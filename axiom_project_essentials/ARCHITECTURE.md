# Axiom — Architecture

## Purpose
Document the architecture that actually exists. This file begins with the intended boundaries and must be updated after repository inspection; do not treat proposed structure as proof of implementation.

## Architectural Principles
- Preserve the current stack and working infrastructure unless there is a clear reason to change it.
- Keep presentation, domain types, and API access separated.
- Use shared layouts and reusable UI primitives.
- Keep backend-dependent behavior behind typed service interfaces.
- Separate mock/development data from real production integrations.
- Validate external data and handle loading, empty, success, and failure states.
- Keep private credentials and server-only configuration out of browser code.

## Intended Frontend Boundaries
Adapt these boundaries to the existing project; do not force a rewrite to match them.

- **Application/bootstrap:** entry point, providers, route setup, global error handling.
- **Layouts:** public layout and authenticated application shell.
- **Pages:** the eight canonical Axiom screens.
- **Shared UI:** buttons, inputs, badges, cards, dialogs, loading states, and empty states.
- **Contract domain components:** upload, document list, risk summary, findings, clause viewer, comparison.
- **Services:** centralized API client and domain-specific contract/analysis calls.
- **Types/schemas:** contract, document, analysis, finding, and report models.
- **Styles:** design tokens, global styles, responsive rules.

## Intended Request/Data Flow
```mermaid
flowchart TD
    U[User] --> UI[React UI / Pages]
    UI --> C[Domain Components]
    C --> S[Typed Service Layer]
    S --> API[Existing Backend API]
    API --> S
    S --> C
    C --> UI
```

This is a conceptual diagram. Modify it if the actual repository uses a different architecture.

## Backend Integration Rules
1. Inspect API documentation, backend routes, and schemas before making requests.
2. Use actual endpoints and response shapes; do not guess endpoint paths.
3. Centralize base URL and request/error handling.
4. Document authentication and credential handling based on the actual implementation.
5. Represent long-running analysis using the backend's real job/status model.
6. If the backend is missing or unavailable, isolate mock services behind the same interface and label mock mode clearly.

## Environment and Configuration
- Frontend public environment variables may be exposed to the browser. In Vite, `VITE_*` values are public; never place secrets there.
- Backend secrets belong only in server-side environment configuration.
- Commit `.env.example`, not real `.env` files.
- Use `.venv` only if Python backend/tooling exists.
- Keep lockfiles and dependency definitions consistent with the selected package manager.

## Security and Reliability
- Validate file type and size on both client and server when uploads exist.
- Do not trust client-side validation as a security boundary.
- Avoid logging contract contents, credentials, or other sensitive data unnecessarily.
- Handle network failures, expired sessions, invalid identifiers, and unavailable services.
- Do not claim authentication, persistence, or access controls work unless verified.

## Repository-Specific Facts to Fill In
After inspection, record:
- Frontend framework/version and package manager.
- Backend framework/version, if present.
- Actual application entry points and route map.
- API base URL configuration and real endpoints.
- Authentication/session strategy.
- Data persistence and file storage.
- Test/lint/build commands.
- Deployment and nested-route behavior.
- Key architecture decisions and rationale.
