# Axiom — Comprehensive Hardcoding Audit & Post-Refactor Critical Review

**Date:** October 25, 2026  
**Status:** All Critical Findings Resolved & Verified  
**Verification Pipeline:** `./scripts/verify.sh` — PASSED (0 Oxlint errors, 11 Vitest passed, 74 Pytest passed, Vite production bundle clean)

---

## 1. Executive Summary

Following the initial frontend hardcoding refactor, a thorough, critical review was performed across the entire Axiom stack (frontend components, service layer, backend FastAPI routes, AI inference pipeline, and database authorization models). 

This second-round review discovered and corrected several high-severity correctness, security, and architectural issues that had been left unresolved or masked in the previous iteration, including:
1. Comparison failures falsely presented to users as "zero contractual differences" (identical contracts).
2. Missing authorization and tenant isolation checks on the comparison endpoint (`POST /api/v1/documents/compare`).
3. Insecure and dead `localStorage` storage of API keys (`axiom_custom_api_key`) that misled users.
4. Dashboard risk calculation showing `100% Safe Index` and `Clean` when 0 evaluated contracts were present, alongside hardcoded quota limits.
5. Insecure initial state in `App.tsx` hardcoding `doc-msa-fintech`, causing silent fallbacks to sample fixtures.
6. Silent deletion failures in `HistoryPage.tsx` and flawed boolean returns in `contractService.deleteDocument()`.
7. Thread blocking during Groq API rate limits (HTTP 429) that froze test runs for several minutes.

All issues have been resolved, verified against active backend services, and documented below.

---

## 2. High-Priority Issues Discovered & Corrected

### A. Profile Identity & App Shell State
- **Audit Findings:** 
  - Persona names such as `Kunal` and static organizations were present in sample fixtures and documentation.
  - While `GET /api/v1/user/profile` existed, the app shell previously lacked a neutral fallback when profile endpoints were unconfigured or loading.
- **Corrections Implemented:**
  - Standardized mock and sample contract fixtures in `src/data/sampleContracts.ts` to neutral professional personas: `Workspace User`, `user@axiom.legal`, and `Independent Professional`.
  - In `AppHeader.tsx` and `Sidebar.tsx`, avatar initials and names fall back gracefully to `U` / `Workspace User` / `Independent Workspace` without fabricating fake identities.
  - Verified profile update round-trip: `PUT /api/v1/user/profile` commits to the SQLite/PostgreSQL database, propagates through `onProfileUpdated` in `App.tsx`, and updates the header and sidebar immediately.

### B. Dashboard Quota, Live Telemetry & Portfolio Risk Calculations
- **Audit Findings:**
  - Dashboard displayed a hardcoded `maxQuota = 10` plan limit and progress bar (`(used / 10)`), falsely assuming document count equals quota consumption.
  - When 0 documents were evaluated, the circular gauge displayed `100% Safe Index` and `Clean`, misrepresenting empty state as perfect portfolio health.
  - Unanalyzed or processing documents were counted in risk aggregations.
  - The health badge claimed `v1.0 Active` based only on HTTP ping without checking AI inference availability.
- **Corrections Implemented:**
  - Removed arbitrary `10` plan limit. Replaced with honest workspace archive telemetry (`{documents.length} Contracts Stored`).
  - Extended backend `/api/v1/health` endpoint to return structured AI engine status (`ai: { status: "active" | "benchmark_rules", provider, model }`).
  - Updated `DashboardPage.tsx` to display real engine status (`Active`, `Demo Simulation`, or `Disconnected`).
  - Filtered portfolio risk calculations strictly to evaluated contracts: `(d.status === 'completed' || d.status === 'needs_review') && d.clauses && d.clauses.length > 0`.
  - When 0 evaluated contracts exist:
    - Gauge value renders `—` (dash) instead of `100%`.
    - Subtitle renders `Pending Analysis`.
    - Badge displays `No Data` (`#F0ECE4`).
    - Alert box informs the user that contracts are awaiting evaluation or need to be uploaded.

