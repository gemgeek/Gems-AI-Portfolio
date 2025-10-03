import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json
import markdown

# --- Initialization ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- AI Configuration ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Please set it in your .env file.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-pro')
except Exception as e:
    print(f"Error during AI model initialization: {e}")
    model = None

# --- Knowledge Base Loading ---
try:
    with open("knowledge.md", "r", encoding="utf-8") as f:
        knowledge_base = f.read()
except FileNotFoundError:
    print("Error: knowledge.md file not found.")
    knowledge_base = "No knowledge base found."

# --- API Route ---
@app.route('/api/chat', methods=['POST'])
def chat():
    if model is None:
        return jsonify({"error": "AI model is not available."}), 500

    user_message = request.json.get('message', '')
    print(f"Received message: {user_message}")

    is_project_query = "project" in user_message.lower()
    
    if is_project_query:
        prompt = f"""
        CONTEXT:
        {knowledge_base}
        ---
        Based *only* on the 'Projects' section of the context provided, respond to the user's request: "{user_message}".
        IMPORTANT: Your response MUST be a valid JSON array of objects. Do not add any text before or after the JSON.
        Each object in the array should represent a project and have the following keys: "title", "name", "description", "imageUrl", and "link".
        """
    else:
        prompt = f"""
        You are GEM's friendly and professional AI assistant. Your personality is witty, helpful, and a little creative.
        Your main goal is to answer questions about GEM based *only* on the following information.
        ---
        CONTEXT:
        {knowledge_base}
        ---
        RULES:
        - Do NOT start your answers with "Based on the context" or similar phrases. Be direct, conversational, and engaging.
        - Sprinkle in cute emojis where appropriate to match the tone (e.g., 👋, ✨, 💻, 🎨).
        - For the "About Me" or "Who are you?" question, provide a comprehensive answer including her name, age, intro, and explicitly include the special tag [SHOW_PHOTO] in your response so the website can show her picture.
        - For the "Skills" question, mention that she is a lifelong learner and always evolving.
        - If you don't know the answer, say something fun and helpful like "That's a fantastic question! I don't have that detail in my knowledge base right now, but I'd be happy to tell you about GEM's amazing projects! ✨"

        Now, answer the following user question in a friendly and conversational way: "{user_message}"
        """

    try:
        response = model.generate_content(prompt)
        raw_response_text = response.text.strip()

        if is_project_query:
            cleaned_text = raw_response_text.replace("```json", "").replace("```", "")
            project_data = json.loads(cleaned_text)
            
            # --- THIS IS THE NEW PART ---
            intro_text = "Here are a few of the projects GEM is really proud of! ✨ For a deeper dive into her work, be sure to check out her <a href='https://github.com/gemgeek' target='_blank' rel='noopener noreferrer'>full GitHub profile</a>."
            
            return jsonify({"type": "cards", "data": project_data, "intro_text": intro_text})
        else:
            html_response = markdown.markdown(raw_response_text)
            return jsonify({"type": "text", "data": html_response})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)