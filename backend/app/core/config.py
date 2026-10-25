"""
Axiom Backend Configuration
Typed environment settings with strict startup validation.
"""

from typing import List, Union
from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    APP_ENV: str = Field(default="development", description="Environment mode: development | staging | production | test")
    APP_NAME: str = Field(default="Axiom API", description="Application service name")
    API_V1_PREFIX: str = Field(default="/api/v1", description="Prefix for v1 routes")

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+psycopg://axiom_user:axiom_password@localhost:5432/axiom_db",
        description="Database connection URL",
    )

    # Security & Tokens
    SECRET_KEY: str = Field(
        default="axiom-insecure-dev-secret-key-32-chars-long-min!!",
        description="JWT cryptographic signing secret",
    )
    ALGORITHM: str = Field(default="HS256", description="JWT signing algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440, description="Token TTL in minutes (24 hours)")

    # CORS
    CORS_ORIGINS: Union[List[str], str] = Field(
        default=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
        description="Allowed CORS origin list or comma-separated string",
    )

    # Storage & Upload limits
    UPLOAD_DIR: str = Field(default="./.local_uploads", description="Directory for private local file storage")
    MAX_UPLOAD_SIZE_MB: int = Field(default=25, description="Maximum permitted upload size in megabytes")

    # AI Service Configuration
    AI_PROVIDER: str = Field(default="groq", description="AI provider: groq | gemini | anthropic | openai | rule_benchmark")
    AI_API_KEY: Union[str, None] = Field(
        default=None,
        validation_alias=AliasChoices(
            "GROQ_API_KEY",
            "AI_API_KEY",
            "GEMINI_API_KEY",
            "GOOGLE_API_KEY",
            "OPENAI_API_KEY",
            "ANTHROPIC_API_KEY",
        ),
        description="Optional server-side API key for LLM analysis",
    )
    AI_MODEL: str = Field(default="llama-3.3-70b-versatile", description="LLM model identifier")



    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Minimum log level: DEBUG | INFO | WARNING | ERROR")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def max_upload_size_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def is_test(self) -> bool:
        return self.APP_ENV.lower() == "test"


settings = Settings()
