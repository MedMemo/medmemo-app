from flask_cors import CORS
from flask import Flask, Blueprint, jsonify
from supabase_client import supabase

download_bp = Blueprint("download", __name__)
CORS(download_bp, resources={r"/*": {"origins": "http://localhost:3000"}})


@download_bp.route("/<visit_id>", methods=["GET"])
def download_from_supabase(visit_id):
    try:
        response = supabase.table("MEDICAL_DOCUMENT").select("Summary").eq("VisitID", visit_id).execute()
        print("Supabase response:", response)

        if response.data is None or len(response.data) == 0:
            return jsonify({"error": "Data not found"}), 404

        summary_data = response.data[0]["Summary"]
        return jsonify({"Summary": summary_data})

    except Exception as e:
        print("Error during download:", e)
        return jsonify({"error": str(e)}), 500