# File: documind-enterprise/backend/app/models/document.py 
# Purpose: Defines the Document schema with the Vector column for embeddings.

"""
Document Model
--------------
Represents uploaded documents and their associated vector embeddings.
Uses the 'pgvector' extension for semantic search capabilities.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from app.models.base import Base

class DocumentChunk(Base):
    """
    SQLAlchemy model for storing document chunks and embeddings.
    
    Attributes:
        id (UUID): Primary Key.
        filename (str): Name of the source file.
        chunk_index (int): Sequential index of the chunk in the document.
        content (str): The actual text content of the chunk.
        metadata (dict): Additional context (page number, author, etc).
        embedding (Vector): 1536-dimensional vector (OpenAI standard).
        created_at (datetime): Timestamp of ingestion.
    """
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, index=True, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    
    # Storing flexible metadata (page_num, source_path) as JSON
    doc_metadata = Column(JSON, nullable=True)
    
    # 1536 is the dimension size for OpenAI text-embedding-3-small/large
    # This column requires the 'vector' extension in Postgres
    embedding = Column(Vector(1536))
    
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<DocumentChunk(id={self.id}, filename='{self.filename}', index={self.chunk_index})>"