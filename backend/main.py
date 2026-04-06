import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
from dotenv import load_dotenv

from prompt_templates import generate_prompt
from data_retrieval import load_contacts_data, search_contacts, format_contact_results

load_dotenv()

# Load context data when the server starts
CONTEXT_FILE = os.path.join(os.path.dirname(__file__), "data", "contact.json")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load contacts
    load_contacts_data(CONTEXT_FILE)
    yield
    # Shutdown logic (if any)

app = FastAPI(title="CollegeBuddy API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # A. Search for top 3 matching contacts based on the user's message
    matched_contacts = search_contacts(request.message, top_n=3)
    
    # B & C. Format the results or inject "No contact data found" flag
    formatted_data = format_contact_results(matched_contacts)
    
    # D. Construct the final system prompt with the injected subset of data
    system_prompt = generate_prompt(formatted_data)
    
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
        raise HTTPException(status_code=503, detail=f"AI Service Error: {str(e)}")
