import io
import docx
from fastapi.testclient import TestClient


def create_docx_bytes(paragraphs) -> bytes:
    doc = docx.Document()
    for text in paragraphs:
        doc.add_paragraph(text)
    stream = io.BytesIO()
    doc.save(stream)
    return stream.getvalue()


def test_compare_contracts(client: TestClient, auth_headers_a: dict):
    # Upload original draft with Net 90 and unilateral termination
    docx_orig = create_docx_bytes([
        "MASTER SERVICES AGREEMENT",
        "Section 4.3 • Payment Schedule: Invoices shall be payable within ninety (90) days following acceptance.",
        "Section 8.1 • Termination: Client may terminate this Agreement at any time for convenience without cause.",
    ])
    res1 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Client_Draft_MSA.docx", docx_orig, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=auth_headers_a,
    )
    doc1_id = res1.json()["id"]

    # Upload counter proposal with Net 30, liability fee cap, and 30-day notice
    docx_rev = create_docx_bytes([
        "MASTER SERVICES AGREEMENT - CONTRACTOR MARKUP",
        "Section 4.3 • Payment Schedule: Invoices shall be payable within thirty (30) days of receipt.",
        "Section 8.1 • Termination: Either party may terminate for convenience upon thirty (30) days notice with compensation.",
        "Section 9.2 • Limitation of Liability: In no event shall aggregate liability exceed the total fees actually paid to contractor.",
    ])
    res2 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Contractor_Counter_Proposal.docx", docx_rev, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
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


def test_compare_identical_documents_returns_empty_diffs(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    res1 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Original_Agreement.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc_id = res1.json()["id"]

    compare_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc_id, "revisedDocId": doc_id},
        headers=auth_headers_a,
    )
    assert compare_res.status_code == 200
    data = compare_res.json()
    assert data["diffs"] == []


def test_compare_nonexistent_document_returns_404(client: TestClient, auth_headers_a: dict, sample_pdf_bytes: bytes):
    res1 = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Valid_Doc.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc1_id = res1.json()["id"]

    compare_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc1_id, "revisedDocId": "doc-nonexistent-9999"},
        headers=auth_headers_a,
    )
    assert compare_res.status_code == 404
    assert compare_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"


def test_compare_cross_user_isolation(client: TestClient, auth_headers_a: dict, auth_headers_b: dict, sample_pdf_bytes: bytes):
    res_a = client.post(
        "/api/v1/documents/upload",
        files={"file": ("User_A_Doc.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_a,
    )
    doc_a_id = res_a.json()["id"]

    res_b = client.post(
        "/api/v1/documents/upload",
        files={"file": ("User_B_Doc.pdf", sample_pdf_bytes, "application/pdf")},
        headers=auth_headers_b,
    )
    doc_b_id = res_b.json()["id"]

    # User A tries to compare User A's doc with User B's doc
    compare_res = client.post(
        "/api/v1/documents/compare",
        json={"originalDocId": doc_a_id, "revisedDocId": doc_b_id},
        headers=auth_headers_a,
    )
    assert compare_res.status_code == 404
    assert compare_res.json()["error"]["code"] == "DOCUMENT_NOT_FOUND"
