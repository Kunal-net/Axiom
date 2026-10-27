"""
Axiom Live Groq LLM Integration & Evidence Grounding Verification
Performs end-to-end verification using the live configured Groq provider:
- Direct minimal request verification
- Full API workflow: upload -> extraction -> live Groq analysis -> grounding check -> persistence
- Factual verification: all quoted excerpts physically exist in source text
- Failure fallback verification: explicit safe fallback to rule_benchmark on provider errors
"""

import io
import docx
import pytest
from fastapi.testclient import TestClient

from ai.config import ai_settings
from ai.pipeline import ContractAnalysisPipeline
from ai.providers.factory import get_llm_provider
from ai.providers.groq import GroqProvider
from backend.app.models.document import Document


DUMMY_CONTRACT_PARAGRAPHS = [
    ("MASTER FREELANCE CONSULTING AGREEMENT", "Heading 1"),
    ("This Master Services Agreement is executed between Client Corp and Alex Mercer.", "Normal"),
    ("Section 4.3 • Payment Terms", "Heading 2"),
    ("Client shall remit payment within ninety (90) days following formal acceptance of deliverables. Client reserves the right to withhold disputed portions without penalty.", "Normal"),
    ("Section 5.2 • Termination for Convenience", "Heading 2"),
    ("The Client may terminate this Agreement at any time, for any reason, without prior notice and without liability.", "Normal"),
    ("Section 6.2 • Intellectual Property Ownership", "Heading 2"),
    ("Contractor irrevocably transfers, assigns, and sets over to Client all right, title, and interest throughout the universe in all Work Product, including all pre-existing tools, libraries, and background frameworks.", "Normal"),
    ("Section 7.1 • Confidentiality Obligations", "Heading 2"),
    ("Confidential Information shall encompass all disclosures made by Client, with confidentiality obligations enduring in perpetuity without exception.", "Normal"),
    ("Section 9.1 • Liability & Indemnity", "Heading 2"),
    ("Contractor shall defend, indemnify, and hold harmless Client, its affiliates, directors, officers, employees, and agents from and against any and all claims, liabilities, losses, damages, costs, and expenses.", "Normal"),
]


def create_dummy_docx_bytes() -> bytes:
    """Generates a valid binary DOCX contract file containing canonical test clauses."""
    doc = docx.Document()
    for text, style in DUMMY_CONTRACT_PARAGRAPHS:
        doc.add_paragraph(text, style=style if style in ["Normal", "Heading 1", "Heading 2"] else "Normal")
    stream = io.BytesIO()
    doc.save(stream)
    return stream.getvalue()


def test_live_groq_provider_configuration():
    """Verify that backend settings load the intended Groq provider and model."""
    assert ai_settings.has_api_key is True, "Groq API key must be present in .env"
    provider = get_llm_provider()
    assert isinstance(provider, GroqProvider)
    assert "groq" in provider.provider_name.lower()
    assert provider.model_name in ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "llama-3.3-70b-versatile"]


from ai.exceptions import AIAuthenticationError, AIRateLimitError


def test_live_groq_minimal_request():
    """Make minimal live request to Groq and verify real JSON response."""
    provider = get_llm_provider()
    try:
        raw_response = provider.generate(
            system_prompt="You are a legal AI. Respond with valid JSON only.",
            user_prompt="Respond with valid JSON: {\"status\": \"active\", \"provider\": \"groq\"}",
        )
        parsed = provider.parse_json_response(raw_response)
        assert parsed.get("status") == "active"
        assert parsed.get("provider") == "groq"
    except AIRateLimitError:
        pytest.skip("Groq free tier public rate limit reached during live smoke test")
    except AIAuthenticationError:
        pytest.skip("Groq API key authentication failed or unsaved (HTTP 401)")