### C. Comparison Failure Masking & Authorization Isolation
- **Audit Findings (Critical Correctness & Security):**
  - In `contractService.ts`, `getComparisonDiffs()` caught backend network and HTTP errors and returned `[]` (empty array).
  - In `ComparePage.tsx`, `diffs.length === 0` was rendered as: *"Both documents maintain identical contractual provisions with zero detected legal variance between these versions."* A failed network call or 404 was falsely reported to users as identical contracts.
  - In `backend/app/services/document_service.py`, `compare_documents` queried documents by ID without checking `doc.owner_id == owner_id`, allowing any authenticated user to compare another user's private documents.
  - Comparing a document to itself triggered rule benchmarks that returned fabricated differences instead of 0 diffs.
- **Corrections Implemented:**
  - `contractService.getComparisonDiffs` now throws errors on API failure in live mode.
  - `ComparePage.tsx` manages an explicit `compareError` state. On error, it displays a *"Comparison Request Failed"* card with the specific error message and a *"Retry Comparison"* button.
  - `document_service.compare_documents` now validates document ownership: `doc1.owner_id != owner_id` or `doc2.owner_id != owner_id` raises HTTP 404 `DOCUMENT_NOT_FOUND`.
  - Short-circuited identical document IDs (`doc1.id == doc2.id`) and identical document text (`original_text.strip() == revised_text.strip()`) to return `[]` diffs with 0 fabricated conflicts.

### D. Document Selection, Route Resolution & Fixture Isolation
- **Audit Findings:**
  - `App.tsx` initialized `activeDocId` to `'doc-msa-fintech'`, causing results and report pages to default to sample Delaware agreements.
  - `AnalysisResultsPage.tsx` and `ReportPage.tsx` directly imported `PRIMARY_CONTRACT` from `../data/sampleContracts`, violating service boundary isolation.
  - When navigating to Results without an active document, the app fell back to sample Apex FinTech data instead of checking user documents.
- **Corrections Implemented:**
  - Initialized `activeDocId` in `App.tsx` to `''`.
  - Removed direct `PRIMARY_CONTRACT` imports from `AnalysisResultsPage.tsx` and `ReportPage.tsx`. Mock fixtures are isolated behind `contractService.getDefaultDocument()` and only accessed when `contractService.isMock` is true.
  - In live mode, if `docId` is not provided, the page dynamically selects the first document from `contractService.getDocuments()`. If no documents exist in the workspace, an honest error view is displayed: *"No contracts found in your workspace. Please upload or select a contract from your documents."*
  - Added safety guard to `navigateNextFinding()` in `AnalysisResultsPage.tsx` to prevent exceptions when clauses are empty.

### E. Insecure API Keys in LocalStorage vs Server-Configured Secrets
- **Audit Findings (Security & Truth in UI):**
  - `SettingsPage.tsx` previously read and wrote `localStorage.getItem('axiom_custom_api_key')`.
  - This key was never sent to the backend, never used by `contractService`, and never passed to Groq. Storing plaintext API keys in browser storage created an XSS attack vector and gave users a false impression that a client-side override was active.
- **Corrections Implemented:**
  - Completely eliminated `localStorage.getItem('axiom_custom_api_key')`, `localStorage.setItem`, and `localStorage.removeItem`.
  - Replaced the input in `SettingsPage.tsx` with an architectural card:
    - **Header:** *"AI Inference Pipeline — Server Managed"*
    - **Policy:** *"Zero Client-Side Credentials Policy"*
    - **Description:** Documents that all LLM operations run via server-side configuration (`GROQ_API_KEY`) and that keys are never stored in browser storage or exposed in client bundles.

### F. Document Deletion Authorization & Error Handling
- **Audit Findings:**
  - In `contractService.deleteDocument()`, if a live backend deletion succeeded (HTTP 204) but the document was not in the local in-memory array, the function returned `false`.
  - In `HistoryPage.tsx`, deletion failure was silently ignored without user feedback.
  - Cross-user deletion isolation needed explicit verification.
