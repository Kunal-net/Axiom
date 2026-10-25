"""
Axiom AI Pipeline Structured Data Schemas
Pydantic v2 models for LLM output parsing, evidence validation, and intermediate representation.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

RiskSeverity = Literal["high", "medium", "low", "info"]
ClauseCategory = Literal[
    "liability",
    "payment",
    "ip",
    "termination",
    "warranty",
    "confidentiality",
    "governing_law",
]
ChangeType = Literal["modified", "added", "removed", "conflict"]


class SourceReference(BaseModel):
    page: int = 1
    section: str = "General"


class RawClauseFinding(BaseModel):
    """Raw structured clause finding produced by the LLM prompt."""
    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(description="Concise description of the clause or risk")
    category: str = Field(description="Standard category: liability, payment, ip, termination, warranty, confidentiality, governing_law")
    severity: RiskSeverity = Field(default="medium", description="Risk level: high, medium, low, info")
    source_excerpt: str = Field(alias="source_excerpt", description="Verbatim excerpt copied exactly from the contract text")
    section: Optional[str] = Field(default=None, description="Section heading or clause number")
    page_number: Optional[int] = Field(default=None, alias="page_number", description="Page number where the excerpt appears")
    plain_english_explanation: str = Field(alias="plain_english_explanation", description="Plain-English explanation of practical commercial meaning")
    why_it_matters: str = Field(alias="why_it_matters", description="Specific exposure or disadvantage to the independent professional")
    recommended_action: Optional[str] = Field(default=None, alias="recommended_action", description="Concrete proportionate negotiation step")
    suggested_counter_clause: Optional[str] = Field(default=None, alias="suggested_counter_clause", description="Balanced redline counter-proposal wording")
    confidence: Optional[str] = Field(default="medium", description="Model confidence indicator: high, medium, low")
    needs_human_review: Optional[bool] = Field(default=True, description="Always true for legal guidance")


class RawAnalysisResponse(BaseModel):
    """Container for complete LLM contract analysis response."""
    model_config = ConfigDict(populate_by_name=True)

    summary: str = Field(description="2-3 sentence executive synthesis of contract risk profile")
    findings: List[RawClauseFinding] = Field(default_factory=list, description="List of identified clause risks")


class RawDiffFinding(BaseModel):
    """Structured clause diff produced by LLM document comparison."""
    model_config = ConfigDict(populate_by_name=True)

    clause_title: str = Field(alias="clause_title", description="Title of the modified or conflicting provision")
    section: str = Field(description="Section heading or number in the contract")
    change_type: ChangeType = Field(alias="change_type", description="modified, added, removed, or conflict")
    severity: RiskSeverity = Field(default="medium", description="Commercial severity of the change")
    original_text: str = Field(alias="original_text", description="Text in original contract, or [Silent / Absent]")
    revised_text: str = Field(alias="revised_text", description="Text in counter-proposal / revised draft, or [Stricken / Deleted]")
    explanation: str = Field(description="Plain-English explanation of why this provision was changed or conflicts")
    legal_impact: str = Field(alias="legal_impact", description="Commercial and legal impact on the contractor")


class RawComparisonResponse(BaseModel):
    """Container for LLM cross-document comparison response."""
    model_config = ConfigDict(populate_by_name=True)

    diffs: List[RawDiffFinding] = Field(default_factory=list)


class ContractSegment(BaseModel):
    """A bounded segment or clause of contract text with page and section anchors."""
    index: int
    page_number: int = 1
    section_title: str = "General Provisions"
    text: str
    char_start: int = 0
    char_end: int = 0
