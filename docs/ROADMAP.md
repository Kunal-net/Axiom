# Axiom Roadmap

> Authoritative multi-phase product roadmap for Axiom.
> For the live team task tracker with individual ownership assignments, see [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md).

---

## Phase 1: Foundation, Reorganization & Frontend (Completed)
- [x] Inspect existing repository, stack, and scripts.
- [x] Discover and apply design skills (`design-taste-frontend`, `gpt-taste`, `stitch-design-taste`).
- [x] Verify project documentation and environment setup.
- [x] Confirm warm editorial design tokens and assets against Stitch.
- [x] Public landing page (`#/landing`)
- [x] Dashboard (`#/dashboard`)
- [x] Contract upload and analysis initiation (`#/analyze`)
- [x] Analysis workspace/results (`#/results?doc=<id>`)
- [x] Document comparison tool (`#/compare`)
- [x] Analysis report and print/export (`#/report?doc=<id>`)
- [x] Document history audit archive (`#/history`)
- [x] Settings/profile preferences (`#/settings`)
- [x] Shared navigation, responsive layouts, double-bezel primitives
- [x] Loading, empty, and simulated enclave states
- [x] Safely reorganize repository into modular `frontend/`, `backend/`, `ai/`, `docs/`, and `scripts/` layout
- [x] Unified verification script (`./scripts/verify.sh` passing 100%)

---

## Phase 2: Contract Alignment & Protocol Freeze (Completed)
- [x] Draft REST API specification in [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md).
- [x] Sign-off on request/response schemas across Member 1, Member 2, and Member 3.
- [x] Finalize analysis delivery mechanism (synchronous immediate response with honest lifecycle states).
- [x] Define backend-to-AI internal payload interfaces.

---

## Phase 3: Backend & Database Foundations (Completed & Verified)
- [x] Member 2: Initialize `backend/` application using FastAPI, Uvicorn, and Pydantic v2.
- [x] Member 2: Set up PostgreSQL 16 / SQLite database with SQLAlchemy 2.0 ORM and Alembic migrations.
- [x] Member 2: Implement REST endpoints (`/upload`, `/analyze`, `/documents`, `/compare`, `/user/profile`).
- [x] Member 2: Automated test suite with 21 unit, integration, and security tests passing.

---

## Phase 4: AI & Machine Learning Pipeline (Pending)
- [x] Initialize `ai/` directory structure with `.gitkeep`.
- [ ] Member 3: Implement PDF/DOCX text & layout extraction.
- [ ] Member 3: Implement clause segmentation and prompt-engineered risk scoring.
- [ ] Member 3: Enforce structured JSON outputs matching `frontend/src/types/contract.ts`.

---

## Phase 5: Live API Integration (In Progress)
- [x] Member 1: Wire up live HTTP calls in `frontend/src/services/contractService.ts` (`VITE_USE_MOCK_DATA=false`).
- [x] Member 1: Connect live file upload, analysis trigger, and document comparison.
- [ ] Member 1: Connect live document pagination and error boundaries.

---

## Phase 6: End-to-End Verification & Delivery (Partial)
- [x] Live API end-to-end integration walkthrough (62/62 checks passed via `verify_live_api.py`).
- [ ] Run automated end-to-end integration tests across real AI extractions.
- [ ] Verify security enclave isolation and zero-data retention policies.
- [ ] Production build and staging deployment.