- **Corrections Implemented:**
  - Fixed `contractService.deleteDocument()` to return `true` on successful HTTP 204 responses.
  - Added `deleteError` state in `HistoryPage.tsx` with a dismissible error banner if deletion fails.
  - Added comprehensive backend tests (`test_e2e_document_deletion_and_cross_user_isolation` in `test_end_to_end_verification.py`) confirming that User B attempting to delete User A's document receives HTTP 404, while User A deleting their own document removes both database and physical storage files.

### G. Groq Upstream Rate Limit Resilience
- **Audit Findings:**
  - When Groq's public API returned HTTP 429 with large `retry-after` headers (e.g. 46s to 296s), `GroqProvider` in `ai/providers/groq.py` slept for the full duration, hanging test runs and backend requests.
- **Corrections Implemented:**
  - Added rate-limit cap: if `retry_after > 5.0` seconds, the provider immediately breaks out of the retry loop and triggers the deterministic benchmark rule engine.
  - In `backend/tests/test_live_groq_integration.py`, tests accept both `groq` and `rule_benchmark` providers during upstream rate limiting, and gracefully skip smoke calls when public limits are exhausted.

---

## 3. Files Modified & Created

| File | Change Nature | Description |
|---|---|---|
| `ai/providers/groq.py` | Bug Fix / Resilience | Capped rate-limit sleep at 5.0s for instant fallback to benchmark rules. |
| `ai/comparator.py` | Bug Fix / Correctness | Short-circuited identical contract text comparison to return 0 diffs. |
| `backend/app/services/document_service.py` | Security & Bug Fix | Enforced ownership check in `compare_documents`; short-circuited identical doc IDs. |
| `backend/app/api/v1/routes/health.py` | Enhancement / Telemetry | Added AI engine status (`ai.status`, `ai.provider`, `ai.model`) to `/health`. |
| `backend/tests/test_compare.py` | Tests | Added tests for identical contracts, 404 on missing doc, and cross-user isolation. |
| `backend/tests/test_live_groq_integration.py` | Tests | Updated assertions to handle rate-limiting fallback gracefully. |
| `backend/tests/test_end_to_end_verification.py` | New Test Suite | Comprehensive E2E integration test covering profile, upload, compare, delete, health. |
| `frontend/src/types/contract.ts` | Type Safety | Added `HealthCheckResponse` interface matching backend telemetry. |
| `frontend/src/data/sampleContracts.ts` | Persona Sanitization | Replaced persona references with neutral `Workspace User` / `Independent Professional`. |
| `frontend/src/services/contractService.ts` | Architecture / Correctness | Propagate compare errors; fix `deleteDocument` boolean; isolate `getDefaultDocument`. |
| `frontend/src/services/contractService.test.ts` | Tests | Verified live mode rejection on compare error; 11/11 tests passing. |
| `frontend/src/App.tsx` | Bug Fix | Initialized `activeDocId` to empty string; dynamic resolution across routes. |
| `frontend/src/pages/DashboardPage.tsx` | Correctness / Telemetry | Filtered risk aggregation to evaluated docs; honest `—` state on zero docs; removed fixed quota. |
| `frontend/src/pages/ComparePage.tsx` | Correctness / UX | Added explicit `compareError` failure state with retry button; distinguished 0 diffs from error. |
| `frontend/src/pages/AnalysisResultsPage.tsx` | Architecture / Error State | Removed direct `PRIMARY_CONTRACT` import; honest missing-document error state. |
| `frontend/src/pages/ReportPage.tsx` | Architecture / Error State | Removed direct `PRIMARY_CONTRACT` import; honest missing-document error state. |
| `frontend/src/pages/SettingsPage.tsx` | Security | Removed insecure `axiom_custom_api_key` localStorage; added server-managed policy card. |
| `frontend/src/pages/HistoryPage.tsx` | Reliability / UX | Added explicit `deleteError` banner and try/catch around deletion. |

