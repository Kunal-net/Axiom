# Axiom — Development Roadmap & Group Task Tracker

> Purpose: Centralized, prioritized task board tracking progress across the three team members.
> Update this document as items are completed with verified test or commit evidence.

---

## Task Board Summary

| Phase | Description | Status | Primary Owner |
|---|---|---|---|
| **Phase 1** | Repository Organization & Development Foundation | **[x] COMPLETED** | Shared / Architect |
| **Phase 2** | Agreement on API & AI Contracts | **[ ] IN PROGRESS** | All Members (M1, M2, M3) |
| **Phase 3** | Backend & Database Foundations | **[ ] PENDING** | Member 2 (Backend) |
| **Phase 4** | AI Module Proof of Concept | **[ ] PENDING** | Member 3 (AI/ML) |
| **Phase 5** | Frontend Live API Integration | **[ ] PENDING** | Member 1 (Frontend) |
| **Phase 6** | End-to-End Integration Testing | **[ ] PENDING** | All Members |
| **Phase 7** | Deployment & Final Verification | **[ ] PENDING** | All Members |

---

## Phase 1: Repository Organization & Development Foundation
**Status: COMPLETED** | **Owner: Shared**

- [x] **Repository Inspection:** Verified Git history, untracked files, package manifests, and dependencies.
- [x] **Frontend Status Audit:** Confirmed all 8 canonical Stitch screens exist and are functional in `src/pages/`.
- [x] **Code Quality Sweep:** Resolved all linter warnings across component imports, JSX purity, and unused variables. `npm run lint` reaches 0 warnings, 0 errors.
- [x] **Regression Suite:** Verified 8/8 unit and service tests passing via `npm test`.
- [x] **Production Bundle:** Verified clean TypeScript build (`tsc -b && vite build`).
- [x] **Unified CI Script:** Created `scripts/verify.sh` and npm script `npm run verify`.
- [x] **Dead Code / Duplicate Cleanup:** Eliminated redundant `axiom_project_essentials/` duplicate folder.
- [x] **Safe Environment Config:** Verified `.env.example` placeholder template and strict `.gitignore` rules.
- [x] **Team Ownership System:** Established responsibilities for Member 1, Member 2, and Member 3.

---

## Phase 2: Agreement on API & AI Contracts
**Status: IN PROGRESS** | **Owner: All Members (M1, M2, M3)**

- [x] Draft initial API contract specification in `docs/API.md` based on frontend types in `src/types/contract.ts`.
- [ ] Member 1, Member 2, and Member 3 formal review and sign-off on request/response schemas.
- [ ] Decide on analysis execution model:
  - Option A: Polling job status (`POST /analyze` returns `jobId`, client polls `GET /jobs/{id}`).
  - Option B: Server-Sent Events (SSE) streaming progress stages (0% -> 25% -> 55% -> 85% -> 100%).
- [ ] Decide on upload payload handling (multipart/form-data for PDF/DOCX, maximum 25 MB limit).
- [ ] Define contract schema between Backend (Member 2) and AI Service (Member 3).
- [ ] Freeze API Contract v1 before starting parallel implementation.

---

## Phase 3: Backend & Database Foundations
**Status: PENDING** | **Owner: Member 2 (Backend & Database)**

- [ ] Select and initialize backend framework under `backend/` (e.g., Python FastAPI or Node Express).
- [ ] Configure database connection (PostgreSQL / SQLite for development) and ORM/query builder.
- [ ] Implement database models:
  - `contracts` (id, title, file_url, status, summary, risk_counts, created_at)
  - `clauses` (id, contract_id, title, section, page_number, severity, original_text, explanation, why_risky, suggested_revision)
  - `comparisons` (id, original_doc_id, revised_doc_id, diffs_json)
  - `user_profiles` (id, email, risk_sensitivity, tone, retention_days)
- [ ] Implement database migrations.
- [ ] Build core REST endpoints matching `docs/API.md`:
  - `POST /api/v1/documents/upload`
  - `POST /api/v1/documents/{id}/analyze`
  - `GET /api/v1/documents/{id}`
  - `GET /api/v1/documents`
  - `POST /api/v1/documents/compare`
  - `GET /api/v1/user/profile`, `PUT /api/v1/user/profile`
- [ ] Implement file validation (MIME type check, file size limit <= 25 MB, virus scan placeholder).
- [ ] Add backend automated test suite (unit and integration tests).

---

## Phase 4: AI Module Proof of Concept
**Status: PENDING** | **Owner: Member 3 (AI/ML & Intelligence)**

- [ ] Initialize AI module structure under `ai/`.
- [ ] Implement document text extraction pipeline for PDF and DOCX files.
- [ ] Implement clause segmentation (splitting document into structured sections and page numbers).
- [ ] Design and test prompts for:
  - Risk classification (`high`, `medium`, `low`, `info`).
  - Plain-English breakdown (explaining legal consequences to freelancers).
  - Counter-proposal generation (balanced redlines with liability caps).
- [ ] Implement structured JSON output enforcement (using Pydantic, Instructor, or Gemini structured outputs).
- [ ] Implement document comparison diff engine (identifying modifications, deletions, and contractual conflicts).
- [ ] Test with benchmark sample agreements (`sampleContracts.ts`) and evaluate accuracy against ground truth.
- [ ] Expose clean Python interface / internal API for Member 2's backend to invoke.

---

## Phase 5: Frontend Live API Integration
**Status: PENDING** | **Owner: Member 1 (Frontend, Integration & QA)**

- [ ] Update `src/services/contractService.ts` to toggle between mock mode and real HTTP requests using `fetch` or `axios`.
- [ ] Wire up real file upload (`POST /api/v1/documents/upload`) in `AnalyzePage.tsx`.
- [ ] Connect analysis progress indicator to live backend job polling or SSE stream.
- [ ] Connect `AnalysisResultsPage.tsx` to live findings returned by the backend.
- [ ] Connect `ComparePage.tsx` to live side-by-side diff responses.
- [ ] Connect `HistoryPage.tsx` and `DashboardPage.tsx` to live document persistence.
- [ ] Connect `SettingsPage.tsx` to live user profile updates.
- [ ] Implement robust error boundaries, retry buttons, and network disconnect states.

---

## Phase 6: End-to-End Integration Testing
**Status: PENDING** | **Owner: All Members**

- [ ] Conduct end-to-end integration walkthrough: Upload PDF -> Analyze -> Inspect Clauses -> Generate Report -> Compare Revisions.
- [ ] Verify that real AI extractions map accurately to document page numbers without phantom clauses.
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
