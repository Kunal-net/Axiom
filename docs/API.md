# Axiom API Contracts

## Status
This file is a template until verified against the actual backend source, API documentation, or running service. Do not treat example routes as real endpoints.

## Integration Inventory
For every real integration, document:
- Service and purpose.
- Base URL configuration variable.
- Authentication/session requirements.
- Actual endpoint and HTTP method.
- Request and response schemas.
- Error responses and retry behavior.
- Upload constraints.
- Analysis job/status behavior.
- Implementation status and verification evidence.

## Contract Upload
Document the actual upload endpoint, multipart field names, supported content types, maximum size, and response shape only after verifying them.

## Analysis
Document the actual create-analysis and status/result interfaces, including whether work is synchronous, polled, streamed, or handled through a background job.

## Documents and Reports
Document actual list/detail/history/compare/export interfaces where they exist.

## Mock Mode
If mock services are used, identify them explicitly, explain how they are enabled, and ensure mock output cannot be mistaken for genuine backend/AI results.

## Security
Never document real secrets or sensitive payloads. Client-side validation does not replace server-side validation.
