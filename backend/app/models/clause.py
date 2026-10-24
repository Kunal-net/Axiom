"""
Axiom ClauseFinding Database Model
Represents an extracted and evaluated contract clause.
"""

from typing import TYPE_CHECKING
from sqlalchemy import Boolean, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from backend.app.models.document import Document


class ClauseFinding(Base, TimestampMixin):
    __tablename__ = "clause_findings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    document_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), index=True, nullable=False)  # 'high' | 'medium' | 'low' | 'info'
    section: Mapped[str] = mapped_column(String(255), nullable=False)
    page_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    original_text: Mapped[str] = mapped_column(Text, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    why_risky: Mapped[str] = mapped_column(Text, nullable=False)
    suggested_revision: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    reviewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    bookmarked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="clauses")

    __table_args__ = (
        Index("ix_clause_findings_doc_severity", "document_id", "severity"),
    )
