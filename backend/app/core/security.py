"""
Axiom Security Module
Password hashing and JWT generation/validation.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from passlib.context import CryptContext

from backend.app.core.config import settings
from backend.app.core.errors import UnauthorizedError

# Configure password hashing context: Argon2 with bcrypt fallback
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash plaintext password using Argon2id/bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "iat": now})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate a signed JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise UnauthorizedError(message="Authentication token has expired", code="TOKEN_EXPIRED")
    except jwt.InvalidTokenError:
        raise UnauthorizedError(message="Invalid authentication token", code="INVALID_TOKEN")


import time
from backend.app.core.errors import RateLimitError


class LoginRateLimiter:
    """In-memory brute-force protection tracking failed login attempts per key (email / client IP)."""

    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._attempts: Dict[str, list] = {}

    def check_rate_limit(self, key: str) -> None:
        now = time.time()
        timestamps = self._attempts.get(key, [])
        valid_timestamps = [t for t in timestamps if now - t < self.window_seconds]
        self._attempts[key] = valid_timestamps
        if len(valid_timestamps) >= self.max_attempts:
            retry_after = int(self.window_seconds - (now - valid_timestamps[0]))
            raise RateLimitError(
                message=f"Too many failed login attempts. Please wait {max(1, retry_after)} seconds before trying again.",
                code="TOO_MANY_ATTEMPTS",
                details={"retry_after": max(1, retry_after)},
            )

    def record_failed_attempt(self, key: str) -> None:
        now = time.time()
        if key not in self._attempts:
            self._attempts[key] = []
        self._attempts[key].append(now)

    def record_successful_login(self, key: str) -> None:
        if key in self._attempts:
            del self._attempts[key]

    def reset(self) -> None:
        self._attempts.clear()


login_rate_limiter = LoginRateLimiter()
