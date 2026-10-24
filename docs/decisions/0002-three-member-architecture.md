# ADR 0002: Three-Member Team Ownership & Decoupled Service Architecture

- **Status:** Accepted
- **Date:** 2026-10-24
- **Deciders:** Axiom Team (Member 1, Member 2, Member 3)

---

## Context
Axiom is evolving from a completed frontend prototype with mock services into an integrated production application developed collaboratively by three team members:
- Member 1: Frontend, Integration & QA
- Member 2: Backend & Database
- Member 3: AI/ML & Intelligence

We need a clear architectural boundary that allows Member 2 and Member 3 to build their systems in parallel without breaking the completed frontend or causing merge conflicts in shared repositories.

---

## Alternatives Considered

1. **Option A: Monolithic Full-Stack Rewrite (Node/Next.js)**
   - *Pros:* Single language (TypeScript) throughout.
   - *Cons:* Would require throwing away and rebuilding the completed React 19 + Vite frontend. Violates non-negotiable project rules. AI libraries (PyMuPDF, pdfplumber, advanced evaluation frameworks) are heavily Python-centric.
2. **Option B: Moving Frontend into `frontend/` Subdirectory immediately**
   - *Pros:* Aesthetic folder symmetry (`frontend/`, `backend/`, `ai/`).
   - *Cons:* High risk of breaking active IDE workspaces, dev server paths, lockfiles, and imports. Requires reinstalling dependencies and altering configuration without architectural benefit.
3. **Option C: Decoupled Service Layer with Target Micro-Directory Allocation (Selected)**
   - *Pros:* Keeps the completed frontend intact at root (`src/`), isolates API communication behind `contractService.ts`, allocates `backend/` for Member 2 and `ai/` for Member 3, and establishes a single frozen API contract (`docs/API.md`).

---

## Decision
We select **Option C**:
1. The completed React 19 frontend remains intact in `src/`.
2. All contract and analysis calls are routed through `src/services/contractService.ts`, which toggles between in-memory mock mode and live backend requests via `VITE_USE_MOCK_DATA`.
3. Member 2 develops the backend in `backend/` adhering to `docs/API.md`.
4. Member 3 develops the AI pipeline in `ai/` outputting validated JSON matching `src/types/contract.ts`.
5. Pre-merge quality is enforced via `npm run verify` (`scripts/verify.sh`).

---

## Consequences
- **Positive:** Zero risk of breaking the completed frontend during backend/AI scaffolding.
- **Positive:** Team members can work independently on feature branches without stepping on each other's code.
- **Positive:** Seamless toggle between mock and live data enables rapid debugging.
- **Negative:** Requires team discipline to keep `docs/API.md` and `src/types/contract.ts` synchronized when schemas evolve.
