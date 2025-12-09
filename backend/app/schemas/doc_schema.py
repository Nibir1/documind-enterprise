# File: documind-enterprise/backend/app/schemas/doc_schema.py 
# Purpose: Define what the API returns after an upload.

"""
Document Schema
---------------
Pydantic models for Document API request/response objects.
"""

from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional

class DocumentUploadResponse(BaseModel):
    """
    Response model returned after successful file ingestion.
    """
    filename: str
    message: str
    chunks_processed: int
    doc_id: Optional[UUID] = None
    
    # Modern Pydantic V2 Configuration
    model_config = ConfigDict(from_attributes=True)

class DocumentMetadata(BaseModel):
    """
    Metadata associated with a document chunk.
    """
    source: str
    page: int
    score: Optional[float] = None