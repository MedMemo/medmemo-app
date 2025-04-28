from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import time

# Load environment variables
load_dotenv()

summarize_bp = Blueprint('summarize', __name__)

# Set OpenAI API key
client = OpenAI(api_key = os.getenv("OPENAI_KEY"))


### SUMMARY

# Create prompt to send to OpenAI API to get the summary
def structure_summary_prompt(key_value_pairs):
    prompt = "Below are structured key-value notes from a clinical visit, uploaded by the patient themself. Please summarize the visit in easy-to-understand language. Don't use the words 'This is a summary for...', and do use 'you' language as you are speaking to the patient themself. Also include a list that specifies 'Conditions', 'Symptoms', and 'Medications' if they are provided in the below notes.\n"

    # append key value pairs to the prompt
    for kv in key_value_pairs:
        prompt += f"{kv['key']}: {kv['value']}\n"

    return prompt

# Create prompt to send to OpenAI API to get a list of keywords
def structure_articles_prompt(summary):
    prompt = "Below is a summary from a clinical visit. Please find exactly 3 medical keywords relating to the patient's condition(s). Structure your response in a very simple way, exactly like this example: 'Fever,Cough,Influenza A' with no spaces or newline characters between terms."

    prompt += summary

    return prompt

@summarize_bp.route('/summary', methods=['POST'])
def summarize():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error:" "Request must be JSON"}), 400
    
    data = request.get_json()
    key_values = data.get("ocr_data", {}).get("kv_pairs")

    if key_values:
        prompt = structure_summary_prompt(key_values)
    else:
        return jsonify({"error": "No key-value pairs provided"}), 400

    try:

        # Attempt to send the structured prompt to OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.2,
            messages=[{"role": "user", "content": prompt}]
        )

        # Check if response contains data
        if response:
            return jsonify({
                "summary": (
                    response.choices[0].message.content[len("Summary:"):].lstrip()
                    if response.choices[0].message.content.strip().lower().startswith("summary:")
                    else response.choices[0].message.content
                )}), 200
        
        # If nothing returns in response (for example, summary returns no data), return a 204 success with a message there is no response
        return jsonify({"error": "No response generated"}), 204
    
    except Exception as e:
        print (f"Error during summary generation: {str(e)}")
        return jsonify({"error": f"{str(e)}"}), 500


### ARTICLES

# Creates a JSON where each key maps to a list of article objects
def get_articles(keywords):
    all_articles = {}
    pubmed_url = "https://pubmed.ncbi.nlm.nih.gov/?term="
    root_pubmed_url = "https://pubmed.ncbi.nlm.nih.gov"

    for keyword in keywords:

        articles = []
        url = f'{pubmed_url}+{keyword}'
        all_articles[keyword] = []
        
        # Search for related articles using the keyword in pubmed
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        pmids = soup.find('meta', {'name': 'log_displayeduids'})['content'].split(',')
        
        for pmid in pmids:
            if len(articles) >= 1: #only 1 article per keyword max (can change this later if we want)
                break
            article_url = f"{root_pubmed_url}/{pmid}"
            article = extract_by_article(article_url)
            if article:
                articles.append(article)

        all_articles[keyword] = articles
    return all_articles  

# Extract article title by url
def extract_by_article(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch article: {url}")
        return None
    
    soup = BeautifulSoup(response.text, "html.parser")

    # get title
    try:
        title = soup.find('meta',{'name':'citation_title'})['content'].strip('[]')
    except:
        title = 'NO_TITLE'

    # get author(s)
    try:
        authors_raw = soup.find_all('meta',{'name': 'citation_authors'})
        authors = ', '.join([a['content'] for a in authors_raw])
    except:
        authors = 'NO_AUTHORS'

    # get publication date
    try:
        date = soup.find('meta', {'name': 'citation_date'})['content']
    except:
        date = 'NO_DATE'

    return {
        'Title': title,
        'Author': authors,
        'Date': date,
        'URL': url
    }

@summarize_bp.route('/articles', methods=['POST'])
def articles():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error:" "Request must be JSON"}), 400
    

    data = request.get_json()

    # Retrieve the 'summary' from the request data
    summary = data.get('summary')
    prompt = structure_articles_prompt(summary)
    
    try:
        
        # Attempt to send structured prompt to OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.1,
            messages=[{"role": "user", "content": prompt }] 
        )

        # Check if response contains data
        if response:
            # Split raw response by commas and generate list of keywords
            keywords = [kw.strip() for kw in response.choices[0].message.content.split(",") if kw.strip()] 
            return jsonify({"articles": get_articles(keywords)}), 200
        else:
            # If nothing returns in response (for example, articles return no data), return a 204 success with a message
            return jsonify({"error": "No response generated"}), 204
        
    except Exception as e:
        print (f"Error during article generation: {str(e)}")
        return jsonify({"error": f"{str(e)}"}), 500

    