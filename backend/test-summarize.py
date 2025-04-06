# Test summarize.py with an example transcript

import requests

#run Flash app first
url = "http://localhost:8080/summarize"

#example medical visit transcript
transcript = """
Patient is a 55-year-old male with a history of hypertension and type 2 diabetes. He complains of headaches for the past week and has been experiencing dizziness. The patient is currently taking Lisinopril for hypertension and Metformin for diabetes. He denies any chest pain or shortness of breath.
"""

#create a dictionary to send in the POST request
data = {"transcript": transcript}

#send a POST request to the /summarize route
response = requests.post(url, json=data)

if response.status_code == 200:
    try:
        print("Response JSON:", response.json())
    except requests.exceptions.JSONDecodeError:
        print("Failed to decode JSON. The response might not be valid JSON.")
else:
    print(f"Error: {response.status_code}")
    print(response.text)