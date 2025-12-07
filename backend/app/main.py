# File: documind-enterprise/backend/app/main.py 
# Purpose: Initialize FastAPI, middleware, and lifecycle hooks.

"""
Main Application Module
-----------------------
Entry point for the FastAPI application.
Configures Middleware, CORS, and Exception Handlers.
"""

from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, AsyncSessionLocal

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan Context.
    
    1. Startup: Checks database connectivity and ensures 'vector' extension exists.
    2. Shutdown: Disposes of the database engine.
    """
    # --- Startup Logic ---
    print(f"INFO:    Starting {settings.PROJECT_NAME}...")
    
    async with AsyncSessionLocal() as session:
        try:
            # Ensure the pgvector extension is enabled
            await session.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            await session.commit()
            print("INFO:    Database connection established & Vector extension verified.")
        except Exception as e:
            print(f"ERROR:   Database connection failed: {e}")
            raise e
            
    yield
    
    # --- Shutdown Logic ---
    print("INFO:    Shutting down...")
    await engine.dispose()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

@app.get("/health")
async def health_check():
    """
    K8s/Docker Liveness Probe.
    Returns 200 OK if the app is running.
    """
    return {"status": "healthy", "version": "0.1.0"}

@app.get("/")
async def root():
    """
    Root endpoint for quick verification.
    """
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API", 
        "docs": "/docs"
    }