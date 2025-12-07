# File: documind-enterprise/backend/app/core/config.py 
# Purpose: Type-safe configuration management using Pydantic V2.

"""
Config Module
-------------
Loads environment variables and defines application settings.
"""

from typing import List, Union, Optional
from pydantic import AnyHttpUrl, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuMind Enterprise"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    
    # Database Settings
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int = 5432

    # AI Settings
    OPENAI_API_KEY: str
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    model_config = SettingsConfigDict(
        env_file=".env.example", 
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()