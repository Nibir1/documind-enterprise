# File: documind-enterprise/backend/app/services/ingestion.py 
# Purpose: Handles parsing (PDF/Text) and Splitting. This separates "File Logic" from "Database Logic".

"""
Ingestion Service
-----------------
Responsible for:
1. Parsing raw file bytes (PDF, TXT).
2. Splitting text into semantic chunks using LangChain.
"""

import io
from typing import List
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class IngestionService:
    def __init__(self):
        # Configure the splitter
        # chunk_size=1000 tokens ~ 750 words (Good for RAG context window)
        # chunk_overlap=200 ensures context continuity between chunks
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )

    async def process_file(self, file: UploadFile) -> List[Document]:
        """
        Orchestrates the reading and splitting of an uploaded file.
        
        Args:
            file (UploadFile): The file object from FastAPI.
            
        Returns:
            List[Document]: A list of LangChain Document objects ready for embedding.
        """
        content = await file.read()
        filename = file.filename
        
        # 1. Extract Text based on file type
        text_content = ""
        
        if filename.endswith(".pdf"):
            text_content = self._parse_pdf(content)
        elif filename.endswith(".txt") or filename.endswith(".md"):
            text_content = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or TXT.")

        if not text_content.strip():
            raise HTTPException(status_code=400, detail="File content is empty or unreadable.")

        # 2. Create a base document
        # We wrap the raw text in a Document object to pass to the splitter
        # Metadata is crucial for citations later
        raw_doc = Document(
            page_content=text_content,
            metadata={"source": filename}
        )

        # 3. Split into chunks
        chunks = self.text_splitter.split_documents([raw_doc])
        
        # Add index metadata for ordering
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_index"] = i
            
        return chunks

    def _parse_pdf(self, file_bytes: bytes) -> str:
        """Helper to extract text from PDF bytes."""
        try:
            pdf_reader = PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            raise HTTPException(status_code=500, detail="Failed to parse PDF file.")