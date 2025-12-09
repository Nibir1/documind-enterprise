"""
API Integration Tests
---------------------
Tests the full lifecycle of the application endpoints:
1. Health Check
2. Document Ingestion (Mocked DB/OpenAI)
3. Chat Agent - General Intent (Mocked LangGraph)
4. Chat Agent - Search Intent (Mocked LangGraph + Vector Store)
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db

# --- Fixtures ---

@pytest.fixture
def client():
    """
    FastAPI Test Client.
    We use context manager to trigger startup/shutdown events.
    """
    # We override the dependency to avoid needing a real DB connection
    app.dependency_overrides[get_db] = lambda: MagicMock()
    
    # We patch the lifespan context to prevent it from trying to connect to Postgres on startup
    with patch("app.main.lifespan", side_effect=AsyncMock()) as mock_lifespan:
        mock_lifespan.__aenter__.return_value = None
        with TestClient(app) as c:
            yield c
    
    # Clean up overrides
    app.dependency_overrides = {}

# --- Tests ---

def test_health_check(client):
    """
    Test 1: System Health
    Verifies the container liveness probe.
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "0.1.0"}

@patch("app.api.v1.endpoints.documents.IngestionService")
@patch("app.api.v1.endpoints.documents.VectorStoreService")
def test_upload_document(mock_vector_service, mock_ingestion_service, client):
    """
    Test 2: Document Ingestion Pipeline
    Verifies that the upload endpoint correctly:
    1. Receives a file.
    2. Calls the IngestionService to split it.
    3. Calls the VectorStoreService to save it.
    """
    # 1. Setup Mocks
    # Mock IngestionService.process_file to return dummy chunks
    mock_ingest_instance = mock_ingestion_service.return_value
    mock_ingest_instance.process_file = AsyncMock(return_value=[
        MagicMock(page_content="Chunk 1", metadata={"source": "test.pdf"}),
        MagicMock(page_content="Chunk 2", metadata={"source": "test.pdf"})
    ])

    # Mock VectorStoreService.ingest_documents to return a count
    mock_vector_instance = mock_vector_service.return_value
    mock_vector_instance.ingest_documents = AsyncMock(return_value=2)

    # 2. Execute Request
    file_content = b"Fake PDF content"
    files = {"file": ("test.pdf", file_content, "application/pdf")}
    
    response = client.post("/api/v1/documents/upload", files=files)

    # 3. Assertions
    assert response.status_code == 201
    data = response.json()
    assert data["filename"] == "test.pdf"
    assert data["chunks_processed"] == 2
    assert "successfully" in data["message"]

@patch("app.api.v1.endpoints.chat.RAGAgent")
@patch("app.api.v1.endpoints.chat.VectorStoreService")
def test_chat_general_intent(mock_vector_service, mock_rag_agent, client):
    """
    Test 3: Chat Agent (General Intent)
    Verifies that when LangGraph returns 'general', the API formats it correctly
    without citations.
    """
    # 1. Setup Mocks
    mock_agent_instance = mock_rag_agent.return_value
    
    # Simulate the LangGraph state output for a Greeting
    mock_agent_instance.run = AsyncMock(return_value={
        "intent": "general",
        "answer": "Hello! How can I help you?",
        "documents": []
    })

    # 2. Execute Request
    payload = {"message": "Hello there!"}
    response = client.post("/api/v1/chat/", json=payload)

    # 3. Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Hello! How can I help you?"
    assert data["intent"] == "general"
    assert data["citations"] == []

@patch("app.api.v1.endpoints.chat.RAGAgent")
@patch("app.api.v1.endpoints.chat.VectorStoreService")
def test_chat_search_intent(mock_vector_service, mock_rag_agent, client):
    """
    Test 4: Chat Agent (RAG/Search Intent)
    Verifies that when LangGraph returns 'search', the API formats the citations correctly.
    """
    # 1. Setup Mocks
    mock_agent_instance = mock_rag_agent.return_value
    
    # Simulate LangGraph output with retrieved documents
    mock_agent_instance.run = AsyncMock(return_value={
        "intent": "search",
        "answer": "Nahasat is an AI Engineer.",
        "documents": [
            {
                "source": "cv.pdf",
                "page": 1,
                "content": "Nahasat is a skilled engineer...",
                "score": 0.89
            }
        ]
    })

    # 2. Execute Request
    payload = {"message": "Who is Nahasat?"}
    response = client.post("/api/v1/chat/", json=payload)

    # 3. Assertions
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Nahasat is an AI Engineer."
    assert data["intent"] == "search"
    
    # Verify Citations
    assert len(data["citations"]) == 1
    citation = data["citations"][0]
    assert citation["filename"] == "cv.pdf"
    assert citation["page"] == 1
    assert citation["score"] == 0.89
    assert "Nahasat" in citation["text_snippet"]

@patch("app.api.v1.endpoints.chat.RAGAgent")
@patch("app.api.v1.endpoints.chat.VectorStoreService")
def test_chat_error_handling(mock_vector_service, mock_rag_agent, client):
    """
    Test 5: Error Handling
    Verifies the API returns 500 when the Agent crashes.
    """
    # 1. Setup Mock to Raise Exception
    mock_agent_instance = mock_rag_agent.return_value
    mock_agent_instance.run = AsyncMock(side_effect=Exception("LangGraph exploded"))

    # 2. Execute Request
    payload = {"message": "Crash me"}
    response = client.post("/api/v1/chat/", json=payload)

    # 3. Assertions
    assert response.status_code == 500
    assert "LangGraph exploded" in response.json()["detail"]