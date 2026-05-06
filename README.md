# 🛒 CartCop

AI-powered product review analyzer for Amazon & Flipkart. Paste any product URL and get an instant trust score, pros, cons, and red flags — powered by Groq AI.

## 🚀 Live Demo
> Run locally (see setup below)

## ✨ Features
- 🔍 Scrapes product pages automatically
- 🤖 AI analyzes reviews using Groq (LLaMA 3.3)
- 📊 Trust score out of 10
- ✅ Pros, cons, and red flags
- ⚡ Fast — results in seconds

## 🛠️ Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **AI:** Groq API (LLaMA 3.3 70B)
- **Scraping:** httpx + BeautifulSoup

## ⚙️ Setup

### Backend
```bash
cd backend
pip install fastapi uvicorn groq httpx python-dotenv beautifulsoup4
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173
