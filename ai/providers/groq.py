"""
Axiom Groq LLM Provider Adapter
Ultra-fast OpenAI-compatible REST integration for Groq models (Llama 3.3, Llama 3.1, Mixtral).
Supports JSON object mode.
"""

import time
from typing import Optional, Type
import httpx
from pydantic import BaseModel

from ai.exceptions import AIAuthenticationError, AIProviderError
from ai.providers.base import BaseLLMProvider
from backend.app.core.logging import logger


class GroqProvider(BaseLLMProvider):
    """Adapter for Groq LPUs via OpenAI-compatible REST API."""

    URL = "https://api.groq.com/openai/v1/chat/completions"

    def __init__(
        self,
        api_key: Optional[str] = None,
        model_name: str = "llama-3.3-70b-versatile",
        timeout: float = 30.0,
        max_retries: int = 2,
    ):
        super().__init__(
            api_key=api_key,
            model_name=model_name,
            timeout=timeout,
            max_retries=max_retries,
            provider_name="groq",
        )


    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        if not self.api_key:
            raise AIAuthenticationError("Groq API key is not configured in settings/environment")

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
                status_code = getattr(getattr(e, "response", None), "status_code", None)
                is_transient = (
                    isinstance(e, (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError))
                    or (status_code is not None and (status_code >= 500 or status_code == 429))
                )
                if attempt < self.max_retries and is_transient:
                    wait_time = 2.0 * (attempt + 1)
                    if status_code == 429 and hasattr(e, "response") and e.response is not None:
                        retry_after = e.response.headers.get("retry-after")
                        if retry_after:
                            try:
                                retry_val = float(retry_after)
                                if retry_val > 5.0:
                                    logger.warning(
                                        f"Groq 429 rate limit retry-after of {retry_val}s exceeds max interactive retry window. Triggering immediate safe fallback."
                                    )
                                    break
                                wait_time = max(retry_val, wait_time)
                            except ValueError:
                                pass
                    logger.warning(
                        f"Transient error with Groq attempt {attempt + 1}: {e}. Retrying in {wait_time}s..."
                    )
                    time.sleep(wait_time)
                    continue
                break

        self.handle_http_error(last_error or AIProviderError("Failed to generate response from Groq"))
        raise AIProviderError("Failed to generate response from Groq")
