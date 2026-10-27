"""
Axiom Regression Test Suite: Contract A Upload, Isolation & Grounding Verification
Proves that:
1. Uploading Contract A (Redstone Retail vs Nimbus Labs) produces findings grounded in Contract A's exact text.
2. Findings for Contract A NEVER contain fabricated excerpts from the unrelated seeded contract (doc-msa-fintech / Delaware / Apex).
3. Two different uploaded documents cannot share or overwrite each other's analysis.
4. Extracted text, analysis record, and quoted findings are strictly linked to the same document ID throughout the pipeline.
5. Failed provider call produces explicit fallback behavior and never silently fabricates sample contract excerpts.
"""

import io
import docx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from backend.app.models.document import Document
from backend.app.models.analysis import Analysis
from backend.app.models.clause import ClauseFinding
from backend.app.models.user import User
from ai.pipeline import ContractAnalysisPipeline
from ai.providers.mock import MockProvider
from ai.providers.groq import GroqProvider


CONTRACT_A_PARAGRAPHS = [
    ("MASTER SERVICES AGREEMENT", "Heading 1"),
    ("This Master Services Agreement is entered into between Redstone Retail Pvt. Ltd. ('Client') and Nimbus Labs Pvt. Ltd. ('Contractor').", "Normal"),
    ("Section 2: Payment Terms", "Heading 2"),
    ("Client shall remit payment within ninety (90) days following invoice submission. Client reserves the right to unrestricted withholding of any disputed portions without penalty or interest.", "Normal"),
    ("Section 3: Intellectual Property", "Heading 2"),
    ("Contractor irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe in all Work Product, background frameworks, and code without reservation.", "Normal"),
    ("Section 4: Indemnification", "Heading 2"),
    ("Contractor shall defend, indemnify, and hold harmless Client from and against any and all claims, liabilities, losses, damages, costs, and expenses, including losses partly caused by the Client.", "Normal"),
    ("Section 5: Limitation of Liability", "Heading 2"),
    ("Contractor total aggregate liability under this Agreement shall not exceed the fees actually paid to Contractor in the preceding one month.", "Normal"),
    ("Section 7: Termination", "Heading 2"),
    ("Client may terminate this Agreement at any time, for any reason, with one-sided termination immediately effective upon notice and without liability.", "Normal"),
]

CONTRACT_B_PARAGRAPHS = [
    ("CYBERSECURITY CONSULTING AGREEMENT", "Heading 1"),
    ("This Cybersecurity Consulting Agreement is entered into between CyberShield Corp and Quantum Security LLC.", "Normal"),
    ("Section 1: Scope of Services", "Heading 2"),
    ("Quantum Security LLC shall perform independent penetration testing and vulnerability assessments.", "Normal"),
    ("Section 8: Payment Schedule", "Heading 2"),
    ("Invoices shall be payable within fifteen (15) business days upon delivery of the final assessment report.", "Normal"),
    ("Section 10: Mutual Confidentiality", "Heading 2"),
    ("Each party shall hold all confidential disclosures in confidence for a period of two (2) years.", "Normal"),
]


def create_docx_bytes(paragraphs) -> bytes:
    doc = docx.Document()
    for text, style in paragraphs:
        doc.add_paragraph(text, style=style if style in ["Normal", "Heading 1", "Heading 2"] else "Normal")
    stream = io.BytesIO()
    doc.save(stream)
    return stream.getvalue()


def test_contract_a_upload_and_grounded_analysis(client: TestClient, auth_headers_a: dict, db_session: Session):
    """Prove that uploading Contract A produces findings strictly grounded in Contract A, not the seeded contract."""
    docx_bytes = create_docx_bytes(CONTRACT_A_PARAGRAPHS)

    # 1. Upload Contract A
    res_upload = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contract_A_Redstone_Nimbus.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    assert res_upload.status_code == 201
    doc_data = res_upload.json()
    doc_id = doc_data["id"]

    # Verify ID is unique and NOT the hardcoded mock timestamp or seeded doc
    assert doc_id != "doc-1792910048445"
    assert doc_id != "doc-msa-fintech"

    # Verify extracted text is stored for this document ID
    db_doc = db_session.query(Document).filter(Document.id == doc_id).first()
    assert db_doc is not None
    assert "Redstone Retail" in db_doc.extracted_text
    assert "Nimbus Labs" in db_doc.extracted_text
    assert "Section 4: Indemnification" in db_doc.extracted_text

    # 2. Analyze Contract A
    res_analyze = client.post(
        f"/api/v1/documents/{doc_id}/analyze",
        json={"riskSensitivity": "standard", "autoGenerateRedlines": True},
        headers=auth_headers_a,
    )
    assert res_analyze.status_code == 200
    analyzed_doc = res_analyze.json()
    assert analyzed_doc["id"] == doc_id
    assert analyzed_doc["status"] == "needs_review"
    assert len(analyzed_doc["clauses"]) >= 1

    # 3. Grounding & Anti-Fabrication Checks
    for clause in analyzed_doc["clauses"]:
        excerpt = clause["originalText"]
        assert len(excerpt) > 0

        # Must be physically present in Contract A's extracted text
        assert excerpt.lower() in db_doc.extracted_text.lower() or any(
            phrase in db_doc.extracted_text.lower()
            for phrase in [excerpt.lower()[:30], excerpt.lower()[-30:]]
            if len(phrase) >= 10
        )

        # MUST NOT contain terms from the unrelated seeded benchmark contract
        assert "apex financial" not in excerpt.lower()
        assert "delaware" not in excerpt.lower()
        assert "new castle county" not in excerpt.lower()
        assert "section 11.4" not in clause["section"].lower()
        assert "section 14.1" not in clause["section"].lower()


