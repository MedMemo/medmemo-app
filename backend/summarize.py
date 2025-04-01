from flask import Blueprint, request, jsonify
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline # To use BERT model
from openai import OpenAI
import os
from dotenv import load_dotenv

# load environment variables
load_dotenv()

summarize_bp = Blueprint('summarize', __name__)

# load Bio_ClinicalBERT model: https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT
tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
bert_model = AutoModelForTokenClassification.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")

# create NER pipeline to extract medical entities from transcript
ner_pipeline = pipeline("ner", model=bert_model, tokenizer=tokenizer)

# set OpenAI API key
client = OpenAI(api_key = os.getenv("OPENAI_KEY"))

# specify transcript's medical entities using BERT model
def extract_med_entities(transcript):
    # get tramscript
    transcript = request.json.get("transcript")

    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    ner_results = ner_pipeline(transcript)
    entities = {"SYMPTOMS": [], "CONDITIONS": [], "MEDICATIONS": []}

    for entity in ner_results:
        word = entity["word"]
        label = entity["entity"]
        
        if "DIS" in label: # disease (condition)
            entities["CONDITIONS"].append(word)
        elif "SYMPTOM" in label:
            entities["SYMPTOMS"].append(word)
        elif "MED" in label:  # medications
            entities["MEDICATIONS"].append(word)

    # remove duplicates and convert to list
    for term in entities:
        entities[term] = list(set(entities[term]))
    
    return entities

# create prompt to send to OpenAI API - can change this later after we figure out what prompt structure works best!
def structure_prompt(transcript):
    medical_entities = extract_med_entities(transcript)

    prompt = "Below are notes from a clinical visit. Please summarize the original notes while also preserving the following listed key medical details (symptoms, conditions, and medications).\n\n"
    
    if medical_entities["SYMPTOMS"]:
        prompt += f"Symptoms: {', '.join(medical_entities['SYMPTOMS'])}\n"
    if medical_entities["CONDITIONS"]:
        prompt += f"Conditions: {', '.join(medical_entities['CONDITIONS'])}\n"
    if medical_entities["MEDICATIONS"]:
        prompt += f"Medications: {', '.join(medical_entities['MEDICATIONS'])}\n"
    
    # append the original transcript at the end
    prompt += f"\nOriginal Notes:\n{transcript}\n\n"
    prompt += "Summarize this in a clear, concise, and organized way."

    return prompt

# send transcript + prompt to OpenAI API to get the summary
def generate_summary(transcript):
    ##prompt = structure_prompt(transcript)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            message={"role": "user", "content": transcript}, # send prompt as user input
            max_tokens = 100,
            temperature = 0.5,
            response_format={"type": "json_object"}
        )
        
        return response.choices[0].message.content
    
        # extract summary from OpenAI response
        ##summary = response.choices[0].message.content
        
        ##print(f"Summary type: {type(summary)}")

        ##if isinstance(summary, str):
        ##    return jsonify({"response": summary})
        ##else:
        ##    return jsonify({"error": "Summary is not a string"}), 500
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        # Make sure to return a proper error message in the JSON response
        ##return jsonify({"error": "Failed to generate summary", "details": str(e)}), 500
    
@summarize_bp.route('', methods=['POST'])
def summarize():
    
    
    
    
    # get transcipt from request
    ##transcript = request.json.get("transcript")
    ##f not transcript:
    ##    return jsonify({"error": "No transcript provided"}), 400

    # call generate_summary() to get the summary from OpenAI
    ##summary = generate_summary(transcript)

    ##print(f"Response Status: 200, Summary: {summary}")

    ##return jsonify({"response": summary}), 200