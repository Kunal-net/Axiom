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

- **2026-10-24 (Organization & Foundation):** Completed comprehensive project organization for 3-member team. Removed redundant `axiom_project_essentials/` folder. Created `TASKS.md`, `scripts/verify.sh`, and `docs/WORKFLOW.md`. Updated `README.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `AGENTS.md`, and `docs/API.md`. Cleaned all lingering Oxlint warnings across pages to achieve 0 warnings and 0 errors on `npm run verify`.
- **2026-10-22 (Bootstrap & Skills):** Discovered and loaded design taste skills (`design-taste-frontend`, `gpt-taste`, `stitch-design-taste`). Verified all 8 canonical screens.
