# Axiom — Three-Member Team Collaboration Workflow

> Operational guidelines for collaborative development across Member 1, Member 2, and Member 3.

---

## 1. Domain Ownership Boundaries

To prevent merge conflicts and coordination overhead, each team member has primary ownership over specific directories:

| Member | Primary Domain | Subdirectories / Files Owned |
|---|---|---|
| **Member 1 (Frontend, Integration & QA)** | Frontend UI, Client Services & E2E | `src/pages/`, `src/components/`, `src/services/contractService.ts`, `src/App.tsx`, `index.html` |
| **Member 2 (Backend & Database)** | Server Application, APIs & DB | `backend/`, `backend/routes/`, `backend/models/`, `backend/migrations/` |
| **Member 3 (AI/ML & Intelligence)** | LLM Pipeline, Extraction & Prompts | `ai/`, `ai/pipeline/`, `ai/prompts/`, `ai/eval/` |
| **Shared (Requires Team Sign-Off)** | Core Contracts, Config & Documentation | `src/types/contract.ts`, `docs/API.md`, `.env.example`, `TASKS.md`, `ARCHITECTURE.md` |

---

## 2. Git Branching Strategy

All development branches must be created from `master` and use designated prefixes:

- **Member 1 Branches:** `feature/m1-<feature-name>` (e.g. `feature/m1-live-api-client`, `feature/m1-error-boundaries`)
- **Member 2 Branches:** `feature/m2-<feature-name>` (e.g. `feature/m2-fastapi-scaffold`, `feature/m2-upload-endpoint`)
- **Member 3 Branches:** `feature/m3-<feature-name>` (e.g. `feature/m3-pdf-extractor`, `feature/m3-risk-prompts`)
- **Bug Fixes:** `fix/<bug-description>` (e.g. `fix/analysis-timeout-retry`)

---

## 3. Pull Request & Code Review Protocol

1. **Keep Pull Requests Small:** Aim for PRs under 400 lines of changes. Smaller PRs are reviewed faster and rarely conflict.
2. **Mandatory Pre-Merge Verification:**
   Before pushing a branch or requesting review, run the automated verification pipeline:
   ```bash
   npm run verify
   ```
   A PR must never be merged if `npm run verify` reports errors, test failures, or lint warnings.
3. **Peer Review Rule:**
   - Changes to `src/` must be reviewed by Member 1.
   - Changes to `backend/` must be reviewed by Member 2.
   - Changes to `ai/` must be reviewed by Member 3.
   - Changes to `src/types/contract.ts` or `docs/API.md` require approval from all three members.

---

## 4. Contract Freeze Protocol

To prevent backend and AI development from blocking frontend integration:
1. **Contract Review:** All members review `docs/API.md` and agree on endpoint paths, query parameters, and payload schemas.
2. **Contract Sign-Off:** Once agreed, mark Phase 2 as complete in `TASKS.md`.
3. **Parallel Execution:**
   - Member 1 builds frontend API integration against the agreed contract.
   - Member 2 implements backend endpoints matching the contract.
   - Member 3 implements AI output generators adhering to the contract schema.
4. If a schema change becomes necessary mid-implementation, the proposing member must document the change in `docs/API.md` and notify teammates before altering code.

---

## 5. Resolving Merge Conflicts Safely

If `master` has advanced:
```bash
# 1. Fetch latest updates
git fetch origin

# 2. Rebase feature branch on master
git checkout feature/mX-my-branch
git rebase origin/master

# 3. If a conflict occurs in shared types, consult the teammate owning that domain
# 4. After resolving, re-run verification
npm run verify

# 5. Push updated branch
git push origin feature/mX-my-branch --force-with-lease
```

---

## 6. Security & Environment Safety

- **Never Commit Secrets:** Do not commit `.env` or paste real API keys into code, documentation, or commit messages.
- **Update `.env.example`:** Whenever a new environment variable is introduced, add its safe placeholder and description to `.env.example`.
- **Public vs Private Variables:** In Vite, any variable starting with `VITE_` is bundled and visible to client browsers. Never prefix backend database passwords or private AI keys with `VITE_`.
