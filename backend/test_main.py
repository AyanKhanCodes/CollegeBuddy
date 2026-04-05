import pytest
from fastapi.testclient import TestClient
from main import app, load_context
from unittest.mock import patch, AsyncMock

client = TestClient(app)

def test_load_context():
    data = load_context()
    assert isinstance(data, list)
    # Check if context parsing logic works correctly (e.g. finds some mock data)
    pass

@patch('main.ollama.AsyncClient.chat', new_callable=AsyncMock)
def test_chat_consultant_persona_guardrail(mock_chat):
    # Simulate Llama 3.2 returning the exact fallback text correctly
    mock_chat.return_value = {
        "message": {
            "content": "I don't have that information in my current database."
        }
    }
    
    response = client.post("/chat", json={"message": "What is the best shoe brand?"})
    
    assert response.status_code == 200
    assert response.json()["reply"] == "I don't have that information in my current database."
    
    # Assert proper context injection in Llama 3.2 prompt
    call_kwargs = mock_chat.call_args[1]
    messages = call_kwargs["messages"]
    assert "system" in messages[0]["role"]
    assert "Academic Consultant" in messages[0]["content"]
    assert "I don't have that information" in messages[0]["content"]
    assert "What is the best shoe brand?" in messages[1]["content"]

@patch('main.ollama.AsyncClient.chat', new_callable=AsyncMock)
def test_chat_timeout_handling(mock_chat):
    # Simulate an edge case failure from local Ollama model
    mock_chat.side_effect = Exception("Connection Refused")
    response = client.post("/chat", json={"message": "Hello"})
    
    assert response.status_code == 503
    assert "AI Service Error" in response.json()["detail"]
