# auth enpoints
from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature, AnalyzeResult

from dotenv import load_dotenv

from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Rectangle

import os

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

    reader = PdfReader(file)
    page = reader.pages[0]
    writer = PdfWriter()
    writer.add_page(page)

    # # Add the rectangle
    # annotation = Rectangle(
    #     rect=(50, 100, 200, 200),
    #     #
    # )
    # writer.add_annotation(page_number=0, annotation=annotation)


    if result['keyValuePairs']:
        for pair in result['keyValuePairs']:

            key = pair['key']
            value = pair['value']

            print(key["boundingRegions"][0]["polygon"])

            # key_annotation = Rectangle(
            #     rect=(key['boundingRegions'][0]['polygon'][6],
            #             key['boundingRegions'][0]['polygon'][7],
            #             key['boundingRegions'][0]['polygon'][2],
            #             key['boundingRegions'][0]['polygon'][3]),
            #     interior_color="ffaac00"
            #     )
            # key_annotation = Rectangle(
            #     rect=((key['boundingRegions'][0]['polygon'][6],key['boundingRegions'][0]['polygon'][7]), # lower left
            #         (key['boundingRegions'][0]['polygon'][4],key['boundingRegions'][0]['polygon'][5]), # lower right
            #         (key['boundingRegions'][0]['polygon'][0], key['boundingRegions'][0]['polygon'][1]), # upper left
            #         (key['boundingRegions'][0]['polygon'][2], key['boundingRegions'][0]['polygon'][3])), # upper right

            #     interior_color="ffaac00"
            #     )
            key_annotation = Rectangle(
                rect=(50, 51, 200, 201),
                interior_color="ffaac00"

            )
            print("key",(key['boundingRegions'][0]['polygon'][6],key['boundingRegions'][0]['polygon'][7]), # lower left
                    (key['boundingRegions'][0]['polygon'][4],key['boundingRegions'][0]['polygon'][5]), # lower right
                    (key['boundingRegions'][0]['polygon'][0], key['boundingRegions'][0]['polygon'][1]), # upper left
                    (key['boundingRegions'][0]['polygon'][2], key['boundingRegions'][0]['polygon'][3]))



            writer.add_annotation(page_number=key['boundingRegions'][0]['pageNumber'] - 1,
                                annotation=key_annotation)


            print("Key:", pair['key'])
            print("Value:", pair['value'])
            print("Confidence:", pair['confidence'])
            # print("Text content:")
            # for content in pair['content']:
            #     print(content)
            print("--------------------------------------------------")

    with open("annotated-pdf.pdf", "wb") as fp:
        writer.write(fp)


    return jsonify({"message": "Upload endpoint"}), 200