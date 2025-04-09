from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
import re
import requests
from bs4 import BeautifulSoup
import time

# load environment variables
load_dotenv()

articles_bp = Blueprint('articles', __name__)

# set OpenAI API key
client = OpenAI(api_key = os.getenv("OPENAI_KEY"))

# create prompt to send to OpenAI API to get a list of keywords
def structure_prompt(transcript):
    prompt = "Below are notes from a clinical visit. Please find keywords relating to the person's condition(s). Structure your response in a very simple way, exactly like this example: 'Flu,Fever,Cough,Influenza A' with no spaces or newline characters between terms."

    # append the original transcript at the end
    prompt += transcript

    return prompt

# send prompt to OpenAI API to get keywords relating to condition(s)
def get_keywords(transcript):
    my_prompt = structure_prompt(transcript)
    print("\n===== DEBUG: Structured prompt for getting keywords for Suggested Articles =====")
    print(my_prompt)
    print("====================================\n")

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.1,
            messages=[{"role": "user", "content": my_prompt}] # send prompt as user input
        )

        if response:
            keyword_response = response.choices[0].message.content # response as a string
            print("Raw OpenAI keywords response:", keyword_response)

            keywords = [kw.strip() for kw in keyword_response.split(",") if kw.strip()] # split raw response by commas and generate list of terms
            return keywords
        else:
            return []
    except Exception as e:
        return {"error": str(e)}


#Web scrape:

root_pubmed_url = "https://pubmed.ncbi.nlm.nih.gov"
pubmed_url = "https://pubmed.ncbi.nlm.nih.gov/?term="
articles_data = [] #data for all scraped articles

# extract PMIDs of all articles from a PubMed search result
# builds a URL to each article
def get_pmids(keyword):    
    # URL to one unique page of results for a keyword search
    url = f'{pubmed_url}+{keyword}'
    response = requests.get(url)
    
    soup = BeautifulSoup(response.text, "html.parser")
    #find section which holds the PMIDs for all articles on the page
    pmids = soup.find('meta',{'name':'log_displayeduids'})['content']

    for pmid in pmids.split(','):
        if len(articles_data) >= 5:
            break
        article_url = root_pubmed_url + '/' + pmid
        article_data = extract_by_article(article_url)
        if article_data:
            articles_data.append(article_data)
        time.sleep(0.5) #avoid overwhelming the server
    print(f"{len(pmids.split(','))} article(s) have just been extracted.")

# extract article title
def extract_by_article(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch article: {url}")
        return None
    
    soup = BeautifulSoup(response.text, "html.parser")
    #Get article title
    try:
        title = soup.find('meta',{'name':'citation_title'})['content'].strip('[]')
    except:
        title = 'NO_TITLE'

    article_data = {
        'Title': title,
        'URL': url
    }
    #add this article dict to list of all article dicts
    articles_data.append(article_data)


@articles_bp.route('/', methods=['POST'])
def articles():
    # get transcipt from request
    data = request.get_json()
    transcript = data.get("transcript", "")
    #debug:
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    # call get_keywords() to get the transcript's keywords using OpenAI
    keywords = get_keywords(transcript)
    print(f"Response Status: 200, Keywords: {keywords}")

    for keyword in keywords:
        get_pmids(keyword)

    print(articles_data)
    return articles_data