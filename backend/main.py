from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from bs4 import BeautifulSoup
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class URLRequest(BaseModel):
    url: str

def scrape_reviews(url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    try:
        response = httpx.get(url, headers=headers, timeout=10, follow_redirects=True)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Try Amazon reviews
        reviews = soup.select("[data-hook='review-body']")
        if reviews:
            return " ".join([r.get_text(strip=True) for r in reviews[:10]])
        
        # Try getting any paragraph text as fallback
        paragraphs = soup.find_all("p")
        text = " ".join([p.get_text(strip=True) for p in paragraphs[:20]])
        return text if text else "No reviews found"
    except Exception as e:
        return f"Could not fetch page: {str(e)}"

@app.post("/analyze")
async def analyze(request: URLRequest):
    review_text = scrape_reviews(request.url)
    
    prompt = f"""
You are a smart shopping assistant. Analyze the following product page content and give a honest review summary.

Product page content:
{review_text[:3000]}

Respond ONLY with a valid JSON object in this exact format:
{{
  "trust_score": <number from 1-10>,
  "verdict": "<one sentence summary>",
  "pros": ["<pro 1>", "<pro 2>", "<pro 3>"],
  "cons": ["<con 1>", "<con 2>", "<con 3>"],
  "red_flags": ["<red flag 1>", "<red flag 2>"]
}}
"""
    
    chat = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    
    raw = chat.choices[0].message.content.strip()
    
    try:
        result = json.loads(raw)
    except:
        result = {
            "trust_score": 5,
            "verdict": "Could not fully analyze this product.",
            "pros": ["Page loaded successfully"],
            "cons": ["Could not extract detailed reviews"],
            "red_flags": ["Try a different product URL"]
        }
    
    return result