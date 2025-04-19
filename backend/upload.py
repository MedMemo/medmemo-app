from flask import Blueprint, request, jsonify
from supabase_client import supabase
import mimetypes, io
from ocr import perform_ocr, check_file_type

upload_bp = Blueprint('upload', __name__)
BUCKET_NAME = "documents"

@upload_bp.route("", methods=['POST'])
def upload_file():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    user_id = auth_header

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_name = file.filename
    file_bytes = file.read()

    # Guess MIME type
    mime_type, _ = mimetypes.guess_type(file_name)
    if mime_type is None:
        mime_type = 'application/octet-stream'

    file_path = f"{user_id}/{file_name}"

    try:
        response = supabase.storage.from_(BUCKET_NAME).upload(
            file_path,
            file_bytes,
            {"content-type": mime_type}
        )

        if hasattr(response, 'path'):
            file_type = check_file_type(io.BytesIO(file_bytes))
            ocr_results = perform_ocr(file_bytes, file_type)

            if "error" in ocr_results:
                return jsonify({"error": ocr_results["error"]}), 400

            return jsonify({
                "message": "File uploaded and OCR processed successfully",
                "file_path": response.path,
                "ocr_data": ocr_results
            }), 200
        else:
            return jsonify({"error": "Unexpected Supabase response"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
