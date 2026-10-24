"""
Axiom Contract Analysis and Structured Output Persistence Tests
"""

from fastapi.testclient import TestClient


def test_analyze_contract_workflow(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    # 1. Upload
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Consulting_Agreement_2026.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 201
    doc_id = upload_res.json()["id"]

    # 2. Trigger Analysis
    analyze_payload = {
        "riskSensitivity": "strict",
        "explanationStyle": "plain_english",
        "autoGenerateRedlines": True,
    }
    analyze_res = client.post(
        f"/api/v1/documents/{doc_id}/analyze",
        json=analyze_payload,
        headers=auth_headers_a,
    )
    assert analyze_res.status_code == 200
    doc = analyze_res.json()
    assert doc["status"] in ["needs_review", "completed"]
    assert len(doc["clauses"]) > 0
    assert "summary" in doc
    assert doc["riskCounts"]["high"] >= 0

    first_clause = doc["clauses"][0]
    clause_id = first_clause["id"]
    assert first_clause["severity"] in ["high", "medium", "low", "info"]
    assert len(first_clause["originalText"]) > 0
    assert len(first_clause["suggestedRevision"]) > 0

    # 3. Patch Clause (Bookmark and Review)
    patch_res = client.patch(
        f"/api/v1/documents/{doc_id}/clauses/{clause_id}",
        json={"reviewed": True, "bookmarked": True},
        headers=auth_headers_a,
    )
    assert patch_res.status_code == 200
    patch_data = patch_res.json()
    assert patch_data["reviewed"] is True
    assert patch_data["bookmarked"] is True

    # 4. Fetch Direct Structured Analysis JSON
    analysis_res = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=auth_headers_a)
    assert analysis_res.status_code == 200
    ana_data = analysis_res.json()
    assert ana_data["documentId"] == doc_id
    assert ana_data["version"] == 1
    assert len(ana_data["clauses"]) > 0
    assert "riskCounts" in ana_data

    # 5. Re-analyze (Version Increment)
    reanalyze_res = client.post(
        f"/api/v1/documents/{doc_id}/reanalyze",
        json={"riskSensitivity": "relaxed"},
        headers=auth_headers_a,
    )
    assert reanalyze_res.status_code == 200
    re_doc = reanalyze_res.json()
    assert re_doc["id"] == doc_id

    # Verify version incremented
    analysis_res_v2 = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=auth_headers_a)
    assert analysis_res_v2.status_code == 200
    assert analysis_res_v2.json()["version"] == 2


def test_analyze_nonexistent_document_returns_404(client: TestClient, auth_headers_a: dict):
    response = client.post(
        "/api/v1/documents/doc-nonexistent-12345/analyze",
        json={"riskSensitivity": "standard"},
        headers=auth_headers_a,
    )
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"
