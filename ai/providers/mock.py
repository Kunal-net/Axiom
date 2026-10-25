"""
Axiom Mock / Rule-Based LLM Provider Adapter
Provides deterministic, fast responses for offline unit tests, CI pipelines,
and controlled failure injection testing.
"""

import json
from typing import Callable, Optional, Type
from pydantic import BaseModel

from ai.exceptions import AIAuthenticationError, AIRateLimitError, AISchemaValidationError, AITimeoutError
from ai.providers.base import BaseLLMProvider


class MockProvider(BaseLLMProvider):
    """Deterministic mock provider for unit testing and CI test environments."""

    def __init__(
        self,
        mock_response: Optional[str] = None,
        generator_fn: Optional[Callable[[str, str], str]] = None,
        failure_mode: Optional[str] = None,
    ):
        super().__init__(api_key="mock-api-key", model_name="mock-pipeline-model", provider_name="mock")

        self.mock_response = mock_response
        self.generator_fn = generator_fn
        self.failure_mode = failure_mode

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
    ) -> str:
        # Simulate explicit failure modes
        if self.failure_mode == "timeout":
            raise AITimeoutError("Mock simulated provider timeout")
        elif self.failure_mode == "rate_limit":
            raise AIRateLimitError("Mock simulated rate limit reached")
        elif self.failure_mode == "auth_failed":
            raise AIAuthenticationError("Mock simulated invalid credentials")
        elif self.failure_mode == "malformed_json":
            return "This is not valid JSON at all: {broken, text}"
        elif self.failure_mode == "empty_findings":
            return json.dumps({"summary": "No risks identified.", "findings": []})

        if self.generator_fn:
            return self.generator_fn(system_prompt, user_prompt)

        if self.mock_response:
            return self.mock_response

        # Default synthetic response for contract analysis
        default_payload = {
            "summary": "The agreement contains significant commercial risks: unlimited indemnification obligations and broad intellectual property assignment.",
            "findings": [
                {
                    "title": "Unlimited Indemnification",
                    "category": "liability",
                    "severity": "high",
                    "source_excerpt": "defend, indemnify, and hold harmless",
                    "section": "Section 9.1 • Indemnification",
                    "page_number": 1,
                    "plain_english_explanation": "You are agreeing to pay all client legal claims without any dollar limit.",
                    "why_it_matters": "A single dispute could result in catastrophic financial liability exceeding contract fees.",
                    "recommended_action": "Insert mutual liability ceiling capped at total contract fees.",
                    "suggested_counter_clause": "Each party shall indemnify the other against direct claims, capped at total fees paid.",
                    "confidence": "high",
                    "needs_human_review": True,
                }
            ],
        }
        return json.dumps(default_payload)
