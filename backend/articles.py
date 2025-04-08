from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# load environment variables
load_dotenv()

articles_bp = Blueprint('articles', __name__)

# set OpenAI API key
client = OpenAI(api_key = os.getenv("OPENAI_KEY"))

# create prompt to send to OpenAI API to get a list of keywords
def structure_prompt(transcript):
    prompt = "Below are notes from a clinical visit. Please find keywords relating to the person's condition(s) and medication(s). Structure your response in this exact format:\n'CONDITION(S): ...\nMEDICATION(S): ...'"

    # append the original transcript at the end
    prompt += transcript

    return prompt

# send prompt to OpenAI API to get keywords relating to condition(s) and medication(s)
def get_keywords(transcript):
    my_prompt = structure_prompt(transcript)
    print("\n===== DEBUG: Structured Prompt for getting keywords for Suggested Articles =====")
    print(my_prompt)
    print("====================================\n")

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            temperature=0.1,
            messages=[{"role": "user", "content": my_prompt}] # send prompt as user input
        )

        if response:
            return {"keyword_list": response.choices[0].message.content.replace("\n","")}
        else:
            return {"error": "No response generated"}
    except Exception as e:
        return {"error": str(e)}

@articles_bp.route('/', methods=['POST'])
def articles():
    # get transcipt from request
    data = request.get_json()
    transcript = data.get("transcript", "")
    #debug:
    if not transcript:
        return jsonify({"error": "No transcript provided"}), 400

    # call get_keywords() to get the transcript's keywords using OpenAI
    keyword_list = get_keywords(transcript)
    print(f"Response Status: 200, Keyword List: {keyword_list}")

    # call get_articles() to get the suggested articles from OpenAI
    ##article_list = get_articles(transcript)
    ##print(f"Response Status: 200, Article List: {article_list}")

    return keyword_list