from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key= os.getenv('GEMINI_API_KEY'));
model= genai.GenerativeModel(
    "gemini-3.1-flash-lite",
    generation_config={
        'max_output_tokens':150
    }
    )
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message:str

@app.post("/chat")
async def chat(req:ChatRequest):
    response = model.generate_content(req.message)
    return {'reply': response.text}