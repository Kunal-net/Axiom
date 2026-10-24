"""
Axiom Document Comparison Schemas
Matches frontend DocumentComparisonResponse and DocumentDiff in src/types/contract.ts
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.app.schemas.clause import RiskSeverity


class DocumentComparisonRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    original_doc_id: str = Field(alias="originalDocId")
    revised_doc_id: str = Field(alias="revisedDocId")


class DocumentDiffSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    clause_title: str = Field(alias="clauseTitle")
    section: str
    change_type: str = Field(alias="changeType")  # 'modified' | 'added' | 'removed' | 'conflict'
    severity: RiskSeverity
    original_text: str = Field(alias="originalText")
    revised_text: str = Field(alias="revisedText")
    explanation: str
    legal_impact: str = Field(alias="legalImpact")
    author_original: Optional[str] = Field(default=None, alias="authorOriginal")
    author_revised: Optional[str] = Field(default=None, alias="authorRevised")


class DocumentComparisonResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    comparison_id: str = Field(alias="comparisonId")
    original_doc_id: str = Field(alias="originalDocId")
    revised_doc_id: str = Field(alias="revisedDocId")
    diffs: List[DocumentDiffSchema] = Field(default_factory=list)
