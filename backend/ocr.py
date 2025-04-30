from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature
from dotenv import load_dotenv
from pypdf import PdfReader
from PIL import Image, ImageDraw
from base64 import encodebytes
import io, os

load_dotenv()
ocr_bp = Blueprint('ocr', __name__)
AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
credential = AzureKeyCredential(AZURE_KEY)
document_client = DocumentIntelligenceClient(AZURE_ENDPOINT, credential)


def check_file_type(file):
    try:
        Image.open(file)
        return "image"
    except IOError:
        pass

    try:
        PdfReader(file)
        return "pdf"
    except Exception:
        pass

    return None

def annotate_bounding_boxes(image, annotations):
    draw = ImageDraw.Draw(image)
    for anno in annotations:
        key_coords = anno['key']['boundingRegions'][0]['polygon']
        k_x1, k_y1, k_x2, k_y2 = key_coords[0], key_coords[1], key_coords[4], key_coords[5]
        draw.rectangle([(k_x1, k_y1), (k_x2, k_y2)], outline="red", width=3)

        if "value" in anno:
            val_coords = anno['value']['boundingRegions'][0]['polygon']
            v_x1, v_y1, v_x2, v_y2 = val_coords[0], val_coords[1], val_coords[4], val_coords[5]
            draw.rectangle([(v_x1, v_y1), (v_x2, v_y2)], outline="blue", width=3)
    return image

def perform_ocr(file_bytes, file_type):
    poller = document_client.begin_analyze_document(
        "prebuilt-layout",
        file_bytes,
        features=[DocumentAnalysisFeature.KEY_VALUE_PAIRS],
    )
    result = poller.result()

    if not result.key_value_pairs:
        return {"error": "No key-value pairs found"}

    kv_pairs = [
        {"key": pair.key.content, "value": pair.value.content if pair.value else ""}
        for pair in result.key_value_pairs
    ]

    annotated_img_base64 = ""
    if file_type == "image":
        image = Image.open(io.BytesIO(file_bytes))
        annotated_image = annotate_bounding_boxes(image, result.key_value_pairs)
        byte_arr = io.BytesIO()
        annotated_image.save(byte_arr, format='PNG')
        annotated_img_base64 = encodebytes(byte_arr.getvalue()).decode('ascii')

    return {
        "kv_pairs": kv_pairs,
        "annotated_image": annotated_img_base64
    }


