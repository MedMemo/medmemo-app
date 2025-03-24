# auth enpoints
from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from openai import OpenAI
load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)

client = OpenAI(api_key=os.getenv("OPENAI_KEY"))  # New client initialization

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        prompt = data['prompt']
        response = client.chat.completions.create(
            model='gpt-4',
            messages=[{"role": "user", "content": prompt}],
            max_tokens = 100

        )
        #get the response
        bot_response = response.choices[0].message.content
        return jsonify({'response': bot_response}), 200

    except Exception as e:
        # Handle errors and return them
        return jsonify({'error': str(e)}), 500