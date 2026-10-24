"""
Axiom Document Legal Diff Comparison Tests
"""

from fastapi.testclient import TestClient


def test_compare_contracts(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    # Upload original draft
    res1 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Client_Draft_MSA.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc1_id = res1.json()["id"]

    # Upload counter proposal
    res2 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contractor_Counter_Proposal.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc2_id = res2.json()["id"]

    # Compare
    compare_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": doc2_id},
        headers=auth_headers_a,
    )
    assert compare_res.status_code == 200
    data = compare_res.json()
    assert "comparisonId" in data
    assert data["originalDocId"] == doc1_id
    assert data["revisedDocId"] == doc2_id
    assert len(data["diffs"]) > 0

    first_diff = data["diffs"][0]
    assert "clauseTitle" in first_diff
    assert "section" in first_diff
    assert first_diff["changeType"] in ["modified", "added", "removed", "conflict"]
    assert "severity" in first_diff
    assert "originalText" in first_diff
    assert "revisedText" in first_diff
    assert "explanation" in first_diff
    assert "legalImpact" in first_diff
