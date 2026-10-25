"""
Axiom Google Gemini LLM Provider Adapter
Native REST integration with Google Generative AI API using HTTPX.
Supports structured JSON mode and system instructions.
"""

import time
from typing import Optional, Type
import httpx
from pydantic import BaseModel

from ai.exceptions import AIAuthenticationError, AIProviderError
from ai.providers.base import BaseLLMProvider
from backend.app.core.logging import logger


class GeminiProvider(BaseLLMProvider):
    """Adapter for Google Gemini models via REST API."""

    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "gemini-1.5-pro",
        timeout: float = 30.0,
        max_retries: int = 2,
    ):
        super().__init__(
            api_key=api_key,
            model_name=model_name,
            timeout=timeout,
            max_retries=max_retries,
            provider_name="gemini",
        )


    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        if not self.api_key:
            raise AIAuthenticationError("Gemini API key is not configured in settings/environment")

        url = f"{self.BASE_URL}/{self.model_name}:generateContent?key={self.api_key}"

        payload = {
            "system_instruction": {
                "parts": [{"text": system_prompt}],
            },
            "contents": [
                {
                    "parts": [{"text": user_prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "response_mime_type": "application/json",
            },
        }

        # If schema is available, hint it in generationConfig
        if response_schema:
            try:
                schema_dict = response_schema.model_json_schema()
                payload["generationConfig"]["response_schema"] = schema_dict
            except Exception as e:
                logger.debug(f"Could not attach model_json_schema to Gemini config: {e}")

        client = httpx.Client(timeout=self.timeout)
        last_error = None

        for attempt in range(self.max_retries + 1):
            try:
                logger.debug(f"Dispatching request to Gemini ({self.model_name}), attempt {attempt + 1}")
                response = client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()

                candidates = data.get("candidates", [])
                if not candidates:
                    raise AIProviderError(f"Gemini returned empty candidates list: {data}")

                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts or "text" not in parts[0]:
                    raise AIProviderError(f"Gemini returned missing content parts: {candidates[0]}")

                return parts[0]["text"]
            except Exception as e:
                last_error = e
                # Only retry on 5xx or transient connection errors
                is_transient = isinstance(e, (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError)) or (
                    isinstance(e, httpx.HTTPStatusError) and e.response.status_code >= 500
                )
                if attempt < self.max_retries and is_transient:
                    logger.warning(f"Transient error with Gemini attempt {attempt + 1}: {e}. Retrying in 1s...")
                    time.sleep(1.0)
                    continue
                break

        self.handle_http_error(last_error or AIProviderError("Failed to generate response from Gemini"))
        raise AIProviderError("Failed to generate response from Gemini")
