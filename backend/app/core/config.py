import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXUS INTEL — AI-Powered Investigation Intelligence Platform"
    VERSION: str = "2.0.0-sih26189"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"

    # CORS — set CORS_ORIGINS env var on Render as comma-separated URLs
    # e.g. CORS_ORIGINS=https://tracenet.vercel.app,https://tracenet-staging.vercel.app
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # JWT Security
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "nexus_intel_sih26189_secure_random_development_key_change_in_prod"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Neo4j Settings
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USERNAME: str = os.getenv("NEO4J_USERNAME", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")
    NEO4J_DATABASE: str = os.getenv("NEO4J_DATABASE", "neo4j")
    NEO4J_MAX_CONNECTION_POOL_SIZE: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

settings = Settings()

# Apply CORS_ORIGINS env var override if set
_cors_env = os.getenv("CORS_ORIGINS", "")
if _cors_env:
    settings.CORS_ORIGINS = [origin.strip() for origin in _cors_env.split(",") if origin.strip()]

