# File: documind-enterprise/backend/app/core/database.py 
# Purpose: Manages the Async Engine and Session lifecycle. Essential for high-concurrency API handling.

"""
Database Module
---------------
Sets up the SQLAlchemy Async Engine and Session Factory.
Provides dependency injection for FastAPI endpoints.
"""

from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Create the Async Engine
# echo=True logs SQL queries (useful for dev, disable in prod)
engine = create_async_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    echo=True, 
    future=True
)

# Create the Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for FastAPI Routes.
    
    Yields:
        AsyncSession: A database session context.
        
    Usage:
        @router.get("/")
        async def endpoint(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()