from flask_cors import CORS
from flask import Flask, send_file, jsonify, make_response
from supabase_client import supabase
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route("/download/<visit_id>", methods=["GET"])
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
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)


