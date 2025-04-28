#Use example medical documents to test the full flow (upload->ocr->summarize & articles)

import requests
import json

base_url = "http://127.0.0.1:3000"
path = "./med_doc2.jpg"
#med_doc1_path = "./med_doc1.png"
#med_doc2_path = "./med_doc2.jpg"
email = "tuo90701@temple.edu"
password = "Temple2025"

#0. login to get authenticated
def login_for_auth():
    response = requests.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": password}
    )
    response.raise_for_status()
    return response.json()["session"]["access_token"]

#1. upload file and get ocr results
def upload_file(token):
    with open(path, "rb") as f:
        headers = {"Authorization": f"Bearer {token}"}
        files = {"file": (path, f, "application/pdf")}
        response = requests.post(f"{base_url}/upload", files=files, headers=headers)
        print("\n---Upload Response---")
        response.raise_for_status()
        upload_response = response.json()

        return upload_response.get("ocr_data") #these are the ocr results


#2. send ocr results to summarize/summary
def get_summary(token, ocr_data):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.post(f"{base_url}/summarize/summary", json={"ocr_data": ocr_data}, headers=headers)
    print("\n---Summary Response---")
    response.raise_for_status()
    print(response.json())

#3. send ocr results to summarize/articles
def get_articles(token, ocr_data):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.post(f"{base_url}/summarize/articles", json={"ocr_data": ocr_data}, headers=headers)
    print("\n---Articles Response---")
    response.raise_for_status()
    print(response.json())

if __name__ == "__main__":
    print("\n---0. Login---")
    token = login_for_auth()

    print("\n---1. Upload---")
    ocr_data = upload_file(token)
    print("OCR Results:", ocr_data)

    if "kv_pairs" in ocr_data:
        print("\n---2. Summarize---")
        print(get_summary(token, ocr_data))

        print("\n---3. Articles---")
        print(get_articles(token, ocr_data))
    else:
        print("\nOCR did not return key-value pairs. Stopping test.")