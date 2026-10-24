"""
Axiom Logging Module
Provides safe, structured logging with request ID tracking and sensitive data redaction.
"""

import logging
import re
import sys
from contextvars import ContextVar
from typing import Optional

# Request ID context for distributed request tracing
request_id_ctx: ContextVar[Optional[str]] = ContextVar("request_id_ctx", default=None)

SENSITIVE_PATTERNS = [
    re.compile(r"(?i)(password|secret|token|api_key|authorization)[\"']?\s*[:=]\s*[\"']?([^\"'\s,]+)"),
]


class RedactingFormatter(logging.Formatter):
    """Log formatter that automatically masks secrets and attaches the current request ID."""

    def format(self, record: logging.LogRecord) -> str:
        req_id = request_id_ctx.get()
        record.request_id = req_id if req_id else "-"
        message = super().format(record)
        for pattern in SENSITIVE_PATTERNS:
            message = pattern.sub(r"\1=[REDACTED]", message)
        return message


def configure_logging(log_level: str = "INFO") -> None:
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level.upper())

    # Clear existing handlers
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    formatter = RedactingFormatter(
        fmt="%(asctime)s [%(levelname)s] [%(request_id)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)

    # Silence chatty third-party loggers
    logging.getLogger("uvicorn.access").handlers.clear()
    logging.getLogger("passlib").setLevel(logging.ERROR)


logger = logging.getLogger("axiom")
