"""
Axiom Clause Finding Schemas
Matches frontend ClauseFinding in src/types/contract.ts
"""

from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

RiskSeverity = Literal["high", "medium", "low", "info"]
ClauseCategory = Literal[
    "liability", "payment", "ip", "termination", "warranty", "confidentiality", "governing_law"
]


class ClauseFindingSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    severity: RiskSeverity
    section: str
    page_number: int = Field(alias="pageNumber")
    original_text: str = Field(alias="originalText")
    explanation: str
    why_risky: str = Field(alias="whyRisky")
    suggested_revision: str = Field(alias="suggestedRevision")
    category: str
    reviewed: bool = False
    bookmarked: bool = False


class ClausePatchRequest(BaseModel):
    reviewed: Optional[bool] = None
    bookmarked: Optional[bool] = None


class ClausePatchResponse(BaseModel):
    id: str
    reviewed: Optional[bool] = None
    bookmarked: Optional[bool] = None
