# auth enpoints
from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature, AnalyzeResult

from dotenv import load_dotenv

from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Rectangle
from pypdf.generic import ArrayObject, FloatObject, NameObject

import numpy as np
from PIL import Image
from base64 import encodebytes

import os
import io

# Load environment variables
load_dotenv()

ocr_bp = Blueprint('ocr', __name__)

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

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



@ocr_bp.route('/upload', methods=['POST'])
def upload():
    # Ensure the request contains JSON data
    credential = AzureKeyCredential(AZURE_KEY)
    document_intelligence_client = DocumentIntelligenceClient(AZURE_ENDPOINT,
                                                        credential)

    if request.files:
        file = request.files['file']
        file_bytes = file.read()
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-layout",
            file_bytes,
            features=[DocumentAnalysisFeature.KEY_VALUE_PAIRS],
        )
        result = poller.result()
    else:
        return jsonify({"message": "No file uploaded"}), 400

    # Check for PDF
    try:
        reader = PdfReader(file)
        page = reader.pages[0]
        writer = PdfWriter()
        writer.add_page(page)
    except:
        pass


    kv_pairs = []
    if result['keyValuePairs']:
        for pair in result['keyValuePairs']:

            key = pair['key']
            value = pair['value']

            kv_pairs.append((key["content"], value["content"]))
            boundingBox = key['boundingRegions'][0]['polygon']

            key_annotation = Rectangle(
                rect=((50,55), (100,105), (200,205), (250, 255)),
                interior_color="#FF0000",
            )

            key_annotation[NameObject("/C")] = ArrayObject(
                [FloatObject(1.0)]
            )

            # print("key",(key['boundingRegions'][0]['polygon'][6],key['boundingRegions'][0]['polygon'][7]), # lower left
            #         (key['boundingRegions'][0]['polygon'][4],key['boundingRegions'][0]['polygon'][5]), # lower right
            #         (key['boundingRegions'][0]['polygon'][0], key['boundingRegions'][0]['polygon'][1]), # upper left
            #         (key['boundingRegions'][0]['polygon'][2], key['boundingRegions'][0]['polygon'][3]))

            writer.add_annotation(page_number=key['boundingRegions'][0]['pageNumber'] - 1,
                                annotation=key_annotation)

            print("Key:", pair['key'])
            print("Value:", pair['value'])
            print("Confidence:", pair['confidence'])
            print("--------------------------------------------------")

    with open("annotated-pdf.pdf", "wb") as fp:
        writer.write(fp)

    table = generate_table_from_region(kv_pairs)

    # pil_img = Image.open(request.files['file'], mode='r') # reads the PIL image
    # byte_arr = io.BytesIO()
    # pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array

    # encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    encoded_img = "afeaf"

    return jsonify({"image": encoded_img, "table": table}), 200