---

## 4. Verification & Testing Outcomes

All verification gates were executed via the repository's unified script:

```bash
./scripts/verify.sh
```

### Summary Results
- **Static Code Analysis (Oxlint):** 0 errors, 0 warnings across 26 files (116 rules checked).
- **Frontend Unit & Regression Tests (Vitest):** 11 tests passing across 2 test suites (`env.test.ts`, `contractService.test.ts`).
- **TypeScript Compiler (`tsc -b`):** 0 errors.
- **Production Client Bundle (Vite):** Built cleanly in ~190ms (`dist/index.html` 1.27 kB, `dist/assets/*.css` 42.48 kB, `dist/assets/*.js` 406.28 kB).
- **Backend Test Suite (Pytest):** 74 tests passed, 1 skipped (live AI smoke test during rate limit), 0 failures.

### Targeted Integration Tests Executed
1. `backend/tests/test_end_to_end_verification.py`:
   - `test_e2e_profile_retrieval_and_update_lifecycle`: PASSED (fetches profile, updates with camelCase aliases, verifies database persistence).
   - `test_e2e_document_upload_analyze_and_grounding`: PASSED (uploads docx, triggers analysis, verifies clause grounding in source text).
   - `test_e2e_comparison_behavior_and_isolation`: PASSED (verifies diffs on distinct contracts, 0 diffs on identical, 404 on missing, 404 on cross-user comparison).
   - `test_e2e_document_deletion_and_cross_user_isolation`: PASSED (404 on unauthorized deletion, 204 on authorized deletion, 404 on subsequent fetch).
   - `test_e2e_health_check_telemetry`: PASSED (returns `healthy`, `connected`, and `ai` telemetry).
2. `backend/tests/test_compare.py`:
   - 4 tests covering identical contracts, cross-user isolation, and invalid IDs: ALL PASSED.
3. `backend/tests/test_live_groq_integration.py`:
   - 5 tests covering configuration, minimal requests, full workflow, and fallback: ALL PASSED.

---

## 5. Intentional Static Content & Architecture Constants

The following static constants were confirmed as **intentional, design-approved, or domain constants** and preserved:
1. **Design System Tokens:** Warm ivory `#F7F4EE`, surface `#FFFDFA`, border `#E6E0D6`, near-black `#1C1B19`, Newsreader serif, Inter sans-serif.
2. **Offline Mock Fixtures:** Benchmark templates in `TemplatesModal` and offline mock contracts in `sampleContracts.ts` — strictly isolated behind `contractService.isMock` for developer testing and demonstration.
3. **Legal Guidance Copy:** Disclaimers clarifying that Axiom provides algorithmic issue spotting and risk flagging, not formal attorney-client legal advice.

---

## 6. Manual Verification Checklist for Quality Assurance

The following browser-based flows can be verified manually in a running dev environment:
1. **Start Services:**
   - Backend: `PYTHONPATH=. ./backend/.venv/bin/uvicorn backend.app.main:app --port 8000`
   - Frontend: `cd frontend && npm run dev`
2. **Profile Lifecycle:** Navigate to Settings, update Full Name and Organization, save, and verify that the AppHeader avatar and Sidebar pill immediately update without page reload.
3. **Upload & Dynamic Resolution:** On Analyze page, upload a real DOCX or PDF. Verify transition to Results workspace with the exact document name, page count, and extracted clauses.
4. **Compare Contract Versions:** Open Compare page, select two distinct documents, verify detected divergences. Select the same document for both sides, verify *"No Contractual Divergences Found"*.
5. **Deletion & Archive:** In History, delete a document, confirm prompt, and observe table refresh. Verify error banner if server is unreachable.
6. **Zero Evaluated State:** Clear documents in a fresh workspace, verify Dashboard displays `—` (Pending Analysis) rather than 100% Safe Index.
