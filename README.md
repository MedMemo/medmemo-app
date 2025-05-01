# MedMemo

## 📌 Project Overview

MedMemo is a web application designed to help patients keep structured and informative notes from their healthcare provider visits. By simply copying and pasting a transcript of their visit dialogue, users can generate a well-organized summary that includes key medical information, personal questions, and additional context that is often missing from traditional healthcare records.

Powered by a **deep learning model** and a **large language model (LLM)**, MedMemo transforms unstructured conversation transcripts into clear, actionable medical notes.

## ✨ Key Features

- **Upload Document**: Upload PNG or PDF files, which are scanned using OCR to extract text and link the content to your personal account for further processing.
- **Transcript Summarization**: Upload medical visit documents to receive structured, AI-generated summaries highlighting diagnoses, treatments, and key insights.
- **Suggested Articles**: Automatically receive links to trusted health articles relevant to the medical terms and topics found in your transcript summary.
- **Chatbot Assistant**: Ask follow-up questions or clarify medical terms using an AI-powered chatbot that references your summaries and general health knowledge.
- **Download/Export**: Save your medical summaries and documents as text files for offline access, printing, or sharing.
- **View History**: Access a chronological view of all your previously uploaded documents and generated summaries, organized by date.
- **Prescription Reminder**: Connect to your Google Calendar to schedule reminders for medications, including dosage, frequency, and start/end dates.
- **User Login/Logout**: Securely create an account to manage your health documents, with all data tied to your personal user ID.
- **Contact Us**: Submit feedback, report issues, or request support directly from within the app.
- **About Us**: A dedicated page that explains MedMemo’s mission, core features, and how it helps users manage their medical information, including AI-powered summarization, document upload, and health resources.
- **User-Friendly Interface**: Simple and intuitive design for easy use.

## 🚀 How It Works

1. **Input Your Transcript**: Copy and paste the dialogue from your healthcare visit into MedMemo’s text box.
2. **AI Processing**: The system uses deep learning and LLMs to extract key details and structure the information.
3. **Get Structured Notes**: Receive a well-organized document summarizing your visit, including medical insights and personal notes.

## 🛠️ Technologies Used

- **Backend**: Python, Flask
- **AI/ML**: GPT-4 for text processing, used for Transcript Summarization and the Chatbot Assistant.
- **Image Processing**: Azure (OCR) for transcribing and extracting text from uploaded images (PNG/PDF) to highlight and edit values.
- **Frontend**: React (Next.js)
- **Storage**: Supabase for user authentication and database management.

## 🔧 Installation Guide

## 📂 Backend Setup
# Step 1: Navigate to backend directory
cd backend

# Step 2: Create & activate virtual environment
# Mac/Linux
python3 -m venv .venv && source .venv/bin/activate
# Windows
py -3 -m venv .venv && .venv\Scripts\activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Run the Flask app
# Mac/Linux
python3 app.py
# Windows
py app.py

## 🌐 Frontend Setup
# Step 1: Navigate to frontend directory
cd frontend

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
# or use: yarn dev / pnpm dev / bun dev
Open http://localhost:3000 to view the application.

## 🤝 Contributing

We welcome contributions to MedMemo! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add some feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please ensure your code follows the project's style guidelines and includes appropriate tests.
