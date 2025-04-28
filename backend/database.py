from flask import Blueprint, request, jsonify
from supabase_client import supabase
import mimetypes, io
from ocr import perform_ocr, check_file_type

database_bp = Blueprint('database', __name__)
BUCKET_NAME = "documents"

@database_bp.route("/upload", methods=['POST'])
def upload_file():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    user_id = auth_header.strip()

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_name = file.filename
    file_bytes = file.read()

    # Guess MIME type
    mime_type, _ = mimetypes.guess_type(file_name)
    mime_type = mime_type or 'application/octet-stream'

    file_path = f"{user_id}/{file_name}"

    try:
        # Check if file already exists to avoid overwrites
        existing_files = supabase.storage.from_(BUCKET_NAME).list(user_id)
        print(file_name, existing_files)
        if any(f['name'] == file_name for f in existing_files):
            print("file same name")
            return jsonify({"error": "File with same name already exists"}), 400

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


@database_bp.route("/remove/<string:file_name>", methods=['DELETE'])
def remove_file(file_name):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401
    user_id = auth_header.strip()

    try:

        # Try to delete the file from Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).remove([f"{user_id}/{file_name}"])

        # Check if the response is a list and contains results
        if isinstance(response, list) and len(response) > 0:
            result = response[0] 
            if 'status' in result and result['status'] == 200:
                return jsonify({"message": f"File {file_name} removed successfully"}), 200
            else:
                return jsonify({"error": f"Error removing the file: {result.get('error', 'Unknown error')}"})
        else:
            return jsonify({"error": "Error removing the file: no valid response from Supabase"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@database_bp.route("/get/<string:file_name>", methods=['GET'])
def get_file(file_name):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401
    
    user_id = auth_header.strip()

    try:
        # Try to retrieve the file from Supabase storage
        response = supabase.storage.from_(BUCKET_NAME).download(f"{user_id}/{file_name}")

        if response.get('status') == 200:
            return jsonify({
                "message": f"File {file_name} retrieved successfully",
                "file": response['data']
            }), 200
        else:
            return jsonify({"error": "Error retrieving the file"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
