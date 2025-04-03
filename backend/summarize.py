from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# load environment variables
load_dotenv()

summarize_bp = Blueprint('summarize', __name__)

# set OpenAI API key
client = OpenAI(api_key = os.getenv("OPENAI_KEY"))

# create prompt to send to OpenAI API - can change this later after we figure out what prompt structure works best!
def structure_prompt(transcript):
    prompt = "Below are notes from a clinical visit. Please summarize the original notes in an easy-to-understand manner. Include a list that is oranized and specifies 'Conditions', 'Symptoms', and 'Medications' if they are provided in the below notes.\n"
    
    # append the original transcript at the end
    prompt += transcript

    return prompt

# send transcript + prompt to OpenAI API to get the summary
def generate_summary(transcript):
    my_prompt = structure_prompt(transcript)
    print("\n===== DEBUG: Structured Prompt =====")
    print(my_prompt)
    print("====================================\n")

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.2,
            messages=[{"role": "user", "content": my_prompt}] # send prompt as user input
        )
            
        if response:
            return {"summary": response.choices[0].message.content.replace("\n","")}
        else:
            return {"error": "No response generated"}
    except Exception as e:
        return {"error": str(e)}

@summarize_bp.route('/', methods=['POST'])
def summarize():
    # get transcipt from request
    data = request.get_json()
    transcript = data.get("transcript", "")
    #debug
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    # call generate_summary() to get the summary from OpenAI
    summary = generate_summary(transcript)
    print(f"Response Status: 200, Summary: {summary}")
    
    return jsonify(summary), 200