# Axiom — Development Roadmap & Group Task Tracker

> Purpose: Centralized, prioritized task board tracking progress across the three team members.
> Update this document as items are completed with verified test or commit evidence.

---

## Task Board Summary

| Phase | Description | Status | Primary Owner |
|---|---|---|---|
| **Phase 1** | Repository Organization & Development Foundation | **[x] COMPLETED** | Shared / Architect |
| **Phase 2** | Agreement on API & AI Contracts | **[x] COMPLETED** | All Members (M1, M2, M3) |
| **Phase 3** | Backend & Database Foundations | **[x] COMPLETED & VERIFIED** | Member 2 (Backend) |
| **Phase 4** | AI Module Proof of Concept | **[x] COMPLETED & VERIFIED** | Member 3 (AI/ML) |
| **Phase 5** | Frontend Live API Integration | **[~] IN PROGRESS** | Member 1 (Frontend) |
| **Phase 6** | End-to-End Integration Testing | **[x] COMPLETED & VERIFIED** | All Members |
| **Phase 7** | Deployment & Final Verification | **[ ] PENDING** | All Members |

---

## Phase 1: Repository Organization & Development Foundation
**Status: COMPLETED** | **Owner: Shared**

- [x] **Repository Inspection:** Verified Git history, untracked files, package manifests, and dependencies.
- [x] **Repository Reorganization:** Safely reorganized into modular structure: `frontend/` (React 19 + TypeScript + Vite), `backend/` (FastAPI + PostgreSQL), `ai/` (scaffolded with `.gitkeep`), `docs/` (consolidated specs & architecture), and `scripts/` (unified CI/CD).
- [x] **Frontend Status Audit:** Confirmed all 8 canonical Stitch screens exist and are functional in `frontend/src/pages/`.
- [x] **Code Quality Sweep:** Resolved all linter warnings across component imports, JSX purity, and unused variables. Oxlint reaches 0 warnings, 0 errors.
- [x] **Regression Suite:** Verified 9/9 unit and service tests passing via Vitest.
- [x] **Production Bundle:** Verified clean TypeScript build (`tsc -b && vite build`) producing `frontend/dist/`.
- [x] **Unified CI Script:** Maintained `scripts/verify.sh` verifying frontend lint, tests, build, and backend pytest.
- [x] **Dead Code / Duplicate Cleanup:** Eliminated redundant `axiom_project_essentials/` duplicate folder.
- [x] **Safe Environment Config:** Verified `.env.example` placeholder template and strict `.gitignore` rules.
- [x] **Team Ownership System:** Established responsibilities for Member 1, Member 2, and Member 3.

---

## Phase 2: Agreement on API & AI Contracts
**Status: COMPLETED** | **Owner: All Members (M1, M2, M3)**

- [x] Draft initial API contract specification in `docs/API.md` based on frontend types in `src/types/contract.ts`.
- [x] Member 1, Member 2, and Member 3 formal review and sign-off on request/response schemas (Reconciled with PDF specification).
- [x] Decide on analysis execution model: synchronous immediate analysis with honest lifecycle states (`uploaded`, `processing`, `needs_review`, `completed`, `failed`).
- [x] Decide on upload payload handling: multipart/form-data for PDF/DOCX with 25 MB limit and MIME validation.
- [x] Define contract schema between Backend (Member 2) and AI Service (Member 3).
- [x] Freeze API Contract v1 in `docs/API.md` with complete screen mapping matrix.

---

## Phase 3: Backend & Database Foundations
**Status: COMPLETED & VERIFIED** | **Owner: Member 2 (Backend & Database)**

- [x] Select and initialize backend framework under `backend/` using FastAPI, Uvicorn, and Pydantic v2.
- [x] Configure database connection (PostgreSQL 16 via `psycopg` and SQLite support for tests) and SQLAlchemy 2.0 ORM.
- [x] Implement database models:
  - `users` (id, email, password_hash, name, role, organization, preferences, timestamps)
  - `documents` (id, owner_id, name, safe_storage_key, file_type, file_size, sha256_checksum, status, extracted_text, timestamps)
  - `analyses` (id, document_id, version, schema_version, status, risk_counts, structured_result, provider, completed_at)
  - `clause_findings` (id, document_id, title, severity, section, page_number, original_text, explanation, why_risky, suggested_revision, reviewed, bookmarked)
- [x] Implement Alembic database migrations (`backend/migrations/`) with zero-to-head migration and rollback verification.
- [x] Build core REST endpoints matching `docs/API.md`:
  - `GET /api/v1/health`
  - `POST /api/v1/auth/register` & `POST /api/v1/auth/login`
  - `GET /api/v1/me`
  - `POST /api/v1/documents/upload` & `POST /api/v1/documents`
  - `POST /api/v1/documents/{id}/analyze` & `POST /api/v1/documents/{id}/reanalyze`
  - `GET /api/v1/documents/{id}`
  - `GET /api/v1/documents/{id}/analysis`
  - `GET /api/v1/documents` (with search and status pagination)
  - `PATCH /api/v1/documents/{id}/clauses/{clauseId}`
  - `POST /api/v1/documents/compare`
  - `GET /api/v1/user/profile`, `PUT /api/v1/user/profile`
  - `DELETE /api/v1/documents/{id}`
