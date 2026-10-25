"""
Axiom AI Pipeline Configuration
Typed settings for AI providers, rate limiting, timeouts, and chunk boundaries.
Supports Groq, Gemini, OpenAI, and Anthropic seamlessly.
"""

import os
from pathlib import Path
from typing import Optional
from dotenv import dotenv_values
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AISettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # Provider and Model
    AI_PROVIDER: str = Field(
        default="groq",
        validation_alias=AliasChoices("AI_PROVIDER", "LLM_PROVIDER"),
        description="AI provider: groq | gemini | anthropic | openai | rule_benchmark",
    )
    AI_API_KEY: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices(
            "GROQ_API_KEY",
            "AI_API_KEY",
            "GEMINI_API_KEY",
            "GOOGLE_API_KEY",
            "OPENAI_API_KEY",
            "ANTHROPIC_API_KEY",
        ),
        description="Server-side API key for external LLM calls",
    )
    AI_MODEL: str = Field(
        default="llama-3.3-70b-versatile",
        validation_alias=AliasChoices("AI_MODEL", "GROQ_MODEL", "MODEL_NAME"),
        description="LLM model identifier",
    )

    # Network and Timeouts
    AI_TIMEOUT_SECONDS: float = Field(default=30.0, description="HTTP timeout for LLM provider API requests")
    AI_MAX_RETRIES: int = Field(default=2, description="Maximum bounded retries for transient HTTP errors")

    # Chunking & Token Boundaries
    AI_MAX_CHUNK_CHARS: int = Field(default=12000, description="Maximum character length per contract analysis chunk")
    AI_CHUNK_OVERLAP_CHARS: int = Field(default=1000, description="Character overlap between consecutive chunks")

    # Temperature & Sampling
    AI_TEMPERATURE: float = Field(default=0.1, description="Sampling temperature for deterministic legal reasoning")

    def get_api_key(self) -> Optional[str]:
        """Dynamically retrieves API key checking settings, os.environ, and fresh .env file."""
        if self.AI_API_KEY and self.AI_API_KEY.strip():
            return self.AI_API_KEY.strip()

        # Check os.environ
        for var in ["GROQ_API_KEY", "AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]:
            val = os.environ.get(var)
            if val and val.strip():
                return val.strip()

        # Check .env file directly from filesystem
        for env_path in [Path(".env"), Path("../.env"), Path(__file__).resolve().parent.parent / ".env"]:
            if env_path.exists():
                values = dotenv_values(env_path)
                for var in ["GROQ_API_KEY", "AI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]:
                    val = values.get(var)
                    if val and val.strip():
                        return val.strip()

        return None

    def get_provider_name(self) -> str:
        """Determines active provider name based on settings, env or API key prefix."""
        # 1. If explicit provider configured on this settings instance
        if self.AI_PROVIDER:
            prov = self.AI_PROVIDER.lower().strip()
            if prov != "groq":  # If user explicitly specified mock, gemini, openai, etc.
                return prov

        # 2. Check explicit provider in os.environ or .env
        for env_path in [Path(".env"), Path("../.env")]:
            if env_path.exists():
                vals = dotenv_values(env_path)
                if vals.get("AI_PROVIDER"):
                    return vals["AI_PROVIDER"].lower().strip()
                if vals.get("GROQ_API_KEY"):
                    return "groq"
                if vals.get("GEMINI_API_KEY") or vals.get("GOOGLE_API_KEY"):
                    return "gemini"
                if vals.get("OPENAI_API_KEY"):
                    return "openai"
                if vals.get("ANTHROPIC_API_KEY"):
                    return "anthropic"

        key = self.get_api_key() or ""
        if key.startswith("gsk_"):
            return "groq"

        return self.AI_PROVIDER.lower().strip()


    @property
    def has_api_key(self) -> bool:
        return bool(self.get_api_key())


ai_settings = AISettings()
