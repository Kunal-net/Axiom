"""
Axiom Error Classes and Exception Handlers
Provides consistent, leak-safe error responses matching the frontend ApiError specification.
"""

from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.app.core.logging import logger, request_id_ctx


class AxiomException(Exception):
    """Base application exception with HTTP status code and standardized error code."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}


class NotFoundError(AxiomException):
    def __init__(self, message: str = "Resource not found", code: str = "NOT_FOUND", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_404_NOT_FOUND, details=details)


class UnauthorizedError(AxiomException):
    def __init__(self, message: str = "Authentication required", code: str = "UNAUTHORIZED", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_401_UNAUTHORIZED, details=details)


class ForbiddenError(AxiomException):
    def __init__(self, message: str = "Access forbidden", code: str = "FORBIDDEN", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_403_FORBIDDEN, details=details)


class ConflictError(AxiomException):
    def __init__(self, message: str = "Resource conflict", code: str = "CONFLICT", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_409_CONFLICT, details=details)


class ValidationError(AxiomException):
    def __init__(self, message: str = "Invalid request parameters", code: str = "VALIDATION_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)


class OversizedFileError(AxiomException):
    def __init__(self, message: str = "Uploaded file exceeds maximum permitted size", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code="PAYLOAD_TOO_LARGE", status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, details=details)


class UnsupportedMediaTypeError(AxiomException):
    def __init__(self, message: str = "Unsupported media type. Allowed: PDF, DOCX", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code="UNSUPPORTED_MEDIA_TYPE", status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, details=details)


class ProcessingError(AxiomException):
    def __init__(self, message: str = "Document processing failed", code: str = "PROCESSING_FAILED", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, details=details)


def format_error_response(status_code: int, code: str, message: str, details: Optional[Dict[str, Any]] = None) -> JSONResponse:
    req_id = request_id_ctx.get() or "req-unknown"
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code,
                "message": message,
                "request_id": req_id,
                "details": details or {},
            }
        },
    )


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AxiomException)
    async def axiom_exception_handler(_request: Request, exc: AxiomException):
        if exc.status_code >= 500:
            logger.error(f"Application error: [{exc.code}] {exc.message} - {exc.details}")
        else:
            logger.warning(f"Client error: [{exc.code}] {exc.message} - {exc.details}")
        return format_error_response(exc.status_code, exc.code, exc.message, exc.details)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_request: Request, exc: RequestValidationError):
        logger.warning(f"Request validation failure: {exc.errors()}")
        clean_errors = []
        for err in exc.errors():
            clean_errors.append({
                "loc": [str(loc) for loc in err.get("loc", [])],
                "msg": err.get("msg", "Invalid value"),
                "type": err.get("type", "value_error"),
            })
        return format_error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_ERROR",
            message="Request parameters failed validation.",
            details={"errors": clean_errors},
        )

    @app.exception_handler(StarletteHTTPException)
    async def starlette_http_exception_handler(_request: Request, exc: StarletteHTTPException):
        code_map = {
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            405: "METHOD_NOT_ALLOWED",
            413: "PAYLOAD_TOO_LARGE",
            415: "UNSUPPORTED_MEDIA_TYPE",
            422: "VALIDATION_ERROR",
            429: "RATE_LIMITED",
            500: "INTERNAL_SERVER_ERROR",
        }
        code = code_map.get(exc.status_code, "HTTP_ERROR")
        return format_error_response(
            status_code=exc.status_code,
            code=code,
            message=str(exc.detail),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_request: Request, exc: Exception):
        logger.exception(f"Unhandled server exception: {exc}")
        return format_error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred. Please try again later.",
        )
