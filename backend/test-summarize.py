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

#####can delete this
# print the entire response to inspect its structure
print("Response JSON:", response.json())

#print result
if response.status_code == 200:
    print("Summary:")
    print(response.json().get('response', 'No response key found'))
else:
    print(f"Error: {response.status_code}")
    print(response.json())