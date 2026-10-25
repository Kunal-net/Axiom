"""
Axiom Anthropic LLM Provider Adapter
Native REST integration with Anthropic Claude API using HTTPX.
"""

import time
from typing import Optional, Type
import httpx
from pydantic import BaseModel

from ai.exceptions import AIAuthenticationError, AIProviderError
from ai.providers.base import BaseLLMProvider
from backend.app.core.logging import logger


class AnthropicProvider(BaseLLMProvider):
    """Adapter for Anthropic Claude models via REST API."""

    URL = "https://api.anthropic.com/v1/messages"

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "claude-3-5-sonnet-20241022",
        timeout: float = 30.0,
        max_retries: int = 2,
    ):
        super().__init__(
            api_key=api_key,
            model_name=model_name,
            timeout=timeout,
            max_retries=max_retries,
            provider_name="anthropic",
        )


    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        if not self.api_key:
            raise AIAuthenticationError("Anthropic API key is not configured in settings/environment")

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "max_tokens": 4096,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.1,
        }

        client = httpx.Client(timeout=self.timeout)
        last_error = None

        for attempt in range(self.max_retries + 1):
            try:
                response = client.post(self.URL, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                content = data.get("content", [])
                if not content or "text" not in content[0]:
                    raise AIProviderError("Anthropic returned empty content")
                return content[0]["text"]
            except Exception as e:
                last_error = e
                is_transient = isinstance(e, (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError)) or (
                    isinstance(e, httpx.HTTPStatusError) and e.response.status_code >= 500
                )
                if attempt < self.max_retries and is_transient:
                    logger.warning(f"Transient error with Anthropic attempt {attempt + 1}: {e}. Retrying in 1s...")
                    time.sleep(1.0)
                    continue
                break

        self.handle_http_error(last_error or AIProviderError("Failed to generate response from Anthropic"))
        raise AIProviderError("Failed to generate response from Anthropic")
