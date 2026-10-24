# Axiom

Axiom is an AI-powered contract intelligence and analysis platform. This repository is intended to implement the approved eight-screen Stitch experience as a functional frontend, integrated with available backend services.

## Start Here
1. Read `AGENTS.md` for coding-agent rules.
2. Read `MEMORY.md` for current project knowledge.
3. Read `CONTEXT.md` for product/domain concepts.
4. Read `ARCHITECTURE.md` for system structure.
5. Read `DESIGN.md` for the approved visual direction.
6. Follow `docs/DEVELOPMENT.md` for environment setup.

## Design Reference
https://stitch.withgoogle.com/projects/17845469504253765522

## Setup
This repository's actual stack and scripts must be verified before running commands. Do not assume that a frontend or backend is already configured.

See:
- `docs/DEVELOPMENT.md` — install and run
- `docs/API.md` — verified API contracts and integration status
- `docs/TESTING.md` — checks and verification
- `docs/ROADMAP.md` — remaining work

## Environment Variables
Use `.env.example` as the template for local configuration. Never commit real secrets. Frontend-prefixed variables (for example `VITE_*`) are public and must not contain secrets.

## Project Status
The existence of these documents does not prove that screens, APIs, tests, or services are implemented. Check the code and current verification results before reporting status.
