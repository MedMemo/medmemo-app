# auth enpoints
from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    

    # Validate that both email and password are provided
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Attempt to sign up the user
        response = supabase.auth.sign_up({"email": email, "password": password})
        
        # Extract only the necessary data from the response
        user_data = {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at,
            },
            "session": {
                "access_token": response.session.access_token if response.session else None,
                "refresh_token": response.session.refresh_token if response.session else None,
            }
        }

        # Return the extracted data as JSON
        return jsonify(user_data), 201

    except Exception as e:
        # Handle any errors that occur during the sign-up process
        return jsonify({"error": str(e)}), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Extract email and password from the request data
    email = data.get('email')
    password = data.get('password')

    # Validate that both email and password are provided
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Attempt to sign in with the provided credentials
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        
        # Extract only the necessary data from the response
        user_data = {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at,
                "last_sign_in_at": response.user.last_sign_in_at,
            },
            "session": {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_in": response.session.expires_in,
                "expires_at": response.session.expires_at,
            }
        }

        # Return the extracted data as JSON
        return jsonify(user_data), 200

    except Exception as e:
        # Handle any errors that occur during the sign-in process
        return jsonify({"error": str(e)}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Attempt to sign out the user
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200

    except Exception as e:
        # Handle any errors that occur during the sign-out process
        return jsonify({"error": str(e)}), 400