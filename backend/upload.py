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

        # Upload file to Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).upload(file_path, file_bytes)

        if response.status_code == 200:
            return jsonify({"message": "File uploaded successfully"})
        else:
            return jsonify({"error": "File upload failed"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
