# import flast module
from flask import Flask
from flask_cors import CORS
import os
from supabase_client import env_file
from download import download_bp #Import the download blueprint
from auth import auth_bp  # Import the auth blueprint
from summarize import summarize_bp # Import the summarize blueprint
from chatbot import chatbot_bp
from upload import upload_bp  # Import the upload blueprint
from summarize import summarize_bp # Import the summarize blueprint
from ocr import ocr_bp  # Import the ocr blueprint

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"], supports_credentials=True)  # Enable CORS for frontend communication (middleware)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')
# Register download routes
app.register_blueprint(download_bp, url_prefix='/download')
# Register upload routes
app.register_blueprint(upload_bp, url_prefix='/upload')
# Register summarize routes
app.register_blueprint(summarize_bp, url_prefix='/summarize')
# Register OCR routes
app.register_blueprint(ocr_bp, url_prefix='/ocr')
# Register auth chat
app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

# home route that returns below text when root url is accessed
@app.route("/")
def hello_world():
    env_mode = "Production" if env_file == ".env.prod" else "Development"
    return f"<p>Hello, World! Running in {env_mode} mode.</p>"

if __name__ == '__main__':
    debug_mode = os.getenv('DEBUG', 'True').lower() == 'true'
    dev_port = int(os.getenv('PORT', 8080))  # Default to 8080 if DEV_PORT is not set
    app.run(debug=debug_mode, port=dev_port)
