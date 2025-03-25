# auth enpoints
from flask import Blueprint, request, jsonify
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import DocumentAnalysisFeature, AnalyzeResult

from dotenv import load_dotenv

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
    print("request",request.files)

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

    print(result)


    return jsonify({"message": "Upload endpoint"}), 200