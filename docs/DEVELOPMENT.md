# Axiom — Local Development Guide

> Quickstart instructions and verified commands for the three-member development team.

---

## 1. Quickstart (Frontend Client)

Axiom's frontend is fully implemented in React 19 + TypeScript + Vite under `frontend/`. It runs locally with in-memory mock data out of the box.

```bash
# 1. Navigate to frontend directory and install dependencies
cd frontend
npm install

# 2. Start the local development server (http://localhost:5173)
npm run dev

# 3. Run the full verification pipeline from repository root
cd ..
./scripts/verify.sh
```

---

## 2. Command Index

All scripts are defined in [frontend/package.json](file:///Users/kunalsuryanshi/Documents/axiom/frontend/package.json) and verified in CI:

| Command | Working Directory | Purpose | Verification Status |
|---|---|---|---|
| `./scripts/verify.sh` | Repository root | Runs unified 4-stage pipeline (Oxlint + Vitest + Vite Build + Pytest) | **Verified** (0 warnings, 9/9 Vitest, 20 Pytest) |
| `npm run dev` | `frontend/` | Starts Vite dev server on `http://localhost:5173` | **Verified** (Fast HMR active) |
| `npm run build` | `frontend/` | Compiles TypeScript (`tsc -b`) and generates production bundle (`frontend/dist/`) | **Verified** (build in ~360ms) |
| `npm run lint` | `frontend/` | Runs Oxlint across all TypeScript and TSX files | **Verified** (0 warnings, 0 errors) |
| `npm test` | `frontend/` | Runs Vitest unit and service tests | **Verified** (9/9 tests pass) |
| `npm run test:watch` | `frontend/` | Runs Vitest in interactive watch mode | Available |
| `npm run preview` | `frontend/` | Previews production build locally | Available |
| `PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -q` | Repository root | Runs backend automated test suite | **Verified** (20 passing tests) |

---

## 3. Environment Configuration

The application configuration is managed via `.env` at the repository root (derived from safe template [.env.example](file:///Users/kunalsuryanshi/Documents/axiom/.env.example)):

```ini
# Base URL for backend REST API (when live)
VITE_API_BASE_URL=http://localhost:8000

# Toggle between in-memory mock data (true) and live backend (false)
VITE_USE_MOCK_DATA=true

# Public application metadata
VITE_APP_TITLE=Axiom — Contract Intelligence for Independent Professionals
```

> [!IMPORTANT]
> In Vite, only variables prefixed with `VITE_` are exposed to the client bundle. Never store backend database passwords, AI vendor API keys, or private JWT secrets in `VITE_` variables.

---

## 4. Multi-Member Directory Boundaries

- **Member 1 (Frontend, Integration & QA):** Works in `frontend/`, `frontend/src/pages/`, `frontend/src/components/`, `frontend/src/services/contractService.ts`.
- **Member 2 (Backend & Database):** Works in `backend/` adhering to [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md).
- **Member 3 (AI/ML & Intelligence):** Works in `ai/` adhering to schemas in [frontend/src/types/contract.ts](file:///Users/kunalsuryanshi/Documents/axiom/frontend/src/types/contract.ts).

See [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) for full branch naming and review guidelines.
