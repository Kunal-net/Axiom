"""
Axiom AI Pipeline Custom Exceptions
Explicit error classification for provider, validation, and execution failures.
"""

from typing import Optional, Dict, Any


class AIError(Exception):
    """Base exception for all AI pipeline errors."""

    def __init__(self, message: str, code: str = "AI_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}


class AIProviderError(AIError):
    """Error communicating with external LLM provider."""

    def __init__(self, message: str, code: str = "PROVIDER_ERROR", status_code: Optional[int] = None, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code=code, details=details)
        self.status_code = status_code


class AIAuthenticationError(AIProviderError):
    """Authentication failed with the LLM provider (e.g. invalid or missing API key)."""

    def __init__(self, message: str = "Invalid or missing LLM API credentials", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="PROVIDER_AUTH_FAILED", status_code=401, details=details)


class AITimeoutError(AIProviderError):
    """LLM provider request timed out."""

    def __init__(self, message: str = "LLM provider call timed out", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="PROVIDER_TIMEOUT", status_code=504, details=details)


class AIRateLimitError(AIProviderError):
    """LLM provider rate limit exceeded."""

    def __init__(self, message: str = "LLM provider rate limit reached", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="PROVIDER_RATE_LIMIT", status_code=429, details=details)


class AISchemaValidationError(AIError):
    """Model output failed schema validation or could not be parsed as structured JSON."""

    def __init__(self, message: str = "Model output failed schema validation", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="MALFORMED_MODEL_OUTPUT", details=details)


class AIGroundingError(AIError):
    """Evidence grounding check failed (e.g. hallucinated quote or ungrounded page reference)."""

    def __init__(self, message: str = "Quoted clause finding not grounded in source text", details: Optional[Dict[str, Any]] = None):
        super().__init__(message, code="EVIDENCE_GROUNDING_FAILED", details=details)
