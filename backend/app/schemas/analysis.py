"""
Axiom Analysis Schemas
Matches frontend analysis requests and response contracts.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.app.schemas.clause import ClauseFindingSchema


class RiskCountsSchema(BaseModel):
    high: int = 0
    medium: int = 0
    low: int = 0
    info: int = 0


class AnalysisInitiateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    risk_sensitivity: Optional[str] = Field(default="standard", alias="riskSensitivity")
    explanation_style: Optional[str] = Field(default="plain_english", alias="explanationStyle")
    auto_generate_redlines: Optional[bool] = Field(default=True, alias="autoGenerateRedlines")


class AnalysisResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    document_id: str = Field(alias="documentId")
    version: int = 1
    schema_version: str = Field(default="1.0.0", alias="schemaVersion")
    status: str
    summary: Optional[str] = None
    risk_counts: RiskCountsSchema = Field(alias="riskCounts")
    clauses: List[ClauseFindingSchema] = Field(default_factory=list)
    provider: str
    model: str
    completed_at: Optional[str] = Field(default=None, alias="completedAt")
