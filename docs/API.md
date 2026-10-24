# Axiom — API Contracts & Schema Specification

> Authoritative contract specification connecting the Frontend (`src/services/contractService.ts`),
> Backend REST Gateway (Member 2), and AI/ML Intelligence Pipeline (Member 3).
> Fully reconciled with `Axiom_Member_2_Backend_Master_Prompt.pdf` specifications.

---

## 1. Overview & Protocol Standards

- **Base URL:** `http://localhost:8000/api/v1` (configured via `VITE_API_BASE_URL`).
- **Data Format:** `application/json` for requests and responses (except file upload `multipart/form-data`).
- **Authentication:**
  - Bearer token in `Authorization: Bearer <token>` header.
  - In development mode (`APP_ENV=development`), requests without an Authorization header default to the authenticated demo workspace user (`alex.mercer@studiomercer.design`) to maintain frontend zero-friction compatibility while enforcing strict ownership isolation.
  - In production mode, missing or invalid bearer tokens return `401 Unauthorized`.
- **Standardized Error Format:**
  Every 4xx/5xx error response returns a stable JSON envelope without leaking internal stack traces, SQL errors, or filesystem paths:
  ```json
  {
    "error": {
      "code": "DOCUMENT_NOT_FOUND",
      "message": "The requested contract document was not found or has expired.",
      "request_id": "req-1729780000-abcd",
      "details": {}
    }
  }
  ```
- **Document Lifecycle States:**
  - `uploaded`: File accepted and metadata persisted; extraction and analysis not yet completed.
  - `processing`: Text extraction or AI analysis is actively running.
  - `completed`: Contract analysis completed with zero high-risk findings.
  - `needs_review`: Contract analysis completed with high or medium commercial risk clauses flagged.
  - `failed`: Processing encountered an unrecoverable failure; safe, user-readable error code stored and displayed.

---

## 2. Screen-to-Endpoint Mapping Matrix

| Frontend Screen | Route Hash | HTTP Method | API Path | Description |
|---|---|---|---|---|
| **Service Bootstrap** | Global | `GET` | `/api/v1/health` | Service liveness & database readiness check |
| **Authentication** | Modal / Auth | `POST` | `/api/v1/auth/register` | Register new local user account |
| **Authentication** | Modal / Auth | `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT access token |
| **Authentication** | Global | `GET` | `/api/v1/me` | Fetch authenticated user identity & workspace |
| **Analyze** | `#/analyze` | `POST` | `/api/v1/documents/upload` | Multipart upload (PDF/DOCX <= 25MB) |
| **Analyze** | `#/analyze` | `POST` | `/api/v1/documents` | REST alias for contract document upload |
| **Analyze** | `#/analyze` | `POST` | `/api/v1/documents/{id}/analyze` | Trigger clause segmentation & risk analysis |
| **Analyze / Results** | `#/results?doc=<id>` | `POST` | `/api/v1/documents/{id}/reanalyze`| Controlled retry or re-analysis |
| **Dashboard** | `#/dashboard` | `GET` | `/api/v1/documents` | List recent user contracts with telemetry |
| **History** | `#/history` | `GET` | `/api/v1/documents` | Paginated contract search with status filters |
| **Results** | `#/results?doc=<id>` | `GET` | `/api/v1/documents/{id}` | Full contract document with clauses and findings |
| **Report** | `#/report?doc=<id>` | `GET` | `/api/v1/documents/{id}` | Document audit report & export data |
| **Results** | `#/results?doc=<id>` | `GET` | `/api/v1/documents/{id}/analysis`| Direct structured analysis JSON retrieval |
| **Results** | `#/results?doc=<id>` | `PATCH` | `/api/v1/documents/{id}/clauses/{clauseId}` | Toggle reviewed or bookmarked clause state |
| **Compare** | `#/compare` | `POST` | `/api/v1/documents/compare` | Legal diff between original and revised contracts |
| **Settings** | `#/settings` | `GET` | `/api/v1/user/profile` | Retrieve user profile & risk preferences |
| **Settings** | `#/settings` | `PUT` | `/api/v1/user/profile` | Update liability thresholds & tone preferences |
| **Dashboard / History**| `#/dashboard`, `#/history` | `DELETE` | `/api/v1/documents/{id}` | Delete owned contract and private storage file |

