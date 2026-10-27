"""
Axiom Authentication Routes
User registration, login, logout, and profile identity with HttpOnly cookie and Bearer support.
"""

import uuid
from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_active_user
from backend.app.core.config import settings
from backend.app.core.errors import ConflictError, UnauthorizedError
from backend.app.core.security import create_access_token, hash_password, login_rate_limiter, verify_password
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserSafeResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _set_auth_cookie(response: Response, token: str) -> None:
    """Sets a secure HttpOnly cookie containing the access token."""
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=settings.is_production,
        path="/",
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    clean_email = request.email.lower().strip()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise ConflictError(message="A user with this email address already exists", code="EMAIL_ALREADY_EXISTS")

    user_id = f"usr-{uuid.uuid4().hex[:12]}"
    new_user = User(
        id=user_id,
        email=clean_email,
        password_hash=hash_password(request.password),
        name=request.name.strip(),
        role=request.role or "Principal Design Engineer",
        organization=request.organization or "Independent Studio",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "email": new_user.email})
    _set_auth_cookie(response, token)

    return TokenResponse(
        token=token,
        token_type="bearer",
        user=UserSafeResponse(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name,
            role=new_user.role,
            organization=new_user.organization,
            avatar_url=new_user.avatar_url,
            created_at=new_user.created_at,
        ),
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, raw_request: Request, response: Response, db: Session = Depends(get_db)):
    clean_email = request.email.lower().strip()
    client_ip = raw_request.client.host if raw_request.client else "local"
    rate_limit_key = f"{clean_email}:{client_ip}"

    # Enforce brute-force rate limit
    login_rate_limiter.check_rate_limit(rate_limit_key)

    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(request.password, user.password_hash):
        login_rate_limiter.record_failed_attempt(rate_limit_key)
        raise UnauthorizedError(message="Invalid email or password", code="INVALID_CREDENTIALS")

    # Login succeeded: clear failed attempts
    login_rate_limiter.record_successful_login(rate_limit_key)

    token = create_access_token({"sub": user.id, "email": user.email})
    _set_auth_cookie(response, token)

    return TokenResponse(
        token=token,
        token_type="bearer",
        user=UserSafeResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            organization=user.organization,
            avatar_url=user.avatar_url,
            created_at=user.created_at,
        ),
    )


@router.post("/logout")
def logout(response: Response):
    """Logs out user by clearing the HttpOnly authentication cookie."""
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
    )
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserSafeResponse, tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_active_user)):
    return UserSafeResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        organization=current_user.organization,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at,
    )
