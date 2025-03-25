# import flast module
from flask import Flask
from flask_cors import CORS
from auth import auth_bp  # Import the auth blueprint
from ocr import ocr_bp  # Import the ocr blueprint

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication (middleware)

app = Flask(__name__)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(ocr_bp, url_prefix='/ocr')

# home route that returns below text when root url is accessed
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == '__main__':
   app.run(debug=True)