- [x] Implement file validation (MIME type check, file size limit <= 25 MB, safe key generation, path traversal defense).
- [x] Add backend automated test suite: 21 automated unit, integration, isolation, and storage security tests passing.

---

## Phase 4: AI Module Proof of Concept
**Status: COMPLETED & VERIFIED** | **Owner: Member 3 (AI/ML & Intelligence)**

- [x] Initialize modular AI architecture under `ai/` (`ai/pipeline.py`, `ai/segmenter.py`, `ai/scorer.py`, `ai/validator.py`, `ai/comparator.py`, `ai/prompts.py`, `ai/schemas.py`, `ai/config.py`, `ai/providers/`).
- [x] Implement document text extraction and layout normalization pipeline (`ai/segmenter.py`) handling page headers (`--- PAGE X ---`), whitespace, and scanned/empty document detection.
- [x] Implement clause segmentation and bounded chunking (with context overlap) preserving page and section anchors for long contracts.
- [x] Design and verify system and user prompts (`ai/prompts.py`) with strict prompt injection defense, narrow role definition, untrusted data fencing, and schema validation.
- [x] Implement multi-provider adapter interface (`ai/providers/base.py`, `ai/providers/gemini.py`, `ai/providers/openai.py`, `ai/providers/anthropic.py`, `ai/providers/mock.py`, `ai/providers/factory.py`) with bounded retries, timeouts, and error translation.
- [x] Implement strict evidence validator (`ai/validator.py`) verifying that every quoted excerpt exists in source text, reconciling page numbers, and rejecting ungrounded or hallucinated findings.
- [x] Implement risk scoring and benchmark rubric (`ai/scorer.py`) with sensitivity calibration (`standard`, `strict`, `relaxed`), canonical categories, plain-English synthesis, and balanced redline counter-proposals.
- [x] Implement cross-document legal diff comparator (`ai/comparator.py`) identifying added liability caps, modified terms, stricken non-competes, and contractual conflicts.
- [x] Wire AI pipeline directly into backend `backend/app/services/analysis_service.py` with zero regressions or breaking changes.
- [x] Add comprehensive 36-test AI suite across segmenter, grounding, provider resilience, pipeline flows, risk scenarios, prompt injection defense, and live Groq LLM integration (56 backend/AI tests total passing).

---

## Phase 5: Frontend Live API Integration
**Status: IN PROGRESS** | **Owner: Member 1 (Frontend, Integration & QA)**

- [x] `src/services/contractService.ts` wired to toggle between mock and live HTTP via `VITE_USE_MOCK_DATA` env var.
- [x] Live upload (`POST /api/v1/documents/upload`) path wired in `contractService.analyzeDocument`.
- [x] Analysis trigger (`POST /api/v1/documents/{id}/analyze`) wired with progress stage callbacks.
- [x] `getComparisonDiffs` wired to `POST /api/v1/documents/compare` with default doc IDs.
- [x] Clause bookmark/review state patched via `PATCH /api/v1/documents/{id}/clauses/{clauseId}`.
- [x] User profile `GET`/`PUT` wired to `/api/v1/user/profile`.
- [ ] Connect analysis progress indicator to live backend job polling or SSE stream (currently immediate response).
- [ ] Implement robust error boundaries, retry buttons, and network disconnect states.
- [ ] Connect `HistoryPage.tsx` to live document pagination and filtering.

---

## Phase 6: End-to-End Integration Testing
**Status: COMPLETED & VERIFIED** | **Owner: All Members**

- [x] Conduct end-to-end live API integration walkthrough: Upload PDF -> Analyze -> Inspect Clauses -> Compare Revisions -> Delete. (62/62 checks passed, `verify_live_api.py`)
- [x] Verified cross-user data isolation: User A documents invisible to User B via all endpoints (list, GET, analyze, PATCH, DELETE).
- [x] Verified private local storage (UUID-keyed files in `.local_uploads/`, not web-accessible).
- [x] Verified full database roundtrip persistence: Users, Documents, Analyses, ClauseFindings stored in PostgreSQL 16.
- [x] Verify that real AI extractions map accurately to document page numbers without phantom clauses (`test_live_groq_integration.py` passing with live Groq LLM).
- [ ] Test cross-browser compatibility (Chrome, Safari, Firefox, Edge).
- [ ] Test responsive viewports (Desktop 1440px, Tablet 768px, Mobile 375px).
- [ ] Review zero-training privacy compliance and secret leak audits.

---

## Phase 7: Deployment & Final Verification
**Status: PENDING** | **Owner: All Members**

- [ ] Configure production build pipeline.
- [ ] Set up staging environment deployment (e.g. Vercel / Railway / Cloud Run).
- [ ] Perform final visual comparison against approved Google Stitch designs.
- [ ] Prepare final demo presentation and documentation handover.