---

## 3. API Endpoints

### 3.1. Service Health & Readiness Probe
Lightweight endpoint for frontend startup connectivity and health monitoring.

- **Endpoint:** `GET /api/v1/health`
- **Auth Required:** No
- **Response `200 OK`:**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-10-24T10:30:00Z",
    "database": "connected"
  }
  ```

---

### 3.2. Authentication: Register
Creates a new local user account.

- **Endpoint:** `POST /api/v1/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "Jane Doe",
    "role": "Freelance Consultant",
    "organization": "Acme Consulting"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "tokenType": "bearer",
    "user": {
      "id": "usr-1729780000",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "Freelance Consultant",
      "organization": "Acme Consulting",
      "createdAt": "2026-10-24T10:30:00Z"
    }
  }
  ```

---

### 3.3. Authentication: Login
Authenticates credentials and returns a signed JWT access token.

- **Endpoint:** `POST /api/v1/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "tokenType": "bearer",
    "user": {
      "id": "usr-1729780000",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "Freelance Consultant",
      "organization": "Acme Consulting"
    }
  }
  ```

---

### 3.4. Current User Profile
Retrieves the safe authenticated user profile.

- **Endpoint:** `GET /api/v1/me`
- **Auth Required:** Optional in dev (defaults to Alex Mercer); Required in prod.
- **Response `200 OK`:**
  ```json
  {
    "id": "usr-1729780000",
    "email": "alex.mercer@studiomercer.design",
    "name": "Alex Mercer",
    "role": "Principal Design Engineer",
    "organization": "Mercer Creative Labs LLC",
    "createdAt": "2026-10-24T10:00:00Z"
  }
  ```

---

### 3.5. Upload Contract Document
Uploads a contract file for parsing and enclave staging.

- **Endpoints:**
  - `POST /api/v1/documents/upload`
  - `POST /api/v1/documents` (REST alias)
- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  - `file`: Binary file data.
  - Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`.
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

### 3.6. Initiate Document Analysis / Reanalyze
Initiates full clause segmentation, risk categorization, and redline counter-proposal synthesis.

- **Endpoints:**
  - `POST /api/v1/documents/{id}/analyze`
  - `POST /api/v1/documents/{id}/reanalyze`
- **Request Body:**
  ```json
  {
    "riskSensitivity": "standard",
    "explanationStyle": "plain_english",
    "autoGenerateRedlines": true
  }
  ```
- **Response `200 OK` (or `202 Accepted`):**
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

### 3.7. Get Document by ID
Retrieves full details and findings for a processed contract.

- **Endpoint:** `GET /api/v1/documents/{id}`
- **Response `200 OK`:** Returns full `ContractDocument` object as detailed above.

---

### 3.8. Get Structured Analysis Directly
Fetches only the validated structured analysis JSON for an owned document.

- **Endpoint:** `GET /api/v1/documents/{id}/analysis`
- **Response `200 OK`:**
  ```json
  {
    "id": "ana-1729780000",
    "documentId": "doc-msa-fintech-1729780000",
    "version": 1,
    "schemaVersion": "1.0.0",
    "status": "completed",
    "summary": "...",
    "riskCounts": { "high": 3, "medium": 3, "low": 1, "info": 0 },
    "clauses": [ ... ],
    "provider": "gemini",
    "model": "gemini-1.5-pro",
    "completedAt": "2026-10-24T10:32:00Z"
  }
  ```

---

### 3.9. List Documents
Fetches user contracts for Dashboard and History pages.

- **Endpoint:** `GET /api/v1/documents`
- **Query Parameters:**
  - `search` (optional): Filter by contract title.
  - `status` (optional): `all` | `needs_review` | `completed` | `processing` | `failed`.
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

### 3.10. Compare Documents (Legal Diff)
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

### 3.11. User Profile & Preferences
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

### 3.12. Update Clause Review / Bookmark State
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

### 3.13. Delete Document
Permanently removes a document, its extracted text, structured analyses, and private filesystem file.

- **Endpoint:** `DELETE /api/v1/documents/{id}`
- **Response `204 No Content`**

---

## 4. Backend-to-AI Internal Interface (Member 2 to Member 3)

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
