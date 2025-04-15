# tests/test_utils.py
def test_format_filename():
    from app.utils import format_filename
    assert format_filename("my image.png") == "my_image.png"
