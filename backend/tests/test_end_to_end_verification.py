"""
Axiom Comprehensive Post-Refactor End-to-End Verification Test Suite
Validates all high-priority audit concerns:
A. Profile identity persistence and updates
B. Document analysis telemetry and risk metrics
C. Document comparison with real diffs, identical diffs, failure propagation, and cross-user isolation
D. Document retrieval, listing, and metadata grounding
E. User authorization and cross-tenant deletion isolation
"""

import io
import docx
from fastapi.testclient import TestClient


def create_sample_docx(paragraphs) -> bytes:
    doc = docx.Document()
    for text in paragraphs:
        doc.add_paragraph(text)
    stream = io.BytesIO()
    doc.save(stream)
    return stream.getvalue()


def test_e2e_profile_retrieval_and_update_lifecycle(client: TestClient, auth_headers_a: dict):
    """Confirm user profile retrieval and persistence without hardcoded identities."""
    # 1. Fetch authenticated profile
    res = client.get("/api/v1/user/profile", headers=auth_headers_a)
    assert res.status_code == 200
    profile = res.json()
    assert profile["email"] == "user_a@example.com"
    assert profile["name"] == "Alice User"

    # 2. Update profile with custom preferences
    update_res = client.put(
        "/api/v1/user/profile",
        json={
            "name": "Jordan Rivera",
            "role": "Lead Systems Architect",
            "organization": "Rivera Autonomous Systems",
            "riskSensitivity": "aggressive",
            "documentRetentionDays": 90,
        },
        headers=auth_headers_a,
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["name"] == "Jordan Rivera"
    assert updated["role"] == "Lead Systems Architect"
    assert updated["organization"] == "Rivera Autonomous Systems"
    assert updated["riskSensitivity"] == "aggressive"
    assert updated["documentRetentionDays"] == 90

    # 3. Confirm persistence on subsequent query
    verify_res = client.get("/api/v1/user/profile", headers=auth_headers_a)
    assert verify_res.status_code == 200
    persisted = verify_res.json()
    assert persisted["name"] == "Jordan Rivera"
    assert persisted["organization"] == "Rivera Autonomous Systems"
    assert persisted["riskSensitivity"] == "aggressive"


def test_e2e_document_upload_analyze_and_grounding(client: TestClient, auth_headers_a: dict):
    """Upload commercial agreement, run analysis, and verify evidence grounding."""
    docx_bytes = create_sample_docx([
        "MASTER SERVICES AGREEMENT",
        "Section 4.1 Payment Terms: Invoices are payable within Net 90 days of receipt.",
        "Section 8.2 Indemnity: Contractor shall defend, indemnify, and hold harmless Client against any claims.",
        "Section 11.4 Governing Law: This Agreement shall be governed by the laws of Delaware.",
    ])

    # 1. Upload
    up_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Enterprise_Consulting_MSA.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    assert up_res.status_code == 201
    doc = up_res.json()
    doc_id = doc["id"]
    assert doc["name"] == "Enterprise_Consulting_MSA.docx"
    assert doc["fileType"] == "docx"

    # 2. Trigger analysis
    ana_res = client.post(
        f"/api/v1/documents/{doc_id}/analyze",
        json={"riskSensitivity": "strict", "autoGenerateRedlines": True},
        headers=auth_headers_a,
    )
    assert ana_res.status_code == 200
    analysis = ana_res.json()
    assert analysis["id"] == doc_id
    assert analysis["status"] in ["completed", "needs_review"]
    assert len(analysis["clauses"]) >= 1

    # 3. Grounding check
    for clause in analysis["clauses"]:
        assert len(clause["title"]) > 0
        assert len(clause["originalText"]) > 0
        assert clause["severity"] in ["high", "medium", "low", "info"]

    # 4. List documents includes new document
    list_res = client.get("/api/v1/documents", headers=auth_headers_a)
    assert list_res.status_code == 200
    docs = list_res.json()["documents"]
    assert any(d["id"] == doc_id for d in docs)


def test_e2e_comparison_behavior_and_isolation(client: TestClient, auth_headers_a: dict, auth_headers_b: dict):
    """Test comparison diffs, identical contract diffs, and cross-user isolation."""
    docx_1 = create_sample_docx([
        "CONSULTING AGREEMENT - ORIGINAL",
        "Section 3.1: Fees shall be paid within 60 days.",
        "Section 6.1: Client owns all pre-existing IP.",
    ])
    docx_2 = create_sample_docx([
        "CONSULTING AGREEMENT - REVISED",
        "Section 3.1: Fees shall be paid within 15 days.",
        "Section 6.1: Contractor retains all pre-existing IP.",
    ])

    res1 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Draft_1.docx", docx_1, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    doc1_id = res1.json()["id"]

    res2 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Draft_2.docx", docx_2, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    doc2_id = res2.json()["id"]

    # 1. Distinct documents: should return diffs
    cmp_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": doc2_id},
        headers=auth_headers_a,
    )
    assert cmp_res.status_code == 200
    diffs = cmp_res.json()["diffs"]
    assert len(diffs) > 0

    # 2. Identical document comparison: must return 0 diffs
    identical_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": doc1_id},
        headers=auth_headers_a,
    )
    assert identical_res.status_code == 200
    assert len(identical_res.json()["diffs"]) == 0

    # 3. Invalid / nonexistent document comparison: must return 404 (never empty diffs masked as success)
    not_found_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": "doc-nonexistent-12345"},
        headers=auth_headers_a,
    )
    assert not_found_res.status_code == 404

    # 4. Cross-user comparison isolation: User B cannot compare User A's documents
    unauth_cmp_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": doc2_id},
        headers=auth_headers_b,
    )
    assert unauth_cmp_res.status_code == 404


def test_e2e_document_deletion_and_cross_user_isolation(client: TestClient, auth_headers_a: dict, auth_headers_b: dict):
    """Verify document deletion is strictly scoped to owner and removes associated records."""
    docx_bytes = create_sample_docx(["Confidential NDA to be deleted."])
    up_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Temporary_NDA.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    doc_id = up_res.json()["id"]

    # User B attempting to delete User A's document must fail with 404
    unauth_del = client.delete(f"/api/v1/documents/{doc_id}", headers=auth_headers_b)
    assert unauth_del.status_code == 404

    # User A deleting their own document succeeds with 204
    auth_del = client.delete(f"/api/v1/documents/{doc_id}", headers=auth_headers_a)
    assert auth_del.status_code == 204

    # Subsequent fetch returns 404
    get_res = client.get(f"/api/v1/documents/{doc_id}", headers=auth_headers_a)
    assert get_res.status_code == 404


def test_e2e_health_check_telemetry(client: TestClient):
    """Verify health endpoint provides database and AI engine telemetry."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "ai" in data
    assert data["ai"]["status"] in ["active", "benchmark_rules"]
    assert "provider" in data["ai"]
