import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
from dotenv import load_dotenv

from prompt_templates import generate_prompt

load_dotenv()

app = FastAPI(title="CollegeBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load context data
CONTEXT_FILE = os.path.join(os.path.dirname(__file__), "data", "muj_contacts.json")

def load_context():
    try:
        with open(CONTEXT_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    context_data = load_context()
    system_prompt = generate_prompt(context_data)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    model_name = os.getenv("MODEL_NAME", "llama3.2")
    
    client = ollama.AsyncClient(host=ollama_host)
    
    try:
        response = await client.chat(model=model_name, messages=messages)
        content = response['message']['content']
        return ChatResponse(reply=content)
    except Exception as e:
        # Catch connection errors, timeouts, etc
        raise HTTPException(status_code=503, detail=f"AI Service Error: {str(e)}")
