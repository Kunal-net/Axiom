# Axiom Roadmap

> Authoritative multi-phase product roadmap for Axiom.
> For the live team task tracker with individual ownership assignments, see [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md).

---

## Phase 1: Foundation & Frontend (Completed)
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
- [x] Unified verification script (`npm run verify` passing 100%)

---

## Phase 2: Contract Alignment & Protocol Freeze (In Progress)
- [x] Draft REST API specification in [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md).
- [ ] Sign-off on request/response schemas across Member 1, Member 2, and Member 3.
- [ ] Finalize analysis delivery mechanism (Polling vs Server-Sent Events).
- [ ] Define backend-to-AI internal payload interfaces.

---

## Phase 3: Backend & Database Foundations (Pending)
- [ ] Member 2: Initialize `backend/` application (FastAPI recommended).
- [ ] Member 2: Set up PostgreSQL / SQLite database with migrations.
- [ ] Member 2: Implement REST endpoints (`/upload`, `/analyze`, `/documents`, `/compare`).

---

## Phase 4: AI & Machine Learning Pipeline (Pending)
- [ ] Member 3: Initialize `ai/` module structure.
- [ ] Member 3: Implement PDF/DOCX text & layout extraction.
- [ ] Member 3: Implement clause segmentation and prompt-engineered risk scoring.
- [ ] Member 3: Enforce structured JSON outputs matching `src/types/contract.ts`.

---

## Phase 5: Live API Integration (Pending)
- [ ] Member 1: Wire up live HTTP calls in `src/services/contractService.ts` (`VITE_USE_MOCK_DATA=false`).
- [ ] Member 1: Connect live file upload, job polling, and document comparison.

---

## Phase 6: End-to-End Verification & Delivery (Pending)
- [ ] Run automated end-to-end integration tests.
- [ ] Verify security enclave isolation and zero-data retention policies.
- [ ] Production build and staging deployment.

