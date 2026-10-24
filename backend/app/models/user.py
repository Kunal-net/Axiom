"""
Axiom User Database Model
"""

from typing import List, TYPE_CHECKING
from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.document import Document


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), default="Principal Design Engineer", nullable=False)
    organization: Mapped[str] = mapped_column(String(255), default="Independent Studio", nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(512), nullable=True)

    # Preferences & Risk Thresholds
    risk_sensitivity: Mapped[str] = mapped_column(String(32), default="standard", nullable=False)
    explanation_style: Mapped[str] = mapped_column(String(32), default="plain_english", nullable=False)
    auto_generate_redlines: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    document_retention_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    high_risk_alerts: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    documents: Mapped[List["Document"]] = relationship(
        "Document",
        back_populates="owner",
        cascade="all, delete-orphan",
        order_by="desc(Document.created_at)",
    )
