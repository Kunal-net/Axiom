"""
Axiom AI Provider Adapters & Resilience Tests
Tests provider adapters, error translation, timeout resilience,
and JSON output parsing.
"""

import pytest

from ai.config import AISettings
from ai.exceptions import (
    AIAuthenticationError,
    AIProviderError,
    AIRateLimitError,
    AISchemaValidationError,
    AITimeoutError,
)
from ai.providers.factory import get_llm_provider
from ai.providers.gemini import GeminiProvider
from ai.providers.mock import MockProvider


def test_mock_provider_success():
    provider = MockProvider()
    response = provider.generate("System prompt", "User prompt")
    parsed = provider.parse_json_response(response)
    assert "findings" in parsed
    assert len(parsed["findings"]) > 0


def test_mock_provider_simulated_timeout():
    provider = MockProvider(failure_mode="timeout")
    with pytest.raises(AITimeoutError) as exc_info:
        provider.generate("System", "User")
    assert "timeout" in str(exc_info.value).lower()


def test_mock_provider_simulated_rate_limit():
    provider = MockProvider(failure_mode="rate_limit")
    with pytest.raises(AIRateLimitError):
        provider.generate("System", "User")


def test_mock_provider_simulated_auth_failed():
    provider = MockProvider(failure_mode="auth_failed")
    with pytest.raises(AIAuthenticationError):
        provider.generate("System", "User")


def test_mock_provider_malformed_json_parsing():
    provider = MockProvider(failure_mode="malformed_json")
    raw = provider.generate("System", "User")
    with pytest.raises(AISchemaValidationError):
        provider.parse_json_response(raw)


def test_provider_parses_json_wrapped_in_markdown_fences():
    provider = MockProvider()
    markdown_wrapped = "```json\n{\"summary\": \"Clean JSON inside markdown block\", \"findings\": []}\n```"
    parsed = provider.parse_json_response(markdown_wrapped)
    assert parsed["summary"] == "Clean JSON inside markdown block"
    assert parsed["findings"] == []


def test_provider_factory_resolution():
    settings_mock = AISettings(AI_PROVIDER="mock", AI_MODEL="test-model")
    p1 = get_llm_provider(settings=settings_mock)
    assert isinstance(p1, MockProvider)

    settings_gemini = AISettings(AI_PROVIDER="gemini", AI_MODEL="gemini-1.5-pro", AI_API_KEY="test-key")
    p2 = get_llm_provider(settings=settings_gemini)
    assert isinstance(p2, GeminiProvider)
    assert p2.model_name == "gemini-1.5-pro"

    settings_groq = AISettings(AI_PROVIDER="groq", AI_MODEL="llama-3.3-70b-versatile", AI_API_KEY="test-key")
    p3 = get_llm_provider(settings=settings_groq)
    from ai.providers.groq import GroqProvider
    assert isinstance(p3, GroqProvider)
    assert p3.model_name == "llama-3.3-70b-versatile"


def test_gemini_missing_api_key_raises_auth_error():
    provider = GeminiProvider(api_key=None)
    with pytest.raises(AIAuthenticationError):
        provider.generate("System", "User")


def test_groq_missing_api_key_raises_auth_error():
    from ai.providers.groq import GroqProvider
    provider = GroqProvider(api_key=None)
    with pytest.raises(AIAuthenticationError):
        provider.generate("System", "User")