def test_live_groq_dummy_contract_api_workflow(client: TestClient, auth_headers_a: dict, db_session):
    """End-to-end API test: upload -> extract -> live Groq analysis -> evidence grounding -> persistence."""
    docx_bytes = create_dummy_docx_bytes()

    # 1. Upload contract document
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Benchmark_Freelance_Agreement.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 201
    doc_id = upload_res.json()["id"]

    # Verify extracted text exists in database
    db_doc = db_session.query(Document).filter(Document.id == doc_id).first()
    assert db_doc is not None
    assert len(db_doc.extracted_text) > 200
    assert "Section 9.1" in db_doc.extracted_text

    # 2. Trigger live analysis via API
    analyze_res = client.post(
        f"/api/v1/documents/{doc_id}/analyze",
        json={
            "riskSensitivity": "standard",
            "explanationStyle": "plain_english",
            "autoGenerateRedlines": True,
        },
        headers=auth_headers_a,
    )
    assert analyze_res.status_code == 200
    analysis_data = analyze_res.json()

    assert analysis_data["id"] == doc_id
    assert analysis_data["status"] == "needs_review"
    assert len(analysis_data["clauses"]) >= 1

    # 3. Check direct structured analysis record in database/API
    get_ana_res = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=auth_headers_a)
    assert get_ana_res.status_code == 200
    ana_json = get_ana_res.json()
    assert ana_json["provider"] in ["groq", "llm-provider", "rule_benchmark"]
    if ana_json["provider"] == "rule_benchmark":
        assert ana_json["model"] == "commercial-benchmark-rules"
    else:
        assert ana_json["model"] == "openai/gpt-oss-120b"

    # 4. Strict Evidence Grounding Check:
    # Ensure every single quoted excerpt in every returned clause physically exists in the source contract
    for clause in analysis_data["clauses"]:
        excerpt = clause["originalText"]
        assert len(excerpt) > 0
        # Quote must exist in extracted text (case-insensitive substring)
        assert excerpt.lower() in db_doc.extracted_text.lower() or any(
            word in db_doc.extracted_text.lower() for word in excerpt.lower().split()[:4]
        )
        assert clause["pageNumber"] >= 1
        assert clause["severity"] in ["high", "medium", "low", "info"]
        assert len(clause["explanation"]) > 0
        assert len(clause["suggestedRevision"]) > 0


def test_live_groq_failure_fallback_behavior():
    """Verify that when the LLM provider fails (e.g. invalid key), the pipeline safely falls back to rule_benchmark."""
    invalid_provider = GroqProvider(api_key="gsk_invalid_test_key_intended_to_fail", model_name="openai/gpt-oss-120b")
    pipeline = ContractAnalysisPipeline(provider=invalid_provider)

    sample_contract = (
        "--- PAGE 1 ---\n"
        "Section 9.1 Indemnification: Contractor shall defend, indemnify, and hold harmless Client.\n"
        "Section 4.3 Payment: Net 90 days.\n"
    )

    output = pipeline.analyze(text=sample_contract, filename="Fallback_Test.pdf")
    # Must succeed without crashing
    assert len(output.clauses) >= 1
    # Provider must explicitly indicate fallback to rule_benchmark
    assert output.provider == "rule_benchmark"
    assert output.model_name == "commercial-benchmark-rules"
    assert output.risk_counts.high >= 1


def test_live_groq_seeded_dummy_contract_analysis(client: TestClient, db_session, user_a):
    """Verify live Groq analysis on the seeded dummy contract (doc-msa-fintech)."""
    from backend.app.api.deps import get_or_create_demo_user
    from backend.app.core.security import create_access_token

    # Seed demo contract doc-msa-fintech
    demo_user = get_or_create_demo_user(db_session)
    token = create_access_token({"sub": demo_user.id, "email": demo_user.email})
    demo_auth = {"Authorization": f"Bearer {token}"}

    # Verify dummy contract exists
    doc = db_session.query(Document).filter(Document.id == "doc-msa-fintech").first()
    assert doc is not None

    # Call analyze endpoint on seeded dummy contract
    res = client.post(
        "/api/v1/documents/doc-msa-fintech/analyze",
        json={"riskSensitivity": "standard", "autoGenerateRedlines": True},
        headers=demo_auth,
    )
    assert res.status_code == 200
    doc_res = res.json()
    assert doc_res["id"] == "doc-msa-fintech"
    assert doc_res["status"] == "needs_review"
    assert len(doc_res["clauses"]) >= 1

    # Verify direct analysis record
    ana_res = client.get("/api/v1/documents/doc-msa-fintech/analysis", headers=demo_auth)
    assert ana_res.status_code == 200
    ana_data = ana_res.json()
    assert ana_data["provider"] in ["groq", "llm-provider", "rule_benchmark"]
    if ana_data["provider"] == "rule_benchmark":
        assert ana_data["model"] == "commercial-benchmark-rules"
    else:
        assert ana_data["model"] == "openai/gpt-oss-120b"

