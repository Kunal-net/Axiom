"""
Axiom API Dependencies
Authentication, authorization, and database session injection.
"""

from typing import Optional
from fastapi import Cookie, Depends, Header
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.errors import ForbiddenError, UnauthorizedError
from backend.app.core.security import decode_access_token, hash_password
from backend.app.db.session import get_db
from backend.app.models.user import User

DEMO_USER_ID = "usr-demo-alex-mercer"
DEMO_EMAIL = "alex.mercer@studiomercer.design"


def get_or_create_demo_user(db: Session) -> User:
    """Ensures the canonical demo workspace user and initial benchmark contract exist for local development zero-friction access."""
    user = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if not user:
        user = User(
            id=DEMO_USER_ID,
            email=DEMO_EMAIL,
            password_hash=hash_password("DevPassword123!"),
            name="Alex Mercer",
            role="Principal Design Engineer",
            organization="Mercer Creative Labs LLC",
            risk_sensitivity="strict",
            explanation_style="plain_english",
            auto_generate_redlines=True,
            document_retention_days=30,
            email_notifications=True,
            high_risk_alerts=True,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Seed demo contract if not already present
    from backend.app.models.document import Document
    from backend.app.models.analysis import Analysis
    from backend.app.models.clause import ClauseFinding
    from backend.app.db.base import utc_now
    from pathlib import Path

    doc = db.query(Document).filter(Document.id == "doc-msa-fintech").first()
    if not doc:
        # Create dummy physical file in upload dir
        upload_path = Path(settings.UPLOAD_DIR)
        upload_path.mkdir(parents=True, exist_ok=True)
        sample_file = upload_path / "demo_freelance_agreement.pdf"
        if not sample_file.exists():
            sample_file.write_bytes(b"%PDF-1.4 Mock Demo Freelance Agreement PDF content for Axiom")

        doc = Document(
            id="doc-msa-fintech",
            owner_id=user.id,
            name="Freelance Agreement.pdf",
            safe_storage_key="demo_freelance_agreement.pdf",
            file_type="pdf",
            file_size="2.4 MB",
            byte_size=2516582,
            sha256_checksum="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            status="needs_review",
            page_count=8,
            extracted_text=(
                "--- PAGE 1 ---\n"
                "MASTER SERVICES AGREEMENT & FREELANCE CONSULTING CONTRACT\n\n"
                "Section 4.3 • Fees and Payment\n"
                "Client shall remit payment within ninety (90) days following formal acceptance of deliverables. "
                "Client reserves the right to withhold any disputed portion without interest or penalty pending internal audit.\n\n"
                "--- PAGE 2 ---\n"
                "Section 5.2 • Termination\n"
                "The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.\n\n"
                "--- PAGE 3 ---\n"
                "Section 6.2 • Intellectual Property\n"
                "Contractor irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe "
                "in all Work Product, including all pre-existing tools, libraries, and background frameworks incorporated therein, without reservation.\n\n"
                "--- PAGE 4 ---\n"
                "Section 7.1 • Confidentiality\n"
                "Confidential Information shall encompass all disclosures made by Client, whether marked confidential or not, "
                "including ideas discussed informally, with confidentiality obligations enduring in perpetuity.\n\n"
                "--- PAGE 5 ---\n"
                "Section 9.1 • Liability & Indemnity\n"
                "Contractor shall defend, indemnify, and hold harmless Client, its affiliates, directors, officers, employees, and agents "
                "from and against any and all claims, liabilities, losses, damages, costs, and expenses (including attorney's fees and consequential "
                "or punitive damages) arising out of or related to Contractor's performance.\n"
            ),
            last_analyzed_at=utc_now(),
        )

        db.add(doc)
        db.commit()

        # Add Analysis record
        analysis = Analysis(
            id="ana-doc-msa-fintech-1",
            document_id=doc.id,
            version=1,
            schema_version="1.0.0",
            status="completed",
            summary=doc.summary,
            risk_counts={"high": 3, "medium": 5, "low": 2, "info": 1},
            structured_result={},
            provider="benchmark_engine",
            model_name="axiom-heuristic-v1",
            completed_at=utc_now(),
        )
        db.add(analysis)

        # Add benchmark clauses
        sample_clauses = [
            (
                "clause-1",
                "Unilateral termination without notice",
                "high",
                "Section 5.2",
                4,
                "termination",
                "The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.",
                "This clause allows the client to end the contract at any time without notice or compensation, which may be unfair and leaves you financially vulnerable after investing time.",
                "No prior notice period (industry norm: 14–30 days). Eliminates compensation rights for work completed or in-progress.",
                "Either party may terminate this Agreement with 30 days’ written notice. The Client shall compensate the Freelancer for all work completed up to the termination date.",
            ),
            (
                "clause-2",
                "Broad Work for Hire & IP Ownership",
                "high",
                "Section 6.2",
                4,
                "ip",
                "Contractor irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe in all Work Product, including all pre-existing tools, libraries, and background frameworks incorporated therein, without reservation.",
                "The client is attempting to seize ownership of your pre-existing code libraries, UI kits, design templates, and workflow scripts that you created before ever meeting them.",
                "You legally forfeit the right to use your own reusable toolchain or starter kits with any other future clients.",
                "Client receives an exclusive, perpetual license to custom deliverables upon full payment. Contractor explicitly retains full ownership of all pre-existing tools, code libraries, templates, and generic background know-how.",
            ),
            (
                "clause-3",
                "Uncapped One-Way Indemnification",
                "high",
                "Section 9.1",
                3,
                "liability",
                "Contractor shall defend, indemnify, and hold harmless Client, its affiliates, directors, officers, employees, and agents from and against any and all claims, liabilities, losses, damages, costs, and expenses (including attorney's fees and consequential or punitive damages) arising out of or related to Contractor's performance.",
                "This exposes your personal freelance business to unlimited financial liability, including client's lost profits, third-party lawsuits, and punitive damages.",
                "A single disputed bug could result in a claim bankrupting you, far exceeding the total compensation paid under the contract.",
                "Each party agrees to indemnify the other against direct third-party claims arising from gross negligence or willful misconduct, provided that Contractor's aggregate liability shall be capped at the total amount actually paid under this Agreement.",
            ),
            (
                "clause-4",
                "Confidentiality & Non-Disclosure Scope",
                "medium",
                "Section 7.1",
                3,
                "confidentiality",
                "Confidential Information shall encompass all disclosures made by Client, whether marked confidential or not, including ideas discussed informally, with confidentiality obligations enduring in perpetuity.",
                "A perpetual confidentiality term without a residual knowledge clause or written markings requirement can expose you to accidental breach claims years later.",
                "Prevents you from discussing generic industry insights or listing the engagement in your portfolio without formal written clearance.",
                "Confidentiality obligations shall endure for a period of three (3) years post-termination and shall exclude information generally known to the industry or retained in unaided memory.",
            ),
            (
                "clause-5",
                "Net 90 Day Payment Schedule",
                "medium",
                "Section 4.3",
                2,
                "payment",
                "Client shall remit payment within ninety (90) days following formal acceptance of deliverables. Client reserves the right to withhold any disputed portion without interest or penalty pending internal audit.",
                "Payment is delayed for three full months, and any payment dispute allows the client to freeze your invoice without late penalty.",
                "You are forced to act as an interest-free bank for 3 months, creating severe cashflow vulnerability.",
                "Client shall pay all undisputed invoices within thirty (30) days of invoice date. Overdue amounts shall accrue interest at 1.5% per month. Disputed portions must be formally documented within 10 business days.",
            ),
        ]

        for cid, title, sev, sec, pg, cat, orig, exp, why, rev in sample_clauses:
            clause = ClauseFinding(
                id=cid,
                document_id=doc.id,
                title=title,
                severity=sev,
                section=sec,
                page_number=pg,
                category=cat,
                original_text=orig,
                explanation=exp,
                why_risky=why,
                suggested_revision=rev,
                reviewed=False,
                bookmarked=False,
            )
            db.add(clause)
        db.commit()

    return user


async def get_current_user(
    authorization: Optional[str] = Header(default=None),
    access_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    """
    Extracts and authenticates user from Bearer JWT token or HttpOnly access_token cookie.
    Enforces valid server-side authentication with zero anonymous bypass.
    """
    token: Optional[str] = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1].strip()
    elif access_token:
        token = access_token.strip()

    if not token:
        raise UnauthorizedError(
            message="Authentication credentials were not provided. Please sign in.",
            code="UNAUTHORIZED",
        )

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError(message="Invalid token payload", code="INVALID_TOKEN")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise UnauthorizedError(message="User account not found or deactivated", code="USER_NOT_FOUND")

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise ForbiddenError(message="User account is deactivated", code="USER_INACTIVE")
    return current_user
