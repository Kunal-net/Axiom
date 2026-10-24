"""
Axiom Document Database Model
"""

from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.user import User
    from backend.app.models.analysis import Analysis
    from backend.app.models.clause import ClauseFinding


class Document(Base, TimestampMixin):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    owner_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    safe_storage_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    file_type: Mapped[str] = mapped_column(String(16), nullable=False)  # 'pdf' | 'docx'
    file_size: Mapped[str] = mapped_column(String(32), nullable=False)   # formatted, e.g. "1.4 MB"
    byte_size: Mapped[int] = mapped_column(Integer, nullable=False)
    sha256_checksum: Mapped[str] = mapped_column(String(64), index=True, nullable=False)

    # Lifecycle State: 'uploaded' | 'processing' | 'needs_review' | 'completed' | 'failed'
    status: Mapped[str] = mapped_column(String(32), default="uploaded", index=True, nullable=False)
    page_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Safe error codes if failed
    error_code: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    last_analyzed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="documents")
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="desc(Analysis.version)",
    )
    clauses: Mapped[List["ClauseFinding"]] = relationship(
        "ClauseFinding",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="ClauseFinding.page_number, ClauseFinding.id",
    )

    __table_args__ = (
        Index("ix_documents_owner_created", "owner_id", "created_at"),
    )
