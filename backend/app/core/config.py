# File: documind-enterprise/backend/app/core/config.py 
# Purpose: Type-safe configuration management using Pydantic V2.

"""
Config Module
-------------
Loads environment variables and defines application settings using Pydantic.
Ensures validation of critical configuration (e.g., Database URLs) at startup.
"""

from typing import List, Union
from pydantic import AnyHttpUrl, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application Settings
    
    Attributes:
        PROJECT_NAME: Name of the API.
        API_V1_STR: Base path for V1 API.
        POSTGRES_*: Database connection details.
    """
    PROJECT_NAME: str = "DocuMind Enterprise"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    
    # Database Settings
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int = 5432

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        """
        Constructs the Async PostgreSQL connection string.
        Format: postgresql+asyncpg://user:pass@host:port/db
        """
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    # Configuration for loading .env file
    model_config = SettingsConfigDict(
        env_file=".env.example", 
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()