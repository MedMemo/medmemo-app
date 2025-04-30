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
        if any(f['name'] == file_name for f in existing_files):
            return jsonify({"error": "File with same name already exists"}), 400
        response = supabase.storage.from_(BUCKET_NAME).upload(
            file_path,
            file_bytes,
            {"content-type": mime_type}
        )
        if hasattr(response, 'path'):
            new_document = {
                "user_id": user_id,  
                "file_name": file_name
            }

            supabase.table("DOCUMENTS").insert([new_document]).execute()

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
            if result.get("metadata", {}).get("httpStatusCode") == 200:
                delete_response = supabase.table("DOCUMENTS") \
                    .delete() \
                    .eq("user_id", user_id) \
                    .eq("file_name", file_name) \
                    .execute()
                if delete_response:  # This checks if the update operation returned any data (success)
                    return jsonify({"message": "Document removed successfully"}), 200
                else:
                    return jsonify({"error": "Failed to remove document"}), 400  # If no data returned, update failed
                return jsonify({"message": f"File {file_name} removed successfully"}), 200
            else:
                return jsonify({"error": f"Error removing the file: {result.get('error', 'Unknown error')}"})
        else:
            return jsonify({"error": "Error removing the file: no valid response from Supabase"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@database_bp.route("/get_file/<string:file_name>", methods=['GET'])
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


@database_bp.route("/list_files", methods=["GET"])
def list_files():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    user_id = auth_header.strip()

    try:
        files = supabase.storage.from_(BUCKET_NAME).list(user_id, {"limit": 6})
        valid_files = [
            f for f in files if f.get('name') and not f['name'].startswith('.')
        ]
        return jsonify({"files": valid_files}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@database_bp.route("/get_signed_url/<string:file_name>", methods=['GET'])
def get_signed_url(file_name):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401
     
    user_id = auth_header.strip()
    
    try:
        # Construct the file path
        file_path = f"{user_id}/{file_name}"
        # Generate the signed URL (valid for 1 hour)
        signed_url_data = supabase.storage.from_(BUCKET_NAME).create_signed_url(file_path, 60 * 60)
        if signed_url_data and signed_url_data.get('signedUrl'):
            return jsonify({
                "message": "Signed URL generated successfully",
                "signed_url": signed_url_data['signedUrl']
            }), 200
        else:
            return jsonify({"error": "Failed to generate signed URL"}), 500

    except Exception as e:
        return jsonify({"error": f"Error generating signed URL: {str(e)}"}), 500

@database_bp.route("/update_table", methods=['POST'])
def update_table():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    user_id = auth_header.strip()

    data = request.get_json()
    file_name = data.get("file_name")
    summary = data.get("summary")
    articles = data.get("articles")


    if not file_name or not summary or not articles:
        return jsonify({"error": "Missing required fields"}), 400

    try:

        response = supabase.table("DOCUMENTS").update({
            "summary": summary,
            "articles": articles
        }).eq("user_id", user_id).eq("file_name", file_name).execute()

        if response.data:  # This checks if the update operation returned any data (success)
            return jsonify({"message": "Document updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update document"}), 400  # If no data returned, update failed

    except Exception as e:
        # Handle any other exceptions that occur during the update process
        return jsonify({"error": str(e)}), 500


@database_bp.route("/get_history", methods=["GET"])
def get_history():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing or invalid Authorization header"}), 401

    user_id = auth_header.strip()

    try:
        # Fetch history (documents) from the database where user_id matches
        response = supabase.table("DOCUMENTS").select("*").eq("user_id", user_id).execute()

        # Check if we received valid data
        if response.data is not None:
            return jsonify({"history": response.data}), 200
        else:
            return jsonify({"history": []}), 200  

    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500