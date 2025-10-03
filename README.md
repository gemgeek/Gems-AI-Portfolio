# 🤖 GEM's AI Portfolio  
Welcome to my personal AI-powered portfolio! This is a full-stack web application designed to be an interactive and engaging way for you to get to know me, my skills, and my work. Instead of a static page, you can have a conversation with my AI assistant, which is powered by Google's Gemini model.  

---

## ✨ Features  
- **Conversational Interface:** Ask questions in natural language and get intelligent, context-aware answers.  
- **Dynamic Content:** The AI can provide detailed text descriptions, showcase project cards, and even display images directly in the chat.  
- **Structured Knowledge:** The AI's knowledge is based on a structured Markdown file, making it easy to update and maintain.  
- **Rich Responses:** The application can render various response types, including:  
  - Formatted text with bolding, lists, and links.  
  - Clickable project cards with images and descriptions.  
  - Embedded images.  
- **Polished UI:** A clean, modern, and fully responsive design built with React and Tailwind CSS, featuring subtle animations and a user-friendly layout.  

---

## 🛠️ Tech Stack  
This project is a full-stack application built with a modern technology stack:  

### Frontend (The "Look")  
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **Framework:** React.js  
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Styling:** Tailwind CSS  
- ![Lucide](https://img.shields.io/badge/Lucide_Icons-black?style=for-the-badge&logo=lucide&logoColor=white) **Icons:** Lucide React  
- ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) **Language:** JavaScript (ES6+)  

### Backend (The "Brain")  
- ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) **Framework:** Flask  
- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) **Language:** Python  
- ![Google AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white) **AI Model:** Google Gemini 2.5 Pro  
- ![Libraries](https://img.shields.io/badge/Libraries-grey?style=for-the-badge&logo=pypi&logoColor=white) **Libraries:** google-generativeai, python-dotenv, Flask-Cors, Markdown

---

## 🚀 Getting Started  
To run this project locally, follow these steps:  

### Prerequisites  
- Node.js and npm installed  
- Python and pip installed  
- A Google AI Studio API Key  

### Installation & Setup  

**Clone the repository:**  
```bash
git clone https://github.com/gemgeek/Gems-AI-Portfolio.git
cd Gems-AI-Portfolio
```

**Setup the Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file and add your API key:
```bash
GEMINI_API_KEY="YOUR_API_KEY"
```

**Setup the Frontend:**
```bash
cd ../frontend
npm install
```

## Running the Application
**Start the Backend Server**
```bash
cd backend
python app.py
```

The server will start on:
👉 http://localhost:5001

**Start the Frontend Application:**
```bash
cd frontend
npm start
```

The application will open in your browser at:
👉 http://localhost:3000

This project was a fantastic journey into building full-stack AI applications, and I'm thrilled to share it with you!