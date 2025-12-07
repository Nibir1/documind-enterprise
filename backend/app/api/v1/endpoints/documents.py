# File: documind-enterprise/backend/app/api/v1/endpoints/documents.py 
# Purpose: The public API Endpoint.

"""
Documents Endpoint
------------------
API routes for file management and ingestion.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.ingestion import IngestionService
from app.services.vector_store import VectorStoreService
from app.schemas.doc_schema import DocumentUploadResponse

router = APIRouter()

@router.post(
    "/upload", 
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and Ingest Document",
    description="Uploads a PDF or TXT file, splits it into chunks, generates embeddings, and stores them in Postgres."
)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle document upload and ingestion pipeline.
    """
    # 1. Initialize Services
    ingestion_service = IngestionService()
    vector_service = VectorStoreService(session=db)

    # 2. Process File (Parse & Split)
    try:
        chunks = await ingestion_service.process_file(file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

    # 3. Vectorize & Store
    try:
        count = await vector_service.ingest_documents(chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

    return DocumentUploadResponse(
        filename=file.filename,
        message="Document processed and indexed successfully.",
        chunks_processed=count
    )