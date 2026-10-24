"""
Axiom Document Routes
Upload, analysis, retrieval, legal comparison, clause tagging, and deletion.
"""

from typing import Optional
from fastapi import APIRouter, Depends, File, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from backend.app.api.deps import get_current_active_user
from backend.app.core.errors import NotFoundError
from backend.app.db.session import get_db
from backend.app.models.analysis import Analysis
from backend.app.models.document import Document
from backend.app.models.user import User
from backend.app.schemas.analysis import AnalysisInitiateRequest, AnalysisResponse, RiskCountsSchema
from backend.app.schemas.clause import ClauseFindingSchema, ClausePatchRequest, ClausePatchResponse
from backend.app.schemas.compare import DocumentComparisonRequest, DocumentComparisonResponse
from backend.app.schemas.document import ContractDocumentResponse, DocumentListResponse
from backend.app.services.document_service import document_service

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=ContractDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Uploads a contract file for parsing and staging in private storage."""
    return await document_service.upload_document(file=file, owner_id=current_user.id, db=db)


@router.post("", response_model=ContractDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document_alias(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """REST alias for document upload."""
    return await document_service.upload_document(file=file, owner_id=current_user.id, db=db)


@router.post("/{document_id}/analyze", response_model=ContractDocumentResponse)
async def analyze_document(
    document_id: str,
    request: AnalysisInitiateRequest = AnalysisInitiateRequest(),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Initiates clause extraction, risk scoring, and redline counter-proposal synthesis."""
    return await document_service.analyze_document(
        document_id=document_id,
        owner_id=current_user.id,
        request=request,
        db=db,
    )


@router.post("/{document_id}/reanalyze", response_model=ContractDocumentResponse)
async def reanalyze_document(
    document_id: str,
    request: AnalysisInitiateRequest = AnalysisInitiateRequest(),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Controlled retry / re-analysis endpoint."""
    return await document_service.analyze_document(
        document_id=document_id,
        owner_id=current_user.id,
        request=request,
        db=db,
    )


@router.get("", response_model=DocumentListResponse)
def list_documents(
    search: Optional[str] = Query(default=None, description="Search by document title"),
    status: Optional[str] = Query(default=None, description="Filter by status: all | needs_review | completed | processing"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Lists only the current authenticated user's documents."""
    docs, total_count = document_service.list_documents(
        owner_id=current_user.id,
        db=db,
        search=search,
        status=status,
        page=page,
        limit=limit,
    )
    return DocumentListResponse(
        documents=docs,
        total_count=total_count,
        page=page,
        limit=limit,
    )


@router.get("/{document_id}", response_model=ContractDocumentResponse)
def get_document_by_id(
    document_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Fetches full document record, parsed clauses, and severity breakdown."""
    return document_service.get_document(document_id=document_id, owner_id=current_user.id, db=db)


@router.get("/{document_id}/analysis", response_model=AnalysisResponse)
def get_document_analysis(
    document_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Fetches only the structured analysis JSON for an owned document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc or doc.owner_id != current_user.id:
        raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")

    latest_analysis = (
        db.query(Analysis)
        .filter(Analysis.document_id == document_id)
        .order_by(Analysis.version.desc())
        .first()
    )
    if not latest_analysis:
        raise NotFoundError(message="Analysis not yet completed for this document", code="ANALYSIS_NOT_READY")

    # Map clauses
    clauses = [
        ClauseFindingSchema(
            id=c.id,
            title=c.title,
            severity=c.severity,  # type: ignore
            section=c.section,
            pageNumber=c.page_number,
            originalText=c.original_text,
            explanation=c.explanation,
            whyRisky=c.why_risky,
            suggestedRevision=c.suggested_revision,
            category=c.category,
            reviewed=c.reviewed,
            bookmarked=c.bookmarked,
        )
        for c in doc.clauses
    ]

    return AnalysisResponse(
        id=latest_analysis.id,
        documentId=latest_analysis.document_id,
        version=latest_analysis.version,
        schemaVersion=latest_analysis.schema_version,
        status=latest_analysis.status,
        summary=latest_analysis.summary,
        riskCounts=RiskCountsSchema(**latest_analysis.risk_counts),
        clauses=clauses,
        provider=latest_analysis.provider,
        model=latest_analysis.model_name,
        completedAt=latest_analysis.completed_at.isoformat() if latest_analysis.completed_at else None,
    )


@router.patch("/{document_id}/clauses/{clause_id}", response_model=ClausePatchResponse)
def patch_clause_state(
    document_id: str,
    clause_id: str,
    patch: ClausePatchRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Updates the review or bookmark status of a specific clause in an owned document."""
    updated_clause = document_service.patch_clause(
        document_id=document_id,
        clause_id=clause_id,
        owner_id=current_user.id,
        reviewed=patch.reviewed,
        bookmarked=patch.bookmarked,
        db=db,
    )
    return ClausePatchResponse(
        id=clause_id,
        reviewed=updated_clause.reviewed,
        bookmarked=updated_clause.bookmarked,
    )


@router.post("/compare", response_model=DocumentComparisonResponse)
def compare_contracts(
    req: DocumentComparisonRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Performs side-by-side legal diffing between original contract and revised draft."""
    return document_service.compare_documents(
        original_doc_id=req.original_doc_id,
        revised_doc_id=req.revised_doc_id,
        owner_id=current_user.id,
        db=db,
    )


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Permanently deletes document record, extracted text, analyses, and private filesystem file."""
    await document_service.delete_document(document_id=document_id, owner_id=current_user.id, db=db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
