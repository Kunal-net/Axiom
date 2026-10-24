"""
Axiom Cross-User Isolation and Ownership Enforcement Tests
Verifies that User B cannot access, read, analyze, modify, or delete User A's documents.
"""

from fastapi.testclient import TestClient


def test_cross_user_isolation(
    client: TestClient,
    auth_headers_a: dict,
    auth_headers_b: dict,
    sample_pdf_bytes: bytes,
):
    # User A uploads a contract
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Alice_Confidential_MSA.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    assert upload_res.status_code == 201
    doc_id = upload_res.json()["id"]

    # 1. User B attempts to read User A's document -> 404 (or 403)
    get_res = client.get(f"/api/v1/documents/{doc_id}", headers=auth_headers_b)
    assert get_res.status_code == 404
    assert get_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"

    # 2. User B attempts to trigger analysis on User A's document -> 404
    analyze_res = client.post(
        f"/api/v1/documents/{doc_id}/analyze",
        json={"riskSensitivity": "standard"},
        headers=auth_headers_b,
    )
    assert analyze_res.status_code == 404
    assert analyze_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"

    # 3. User B attempts to fetch structured analysis -> 404
    ana_res = client.get(f"/api/v1/documents/{doc_id}/analysis", headers=auth_headers_b)
    assert ana_res.status_code == 404
    assert ana_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"

    # 4. User B attempts to patch clause in User A's document -> 404
    patch_res = client.patch(
        f"/api/v1/documents/{doc_id}/clauses/clause-1",
        json={"reviewed": True},
        headers=auth_headers_b,
    )
    assert patch_res.status_code == 404

    # 5. User B attempts to delete User A's document -> 404
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=auth_headers_b)
    assert del_res.status_code == 404
    assert del_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"

    # 6. User B lists documents -> should be empty
    list_b = client.get("/api/v1/documents", headers=auth_headers_b)
    assert list_b.status_code == 200
    assert list_b.json()["totalCount"] == 0
    assert len(list_b.json()["documents"]) == 0

    # 7. User A lists documents -> sees their document
    list_a = client.get("/api/v1/documents", headers=auth_headers_a)
    assert list_a.status_code == 200
    assert list_a.json()["totalCount"] == 1
    assert list_a.json()["documents"][0]["id"] == doc_id
