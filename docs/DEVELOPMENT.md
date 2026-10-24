# Axiom — Local Development Guide

> Quickstart instructions and verified commands for the three-member development team.

---

## 1. Quickstart (Frontend Client)

Axiom's frontend is fully implemented in React 19 + TypeScript + Vite. It runs locally with in-memory mock data out of the box.

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (http://localhost:5173)
npm run dev

# 3. Run the full verification pipeline (Lint + Unit Tests + Type Build)
npm run verify
```

---

## 2. Command Index

All scripts are defined in [package.json](file:///Users/kunalsuryanshi/Documents/axiom/package.json) and verified in CI:

| Command | Purpose | Verification Status |
|---|---|---|
| `npm run dev` | Starts Vite dev server on `http://localhost:5173` | **Verified** (Fast HMR active) |
| `npm run verify` | Runs `./scripts/verify.sh` (Oxlint + Vitest + Build) | **Verified** (0 warnings, 8/8 tests, 0 build errors) |
| `npm run lint` | Runs Oxlint across all TypeScript and TSX files | **Verified** (0 warnings, 0 errors) |
| `npm test` | Runs Vitest unit and service tests | **Verified** (8/8 tests pass) |
| `npm run test:watch` | Runs Vitest in interactive watch mode | Available |
| `npm run build` | Compiles TypeScript (`tsc -b`) and generates production bundle (`dist/`) | **Verified** (build in ~310ms) |
| `npm run preview` | Previews production build locally | Available |

---

## 3. Environment Configuration

The frontend configuration is managed via `.env` (derived from safe template [.env.example](file:///Users/kunalsuryanshi/Documents/axiom/.env.example)):

```ini
# Base URL for backend REST API (when live)
VITE_API_BASE_URL=http://localhost:8000

# Toggle between in-memory mock data (true) and live backend (false)
VITE_USE_MOCK_DATA=true

# Public application metadata
VITE_APP_TITLE=Axiom — Contract Intelligence for Independent Professionals
```

> [!IMPORTANT]
> In Vite, only variables prefixed with `VITE_` are exposed to the client bundle. Never store backend database passwords, AI vendor API keys, or private JWT secrets in frontend `.env` files.

---

## 4. Multi-Member Directory Boundaries

- **Member 1 (Frontend, Integration & QA):** Works in `src/`, `src/pages/`, `src/components/`, `src/services/contractService.ts`.
- **Member 2 (Backend & Database):** Scaffolds and works in `backend/` adhering to [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md).
- **Member 3 (AI/ML & Intelligence):** Scaffolds and works in `ai/` adhering to schemas in [src/types/contract.ts](file:///Users/kunalsuryanshi/Documents/axiom/src/types/contract.ts).

See [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) for full branch naming and review guidelines.

