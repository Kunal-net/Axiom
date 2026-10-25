# Axiom — Project Memory

> Purpose: Durable, concise project knowledge for future development sessions.
> Update this file after substantial implementation work. Never store secrets.

---

## 1. Source of Truth Matrix

| Domain | Authoritative File | Description |
|---|---|---|
| **Visual Design** | [docs/DESIGN.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DESIGN.md) & [docs/stitch-reference/](file:///Users/kunalsuryanshi/Documents/axiom/docs/stitch-reference) | Warm ivory palette, Newsreader/Inter typography, 8 approved screens |
| **System Architecture** | [docs/ARCHITECTURE.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/ARCHITECTURE.md) | Boundaries, data flow, integration points |
| **Product & Domain** | [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) | Product scope, 3-member team ownership, legal guardrails |
| **Agent Guardrails** | [AGENTS.md](file:///Users/kunalsuryanshi/Documents/axiom/AGENTS.md) | Bounded task rule, Git safety, verification protocol |
| **Task Tracker** | [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md) | 7-phase group roadmap and task board |
| **API Contracts** | [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md) | Request/response schemas for Frontend, Backend, and AI |
| **Developer Guide** | [README.md](file:///Users/kunalsuryanshi/Documents/axiom/README.md) & [docs/DEVELOPMENT.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DEVELOPMENT.md) | Setup, verified commands, and local workflow |

---

## 2. Technical Stack & Key Decisions

- **Frontend (`frontend/`):** React 19.3.1, TypeScript 6.0.3, Vite 8.3.5, Tailwind CSS v4.3.3 (`@tailwindcss/vite`). Configured with `envDir: '../'` in `frontend/vite.config.ts` to share unified root environment configuration.
- **Routing:** Hash-based deep link routing (`#/<route>?doc=<id>`) implemented in `frontend/src/App.tsx`. This ensures seamless bookmarking and page navigation on local preview servers without requiring backend URL rewrite configuration.
- **Service Layer Pattern:** All UI screens interact exclusively with `contractService` (`frontend/src/services/contractService.ts`). When backend endpoints are live, switching `VITE_USE_MOCK_DATA=false` connects directly to the REST API with zero UI component changes.
- **Backend (`backend/`):** FastAPI + PostgreSQL 16 + SQLAlchemy 2.0 with Alembic migrations, cross-tenant isolation, and 21 automated tests.
- **AI Engine (`ai/`):** Dedicated directory reserved and scaffolded (`ai/.gitkeep`) for Member 3's prompt engineering and extraction pipeline.
- **Verification Gate:** `./scripts/verify.sh` executes Oxlint (0 warnings policy), Vitest (9 passing tests), TypeScript build (`tsc -b && vite build`), and Pytest (20 passing tests).

---

## 3. Known Pitfalls & Implementation Conventions

1. **Environment Variable Visibility:** In Vite, only variables prefixed with `VITE_` are exposed to the browser client. Never place AI API keys (`AI_API_KEY`), database passwords, or JWT secrets in `VITE_` variables. Server secrets belong strictly in server-side configuration.
2. **React Render Purity:** Linters flag calling impure constructors (like `new Date()`) directly inside component render bodies. Use module-level constants or compute dates in `useEffect` / handlers.
3. **Tailwind v4 Setup:** Tailwind v4 uses CSS `@theme` declarations inside `frontend/src/index.css` rather than a `tailwind.config.js` file.
4. **Oxlint Unused Variables:** Unused function parameters required by an interface must be prefixed with an underscore (e.g. `_template: ContractTemplate`).
5. **No Redundant Directories:** The starter directory `axiom_project_essentials/` was removed to eliminate confusion and establish single-source-of-truth documentation at the root.
6. **Backend Pytest Execution:** Backend tests require `PYTHONPATH=.` when executed from the repository root because test fixtures import `backend.app...`.

---

## 4. Update Log

- **2026-10-25 (Repository Reorganization & Clean Modular Architecture):** Safely reorganized repository into clean, modular structure before AI pipeline development begins. Moved React 19 frontend into `frontend/` (`public/`, `src/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.oxlintrc.json`). Kept existing production FastAPI backend in `backend/` completely untouched. Initialized dedicated empty `ai/` directory with `.gitkeep` for Member 3. Consolidated technical documentation and design assets (`docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/stitch-reference/`, `docs/Axiom_AI_Member_3_Master_Prompt.pdf`) under `docs/`. Preserved essential root-level context files (`AGENTS.md`, `README.md`, `CONTEXT.md`, `MEMORY.md`, `TASKS.md`, `.gitignore`, `.env.example`). Configured `frontend/vite.config.ts` with `envDir: '../'`. Updated `./scripts/verify.sh` to run frontend and backend checks from their respective directories. Verified all 4 checks pass: Oxlint (0 warnings, 0 errors), Vitest (9/9 passed), TypeScript build (`frontend/dist/`), and Pytest (20 passed).

- **2026-10-24 (Member 2 Complete Backend Implementation):** Built, verified, and integrated the complete production-minded FastAPI + PostgreSQL backend under `backend/`. Implemented SQLAlchemy 2.0 models (`User`, `Document`, `Analysis`, `ClauseFinding`), Alembic migrations with zero-to-head initialization and rollback verification, opaque private local file storage with path traversal protection, multi-format text extraction (`pypdf`, `python-docx`), heuristic & AI contract intelligence engine, and complete REST API endpoints fully matching `docs/API.md` and frontend contracts. Enforced cross-user tenant isolation, Argon2id password hashing, and leak-safe error responses. Built 21-test automated suite covering auth, uploads, analysis, isolation, storage, and live PostgreSQL integration. Integrated backend tests into `./scripts/verify.sh` with 100% passing results across Oxlint, Vitest, TypeScript build, and Pytest.

- **2026-10-24 (Post-Implementation Verification & Live Integration):** Independently verified entire backend implementation. Confirmed PostgreSQL 16 container running (`axiom-postgres`), Alembic migrations clean on isolated fresh database (zero-to-head and rollback), all 21 pytest tests passing. Ran `verify_live_api.py` against live FastAPI server (`uvicorn`): **62/62 end-to-end checks passed** covering health, auth (register, login, JWT, 409 duplicate rejection, 401 invalid credentials), user profile CRUD with PostgreSQL persistence, document upload (201, UUID storage key, private local storage), empty/unsupported file rejection, document listing with `documents`/`totalCount` schema, complete cross-user security isolation (5 isolation checks), contract analysis (4 clauses, riskCounts H/M/L), clause reviewed/bookmarked PATCH persistence and toggle, compare endpoint returning 4 structured diffs (`changeType`, `section`, `clauseTitle`, `severity`), 204 deletion, DB cleanup (404), and filesystem cleanup. Discovered that `storageKey` is intentionally server-side only (not exposed in API response), and duplicate email returns 409 Conflict. Frontend confirmed wired to live backend via `VITE_USE_MOCK_DATA=false` env flag. `npm run verify` passes all 4 stages: Oxlint 0 warnings, Vitest 9 tests, Vite build, Pytest 21 tests.

- **2026-10-24 (Organization & Foundation):** Completed comprehensive project organization for 3-member team. Removed redundant `axiom_project_essentials/` folder. Created `TASKS.md`, `scripts/verify.sh`, and `docs/WORKFLOW.md`. Updated `README.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `AGENTS.md`, and `docs/API.md`. Cleaned all lingering Oxlint warnings across pages to achieve 0 warnings and 0 errors on `npm run verify`.

- **2026-10-22 (Bootstrap & Skills):** Discovered and loaded design taste skills (`design-taste-frontend`, `gpt-taste`, `stitch-design-taste`). Verified all 8 canonical screens.
