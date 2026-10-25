"""
Axiom LLM Provider Factory
Instantiates the configured LLM provider adapter according to application settings.
Supports Groq, Gemini, OpenAI, Anthropic, and Mock providers.
"""

from typing import Optional

from ai.config import AISettings, ai_settings
from ai.providers.anthropic import AnthropicProvider
from ai.providers.base import BaseLLMProvider
from ai.providers.gemini import GeminiProvider
from ai.providers.groq import GroqProvider
from ai.providers.mock import MockProvider
from ai.providers.openai import OpenAIProvider
from backend.app.core.logging import logger


def get_llm_provider(
    provider_name: Optional[str] = None,
    api_key: Optional[str] = None,
    model_name: Optional[str] = None,
    settings: Optional[AISettings] = None,
) -> BaseLLMProvider:
    """Returns an initialized LLM provider instance."""
    cfg = settings or ai_settings
    key = api_key if api_key is not None else cfg.get_api_key()
    provider = (provider_name or cfg.get_provider_name()).lower()
    model = model_name or cfg.AI_MODEL

    logger.debug(f"Initializing AI provider adapter: provider={provider}, model={model}")

    if provider in ["groq", "llama"]:
        groq_model = model if (model and "gemini" not in model.lower()) else "openai/gpt-oss-120b"
        return GroqProvider(

            api_key=key,
            model_name=groq_model,
            timeout=cfg.AI_TIMEOUT_SECONDS,
            max_retries=cfg.AI_MAX_RETRIES,
        )

    elif provider in ["gemini", "google"]:
        return GeminiProvider(
            api_key=key,
            model_name=model or "gemini-1.5-pro",
            timeout=cfg.AI_TIMEOUT_SECONDS,
            max_retries=cfg.AI_MAX_RETRIES,
        )
    elif provider in ["openai", "gpt"]:
        return OpenAIProvider(
            api_key=key,
            model_name=model or "gpt-4o",
            timeout=cfg.AI_TIMEOUT_SECONDS,
            max_retries=cfg.AI_MAX_RETRIES,
        )
    elif provider in ["anthropic", "claude"]:
        return AnthropicProvider(
            api_key=key,
            model_name=model or "claude-3-5-sonnet-20241022",
            timeout=cfg.AI_TIMEOUT_SECONDS,
            max_retries=cfg.AI_MAX_RETRIES,
        )
    elif provider in ["mock", "test", "rule_benchmark"]:
        return MockProvider()
    else:
        logger.warning(f"Unknown AI provider '{provider}', defaulting to GroqProvider")
        return GroqProvider(
            api_key=key,
            model_name="llama-3.3-70b-versatile",
            timeout=cfg.AI_TIMEOUT_SECONDS,
            max_retries=cfg.AI_MAX_RETRIES,
        )
