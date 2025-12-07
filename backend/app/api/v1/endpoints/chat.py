# File: documind-enterprise/backend/app/api/v1/endpoints/chat.py 
# Purpose: Expose the agent via API.

"""
Chat Endpoint
-------------
Handles user queries via the Agentic RAG pipeline.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.chat_schema import ChatRequest, ChatResponse, Citation
from app.services.vector_store import VectorStoreService
from app.services.llm_agent import RAGAgent

router = APIRouter()

@router.post(
    "/",
    response_model=ChatResponse,
    summary="Chat with Documents",
    description="Intelligent route that decides to search documents or chat casually."
)
async def chat_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Init Dependencies
        vector_store = VectorStoreService(session=db)
        agent = RAGAgent(vector_store)

        # 2. Run LangGraph Agent
        result = await agent.run(request.message)

        # 3. Format Citations (if RAG was used)
        citations = []
        if result["intent"] == "search":
            for doc in result["documents"]:
                citations.append(Citation(
                    filename=doc["source"],
                    page=doc.get("page", 0),
                    text_snippet=doc["content"][:100] + "...",
                    score=doc.get("score", 0.0)
                ))

        # 4. Return Response
        return ChatResponse(
            answer=result["answer"],
            intent=result["intent"],
            citations=citations
        )

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))