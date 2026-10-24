# Axiom — Coding Agent Instructions & Guardrails

> Strict operating instructions for AI coding agents working on the Axiom codebase.
> Always inspect the repository and read this file before making modifications.

---

## 1. Operating Rules & Core Constraints

1. **Complete One Bounded Task at a Time:** Do not start multiple speculative refactors simultaneously. Focus strictly on the assigned objective, verify it, and report completion before proceeding.
2. **Preserve Existing Completed Work:** The frontend in `src/` is complete, verified, and approved. Never rebuild, redesign, or replace working components, styles, or routes.
3. **Inspect Before Modifying:** Always inspect actual files, imports, package manifests, and `git status` before writing or editing code.
4. **Git Safety Guardrails:**
   - **NEVER** run `git commit`, `git push`, `git reset`, or `git checkout -f` unless explicitly requested by the user.
   - Preserve existing Git history, branches, and working tree changes.
   - Prefer minimal, reversible file modifications.
5. **No Secret Leaks:** Never commit `.env` or write API keys, tokens, or credentials into source files, client bundles, documentation, or logs.

---

## 2. Repository Layout & Conventions

```text
axiom/
├── src/                      # Completed React 19 + TypeScript frontend
│   ├── pages/                # 8 canonical screens (Landing, Dashboard, Analyze, Results, Report, Compare, History, Settings)
│   ├── components/           # Reusable UI primitives, layout chrome, and modal dialogs
│   ├── services/             # Typed service layer (contractService.ts) connecting UI to mock/live data
│   ├── config/               # Public environment configuration (env.ts)
│   ├── types/                # Core TypeScript domain models (contract.ts)
│   └── data/                 # Sample benchmark contracts and initial mock fixtures
├── backend/                  # [Proposed] Backend application (FastAPI / Express) — Member 2 domain
├── ai/                       # [Proposed] AI/ML analysis & prompt pipeline — Member 3 domain
├── scripts/                  # Unified verification & maintenance scripts (verify.sh)
├── docs/                     # Detailed technical architecture, API contracts, workflow, and testing docs
├── .env.example              # Safe environment variable template with non-secret placeholders
├── AGENTS.md                 # Agent instructions (this file)
├── README.md                 # Project getting started and developer guide
├── ARCHITECTURE.md           # System boundaries and data flow diagrams
├── CONTEXT.md                # Product domain concepts, team ownership, and constraints
├── DESIGN.md                 # Approved design system and Stitch fidelity specifications
├── MEMORY.md                 # Durable project memory, decisions, and stable conventions
└── TASKS.md                  # Prioritized group task tracker
```

---

## 3. Verified Verification Commands

Always run verification checks after editing code. Zero errors and zero warnings are required.

```bash
# Unified pipeline: runs lint, test, and production build in sequence
npm run verify

# Individual checks
npm run lint         # Oxlint static analysis (0 warnings, 0 errors policy)
npm test             # Vitest unit & regression suite (8 passing tests)
npm run build        # TypeScript compiler (tsc -b) & Vite client bundle
npm run dev          # Start local development server (http://localhost:5173/)
```

---

## 4. Engineering Standards

- **Strict Typing:** Use explicit interfaces and types from `src/types/contract.ts`. Avoid `any`.
- **Component Hygiene:** Ensure every visible interactive control functions or clearly displays an unavailable message with a retry or disabled state.
- **Service Isolation:** Keep mock data isolated behind `contractService.ts`. Never hardcode mock payloads directly inside page components.
- **Render Purity:** Do not invoke impure constructors or non-deterministic functions (e.g. `new Date()`) directly inside component render bodies.
- **Design Token Fidelity:** Strictly adhere to the tokens defined in `DESIGN.md` (warm ivory `#F7F4EE`, surface `#FFFDFA`, border `#E6E0D6`, near-black `#1C1B19`, Newsreader serif, Inter sans-serif). Never introduce generic SaaS purple/blue neon glows.

---

## 5. Documentation & Memory Maintenance

At the start of substantial tasks, check whether documentation matches the current repository state.
At the end of substantial tasks, update:
- `MEMORY.md`: Durable discoveries, runtime facts, and resolved blockers (no transcripts, no secrets).
- `ARCHITECTURE.md`: Any structural changes, service boundaries, or new integration points.
- `TASKS.md`: Mark completed tasks with verified evidence; update next action items.
- `CONTEXT.md`: When domain concepts, constraints, or team assignments evolve.
- `docs/API.md`: When endpoints, schemas, or payload structures change.
- `docs/decisions/`: Add an Architecture Decision Record (ADR) for major technical pivots.

---

## 6. Completion Report Format

When concluding an assigned task, provide a clear, structured summary containing:
1. **Summary of Work:** Concise overview of implemented changes.
2. **Files Changed / Created:** Clickable links to all modified files.
3. **Verification Outcomes:** Exact commands run (`npm run verify`, lint, tests, build) and output status.
4. **Active Limitations:** Any mock modes or pending upstream services.
5. **Recommended Next Steps:** Concrete next tasks for team members.
