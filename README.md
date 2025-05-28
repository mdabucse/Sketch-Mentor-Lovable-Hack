# Techiee Hackers 
## Team Details

- **Team Number:** 51  
- **Team Name:** Techiee Hackers
- **Team Leader:** Mohamed Abubakkar S  
- **Email:** mdabucse@gmail.com  

### Team Members:
- Monish G
  
**Sketch Mentor**

**Your personal AI-powered study companion**

Sketch Mentor simplifies complex content, supports self-learning, and makes education more accessible — especially for students without regular access to teachers or reading-heavy material.

📚 Features:

|**Feature**|**Description**|
| :- | :- |
|🧠 **AI Document Summarization**|Condenses long documents into simple summaries for quick understanding.|
|📋 **Quiz & Flashcard Creation**|Generates interactive quizzes and flashcards from any uploaded content.|
|💬 **Real-Time Doubt Solving**|AI chatbot answers questions without needing a live tutor.|
|🎥 **Video Generation**|Converts content into short explainer videos to support visual learners.|
|🖼️ **Visual Canvas**|Transforms topics into interactive flowcharts and diagrams.|

**🧰 Tech Stack**

**🖥️ Backend**

- **Flask (Python)** – Lightweight server framework for handling AI-powered services.

**🤖 AI Integration**

- **Google Gemini** powers:
  - Content summarization
  - Quiz & flashcard creation
  - Doubt-solving chatbot
  - Visual canvas explanations

**📄 File Processing**

- **PDFs**: PyPDF
- **Word Docs**: python-docx
- **Presentations**: python-pptx
- **Audio/Video**: Custom Speech-to-Text Processor

**🌐 APIs Used**

- **YouTube Data API** – Fetches and recommends educational content
- **Gemini API** – For content creation and chatbot interactions

**🧠 Visual Canvas**

- **Gemini**, **Gwen**, and **DeepSeek** work together to turn raw text into meaningful visuals.

**📦 Data Management**

- **FAISS Vector Database** – Enables semantic search and smart retrieval of content for chatbot and visual explanations.

**🎬 Video Generation**

- **PyTorch Environment** – AI-generated explainer videos from text or summarized content.

**⚙️ Setup & Installation**

**1. Prerequisites**

- Python 3.9+
- pip
- Git

**2. Clone the Repository:**
git clone <url>

cd sketch-mentor

3\**. Create Virtual Environment:**
python -m venv venv

\# macOS/Linux

source venv/bin/activate

\# Windows

venv\Scripts\activate

**4. Install Dependencies:**
pip install -r requirements.txt



**5. Configure Environment Variables**

Create a .env file in the root directory:

GOOGLE\_GEMINI\_API\_KEY=your\_google\_gemini\_api\_key

YOUTUBE\_API\_KEY=your\_youtube\_data\_api\_key



**6. Run the Application:**
python app.py

