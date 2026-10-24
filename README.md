# Axiom — Contract Intelligence for Independent Professionals

> Intelligent contract analysis, risk detection, and counter-proposal generation designed for freelancers, boutique creative agencies, and independent software engineers.

---

## Overview

Axiom helps independent professionals understand complex legal contracts before signing. It evaluates agreements against commercial contracting benchmarks, flagging dangerous terms such as uncapped indemnities, broad pre-existing intellectual property expropriation, unilateral non-competes, and delayed payment terms.

The visual direction follows a warm, restrained editorial design system (warm ivory `#F7F4EE`, surface `#FFFDFA`, borders `#E6E0D6`, near-black `#1C1B19`, Newsreader editorial serif, and Inter UI sans-serif) inspired by modern legal-tech references and approved Google Stitch designs.

---

## Project Status

- **Frontend:** **Completed & Verified.** All 8 canonical product screens are fully functional, responsive, and connected via hash-based deep linking.
- **Service Layer:** High-fidelity in-memory mock service active (`src/services/contractService.ts`), providing realistic 4-stage enclave analysis simulation, side-by-side legal diffing, and user settings persistence.
- **Backend (Proposed):** Prepared for implementation by Member 2 (FastAPI / Express API endpoints and persistence layer).
- **AI/ML Module (Proposed):** Prepared for implementation by Member 3 (clause extraction, risk severity classification, plain-English synthesis, and counter-proposal generation).
- **CI/CD Quality:** `npm run verify` passes with **0 warnings, 0 errors** on Oxlint, **8/8 passing tests** on Vitest, and a clean TypeScript build.

---

## Canonical Screen Directory

| # | Screen | Route | Description |
|---|---|---|---|
| 1 | **Public Landing** | `#/landing` | Product overview, interactive clause preview, zero-training privacy guarantee, FAQ |
| 2 | **Dashboard** | `#/dashboard` | Overview of analyzed agreements, telemetry metrics, recent documents, template launcher |
| 3 | **Analyze Contract** | `#/analyze` | Drag-and-drop contract upload with real-time 4-stage enclave analysis simulation |
| 4 | **Analysis Results** | `#/results?doc=<id>` | 3-column workspace with risk filters, highlighted contract viewer, and plain-English clause breakdown |
| 5 | **Analysis Report** | `#/report?doc=<id>` | Formal executive summary audit sheet with print styling and PDF export |
| 6 | **Compare Documents** | `#/compare` | Side-by-side legal diffing tool distinguishing insertions, deletions, and contractual conflicts |
| 7 | **Document History** | `#/history` | Searchable contract audit repository with severity counters and review filters |
| 8 | **Settings & Profile** | `#/settings` | Liability calibration preferences, analysis tone settings, and data retention controls |

---

## Technology Stack

### Frontend Application
- **Runtime & Framework:** React 19.3.1 + TypeScript 6.0.3
- **Build System:** Vite 8.3.5
- **Styling:** Tailwind CSS v4.3.3 (`@tailwindcss/vite`) + Custom Design Tokens
- **Icons & Motion:** Lucide React 1.61.0, Motion 14.5.0
- **Linter & Code Quality:** Oxlint 1.88.0 (configured with 0-warning policy)
- **Test Framework:** Vitest 5.0.5

### Team & Architecture Target
- **Monorepo / Clean Architecture:** Decoupled service interfaces so the frontend seamlessly transitions from the current mock mode (`VITE_USE_MOCK_DATA=true`) to live backend endpoints (`VITE_USE_MOCK_DATA=false`).

---

## Prerequisites

- **Node.js:** `>= 18.0.0` (Node.js 20+ recommended)
- **npm:** `>= 9.0.0`
- **Git**

---

## Quick Start & Local Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd axiom
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   *Note: In development, `VITE_USE_MOCK_DATA=true` by default, allowing full frontend exploration without an external backend service.*

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:5173/](http://localhost:5173/).

---

## Verified Commands

All commands are tested and verified for this repository:

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server on port 5173 |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles production assets |
| `npm run lint` | Runs Oxlint static code analysis (zero-warning policy) |
| `npm test` | Runs Vitest regression test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run preview` | Serves the production build locally on port 4173 |
| `npm run verify` | Runs full pre-merge verification (`./scripts/verify.sh`) |

---

## Team Ownership Boundaries

| Role | Member | Primary Domain | Next Objectives |
|---|---|---|---|
| **Member 1** | Frontend, Integration & QA | `src/`, UI Components, State, E2E | Connect live API when available, maintain UI fidelity, E2E tests |
| **Member 2** | Backend & Database | `backend/`, API, Schemas, Auth | Scaffold backend service, implement upload/analysis API, database schema |
| **Member 3** | AI/ML & Intelligence | `ai/`, Model Pipeline, Prompts | Document extraction, clause classification, structured JSON output |

*See [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) and [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) for full collaboration rules.*

---

## Documentation Index

- [AGENTS.md](file:///Users/kunalsuryanshi/Documents/axiom/AGENTS.md) — Coding agent rules, bounded task instructions, and safety guardrails.
- [ARCHITECTURE.md](file:///Users/kunalsuryanshi/Documents/axiom/ARCHITECTURE.md) — System boundaries, data flow diagrams, and integration points.
- [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) — Product domain concepts, group ownership, and constraints.
- [DESIGN.md](file:///Users/kunalsuryanshi/Documents/axiom/DESIGN.md) — Canonical 8-screen design system, tokens, and Stitch fidelity rules.
- [MEMORY.md](file:///Users/kunalsuryanshi/Documents/axiom/MEMORY.md) — Durable project knowledge, verified decisions, and non-secret discoveries.
- [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md) — Prioritized 7-phase group development roadmap.
- [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md) — Proposed API contract specification and request/response schemas.
- [docs/DEVELOPMENT.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DEVELOPMENT.md) — Development setup, commands, and environment rules.
- [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) — Git workflow, branching conventions, and PR review standards.
- [docs/TESTING.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/TESTING.md) — Testing strategy and visual verification guidelines.
