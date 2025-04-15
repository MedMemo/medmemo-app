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
def structure_summary_prompt(transcript):
    prompt = "Below are notes from a clinical visit. Please summarize the original notes in an easy-to-understand manner. Include a list that is organized and specifies 'Conditions', 'Symptoms', and 'Medications' if they are provided in the below notes.\n"

    # append the original transcript at the end
    prompt += transcript

    return prompt

# Create prompt to send to OpenAI API to get a list of keywords
def structure_articles_prompt(transcript):
    prompt = "Below are notes from a clinical visit. Please find keywords relating to the person's condition(s). Structure your response in a very simple way, exactly like this example: 'Flu,Fever,Cough,Influenza A' with no spaces or newline characters between terms."

    # Append the original transcript at the end
    prompt += transcript

    return prompt

@summarize_bp.route('/summary', methods=['POST'])
def summarize():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error:" "Request must be JSON"}), 400
    
    data = request.get_json()
    transcript = data.get("transcript", "")

    # Validate that the transcript is provided
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400
    
    try:

        # Attempt to send the structured prompt to OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.2,
            messages=[{"role": "user", "content": structure_summary_prompt(transcript)}]
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
            if len(articles) >= 2:
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

    try:
        title = soup.find('meta',{'name':'citation_title'})['content'].strip('[]')
    except:
        title = 'NO_TITLE'

    return {
        'Title': title,
        'URL': url
    }

@summarize_bp.route('/articles', methods=['POST'])
def articles():
    # Ensure the request contains JSON data
    if not request.is_json:
        return jsonify({"error:" "Request must be JSON"}), 400
    

    data = request.get_json()
    transcript = data.get("transcript", "")

    # Validate that the transcript is provided
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400
    
    try:
        
        # Attempt to send structured prompt to OpenAI
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.1,
            messages=[{"role": "user", "content": structure_articles_prompt(transcript)}] 
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

    