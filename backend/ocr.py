# auth enpoints
from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature, AnalyzeResult

from dotenv import load_dotenv

from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Rectangle

import numpy as np
from PIL import Image
from base64 import encodebytes

import os
import io
from base64 import encodebytes

# Load environment variables
load_dotenv()

ocr_bp = Blueprint('ocr', __name__)

AZURE_KEY = os.getenv("AZURE_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

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



    if result['keyValuePairs']:
        for pair in result['keyValuePairs']:

            key = pair['key']
            value = pair['value']

            polygon_in_inches = key['boundingRegions'][0]['polygon']
            dpi = 200

            polygon_in_pixels = [[int(x * dpi), int(y * dpi)] for x, y in zip(polygon_in_inches[::2], polygon_in_inches[1::2])]
            polygon_in_pixelsd = np.array([polygon_in_pixels], np.int32).reshape((-1, 1, 2))

            print(polygon_in_pixels)
            print(polygon_in_pixelsd)

            print(key["boundingRegions"][0]["polygon"])

            key_annotation = Rectangle(
                rect=( page.mediabox.width - key['boundingRegions'][0]['polygon'][6],
                        page.mediabox.height - key['boundingRegions'][0]['polygon'][7],
                        key['boundingRegions'][0]['polygon'][2],
                        page.mediabox.height - key['boundingRegions'][0]['polygon'][3]),
                interior_color="ffaac00"
                )

            # key_annotation = Rectangle(
            #     rect=((50,55), (100,105), (200,205), (250, 255)),
            #     interior_color="ffaac00",
            # )
            # print("key",(key['boundingRegions'][0]['polygon'][6],key['boundingRegions'][0]['polygon'][7]), # lower left
            #         (key['boundingRegions'][0]['polygon'][4],key['boundingRegions'][0]['polygon'][5]), # lower right
            #         (key['boundingRegions'][0]['polygon'][0], key['boundingRegions'][0]['polygon'][1]), # upper left
            #         (key['boundingRegions'][0]['polygon'][2], key['boundingRegions'][0]['polygon'][3]))

            writer.add_annotation(page_number=key['boundingRegions'][0]['pageNumber'] - 1,
                                annotation=key_annotation)

            print("Key:", pair['key'])
            print("Value:", pair['value'])
            print("Confidence:", pair['confidence'])
            # print("Text content:")
            # for content in pair['content']:
            #     print(content)
            print("--------------------------------------------------")

    # with open("annotated-pdf.pdf", "wb") as fp:
    #     writer.write(fp)

    pil_img = Image.open(request.files['file'], mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array

    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64

    return jsonify({"image": encoded_img, "table":
                    """
                    <table>

                    <table/>
                    """}), 200