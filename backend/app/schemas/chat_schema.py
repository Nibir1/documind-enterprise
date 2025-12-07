# File: documind-enterprise/backend/app/schemas/chat_schema.py 
# Purpose: Define how the frontend sends messages and how citations are returned.

"""
Chat Schema
-----------
DTOs for the Chat Endpoint.
"""

from typing import List, Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    """
    User input payload.
    """
    message: str
    history: Optional[List[dict]] = [] # Future proofing for chat history

class Citation(BaseModel):
    """
    Source reference for an answer.
    """
    filename: str
    page: int
    text_snippet: str
    score: float

class ChatResponse(BaseModel):
    """
    Agent response payload.
    """
    answer: str
    citations: List[Citation] = []
    intent: str  # "search" or "general"