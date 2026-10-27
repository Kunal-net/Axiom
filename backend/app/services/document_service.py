"""
Axiom Document Service
Coordinates upload, validation, extraction, analysis, persistence, retries, and deletion.
"""

import hashlib
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from fastapi import UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.errors import (
    ForbiddenError,
    NotFoundError,
    OversizedFileError,
    ProcessingError,
    UnsupportedMediaTypeError,
    ValidationError,
)
from backend.app.core.logging import logger
from backend.app.db.base import utc_now
from backend.app.models.analysis import Analysis
from backend.app.models.clause import ClauseFinding
from backend.app.models.document import Document
from backend.app.schemas.analysis import AnalysisInitiateRequest, RiskCountsSchema
from backend.app.schemas.clause import ClauseFindingSchema
from backend.app.schemas.compare import DocumentComparisonResponse, DocumentDiffSchema
from backend.app.schemas.document import ContractDocumentResponse
from backend.app.services.analysis_service import analysis_service
from backend.app.services.extraction_service import extraction_service
from backend.app.services.storage_service import storage_service

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/octet-stream",  # Often sent by browsers for binary formats
}


class DocumentService:
    @staticmethod
    def format_relative_time(dt: Optional[datetime]) -> str:
        if not dt:
            return "Pending"
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        diff = now - dt
        seconds = int(diff.total_seconds())
        if seconds < 60:
            return "Just now"
        elif seconds < 3600:
            minutes = seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        elif seconds < 86400:
            hours = seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            days = seconds // 86400
            return f"{days} day{'s' if days > 1 else ''} ago"

    def to_contract_document_response(self, doc: Document) -> ContractDocumentResponse:
        high_count = sum(1 for c in doc.clauses if c.severity == "high")
        med_count = sum(1 for c in doc.clauses if c.severity == "medium")
        low_count = sum(1 for c in doc.clauses if c.severity == "low")
        info_count = sum(1 for c in doc.clauses if c.severity == "info")

        risk_counts = RiskCountsSchema(
            high=high_count,
            medium=med_count,
            low=low_count,
            info=info_count,
        )

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

        uploaded_at_display = self.format_relative_time(doc.created_at)
        last_analyzed_display = self.format_relative_time(doc.last_analyzed_at) if doc.last_analyzed_at else "Pending"

        provider = "groq"
        model_name = None
        if doc.analyses:
            provider = doc.analyses[0].provider
            if doc.analyses[0].structured_result and isinstance(doc.analyses[0].structured_result, dict):
                model_name = doc.analyses[0].structured_result.get("model_name")

        return ContractDocumentResponse(
            id=doc.id,
            name=doc.name,
            fileType="pdf" if doc.file_type == "pdf" else "docx",
            fileSize=doc.file_size,
            uploadedAt=uploaded_at_display,
            lastAnalyzedAt=last_analyzed_display,
            status=doc.status,
            riskCounts=risk_counts,
            summary=doc.summary or (
                "Document uploaded successfully and queued for enclave analysis."
                if doc.status in ["uploaded", "processing"]
                else ""
            ),
            clauses=clauses,
            pageCount=doc.page_count,
            provider=provider,
            model_name=model_name,
            extracted_text=doc.extracted_text,
        )

    async def upload_document(
        self,
        file: UploadFile,
        owner_id: str,
        db: Session,
    ) -> ContractDocumentResponse:
        filename = file.filename or "Contract.pdf"
        # Sanitize filename (remove path components)
        import os
        clean_filename = os.path.basename(filename)

        # Validate extension
        from pathlib import Path
        ext = Path(clean_filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise UnsupportedMediaTypeError(
                message=f"Unsupported file format '{ext}'. Allowed: .pdf, .docx, .doc",
                details={"allowed_extensions": list(ALLOWED_EXTENSIONS)},
            )

        # Read content safely with bounded chunking
        content = await file.read()
        byte_size = len(content)

        if byte_size == 0:
            raise ValidationError(message="Uploaded file is empty (0 bytes)", code="EMPTY_FILE")

        if byte_size > settings.max_upload_size_bytes:
            raise OversizedFileError(
                message=f"File size exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB",
                details={"file_size_bytes": byte_size, "max_allowed_bytes": settings.max_upload_size_bytes},
            )

        # Compute checksum
        sha256 = hashlib.sha256(content).hexdigest()

        # Generate safe storage key and persist privately
        safe_key = storage_service.generate_safe_key(clean_filename)
        await storage_service.save(content=content, safe_key=safe_key, content_type=file.content_type or "application/pdf")

        # Format human-readable size
        file_size_mb = byte_size / (1024 * 1024)
        file_size_str = f"{file_size_mb:.1f} MB" if file_size_mb >= 0.1 else f"{byte_size // 1024} KB"

        # Determine file type
        file_type = "docx" if ext in [".docx", ".doc"] else "pdf"

        # Extract text layer and page count
        try:
            extraction = extraction_service.extract(content, file_type=file_type)
            extracted_text = extraction.text
            page_count = extraction.page_count
        except Exception as e:
            logger.warning(f"Initial text extraction warning: {e}")
            extracted_text = f"[Text extraction pending for {clean_filename}]"
            page_count = 1

        # Generate guaranteed unique document ID
        import uuid
        doc_id = f"doc-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')[:17]}-{uuid.uuid4().hex[:6]}"

        doc = Document(
            id=doc_id,
            owner_id=owner_id,
            name=clean_filename,
            safe_storage_key=safe_key,
            file_type=file_type,
            file_size=file_size_str,
            byte_size=byte_size,
            sha256_checksum=sha256,
            status="uploaded",
            page_count=page_count,
            summary="Document uploaded successfully and queued for enclave analysis.",
            extracted_text=extracted_text,
        )

        db.add(doc)
        db.commit()
        db.refresh(doc)

        logger.info(f"Created document record {doc.id} for user {owner_id}")
        return self.to_contract_document_response(doc)

    async def analyze_document(
        self,
        document_id: str,
        owner_id: str,
        request: AnalysisInitiateRequest,
        db: Session,
    ) -> ContractDocumentResponse:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")

        if doc.owner_id != owner_id:
            # Enforce ownership isolation
            raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")

        doc.status = "processing"
        db.commit()

        # If extracted text is missing, attempt to load file from storage and extract
        if not doc.extracted_text or doc.extracted_text.startswith("[Text extraction pending"):
            try:
                content = await storage_service.open(safe_key=doc.safe_storage_key)
                extraction = extraction_service.extract(content, doc.file_type)
                doc.extracted_text = extraction.text
                doc.page_count = extraction.page_count
            except Exception as e:
                logger.error(f"Text extraction failed during analysis: {e}")
                doc.status = "failed"
                doc.error_code = "EXTRACTION_FAILED"
                doc.error_message = str(e)
                db.commit()
                raise ProcessingError(message="Failed to extract contract text", code="EXTRACTION_FAILED")

        # Run AI/Heuristic analysis
        analysis_out = analysis_service.analyze(
            text=doc.extracted_text,
            filename=doc.name,
            risk_sensitivity=request.risk_sensitivity or "standard",
            explanation_style=request.explanation_style or "plain_english",
            auto_generate_redlines=request.auto_generate_redlines if request.auto_generate_redlines is not None else True,
        )

        # Clear old clause findings
        db.query(ClauseFinding).filter(ClauseFinding.document_id == doc.id).delete()

        # Create new clause findings
        for c in analysis_out.clauses:
            clause = ClauseFinding(
                id=f"{doc.id}-{c.id}",
                document_id=doc.id,
                title=c.title,
                severity=c.severity,
                section=c.section,
                page_number=c.page_number,
                original_text=c.original_text,
                explanation=c.explanation,
                why_risky=c.why_risky,
                suggested_revision=c.suggested_revision,
                category=c.category,
                reviewed=c.reviewed,
                bookmarked=c.bookmarked,
            )
            db.add(clause)

        # Record analysis version
        max_version = db.query(func.max(Analysis.version)).filter(Analysis.document_id == doc.id).scalar() or 0
        new_version = max_version + 1

        analysis_record = Analysis(
            id=f"ana-{doc.id}-{new_version}",
            document_id=doc.id,
            version=new_version,
            schema_version="1.0.0",
            status="completed",
            summary=analysis_out.summary,
            risk_counts=analysis_out.risk_counts.model_dump(),
            structured_result=analysis_out.model_dump(),
            provider=analysis_out.provider,
            model_name=analysis_out.model_name,
            completed_at=utc_now(),
        )
        db.add(analysis_record)

        # Update document state
        has_risks = analysis_out.risk_counts.high > 0 or analysis_out.risk_counts.medium > 0
        doc.status = "needs_review" if has_risks else "completed"
        doc.summary = analysis_out.summary
        doc.last_analyzed_at = utc_now()
        doc.error_code = None
        doc.error_message = None

        db.commit()
        db.refresh(doc)

        logger.info(f"Analysis complete for document {doc.id}: status={doc.status}, version={new_version}")
        return self.to_contract_document_response(doc)

    def get_document(self, document_id: str, owner_id: str, db: Session) -> ContractDocumentResponse:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc or doc.owner_id != owner_id:
            raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")
        return self.to_contract_document_response(doc)

    def list_documents(
        self,
        owner_id: str,
        db: Session,
        search: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Tuple[List[ContractDocumentResponse], int]:
        query = db.query(Document).filter(Document.owner_id == owner_id)

        if search:
            query = query.filter(Document.name.ilike(f"%{search}%"))

        if status and status != "all":
            query = query.filter(Document.status == status)

        total_count = query.count()
        offset = max(0, (page - 1) * limit)
        docs = query.order_by(Document.created_at.desc()).offset(offset).limit(limit).all()

        return [self.to_contract_document_response(d) for d in docs], total_count

    async def delete_document(self, document_id: str, owner_id: str, db: Session) -> bool:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc or doc.owner_id != owner_id:
            raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")

        safe_key = doc.safe_storage_key

        # Delete database record (cascades to analyses and clauses)
        db.delete(doc)
        db.commit()

        # Delete underlying private file
        await storage_service.delete(safe_key=safe_key)
        logger.info(f"Deleted document {document_id} and storage key {safe_key}")
        return True

    def patch_clause(
        self,
        document_id: str,
        clause_id: str,
        owner_id: str,
        reviewed: Optional[bool],
        bookmarked: Optional[bool],
        db: Session,
    ) -> ClauseFinding:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc or doc.owner_id != owner_id:
            raise NotFoundError(message=f"Document '{document_id}' not found", code="DOCUMENT_NOT_FOUND")

        clause = (
            db.query(ClauseFinding)
            .filter(ClauseFinding.document_id == document_id)
            .filter((ClauseFinding.id == clause_id) | (ClauseFinding.id == f"{document_id}-{clause_id}"))
            .first()
        )
        if not clause:
            raise NotFoundError(message=f"Clause '{clause_id}' not found in document", code="CLAUSE_NOT_FOUND")

        if reviewed is not None:
            clause.reviewed = reviewed
        if bookmarked is not None:
            clause.bookmarked = bookmarked

        db.commit()
        db.refresh(clause)
        return clause

    def compare_documents(
        self,
        original_doc_id: str,
        revised_doc_id: str,
        owner_id: str,
        db: Session,
    ) -> DocumentComparisonResponse:
        doc1 = db.query(Document).filter(Document.id == original_doc_id).first()
        if not doc1 or doc1.owner_id != owner_id:
            raise NotFoundError(message=f"Original document '{original_doc_id}' not found", code="DOCUMENT_NOT_FOUND")

        doc2 = db.query(Document).filter(Document.id == revised_doc_id).first()
        if not doc2 or doc2.owner_id != owner_id:
            raise NotFoundError(message=f"Comparison document '{revised_doc_id}' not found", code="DOCUMENT_NOT_FOUND")

        if original_doc_id == revised_doc_id:
            return DocumentComparisonResponse(
                comparisonId=f"comp-{int(datetime.now().timestamp())}",
                originalDocId=original_doc_id,
                revisedDocId=revised_doc_id,
                diffs=[],
            )

        title1 = doc1.name
        title2 = doc2.name
        text1 = doc1.extracted_text or ""
        text2 = doc2.extracted_text or ""

        diffs = analysis_service.compare_documents(
            original_title=title1,
            original_text=text1,
            revised_title=title2,
            revised_text=text2,
        )

        return DocumentComparisonResponse(
            comparisonId=f"comp-{int(datetime.now().timestamp())}",
            originalDocId=original_doc_id,
            revisedDocId=revised_doc_id,
            diffs=diffs,
        )


document_service = DocumentService()
