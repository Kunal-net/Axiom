# Axiom — API Contracts & Schema Specification

> Authoritative contract specification connecting the Frontend (`src/services/contractService.ts`),
> Backend REST Gateway (Member 2), and AI/ML Intelligence Pipeline (Member 3).

---

## 1. Overview & Protocol Standards

- **Base URL:** `http://localhost:8000/api/v1` (configured via `VITE_API_BASE_URL`).
- **Data Format:** `application/json` for requests and responses (except file upload `multipart/form-data`).
- **Authentication:** Bearer token in `Authorization: Bearer <token>` header (when auth is active).
- **Error Format:**
  ```json
  {
    "error": {
      "code": "DOCUMENT_NOT_FOUND",
      "message": "The requested contract document was not found or has expired.",
      "details": {}
    }
  }
  ```

---

## 2. API Endpoints

### 2.1. Upload Contract Document
Uploads a contract file for parsing and enclave staging.

- **Endpoint:** `POST /api/v1/documents/upload`
- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  - `file`: Binary file data.
  - Allowed extensions: `.pdf`, `.docx`, `.doc`.
  - Max file size: `26,214,400` bytes (25 MB).
- **Response `201 Created`:**
  ```json
  {
    "id": "doc-msa-fintech-1729780000",
    "name": "Apex_FinTech_Master_Services_Agreement_2026.pdf",
    "fileType": "pdf",
    "fileSize": "1.4 MB",
    "uploadedAt": "Just now",
    "lastAnalyzedAt": "Pending",
    "status": "processing",
    "pageCount": 4,
    "summary": "Document uploaded successfully and queued for enclave analysis.",
    "riskCounts": {
      "high": 0,
      "medium": 0,
      "low": 0,
      "info": 0
    },
    "clauses": []
  }
  ```

---

### 2.2. Initiate Document Analysis
Initiates full clause segmentation, risk categorization, and redline counter-proposal synthesis.

- **Endpoint:** `POST /api/v1/documents/{id}/analyze`
- **Request Body:**
  ```json
  {
    "riskSensitivity": "standard",
    "explanationStyle": "plain_english",
    "autoGenerateRedlines": true
  }
  ```
- **Response `200 OK` (or `202 Accepted` if queued):**
  ```json
  {
    "id": "doc-msa-fintech-1729780000",
    "name": "Apex_FinTech_Master_Services_Agreement_2026.pdf",
    "fileType": "pdf",
    "fileSize": "1.4 MB",
    "uploadedAt": "2 minutes ago",
    "lastAnalyzedAt": "Just now",
    "status": "needs_review",
    "pageCount": 4,
    "riskCounts": {
      "high": 3,
      "medium": 3,
      "low": 1,
      "info": 0
    },
    "summary": "The agreement contains significant commercial risks: unlimited indemnification obligations without liability caps, broad intellectual property assignment encompassing contractor background technology, and unfavorable net-90 payment terms.",
    "clauses": [
      {
        "id": "clause-1",
        "title": "Unlimited Indemnification",
        "severity": "high",
        "section": "Section 9.1 • Liability",
        "pageNumber": 3,
        "originalText": "Contractor shall defend, indemnify, and hold harmless Client and affiliates against any and all claims, liabilities, losses, damages, costs, and expenses (including attorney's fees, consequential, and punitive damages) arising out of Contractor's deliverables or breach of any representation.",
        "explanation": "You are agreeing to pay all of the client's lawsuits, legal bills, and lost profits out of your own pocket without any dollar limit—even for minor unintended mistakes.",
        "whyRisky": "A single bug or delay could result in the client suing you for hundreds of thousands of dollars in consequential damages, far exceeding what they paid you.",
        "suggestedRevision": "Each party shall indemnify the other against direct third-party claims arising from gross negligence or willful misconduct, provided Contractor's aggregate liability shall be capped at the total fees paid under this Statement of Work.",
        "category": "liability",
        "reviewed": false,
        "bookmarked": true
      }
    ]
  }
  ```

