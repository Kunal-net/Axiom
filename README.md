# Axiom — Contract Intelligence for Independent Professionals

> Intelligent contract analysis, risk detection, and counter-proposal generation designed for freelancers, boutique creative agencies, and independent software engineers.

---

## Overview

Axiom helps independent professionals understand complex legal contracts before signing. It evaluates agreements against commercial contracting benchmarks, flagging dangerous terms such as uncapped indemnities, broad pre-existing intellectual property expropriation, unilateral non-competes, and delayed payment terms.

The visual direction follows a warm, restrained editorial design system (warm ivory `#F7F4EE`, surface `#FFFDFA`, borders `#E6E0D6`, near-black `#1C1B19`, Newsreader editorial serif, and Inter UI sans-serif) inspired by modern legal-tech references and approved Google Stitch designs.

---

## Repository Structure

```text
axiom/
├── frontend/                 # React 19 + TypeScript + Vite client application
│   ├── public/               # Static assets & SVG icons
│   ├── src/                  # 8 canonical screens, components, services, and types
│   ├── index.html            # Vite entry point
│   ├── package.json          # Frontend dependencies and npm scripts
│   ├── package-lock.json     # Deterministic frontend lockfile
│   ├── vite.config.ts        # Vite configuration (envDir: '../')
│   ├── tsconfig.json         # TypeScript project configuration
│   └── .oxlintrc.json        # Oxlint configuration (zero-warning policy)
├── backend/                  # Production-ready FastAPI + PostgreSQL backend service
│   ├── app/                  # FastAPI app (routes, models, schemas, services, db)
│   ├── migrations/           # Alembic database migrations
│   ├── tests/                # 21 unit, integration, and security tests
│   ├── requirements.txt      # Python backend dependencies
│   ├── alembic.ini           # Alembic configuration
│   └── README.md             # Backend architecture & developer guide
├── ai/                       # AI/ML contract intelligence pipeline (Member 3 domain)
│   └── .gitkeep              # Ready for AI pipeline development
├── docs/                     # Centralized technical documentation & specifications
│   ├── API.md                # Authoritative REST API contracts and schemas
│   ├── ARCHITECTURE.md       # Multi-tier system architecture and data flow
│   ├── DESIGN.md             # Canonical 8-screen design system & tokens
│   ├── DEVELOPMENT.md        # Local environment and developer workflow guide
│   ├── WORKFLOW.md           # 3-member team Git workflow and PR protocol
│   ├── TESTING.md            # Testing strategy and verification guidelines
│   ├── ROADMAP.md            # Feature roadmap & milestones
│   ├── stitch-reference/     # Stitch HTML reference mockups
│   └── decisions/            # Architecture Decision Records (ADRs)
├── scripts/                  # Project-wide maintenance and CI scripts
│   └── verify.sh             # Unified verification script (Oxlint + Vitest + Vite Build + Pytest)
├── .env.example              # Unified environment variable template (Frontend + Backend)
├── .gitignore                # Root Git ignore rules
├── AGENTS.md                 # Strict coding agent rules & safety guardrails
├── CONTEXT.md                # Product domain context & team ownership
├── MEMORY.md                 # Durable project memory & architectural conventions
├── TASKS.md                  # 7-phase group task tracker & status board
└── README.md                 # Project overview and developer onboarding
```

---

## Project Status

- **Frontend (`frontend/`):** **Completed & Verified.** All 8 canonical product screens are fully functional, responsive, and connected via hash-based deep linking.
- **Service Layer (`frontend/src/services/`):** High-fidelity in-memory mock service active (`contractService.ts`), providing realistic 4-stage enclave analysis simulation, side-by-side legal diffing, and user settings persistence. Seamlessly switches between mock mode (`VITE_USE_MOCK_DATA=true`) and live backend API (`VITE_USE_MOCK_DATA=false`).
- **Backend (`backend/`):** **Completed & Verified.** Production-grade FastAPI service with SQLAlchemy 2.0 ORM, Alembic migrations, PostgreSQL 16 persistence, Argon2id security, cross-tenant isolation, and 21 passing automated tests.
- **AI/ML Pipeline (`ai/`):** **Scaffolded & Ready.** Dedicated directory initialized for Member 3's clause extraction, risk severity classification, plain-English synthesis, and counter-proposal engine.
- **CI/CD Quality:** `./scripts/verify.sh` passes across all 4 verification stages: **0 warnings, 0 errors** on Oxlint, **9/9 passing tests** on Vitest, clean TypeScript production build, and **20 passing tests** on Pytest.

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

