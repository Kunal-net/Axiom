"""
Axiom Base LLM Provider Adapter
Abstract interface and common HTTP resilience for external AI providers.
"""

from abc import ABC, abstractmethod
import json
from typing import Any, Dict, Optional, Type
import httpx
from pydantic import BaseModel

from ai.exceptions import (
    AIAuthenticationError,
    AIProviderError,
    AIRateLimitError,
    AISchemaValidationError,
    AITimeoutError,
)
from backend.app.core.logging import logger


class BaseLLMProvider(ABC):
    """Abstract base class for all LLM service integrations."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "default",
        timeout: float = 30.0,
        max_retries: int = 2,
        provider_name: str = "llm-provider",
    ):
        self.api_key = api_key
        self.model_name = model_name
        self.timeout = timeout
        self.max_retries = max_retries
        self.provider_name = provider_name


    @abstractmethod
    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        """Synchronously invokes the provider and returns raw text / JSON response."""
        pass

    def parse_json_response(self, raw_text: str) -> Dict[str, Any]:
        """Safely parses JSON from model output, handling optional Markdown backticks."""
        text = raw_text.strip()
        # Strip ```json ... ``` wrappers if present
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            # Attempt to find the first '{' and matching '}'
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(text[start : end + 1])
                except Exception:
                    pass
            logger.warning(f"Failed to parse LLM response as JSON: {e}")
            raise AISchemaValidationError(
                message=f"Model output is not valid JSON: {e}",
                details={"raw_preview": text[:200]},
            )

    def handle_http_error(self, e: Exception) -> None:
        """Translates httpx network/HTTP errors into typed AI exceptions."""
        if isinstance(e, httpx.TimeoutException):
            raise AITimeoutError(
                message=f"Request to {self.model_name} timed out after {self.timeout}s",
                details={"timeout": self.timeout},
            )
        elif isinstance(e, httpx.HTTPStatusError):
            status = e.response.status_code
            if status in [401, 403]:
                raise AIAuthenticationError(
                    message=f"Authentication failed for provider {self.model_name} (HTTP {status})",
                    details={"status_code": status},
                )
            elif status == 429:
                raise AIRateLimitError(
                    message=f"Rate limit exceeded for provider {self.model_name}",
                    details={"status_code": 429},
                )
            else:
                raise AIProviderError(
                    message=f"Provider {self.model_name} returned HTTP {status}",
                    status_code=status,
                    details={"status_code": status},
                )
        elif isinstance(e, (AIProviderError, AISchemaValidationError)):
            raise e
        else:
            raise AIProviderError(message=f"Unexpected error communicating with LLM provider: {e}")
