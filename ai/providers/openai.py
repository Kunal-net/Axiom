"""
Axiom OpenAI LLM Provider Adapter
Native REST integration with OpenAI Chat Completions API using HTTPX.
Supports JSON object mode.
"""

import time
from typing import Optional, Type
import httpx
from pydantic import BaseModel

from ai.exceptions import AIAuthenticationError, AIProviderError
from ai.providers.base import BaseLLMProvider
from backend.app.core.logging import logger


class OpenAIProvider(BaseLLMProvider):
    """Adapter for OpenAI models (GPT-4o, GPT-4-turbo) via REST API."""

    URL = "https://api.openai.com/v1/chat/completions"

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "gpt-4o",
        timeout: float = 30.0,
        max_retries: int = 2,
    ):
        super().__init__(
            api_key=api_key,
            model_name=model_name,
            timeout=timeout,
            max_retries=max_retries,
            provider_name="openai",
        )


    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        if not self.api_key:
            raise AIAuthenticationError("OpenAI API key is not configured in settings/environment")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1,
        }

        client = httpx.Client(timeout=self.timeout)
        last_error = None

        for attempt in range(self.max_retries + 1):
            try:
                response = client.post(self.URL, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                last_error = e
                is_transient = isinstance(e, (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError)) or (
                    isinstance(e, httpx.HTTPStatusError) and e.response.status_code >= 500
                )
                if attempt < self.max_retries and is_transient:
                    logger.warning(f"Transient error with OpenAI attempt {attempt + 1}: {e}. Retrying in 1s...")
                    time.sleep(1.0)
                    continue
                break

        self.handle_http_error(last_error or AIProviderError("Failed to generate response from OpenAI"))
        raise AIProviderError("Failed to generate response from OpenAI")
