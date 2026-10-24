# Axiom — Project Memory

> Purpose: Durable, concise project knowledge for future development sessions.
> Update this file after substantial implementation work. Never store secrets.

---

## 1. Source of Truth Matrix

| Domain | Authoritative File | Description |
|---|---|---|
| **Visual Design** | [DESIGN.md](file:///Users/kunalsuryanshi/Documents/axiom/DESIGN.md) & [stitch-reference/](file:///Users/kunalsuryanshi/Documents/axiom/stitch-reference) | Warm ivory palette, Newsreader/Inter typography, 8 approved screens |
| **System Architecture** | [ARCHITECTURE.md](file:///Users/kunalsuryanshi/Documents/axiom/ARCHITECTURE.md) | Boundaries, data flow, integration points |
| **Product & Domain** | [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) | Product scope, 3-member team ownership, legal guardrails |
| **Agent Guardrails** | [AGENTS.md](file:///Users/kunalsuryanshi/Documents/axiom/AGENTS.md) | Bounded task rule, Git safety, verification protocol |
| **Task Tracker** | [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md) | 7-phase group roadmap and task board |
| **API Contracts** | [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md) | Request/response schemas for Frontend, Backend, and AI |
| **Developer Guide** | [README.md](file:///Users/kunalsuryanshi/Documents/axiom/README.md) & [docs/DEVELOPMENT.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DEVELOPMENT.md) | Setup, verified commands, and local workflow |

---

## 2. Technical Stack & Key Decisions

- **Frontend:** React 19.3.1, TypeScript 6.0.3, Vite 8.3.5, Tailwind CSS v4.3.3 (`@tailwindcss/vite`).
- **Routing:** Hash-based deep link routing (`#/<route>?doc=<id>`) implemented in `src/App.tsx`. This ensures seamless bookmarking and page navigation on local preview servers without requiring backend URL rewrite configuration.
- **Service Layer Pattern:** All UI screens interact exclusively with `contractService` (`src/services/contractService.ts`). When backend endpoints are live, switching `VITE_USE_MOCK_DATA=false` connects directly to the REST API with zero UI component changes.
- **Verification Gate:** `npm run verify` (`./scripts/verify.sh`) executes Oxlint (0 warnings policy), Vitest (8 passing tests), and TypeScript build (`tsc -b`).

---

## 3. Known Pitfalls & Implementation Conventions

1. **Environment Variable Visibility:** In Vite, only variables prefixed with `VITE_` are exposed to the browser client. Never place AI API keys (`AI_API_KEY`), database passwords, or JWT secrets in `VITE_` variables. Server secrets belong strictly in server-side configuration.
2. **React Render Purity:** Linters flag calling impure constructors (like `new Date()`) directly inside component render bodies. Use module-level constants or compute dates in `useEffect` / handlers.
3. **Tailwind v4 Setup:** Tailwind v4 uses CSS `@theme` declarations inside `src/index.css` rather than a `tailwind.config.js` file.
4. **Oxlint Unused Variables:** Unused function parameters required by an interface must be prefixed with an underscore (e.g. `_template: ContractTemplate`).
5. **No Redundant Directories:** The starter directory `axiom_project_essentials/` was removed to eliminate confusion and establish single-source-of-truth documentation at the root.

---

## 4. Update Log

- **2026-10-24 (Member 2 Complete Backend Implementation):** Built, verified, and integrated the complete production-minded FastAPI + PostgreSQL backend under `backend/`. Implemented SQLAlchemy 2.0 models (`User`, `Document`, `Analysis`, `ClauseFinding`), Alembic migrations with zero-to-head initialization and rollback verification, opaque private local file storage with path traversal protection, multi-format text extraction (`pypdf`, `python-docx`), heuristic & AI contract intelligence engine, and complete REST API endpoints fully matching `docs/API.md` and frontend contracts. Enforced cross-user tenant isolation, Argon2id password hashing, and leak-safe error responses. Built 21-test automated suite covering auth, uploads, analysis, isolation, storage, and live PostgreSQL integration. Integrated backend tests into `./scripts/verify.sh` with 100% passing results across Oxlint, Vitest, TypeScript build, and Pytest.
- **2026-10-24 (Post-Implementation Verification & Live Integration):** Independently verified entire backend implementation. Confirmed PostgreSQL 16 container running (`axiom-postgres`), Alembic migrations clean on isolated fresh database (zero-to-head and rollback), all 21 pytest tests passing. Ran `verify_live_api.py` against live FastAPI server (`uvicorn`): **62/62 end-to-end checks passed** covering health, auth (register, login, JWT, 409 duplicate rejection, 401 invalid credentials), user profile CRUD with PostgreSQL persistence, document upload (201, UUID storage key, private local storage), empty/unsupported file rejection, document listing with `documents`/`totalCount` schema, complete cross-user security isolation (5 isolation checks), contract analysis (4 clauses, riskCounts H/M/L), clause reviewed/bookmarked PATCH persistence and toggle, compare endpoint returning 4 structured diffs (`changeType`, `section`, `clauseTitle`, `severity`), 204 deletion, DB cleanup (404), and filesystem cleanup. Discovered that `storageKey` is intentionally server-side only (not exposed in API response), and duplicate email returns 409 Conflict. Frontend confirmed wired to live backend via `VITE_USE_MOCK_DATA=false` env flag. `npm run verify` passes all 4 stages: Oxlint 0 warnings, Vitest 9 tests, Vite build, Pytest 21 tests.

- **2026-10-24 (Organization & Foundation):** Completed comprehensive project organization for 3-member team. Removed redundant `axiom_project_essentials/` folder. Created `TASKS.md`, `scripts/verify.sh`, and `docs/WORKFLOW.md`. Updated `README.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `AGENTS.md`, and `docs/API.md`. Cleaned all lingering Oxlint warnings across pages to achieve 0 warnings and 0 errors on `npm run verify`.
- **2026-10-22 (Bootstrap & Skills):** Discovered and loaded design taste skills (`design-taste-frontend`, `gpt-taste`, `stitch-design-taste`). Verified all 8 canonical screens.

