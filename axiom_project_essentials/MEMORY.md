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
- The project has an approved Stitch design phase for eight screens, according to the project brief.
- Actual repository contents, framework, backend status, routes, tests, and runtime status must be inspected and verified by the implementing agent.
- Do not mark a screen or integration complete without checking the code and, where appropriate, running it.

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
Add dated, concise entries when meaningful project state changes. Record decisions and durable discoveries, not a transcript of every prompt.
