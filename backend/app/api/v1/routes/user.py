"""
Axiom User Profile Routes
Profile preferences, liability calibration, and tone settings.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_active_user
from backend.app.db.session import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserProfileSchema, UserProfileUpdateSchema

router = APIRouter(prefix="/user", tags=["User Profile"])


@router.get("/profile", response_model=UserProfileSchema)
def get_user_profile(current_user: User = Depends(get_current_active_user)):
    return UserProfileSchema(
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        organization=current_user.organization,
        avatar_url=current_user.avatar_url,
        risk_sensitivity=current_user.risk_sensitivity,
        explanation_style=current_user.explanation_style,
        auto_generate_redlines=current_user.auto_generate_redlines,
        document_retention_days=current_user.document_retention_days,
        email_notifications=current_user.email_notifications,
        high_risk_alerts=current_user.high_risk_alerts,
    )


@router.put("/profile", response_model=UserProfileSchema)
def update_user_profile(
    updates: UserProfileUpdateSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if updates.name is not None:
        current_user.name = updates.name
    if updates.role is not None:
        current_user.role = updates.role
    if updates.organization is not None:
        current_user.organization = updates.organization
    if updates.avatar_url is not None:
        current_user.avatar_url = updates.avatar_url
    if updates.risk_sensitivity is not None:
        current_user.risk_sensitivity = updates.risk_sensitivity
    if updates.explanation_style is not None:
        current_user.explanation_style = updates.explanation_style
    if updates.auto_generate_redlines is not None:
        current_user.auto_generate_redlines = updates.auto_generate_redlines
    if updates.document_retention_days is not None:
        current_user.document_retention_days = updates.document_retention_days
    if updates.email_notifications is not None:
        current_user.email_notifications = updates.email_notifications
    if updates.high_risk_alerts is not None:
        current_user.high_risk_alerts = updates.high_risk_alerts

    db.commit()
    db.refresh(current_user)

    return UserProfileSchema(
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        organization=current_user.organization,
        avatar_url=current_user.avatar_url,
        risk_sensitivity=current_user.risk_sensitivity,
        explanation_style=current_user.explanation_style,
        auto_generate_redlines=current_user.auto_generate_redlines,
        document_retention_days=current_user.document_retention_days,
        email_notifications=current_user.email_notifications,
        high_risk_alerts=current_user.high_risk_alerts,
    )
