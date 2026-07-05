from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
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

def stream_generator(message:str):
    response = model.generate_content(message, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text


@app.post("/chat")
async def chat(req:ChatRequest):
    response = model.generate_content(req.message)
    return {'reply': response.text}

@app.post("/stream/chat")
async def chat_stream(req:ChatRequest):
    return StreamingResponse(
        stream_generator(stream_generator(req.message)),
        media_type="text/plain"

    )