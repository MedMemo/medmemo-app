# auth enpoints
from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
from dotenv import load_dotenv

from supabase_client import supabase  # Import the Supabase client

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    

    # Validate that both email and password are provided
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:

        # Check if the email already exists in the USER table
        existing_user = supabase.table("USER").select("*").eq("Email", email).execute()

        if existing_user.data:
            return jsonify({"error": "Email already exists"}), 409  # 409 Conflict

        # Attempt to sign up the user
        response = supabase.auth.sign_up({"email": email, "password": password})

        # Extract the user ID from the auth response
        user_id = response.user.id

       # Insert user data into the database
        user_data = {
            "user_id": user_id,
            "created_at": response.user.created_at.isoformat(),  # Convert datetime to string
            "Username": username,
            "Email": email,
            "Password": password
            
        }
         # Insert the user data into the 'users' table
        db_response = supabase.table("USER").insert(user_data).execute()

        # Check if the database insertion was successful
        if not db_response.data:
            # If database insertion fails, delete the user from auth (optional cleanup)
            supabase.auth.admin.delete_user(user_id)
            return jsonify({"error": "Failed to create user in database"}), 500
        
        # Extract only the necessary data from the response
        user_data = {
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at.isoformat(),
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

        # Check if response has user and session data
        if response.user and response.session:
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
            return jsonify(user_data), 200

        # If the login fails (for example, invalid credentials), return a 401 error with a message
        return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        # Handle other errors and log them
        print(f"Error during login: {str(e)}")
        return jsonify({"error": f"{str(e)}"}), 500




@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        # Attempt to sign out the user
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200

    except Exception as e:
        # Handle any errors that occur during the sign-out process
        return jsonify({"error": str(e)}), 400

# get user session
@auth_bp.route('/get_user', methods=['GET'])
def get_user():
    try:
        # Get the currently authenticated user directly from the session
        user = supabase.auth.get_user()

        if not user or not user.user:
            return jsonify({"error": "No active session or user not found"}), 401

        # Return the user data
        user_data = {
            "id": user.user.id,
            "email": user.user.email,
            "created_at": user.user.created_at.isoformat(),
            "last_sign_in_at": user.user.last_sign_in_at.isoformat(),
        }

        return jsonify({"user": user_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
