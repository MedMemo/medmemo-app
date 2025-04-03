# auth enpoints
from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature, AnalyzeResult

from dotenv import load_dotenv

from pypdf import PdfReader, PdfWriter

from PIL import Image, ImageDraw
from base64 import encodebytes

import os
import io

# Load environment variables
load_dotenv()

ocr_bp = Blueprint('ocr', __name__)

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

def check_file_type(file):
    """
    Check if the file is a valid image or PDF.
    """
    try:
        # Try to open the file as an image
        Image.open(file)
        return "image"
    except IOError:
        pass

    try:
        # Try to read the file as a PDF
        PdfReader(file)
        return "pdf"
    except Exception as e:
        pass

    return None

def generate_table_from_region(kp_values):
    """
    Generate a table from the key-value pairs.
    """
    table = "<table>"
    for pair in kp_values:
        key = pair[0]
        value = pair[1]
        table += f"<tr><td>{key}</td><td>{value}</td></tr>"
    table += "</table>"
    return table

def annotate_bounding_box_on_image(image, annotations):
    """
    Annotate the bounding boxes on the image.
    """

    draw = ImageDraw.Draw(image)

    for anno in annotations:

        key = anno['key']

        # Extract the bounding box coordinates
        k_x1, k_y1 = key['boundingRegions'][0]['polygon'][0], key['boundingRegions'][0]['polygon'][1]
        k_x2, k_y2 = key['boundingRegions'][0]['polygon'][4], key['boundingRegions'][0]['polygon'][5]

        # Draw the bounding box for the key
        draw.rectangle([(k_x1, k_y1), (k_x2, k_y2)], outline="red", width=3)

        if "value" not in anno:
            continue

        value = anno['value']

        # Extract the bounding box coordinates for the value
        v_x1, v_y1 = value['boundingRegions'][0]['polygon'][0], value['boundingRegions'][0]['polygon'][1]
        v_x2, v_y2 = value['boundingRegions'][0]['polygon'][4], value['boundingRegions'][0]['polygon'][5]

        # Draw the bounding box for the value
        draw.rectangle([(v_x1, v_y1), (v_x2, v_y2)], outline="blue", width=3)

    return image


@ocr_bp.route('/upload', methods=['POST'])
def upload():
    # Ensure the request contains JSON data
    credential = AzureKeyCredential(AZURE_KEY)
    document_intelligence_client = DocumentIntelligenceClient(AZURE_ENDPOINT,
                                                        credential)

    if request.files:
        file = request.files['file']

        file_type = check_file_type(file)

        if file_type is None:
            return jsonify({"message": "Invalid file format"}), 400

        is_pdf = file_type == "pdf"

        file.seek(0)
        file_bytes = file.read()

        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-layout",
            file_bytes,
            features=[DocumentAnalysisFeature.KEY_VALUE_PAIRS],
        )
        result = poller.result()
    else:
        return jsonify({"message": "No file uploaded"}), 400

    if not result.key_value_pairs:
        return jsonify({"message": "No key-value pairs found"}), 400

    # Process key-value pairs
    kv_pairs = []
    for pair in result.key_value_pairs:
        if pair.key and pair.value:
            kv_pairs.append({
                "key": pair.key.content,
                "value": pair.value.content,
                "confidence": pair.confidence
            })

    # Process paragraphs (for general content)
    content = []
    if result.paragraphs:
        for paragraph in result.paragraphs:
            content.append(paragraph.content)

    response_data = {
        "key_value_pairs": kv_pairs,
        "content": content,
        "file_type": file_type
    }

    if not is_pdf:
        try:
            image = Image.open(file)
            annotated_image = annotate_bounding_box_on_image(image, result.key_value_pairs)
            byte_arr = io.BytesIO()
            annotated_image.save(byte_arr, format='PNG')
            encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii')
            response_data["annotated_image"] = encoded_img
        except Exception as e:
            print(f"Error processing image: {str(e)}")

    return jsonify(response_data), 200