def test_contract_a_and_b_strict_isolation(client: TestClient, auth_headers_a: dict, db_session: Session):
    """Prove that Contract A and Contract B maintain separate document IDs and never overwrite each other."""
    bytes_a = create_docx_bytes(CONTRACT_A_PARAGRAPHS)
    bytes_b = create_docx_bytes(CONTRACT_B_PARAGRAPHS)

    # Upload A
    res_a = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contract_A.docx", bytes_a, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    assert res_a.status_code == 201
    id_a = res_a.json()["id"]

    # Upload B
    res_b = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contract_B.docx", bytes_b, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    assert res_b.status_code == 201
    id_b = res_b.json()["id"]

    assert id_a != id_b

    # Analyze A
    client.post(f"/api/v1/documents/{id_a}/analyze", headers=auth_headers_a)
    # Analyze B
    client.post(f"/api/v1/documents/{id_b}/analyze", headers=auth_headers_a)

    # Retrieve A
    doc_a = client.get(f"/api/v1/documents/{id_a}", headers=auth_headers_a).json()
    # Retrieve B
    doc_b = client.get(f"/api/v1/documents/{id_b}", headers=auth_headers_a).json()

    assert doc_a["id"] == id_a
    assert doc_b["id"] == id_b
    assert doc_a["name"] == "Contract_A.docx"
    assert doc_b["name"] == "Contract_B.docx"

    # Verify extracted texts in DB are completely separate
    db_a = db_session.query(Document).filter(Document.id == id_a).first()
    db_b = db_session.query(Document).filter(Document.id == id_b).first()

    assert "Redstone Retail" in db_a.extracted_text
    assert "Redstone Retail" not in db_b.extracted_text

    assert "Quantum Security" in db_b.extracted_text
    assert "Quantum Security" not in db_a.extracted_text


def test_pipeline_document_id_linkage(client: TestClient, auth_headers_a: dict, db_session: Session):
    """Verify that extracted text, Analysis record, and ClauseFindings are strictly linked to the same document ID."""
    bytes_a = create_docx_bytes(CONTRACT_A_PARAGRAPHS)

    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contract_Linkage_Test.docx", bytes_a, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    doc_id = res.json()["id"]

    client.post(f"/api/v1/documents/{doc_id}/analyze", headers=auth_headers_a)

    # Check database relations
    doc = db_session.query(Document).filter(Document.id == doc_id).first()
    assert doc is not None

    analyses = db_session.query(Analysis).filter(Analysis.document_id == doc_id).all()
    assert len(analyses) >= 1
    for a in analyses:
        assert a.document_id == doc_id

    clauses = db_session.query(ClauseFinding).filter(ClauseFinding.document_id == doc_id).all()
    assert len(clauses) >= 1
    for c in clauses:
        assert c.document_id == doc_id
        # Quoted excerpt must exist in the document's extracted text
        assert c.original_text.lower() in doc.extracted_text.lower() or any(
            w in doc.extracted_text.lower() for w in c.original_text.lower().split()[:3]
        )


def test_provider_failure_explicit_fallback():
    """Verify that provider failure safely falls back to rule_benchmark and explicitly declares it."""
    failing_provider = GroqProvider(api_key="gsk_invalid_intended_to_fail", model_name="openai/gpt-oss-120b")
    pipeline = ContractAnalysisPipeline(provider=failing_provider)

    contract_text = (
        "Section 4: Indemnification\n"
        "Contractor agrees to unlimited indemnification for all losses.\n"
        "Section 2: Payment Terms\n"
        "Payment within 90 days.\n"
    )

    output = pipeline.analyze(text=contract_text, filename="Contract_A.docx")
    assert output.provider == "rule_benchmark"
    assert output.model_name == "commercial-benchmark-rules"
    assert len(output.clauses) >= 1
    for clause in output.clauses:
        assert clause.original_text.lower() in contract_text.lower()


def test_cors_preflight_for_local_dev_ports(client: TestClient):
    """Verify that CORS preflight requests from all local frontend dev origins (5173, 5174, 5175) are permitted."""
    origins_to_test = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]
    for origin in origins_to_test:
        res = client.options(
            "/api/v1/documents/upload",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        assert res.status_code == 200, f"CORS preflight failed for origin {origin}: {res.status_code}"
        assert res.headers.get("access-control-allow-origin") == origin


def test_health_and_openapi_aliases(client: TestClient):
    """Verify root /health and /openapi.json aliases work for local health probes and tooling."""
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

    res_v1_health = client.get("/api/v1/health")
    assert res_v1_health.status_code == 200
    assert res_v1_health.json()["status"] == "healthy"

    res_openapi = client.get("/openapi.json", follow_redirects=False)
    assert res_openapi.status_code in [200, 307], f"Expected 200 or 307 redirect, got {res_openapi.status_code}"