### Frontend Application (`frontend/`)
- **Runtime & Framework:** React 19.3.1 + TypeScript 6.0.3
- **Build System:** Vite 8.3.5
- **Styling:** Tailwind CSS v4.3.3 (`@tailwindcss/vite`) + Custom Design Tokens
- **Icons & Motion:** Lucide React 1.61.0, Motion 14.5.0
- **Linter & Code Quality:** Oxlint 1.88.0 (configured with 0-warning policy)
- **Test Framework:** Vitest 5.0.5

### Backend Application (`backend/`)
- **Framework:** FastAPI, Uvicorn, Pydantic v2
- **Database & ORM:** PostgreSQL 16 / SQLite, SQLAlchemy 2.0, Alembic migrations
- **Security:** Argon2id password hashing, JWT bearer tokens, cross-user isolation
- **Document Processing:** Multi-format parser (`pypdf`, `python-docx`)
- **Test Framework:** Pytest 8.3.4 (21 unit, integration, and security tests)

### AI Module Target (`ai/`)
- **Pipeline:** Python-based clause extraction, risk scoring, plain-English synthesis, and diff analysis

---

## Prerequisites

- **Node.js:** `>= 18.0.0` (Node.js 20+ recommended)
- **npm:** `>= 9.0.0`
- **Python:** `>= 3.11` (for backend service)
- **Git**

---

## Quick Start & Local Setup

### 1. Clone & Configure Environment
```bash
git clone <repo-url>
cd axiom
cp .env.example .env
```
*Note: In development, `VITE_USE_MOCK_DATA=true` by default, allowing full frontend exploration without an external backend service.*

### 2. Frontend Setup & Launch
```bash
cd frontend
npm install
npm run dev
```
Open your browser at [http://localhost:5173/](http://localhost:5173/).

### 3. Backend Setup & Launch (Optional for Live API Mode)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Verified Commands

All commands are tested and verified for this repository:

| Command | Action |
|---|---|
| `./scripts/verify.sh` | Runs unified 4-stage pre-merge verification (Oxlint, Vitest, Build, Pytest) |
| `cd frontend && npm run dev` | Starts Vite local development server on port 5173 |
| `cd frontend && npm run build` | Compiles TypeScript (`tsc -b`) and bundles production client assets |
| `cd frontend && npm run lint` | Runs Oxlint static code analysis (zero-warning policy) |
| `cd frontend && npm test` | Runs Vitest regression test suite |
| `cd frontend && npm run preview` | Serves the frontend production build locally on port 4173 |
| `PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -q` | Runs backend 21-test automated suite |

---

## Team Ownership Boundaries

| Role | Member | Primary Domain | Next Objectives |
|---|---|---|---|
| **Member 1** | Frontend, Integration & QA | `frontend/`, UI Components, State, E2E | Connect live API when available, maintain UI fidelity, E2E tests |
| **Member 2** | Backend & Database | `backend/`, API, Schemas, Auth | Scaffold backend service, implement upload/analysis API, database schema |
| **Member 3** | AI/ML & Intelligence | `ai/`, Model Pipeline, Prompts | Document extraction, clause classification, structured JSON output |

*See [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) and [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) for full collaboration rules.*

---

## Documentation Index

- [AGENTS.md](file:///Users/kunalsuryanshi/Documents/axiom/AGENTS.md) — Coding agent rules, bounded task instructions, and safety guardrails.
- [docs/ARCHITECTURE.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/ARCHITECTURE.md) — System boundaries, data flow diagrams, and integration points.
- [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) — Product domain concepts, group ownership, and constraints.
- [docs/DESIGN.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DESIGN.md) — Canonical 8-screen design system, tokens, and Stitch fidelity rules.
- [MEMORY.md](file:///Users/kunalsuryanshi/Documents/axiom/MEMORY.md) — Durable project knowledge, verified decisions, and non-secret discoveries.
- [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md) — Prioritized 7-phase group development roadmap.
- [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md) — REST API contract specification and request/response schemas.
- [docs/DEVELOPMENT.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DEVELOPMENT.md) — Development setup, commands, and environment rules.
- [docs/WORKFLOW.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/WORKFLOW.md) — Git workflow, branching conventions, and PR review standards.
- [docs/TESTING.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/TESTING.md) — Testing strategy and visual verification guidelines.
