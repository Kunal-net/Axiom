# Axiom — Product and Domain Context

## Product Summary
Axiom is an AI-powered contract intelligence and analysis platform designed for independent professionals, freelancers, and boutique agencies. It evaluates commercial contracts (MSAs, SOWs, NDAs, consulting agreements) to detect predatory or disproportionate liabilities—such as uncapped indemnification, broad intellectual property forfeiture, unilateral non-competes, and late-payment lags—and generates plain-English explanations and balanced counter-proposals.

---

## Current Implementation Status

- **Frontend:** **Completed & Verified.** All 8 canonical screens are implemented in React 19 + TypeScript + Vite, using approved Google Stitch design tokens and Newsreader + Inter typography.
- **Service Layer:** High-fidelity in-memory mock service active (`src/services/contractService.ts`), providing realistic 4-stage enclave analysis simulation, side-by-side diff comparisons, and local profile management.
- **Backend & Database:** Pending architecture sign-off and implementation by Member 2.
- **AI/ML Intelligence:** Pending architecture sign-off and implementation by Member 3.

---

## Three-Member Team Ownership System

### Member 1 — Frontend, Integration & QA
*The frontend application is already complete. Member 1 maintains the existing architecture and leads integration.*

**Responsibilities:**
- Maintain and safeguard the completed frontend codebase (`src/`).
- Seamlessly transition `src/services/contractService.ts` from mock mode to live backend REST endpoints.
- Handle authentication sessions, network failures, loading indicators, empty states, and toast notifications.
- Ensure pixel-perfect responsiveness across desktop (1440px), tablet (768px), and mobile viewports.
- Lead end-to-end integration walkthroughs and quality assurance testing.

*Constraint:* Do not rebuild, redesign, or replace the completed frontend.

### Member 2 — Backend & Database
*Member 2 is responsible for the server-side application, API contracts, persistence, and security.*

**Responsibilities:**
- Architect and configure the backend service under `backend/` (FastAPI or Express).
- Implement REST API endpoints matching `docs/API.md` (`/api/v1/documents/*`, `/api/v1/user/*`).
- Design relational database schemas and migration scripts (PostgreSQL or SQLite).
- Implement file upload handling, MIME validation, and the 25 MB file size limit.
- Manage authentication, session tokens, and CORS configuration.
- Write backend automated tests and generate OpenAPI / Swagger documentation.

### Member 3 — AI/ML & Intelligence
*Member 3 is responsible for document parsing, clause extraction, LLM prompt engineering, and evaluation.*

**Responsibilities:**
- Architect the AI/ML pipeline under `ai/` (Python, LangChain, or direct LLM SDKs).
- Extract structured text and page anchors from PDF and DOCX documents.
- Implement clause segmentation and classification into standard categories (`liability`, `payment`, `ip`, `termination`, `warranty`).
- Calibrate risk severity evaluation (`high`, `medium`, `low`, `info`) with ground-truth contract benchmarks.
- Enforce strictly typed JSON responses matching `ClauseFinding` schema (no hallucinated citations or missing fields).
- Implement side-by-side legal diff analysis distinguishing textual edits from true contractual conflicts.
- Guarantee Zero-Data Retention model training compliance.

*Constraint:* Do not invent speculative AI capabilities outside the approved 8-screen scope.

### Shared Group Responsibilities
All three members collaborate on:
1. **API & Data Contracts:** Formal review and freeze of `docs/API.md` before coding starts.
2. **Git Workflow:** Small reviewable pull requests, feature branches (`feature/m1-...`, `feature/m2-...`, `feature/m3-...`), and mandatory verification before merge.
3. **Local Development Setup:** Keeping `.env.example` up to date with non-secret placeholders.
4. **Integration Testing:** Cross-boundary verification between React frontend, Backend endpoints, and AI pipeline.
5. **Security & Privacy:** Ensuring zero secret leaks and enforcing privacy guarantees.

---

## User-Facing Canonical Screens

1. **Public landing page (`#/landing`):** Value proposition, interactive clause breakdown preview, zero-training trust badges, and FAQ.
2. **Dashboard (`#/dashboard`):** Contract intelligence summary, monthly analysis telemetry, primary action cards, and recent documents.
3. **Analyze contract (`#/analyze`):** Secure upload dropzone with 4-stage enclave processing simulation.
4. **Analysis workspace (`#/results?doc=<id>`):** 3-column workspace with risk filters, source document viewer, and plain-English breakdown with suggested redlines.
5. **Analysis report (`#/report?doc=<id>`):** Structured executive summary audit sheet with print styling and PDF export.
6. **Compare documents (`#/compare`):** Side-by-side contract diffing tool distinguishing insertions, deletions, and contractual conflicts.
7. **Document history (`#/history`):** Searchable document repository and audit log with status and severity filters.
8. **Settings & profile (`#/settings`):** User profile, liability threshold calibration, analysis tone, and data retention policies.

---

## Domain Concepts

- **Contract:** A legal document containing binding obligations, representations, warranties, and commercial terms.
- **Document Version:** A specific draft or file of a contract (e.g., Original Client Draft vs Contractor Counter-Proposal).
- **Finding:** A flagged clause categorized by risk severity (`high`, `medium`, `low`, `info`), supported by verbatim original text, plain-English explanation, and suggested revision.
- **Clause:** A distinct section of a contract tied to a section identifier, page number, and category.
- **Diff:** A side-by-side comparison between two contract versions classifying changes as `modified`, `added`, `removed`, or `conflict`.
- **Enclave Simulation:** Realistic 4-stage processing flow: Uploading (25%) → Extracting Structure (55%) → Scanning Risks (85%) → Synthesizing Revisions (100%).

---

## Product Integrity & Legal Guardrails

- **Informational Tooling Only:** Axiom assists freelancers in issue spotting; it does NOT provide formal attorney-client legal representation.
- **Prominent Disclaimer:** Every report and footer must display the legal disclaimer:
  > *"Axiom provides AI-assisted contract analysis for informational purposes only. It does not provide legal advice, attorney-client privileged counsel, or replace formal review by a qualified legal professional licensed in your jurisdiction."*
- **Evidence-Backed Analysis:** AI findings must quote the exact source text and page number. Never display fabricated citations or phantom clauses.
- **Zero-Data Retention:** Contracts must be processed in isolated runtime memory and never used for public LLM fine-tuning or training.
- **Honest States:** If a backend service or AI model is unavailable, display a helpful error or fallback state with clear retry mechanisms.

---

## Open Decisions for Team Alignment

1. **Backend Framework:** FastAPI (Python) vs Express (Node.js/TypeScript). *Recommendation: FastAPI if AI pipeline is Python-based for seamless intra-process or HTTP communication.*
2. **Analysis Processing Architecture:** Synchronous request vs Background Job Queue with status polling (`GET /api/v1/jobs/{id}`) or SSE streaming.
3. **Storage Strategy:** Local filesystem / SQLite for hackathon MVP vs S3 / Supabase for production.
4. **AI Model Selection:** Gemini 1.5 Pro / Flash vs Claude 3.5 Sonnet with structured outputs.
