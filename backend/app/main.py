# File: documind-enterprise/backend/app/main.py 
# Purpose: Initialize FastAPI, middleware, and lifecycle hooks.

"""
Main Application Module
-----------------------
Entry point for the FastAPI application.
"""

from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, AsyncSessionLocal
from app.models.base import Base
# IMPORTANT: Import models so Base.metadata knows they exist
from app.models.document import DocumentChunk 
from app.api.v1.endpoints import documents, chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    print(f"INFO:    Starting {settings.PROJECT_NAME}...")
    
    # 1. FIRST: Enable Vector Extension
    # We must do this before creating tables, otherwise the 'vector' type won't exist.
    async with AsyncSessionLocal() as session:
        try:
            await session.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            await session.commit()
            print("INFO:    Database connection established & Vector extension verified.")
        except Exception as e:
            print(f"ERROR:   Database connection failed: {e}")
            raise e

    # 2. SECOND: Create Database Tables
    # Now that 'vector' exists, we can create the table safely.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
            
    yield
    
    # --- Shutdown ---
    print("INFO:    Shutting down...")
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Register Routers
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

@app.get("/")
async def root():
    return {"message": "Welcome to DocuMind API", "docs": "/docs"}