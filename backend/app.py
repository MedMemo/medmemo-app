# import flast module
from flask import Flask
from flask_cors import CORS
import os
from supabase_client import env_file
from auth import auth_bp  # Import the auth blueprint
# from summarize import summarize_bp # Import the summarize blueprint

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)  # Enable CORS for frontend communication (middleware)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')

# Register summarize route
# app.register_blueprint(summarize_bp, url_prefix='/summarize')

# home route that returns below text when root url is accessed
@app.route("/")
def hello_world():
    env_mode = "Production" if env_file == ".env.prod" else "Development"
    return f"<p>Hello, World! Running in {env_mode} mode.</p>"

if __name__ == '__main__':  
    debug_mode = os.getenv('DEBUG', 'True').lower() == 'true'
    dev_port = int(os.getenv('PORT', 5000))  # Default to 5000 if DEV_PORT is not set
    app.run(debug=debug_mode, port=dev_port)
