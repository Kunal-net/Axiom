# ADR 0003: Safely Reorganizing Repository into Modular Frontend, Backend, and AI Directories

- **Status:** Accepted
- **Date:** 2026-10-25
- **Deciders:** Axiom Team (Member 1, Member 2, Member 3)

---

## Context
With the frontend (Member 1) completed and verified, and the backend application (Member 2) completed and verified with 21 automated tests, the team is preparing to build the AI/ML intelligence pipeline (Member 3).

To ensure clean isolation, maintainability, and clear ownership boundaries across the 3 domains, the repository needs a structured organization where:
- Frontend code and configuration live in `frontend/`.
- Backend code and configuration remain in `backend/`.
- AI/ML pipeline code lives in `ai/`.
- Project documentation is centralized in `docs/`.
- Shared CI/CD scripts live in `scripts/`.
- Root remains minimal with essential project context and configuration files.

---

## Decision
1. **Frontend Reorganization:**
   - Moved all client code (`src/`, `public/`, `index.html`) into `frontend/`.
   - Moved client tooling (`package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.oxlintrc.json`) into `frontend/`.
   - Configured `frontend/vite.config.ts` with `envDir: '../'` so the frontend reads the root `.env` without duplicating secret/env templates.
   - Configured `frontend/package.json` with `"verify": "../scripts/verify.sh"`.
2. **Backend Preservation:**
   - Maintained `backend/` in place with zero modifications to application logic, database models, or security mechanisms.
   - Preserved `backend/tests/` and test runner configuration (`PYTHONPATH=.`).
3. **AI Pipeline Reservation:**
   - Initialized `ai/` with `.gitkeep` to track the directory for Member 3's upcoming implementation.
4. **Documentation Centralization:**
   - Consolidated `ARCHITECTURE.md`, `DESIGN.md`, `stitch-reference/`, and `Axiom_AI_Member_3_Master_Prompt.pdf` into `docs/`.
   - Retained essential root files: `AGENTS.md`, `README.md`, `CONTEXT.md`, `MEMORY.md`, `TASKS.md`, `.gitignore`, `.env.example`.
5. **Unified Verification:**
   - Updated `scripts/verify.sh` to run frontend checks (`npm --prefix frontend run lint`, `npm --prefix frontend test`, `npm --prefix frontend run build`) and backend tests (`PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -q`).

---

## Consequences
- **Positive:** Clear, modular symmetry (`frontend/`, `backend/`, `ai/`) preventing path collisions between team members.
- **Positive:** Preserves 100% of completed frontend and backend functionality with zero regression.
- **Positive:** All verification checks pass (`./scripts/verify.sh` executes 4 stages cleanly).
- **Positive:** AI development in `ai/` can commence without touching frontend or backend files.
