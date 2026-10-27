"""
Axiom Document Schemas
Matches frontend ContractDocument and DocumentListResponse in src/types/contract.ts
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from backend.app.schemas.analysis import RiskCountsSchema
from backend.app.schemas.clause import ClauseFindingSchema


class ContractDocumentResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    file_type: str = Field(alias="fileType")
    file_size: str = Field(alias="fileSize")
    uploaded_at: str = Field(alias="uploadedAt")
    last_analyzed_at: str = Field(default="Pending", alias="lastAnalyzedAt")
    status: str  # 'completed' | 'processing' | 'needs_review' | 'failed'
    risk_counts: RiskCountsSchema = Field(default_factory=RiskCountsSchema, alias="riskCounts")
    summary: str = ""
    clauses: List[ClauseFindingSchema] = Field(default_factory=list)
    page_count: int = Field(default=1, alias="pageCount")
    provider: Optional[str] = "groq"
    model_name: Optional[str] = Field(default=None, alias="modelName")
    extracted_text: Optional[str] = Field(default=None, alias="extractedText")


class DocumentListResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    documents: List[ContractDocumentResponse]
    total_count: int = Field(alias="totalCount")
    page: int
    limit: int
