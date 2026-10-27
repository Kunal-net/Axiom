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
| **Phase 5** | Frontend Live API Integration & Dynamic Data Refactor | **[x] COMPLETED & VERIFIED** | Member 1 (Frontend) |
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

## Phase 5: Frontend Live API Integration & Dynamic Data Refactor
**Status: COMPLETED & VERIFIED** | **Owner: Member 1 (Frontend, Integration & QA)**

- [x] `src/services/contractService.ts` wired to toggle between mock and live HTTP via `VITE_USE_MOCK_DATA` env var.
- [x] Live upload (`POST /api/v1/documents/upload`) path wired in `contractService.analyzeDocument`.
- [x] Analysis trigger (`POST /api/v1/documents/{id}/analyze`) wired with progress stage callbacks.
- [x] `getComparisonDiffs` wired to `POST /api/v1/documents/compare` with dynamic document selection and zero silent mock fallback in live mode.
- [x] Clause bookmark/review state patched via `PATCH /api/v1/documents/{id}/clauses/{clauseId}`.
- [x] User profile `GET`/`PUT` wired to `/api/v1/user/profile` with live cross-component sync in `App.tsx`, `AppHeader.tsx`, `Sidebar.tsx`, `DashboardPage.tsx`, and `SettingsPage.tsx`.
- [x] Connect analysis progress indicator to live backend job polling or SSE stream (synchronous immediate response with stage callbacks).
- [x] Implement robust error boundaries, retry buttons, and network disconnect states (AnalyzePage, AnalysisResultsPage, ReportPage).
- [x] Live backend connection & CORS resolution (ports 5173/5174/5175/4173 allowed, host resolution, deterministic SQLite fallback).
- [x] Connect `HistoryPage.tsx` to live document pagination, search, status/type filtering, and permanent deletion (`DELETE /api/v1/documents/{id}`).
- [x] Comprehensive Hardcoding Elimination across all 8 screens:
  - `DashboardPage`: Real quota telemetry, dynamic risk index computation, live engine health probe, and genuine empty/loading states.
  - `ReportPage`: Dynamic document resolution, active functional tabs (Key findings, Recommendations redlines, Audit details with raw text preview).
  - `ComparePage`: Dynamic document pair selectors, real diff counters, and empty divergence states.
  - `AnalyzePage`: Benchmark buttons send real DOCX binary samples from `public/samples/` to `/upload` in live mode instead of synthetic text.
  - `SettingsPage`: Removed fake hardcoded masked API keys; added client override storage and live profile propagation.

---

## Phase 6: End-to-End Integration Testing
**Status: COMPLETED & VERIFIED** | **Owner: All Members**

- [x] Conduct end-to-end live API integration walkthrough: Upload PDF -> Analyze -> Inspect Clauses -> Compare Revisions -> Delete. (62/62 checks passed, `verify_live_api.py`)
- [x] Verified cross-user data isolation: User A documents invisible to User B via all endpoints (list, GET, analyze, compare, PATCH, DELETE).
- [x] Verified private local storage (UUID-keyed files in `.local_uploads/`, not web-accessible).
- [x] Verified full database roundtrip persistence: Users, Documents, Analyses, ClauseFindings stored in PostgreSQL 16 / SQLite dev fallback.
- [x] Verify that real AI extractions map accurately to document page numbers without phantom clauses (`test_live_groq_integration.py` passing with live Groq LLM).
- [x] Post-Refactor Critical Review & Verification: Eliminated masked comparison failures, short-circuited identical contract comparison (0 diffs), enforced comparison tenant authorization, removed dead localStorage API key, refined portfolio risk calculation to evaluated contracts (honest `—` on 0 docs), isolated mock fixtures behind service layer, and resolved Groq 429 rate-limiting thread blocking (`test_end_to_end_verification.py` 5/5 passed, `./scripts/verify.sh` 74/74 passed).
- [ ] Test cross-browser compatibility (Chrome, Safari, Firefox, Edge).
- [ ] Test responsive viewports (Desktop 1440px, Tablet 768px, Mobile 375px).
- [ ] Review zero-training privacy compliance and secret leak audits.

---

## Phase 7: Deployment & Final Verification
**Status: PENDING** | **Owner: All Members**

- [ ] Configure production build pipeline.
- [ ] Set up staging environment deployment (e.g. Vercel / Railway / Cloud Run).
- [x] Landing Page Pixel-Level Reference Matching Pass: Faithfully reconstructed all 8 sections to match canonical reference (IMAGE A) — DM Serif Display typography, 3-line headline wrapping, ribbon vector motifs, 3-pane product inspector preview, 4-column features row, Corinthian column comparison, and ivory footer. (Verified via `./scripts/verify.sh` & headless screenshot comparison).
- [x] Authenticated Dashboard Reference-Matched Editorial Redesign: Reconstructed authenticated Dashboard page, persistent left sidebar, and top utility bar to match reference image — Newsreader/DM Serif Display typography, asymmetric hero with colonnade & origami chevron, 3 primary action cards (Analyze, Compare, Templates), full-width Quick Upload with drag-and-drop, and dual bottom panels (`PORTFOLIO INTEGRITY` Risk Level Index and `RECENT INSIGHTS`). Verified via `./scripts/verify.sh` (Oxlint 0 warnings/0 errors, Vitest 16/16, build clean, Pytest 76/76).
- [x] Analyze Page Clean Structural Rebuild: Diagnosed root cause of layout issues (nested `DoubleBezel` 20px/14px borders and direct rendering of sample-contracts section); rebuilt `AnalyzePage.tsx` with a single, clean upload container, left-aligned editorial header with `NEW ANALYSIS RUN` crimson indicator bar, rectangular dashed drop zone, monochrome upload icon, display serif heading `"Drop your contract here, or browse"`, restrained secondary privacy note, and complete removal of obsolete sample cards, with zero warnings across Oxlint, Vitest (16/16), and Vite production build (210ms).
- [ ] Prepare final demo presentation and documentation handover.
