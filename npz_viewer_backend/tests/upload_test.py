import os
from fastapi.testclient import TestClient
from app.main import app  # Adjust the import to match your project structure

client = TestClient(app)

def test_upload_npy():
    # Create a small .npy file for testing
    test_array = [[1, 2], [3, 4]]
    test_file_path = "test.npy"
    import numpy as np
    np.save(test_file_path, test_array)

    # Open the file in binary mode for uploading
    with open(test_file_path, "rb") as f:
        response = client.post("/upload", files={"file": ("test.npy", f, "application/octet-stream")})

    # Clean up the test file
    os.remove(test_file_path)

    # Assert the response
    assert response.status_code == 200
    assert "array" in response.json()
    assert response.json()["array"]["data"] == test_array

def test_unsupported_file():
    # Upload a file with an unsupported extension
    with open("test.txt", "w") as f:
        f.write("This is a test file.")

    with open("test.txt", "rb") as f:
        response = client.post("/upload", files={"file": ("test.txt", f, "text/plain")})

    # Clean up the test file
    os.remove("test.txt")

    # Assert the response
    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported file format. Please upload .npz or .npy files."
