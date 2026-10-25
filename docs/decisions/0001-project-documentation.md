# ADR 0001: Establish Project Knowledge Files

- **Status:** Accepted as a documentation convention
- **Date:** 2026-10-21

## Context
Axiom will be developed across sessions and may be handled by different coding agents. Important product context, architecture, design constraints, and setup knowledge must survive between sessions.

## Decision
Maintain distinct files for:
- `MEMORY.md`: concise evolving project state and durable discoveries.
- `CONTEXT.md`: product goals, domain terms, and business rules.
- `docs/ARCHITECTURE.md`: actual system structure and data flow.
- `docs/DESIGN.md`: approved visual system and Stitch fidelity requirements.
- `AGENTS.md`: mandatory coding-agent workflow and engineering rules.

Keep setup, API, testing, and roadmap details in focused documents under `docs/`.

## Consequences
- Agents have a clear entry point and source of truth.
- Documentation must be kept synchronized with code.
- The architecture and status must be verified against the actual repository; templates must not be mistaken for implementation evidence.
