# Axiom — Project Memory

> Purpose: durable, concise project knowledge for future development sessions.
> Update this file after substantial implementation work. Do not store secrets.

## Product
Axiom is an AI-powered contract intelligence and analysis platform. Its intended experience includes a public landing page and authenticated workflows for contract uploads, analysis, risk findings, document comparison, reports, document history, and settings.

## Source of Truth
- **Visual source of truth:** approved Google Stitch designs and `DESIGN.md`.
- **Technical source of truth:** the actual repository, existing implementation, and verified configuration.
- **Agent workflow:** `AGENTS.md`.
- **Product/domain concepts:** `CONTEXT.md`.
- **Technical structure and data flow:** `ARCHITECTURE.md`.

Stitch reference supplied for the project:
https://stitch.withgoogle.com/projects/17845469504253765522

## Canonical Screens
1. Public landing page
2. Dashboard
3. Analyze contract
4. Analysis workspace/results
5. Compare documents
6. Analysis report
7. Document history
8. Settings and profile

## Confirmed Design Direction
The approved direction is a restrained, editorial contract-intelligence product rather than a generic SaaS template. The supplied design prompt specifies these starting tokens, subject to verification against the existing `DESIGN.md` and Stitch designs:
- Warm ivory: `#F7F4EE`
- Primary surface: `#FFFDFA`
- Borders/dividers: `#E6E0D6`
- Near-black primary buttons: `#1C1B19`
- Editorial headings: DM Serif Display or Newsreader, as supported by the design
- Interface text: Inter

Do not treat these tokens as a substitute for inspecting the actual designs.

## Current Implementation Status
- **Stack Verified:** React 19.3.1, Vite 8.3.5, TypeScript 6.0.3, Tailwind CSS v4.3.3 (@tailwindcss/vite), Motion 14.5.0, Lucide React 1.61.0.
- **Verification Suite:**
  - `npm run lint` (`oxlint`): 0 warnings, 0 errors.
  - `npm test` (`vitest`): 8/8 passing tests covering environment validation and contract service.
  - `npm run build` (`tsc -b && vite build`): succeeds with clean production bundle.
- **Downloaded Skills Discovered & Applied:**
  - `design-taste-frontend` & `stitch-design-taste`: warm ivory palette (`#F7F4EE`, `#FFFDFA`, `#E6E0D6`), double-bezel cards, whisper shadows, restrained editorial typography (Newsreader + Inter).
  - `gpt-taste`: strict wide container heroes, zero-AI-purple aesthetic, explicit evidence-backed contract excerpts, zero emoji pollution.
  - `motion`: spring-based tactile feedback, smooth route and modal transitions, respect for `prefers-reduced-motion`.
- **Screen Inventory:**
  1. `#/landing` — Public landing page with live interactive clause demo and zero-training guarantees.
  2. `#/dashboard` — Contract intelligence workspace with recent documents, telemetry metrics, and template launcher.
  3. `#/analyze` — Drag-and-drop upload zone with realistic 4-stage enclave processing simulation.
  4. `#/results` — 3-column analysis workspace: severity filters, source clause document viewer, and plain-English breakdown with suggested redlines.
  5. `#/report` — Formal printable/exportable contract audit report with executive scorecard and legal disclaimer.
  6. `#/compare` — Side-by-side legal diffing tool distinguishing insertions, deletions, and potential contractual conflicts.
  7. `#/history` — Searchable document repository and audit log with status and severity filters.
  8. `#/settings` — Preferences for liability calibration, analysis tone, data retention policies, and security alerts.
- **Backend & Mock State:** Operating in self-contained mock service mode (`VITE_USE_MOCK_DATA=true`) via `src/services/contractService.ts`. Live backend endpoints remain unconfigured pending backend service deployment.

## Non-Negotiable Rules
- Inspect before modifying; preserve existing working architecture and user work.
- Use downloaded/installed relevant skills: discover them, read their instructions, and apply them. In particular, check whether `design-taste-frontend`, `gpt-taste`, and `motion`/motion-kit are actually available.
- Do not claim a skill, test, API integration, or visual comparison was used/performed unless it was.
- Never present mock contract findings as real AI-generated results.
- Do not invent API endpoints, credentials, database schemas, or production configuration.
- Keep secrets out of Git, browser bundles, logs, and documentation.
- Update this file and the relevant docs after significant changes.
- Distinguish implemented, tested, integrated, and production-ready states.

## Update Log
- **2026-10-24:** Complete verification of all 8 canonical screens. Resolved all 70 linter warnings across component imports, react render purity, and routing hooks to reach 0 errors and 0 warnings on `oxlint`. Successfully validated full test suite (8 passing tests) and verified dev server at `http://localhost:5173/`. Discovered and documented active skills in `~/.agents/skills/`.

