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
    #medical_entities = extract_med_entities(transcript)

    prompt = "Below are notes from a clinical visit. Please summarize the original notes in an easy-to-understand manner while also preserving the following listed key medical details (symptoms, conditions, and medications).\n\n"
    
    #if medical_entities["SYMPTOMS"]:
    #    prompt += f"Symptoms: {', '.join(medical_entities['SYMPTOMS'])}\n"
    #if medical_entities["CONDITIONS"]:
    #    prompt += f"Conditions: {', '.join(medical_entities['CONDITIONS'])}\n"
    #if medical_entities["MEDICATIONS"]:
    #    prompt += f"Medications: {', '.join(medical_entities['MEDICATIONS'])}\n"
    
    # append the original transcript at the end
    prompt += f"\nOriginal Notes:\n{transcript}\n\n"
    prompt += "Summarize these notes in a clearand concise way."

    return prompt

# send transcript + prompt to OpenAI API to get the summary
def generate_summary(transcript):
    my_prompt = structure_prompt(transcript)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
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