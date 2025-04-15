# tests/test_upload.py
import io
from app import app  # assuming your Flask app is in app.py

def test_file_upload():
    test_client = app.test_client()
    data = {
        'file': (io.BytesIO(b"test data"), 'test.txt')
    }
    response = test_client.post('/upload', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert b'File uploaded successfully' in response.data
