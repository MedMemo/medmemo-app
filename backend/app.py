# import flast module
from flask import Flask
from flask_cors import CORS
from auth import auth_bp  # Import the auth blueprint
from transformers import AutoTokenizer, AutoModel # To use BERT model
import openai

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication (middleware)

app = Flask(__name__)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')

# load Bio_ClinicalBERT model: https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT
tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
bert_model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")

# create NER pipeline to extract medical entities from transcript
ner_pipeline = pipeline("ner", model=bert_model, tokenizer=tokenizer)

# set OpenAI API key
openai.api_key = 'key_goes_here'

# specify transcript's medical entities using BERT model
def extract_med_entities(transcript):
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
    medical_entities = extract_medical_entities(transcript)

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
    prompt = generate_prompt(transcript)
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        message={"role": "user", "content": prompt}, # send prompt as user input
        temperature=0.5
    )

    # extract summary from OpenAI response
    summary = response["choices"][0]["message"]["content"].strip()
    return summary

# home route that returns below text when root url is accessed
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# summarize transcript route
@app.route("/api/summarize", methods=['POST'])
def summarize_transcript():
    data = request.json
    transcript = data.get("transcript", "")
    summary = generate_summary(transcript)
    return jsonify({"summary": summary})


if __name__ == '__main__':  
   app.run(debug=True)
