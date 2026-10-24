"""
Axiom Analysis Database Model
"""

from datetime import datetime
from typing import Any, Dict, Optional, TYPE_CHECKING
from sqlalchemy import DateTime, ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.document import Document


class Analysis(Base, TimestampMixin):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    document_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    schema_version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)  # 'completed' | 'failed'
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Structured metadata
    risk_counts: Mapped[Dict[str, int]] = mapped_column(JSON, nullable=False, default=dict)
    structured_result: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)

    provider: Mapped[str] = mapped_column(String(64), default="gemini", nullable=False)
    model_name: Mapped[str] = mapped_column(String(64), default="gemini-1.5-pro", nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_code: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="analyses")

    __table_args__ = (
        Index("ix_analyses_document_version", "document_id", "version"),
    )
