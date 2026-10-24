"""
Axiom Document Upload, Listing, and Storage Tests
"""

import io
from fastapi.testclient import TestClient


def test_upload_pdf_success(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    files = {"file": ("MSA_Master_Services_Agreement_2026.pdf", sample_pdf_bytes, "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files, headers=auth_headers_a)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "MSA_Master_Services_Agreement_2026.pdf"
    assert data["fileType"] == "pdf"
    assert data["status"] in ["uploaded", "processing"]
    assert "riskCounts" in data
    assert "id" in data


def test_upload_empty_file_rejected(client: TestClient, auth_headers_a: dict):
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files, headers=auth_headers_a)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "EMPTY_FILE"


def test_upload_unsupported_media_type_rejected(client: TestClient, auth_headers_a: dict):
    files = {"file": ("malicious_script.exe", b"MZbinarycontent", "application/x-msdownload")}
    response = client.post("/api/v1/documents/upload", files=files, headers=auth_headers_a)

    assert response.status_code == 415
    assert response.json()["error"]["code"] == "UNSUPPORTED_MEDIA_TYPE"


def test_upload_oversized_file_rejected(client: TestClient, auth_headers_a: dict):
    # Limit is 5MB in test env
    oversized_bytes = b"0" * (6 * 1024 * 1024)
    files = {"file": ("giant_contract.pdf", oversized_bytes, "application/pdf")}
    response = client.post("/api/v1/documents/upload", files=files, headers=auth_headers_a)

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "PAYLOAD_TOO_LARGE"


def test_list_documents_pagination_and_filters(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    # Upload 2 documents
    client.post(
        "/api/v1/documents/upload",
        files={"file": ("Doc_Alpha.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    client.post(
        "/api/v1/documents/upload",
        files={"file": ("Doc_Beta.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )

    # List all
    res_list = client.get("/api/v1/documents?limit=10&page=1", headers=auth_headers_a)
    assert res_list.status_code == 200
    data = res_list.json()
    assert data["totalCount"] == 2
    assert len(data["documents"]) == 2

    # Filter by search
    res_search = client.get("/api/v1/documents?search=Alpha", headers=auth_headers_a)
    assert res_search.status_code == 200
    assert res_search.json()["totalCount"] == 1
    assert res_search.json()["documents"][0]["name"] == "Doc_Alpha.pdf"


def test_get_document_detail_and_delete(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    # Upload
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contract_To_Delete.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc_id = upload_res.json()["id"]

    # Get detail
    get_res = client.get(f"/api/v1/documents/{doc_id}", headers=auth_headers_a)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == doc_id

    # Delete
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=auth_headers_a)
    assert del_res.status_code == 204

    # Verify not found after delete
    get_again = client.get(f"/api/v1/documents/{doc_id}", headers=auth_headers_a)
    assert get_again.status_code == 404
    assert get_again.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"