---

### 2.3. Get Document by ID
Retrieves full details and findings for a processed contract.

- **Endpoint:** `GET /api/v1/documents/{id}`
- **Response `200 OK`:** Returns full `ContractDocument` object as detailed above.

---

### 2.4. List Documents
Fetches all user contracts for Dashboard and History pages.

- **Endpoint:** `GET /api/v1/documents`
- **Query Parameters:**
  - `search` (optional): Filter by contract title.
  - `status` (optional): `all` | `needs_review` | `completed` | `processing`.
  - `category` (optional): Filter by document category.
  - `page` (optional, default: 1): Page number.
  - `limit` (optional, default: 20): Results per page.
- **Response `200 OK`:**
  ```json
  {
    "documents": [ ... ],
    "totalCount": 3,
    "page": 1,
    "limit": 20
  }
  ```

---

### 2.5. Compare Documents (Legal Diff)
Performs side-by-side legal comparison between an original contract and a counter-proposal draft.

- **Endpoint:** `POST /api/v1/documents/compare`
- **Request Body:**
  ```json
  {
    "originalDocId": "doc-msa-fintech",
    "revisedDocId": "doc-msa-counter"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "comparisonId": "comp-1729780000",
    "originalDocId": "doc-msa-fintech",
    "revisedDocId": "doc-msa-counter",
    "diffs": [
      {
        "id": "diff-1",
        "clauseTitle": "Limitation of Liability & Fee Cap",
        "section": "Section 9.2 • Liability",
        "changeType": "added",
        "severity": "high",
        "originalText": "[Silent — No mutual liability cap provided in Client draft]",
        "revisedText": "IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE TOTAL FEES ACTUALLY PAID TO CONTRACTOR HEREUNDER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
        "explanation": "Added a strict mutual 12-month fee cap to insulate the contractor from catastrophic commercial exposure.",
        "legalImpact": "Protects contractor from uncapped consequential damages and aligns liability with contract value."
      }
    ]
  }
  ```

---

### 2.6. User Profile & Preferences
Gets or updates user risk thresholds, explanation tone, and retention settings.

- **Endpoints:**
  - `GET /api/v1/user/profile`
  - `PUT /api/v1/user/profile`
- **Schema:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex.mercer@studiomercer.design",
    "role": "Principal Design Engineer",
    "organization": "Mercer Creative Labs LLC",
    "riskSensitivity": "strict",
    "explanationStyle": "plain_english",
    "autoGenerateRedlines": true,
    "documentRetentionDays": 30,
    "emailNotifications": true,
    "highRiskAlerts": true
  }
  ```

---

### 2.7. Update Clause Review / Bookmark State
Updates the review or bookmark status of a specific clause in an analyzed document.

- **Endpoint:** `PATCH /api/v1/documents/{id}/clauses/{clauseId}`
- **Request Body:**
  ```json
  {
    "reviewed": true,
    "bookmarked": false
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "id": "clause-1",
    "reviewed": true,
    "bookmarked": false
  }
  ```

---

### 2.8. Delete Document
Permanently removes a document and its associated findings from user history and storage.

- **Endpoint:** `DELETE /api/v1/documents/{id}`
- **Response `204 No Content`**

---

### 2.9. Service Health & Readiness Probe
Lightweight endpoint for frontend startup connectivity verification.

- **Endpoint:** `GET /api/v1/health`
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-10-24T10:30:00Z"
  }
  ```

---

## 3. Backend-to-AI Internal Interface (Member 2 to Member 3)

When Member 2 receives a document processing request, the internal AI module is invoked via:

```python
# Internal interface under ai/
from ai.pipeline import ContractAnalysisPipeline

pipeline = ContractAnalysisPipeline(model="gemini-1.5-pro")
result = pipeline.analyze(
    file_bytes=file_data,
    filename="Contract.pdf",
    risk_sensitivity="standard"
)
# Returns validated Pydantic model matching ClauseFinding schema
```
