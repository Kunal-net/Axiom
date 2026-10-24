# Axiom — Product and Domain Context

## Product Summary
Axiom is intended to help users understand contracts through AI-assisted contract analysis, risk identification, document comparison, and structured reporting. The implementation must follow the approved Stitch screens and any existing product specifications.

## User-Facing Areas
1. **Public landing page:** explains the product and directs visitors to relevant next steps.
2. **Dashboard:** starting point for document and analysis activity.
3. **Analyze contract:** select/upload a contract and initiate analysis.
4. **Analysis workspace:** inspect analysis status, findings, supporting clauses, and recommendations.
5. **Compare documents:** compare two contracts or versions and inspect meaningful changes.
6. **Analysis report:** review a structured report and print/export it when supported.
7. **Document history:** search and revisit previously processed documents and analyses.
8. **Settings/profile:** manage supported profile and application preferences.

## Domain Concepts
These are conceptual definitions for consistent naming. Confirm exact fields and business rules against the existing backend/API before implementation.

- **Contract:** a document containing contractual terms.
- **Document:** a stored or selected file. A contract may be represented by one or more document versions.
- **Analysis:** a processing run that evaluates a document according to the capabilities actually provided by the backend.
- **Finding:** an issue, observation, or risk identified by an analysis. Genuine findings require actual analysis output.
- **Clause:** a relevant section or passage of a contract, ideally tied to a page, heading, or source excerpt when available.
- **Risk severity:** a classification such as High, Medium, or Low, only if supported by product logic.
- **Report:** a structured presentation of analysis results.
- **Comparison:** a representation of differences between two documents or versions.

## Product Integrity Rules
- Clearly identify demo/mock data in development.
- Never display fabricated findings as if produced by a real model or backend.
- Avoid promising legal advice or guaranteed correctness unless approved product requirements explicitly support such claims.
- Make uncertainty and unavailable functionality clear to users.
- Do not invent supported file types, upload limits, retention policies, privacy guarantees, or integrations. Verify these from actual implementation/specifications.

## User Journeys to Support
- Visitor → landing page → authentication/onboarding if implemented.
- User → dashboard → upload contract → analysis status → findings → report.
- User → compare documents → inspect differences.
- User → history → reopen an existing document or analysis.
- User → settings → edit supported preferences → save or cancel.

## Open Questions to Verify
- Authentication provider and session model.
- Actual API endpoints and response schemas.
- Supported upload formats and maximum file size.
- Analysis execution model (synchronous, polling, streaming, or background job).
- Document persistence and storage policy.
- Export formats and backend support.
- Exact severity taxonomy and scoring rules.
- Account, notification, and security settings supported by the backend.
