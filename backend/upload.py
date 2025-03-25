from flask import Blueprint, request, jsonify
from supabase_client import supabase  

upload_bp = Blueprint('upload', __name__) 

BUCKET_NAME = "documents"

@upload_bp.route("/", methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = file.filename 

    try:
        file_bytes = file.read()

        response = supabase.storage.from_(BUCKET_NAME).upload(file_path, file_bytes)

        return jsonify({"message": "File uploaded successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


