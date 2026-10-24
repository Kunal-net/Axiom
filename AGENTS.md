# Axiom — Coding Agent Instructions

## Before Making Changes
1. Read `MEMORY.md`, `CONTEXT.md`, `ARCHITECTURE.md`, and `DESIGN.md` (if present).
2. Read relevant README/setup docs and repository-specific agent instructions.
3. Inspect the actual files and Git status before editing.
4. Discover relevant downloaded/installed skills, read their instructions, and apply them. Check for `design-taste-frontend`, `gpt-taste`, and `motion`/motion-kit if those names are available in the environment.
5. Confirm the current stack and preserve working architecture.

## Product and Design Rules
- The approved Stitch designs are the visual source of truth.
- Implement all eight canonical Axiom screens and connect them with functional navigation.
- Follow existing design tokens and `DESIGN.md`; do not replace the design with a generic SaaS template.
- Verify the rendered application against Stitch when browser/screenshot tooling is available.
- Do not claim visual verification unless screenshots were actually reviewed.

## Engineering Rules
- Use existing conventions and package manager.
- Prefer typed interfaces and schemas; avoid `any` where practical.
- Reuse shared components without overengineering.
- Every visible interactive control must work or clearly indicate why it is unavailable.
- Implement loading, empty, success, and error states.
- Keep mock data/services isolated and clearly labeled.
- Do not invent API endpoints, credentials, schemas, or product capabilities.
- Do not overwrite existing work or remove files without inspecting their purpose.
- Keep secrets out of source code, client bundles, logs, and Git.
- Never claim tests, integrations, or builds passed unless they were run.

## Environment Setup
- Inspect existing setup before generating starter files.
- Create/maintain `.env.example` with safe placeholders and documentation.
- Ensure `.env`, `.venv/`, dependency directories, caches, and build outputs are appropriately ignored.
- Use `.venv` only when Python backend/tooling requires it.
- Keep package manifests and lockfiles consistent.
- Document exact install, run, lint, test, and build commands in `README.md` or `docs/DEVELOPMENT.md`.

## Documentation and Memory
At the beginning of substantial tasks, check whether documentation matches the code.
At the end of substantial tasks:
- Update `MEMORY.md` with durable discoveries, actual status, and blockers.
- Update `ARCHITECTURE.md` when structure/data flow changes.
- Update `CONTEXT.md` when product/domain rules change.
- Update `DESIGN.md` when approved design tokens or component rules change.
- Update API/setup/testing docs when interfaces or commands change.
- Add an ADR for significant architectural decisions, including context, alternatives, decision, and consequences.
Do not turn memory into a transcript. Never store secrets.

## Verification
Run the relevant available checks:
- install/dependency validation where needed;
- lint and type checking;
- unit/integration tests;
- production build;
- browser walkthrough and responsive review where tools are available.
Report exact checks run and their outcomes, including any blockers.

## Completion Report
Summarize implemented work, routes, actual integrations versus mocks, files changed, checks run, and remaining limitations.
