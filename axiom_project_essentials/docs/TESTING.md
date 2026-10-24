# Testing and Verification

## Before Testing
Inspect the actual package scripts, test configuration, backend tooling, and CI workflow. Use commands supported by the repository.

## Recommended Coverage
- Route rendering and navigation for all eight screens.
- Shared components and key form validation.
- File upload selection, removal, and invalid file handling.
- Loading, empty, error, and success states.
- Search, filtering, sorting, and document selection.
- Service-layer behavior and API error handling.
- Accessibility basics and keyboard navigation.
- Responsive layouts at representative viewport sizes.
- Backend integration tests when the service and test environment are available.

## Visual Verification
Capture screenshots of all eight screens and compare them with the matching Stitch designs. Record which pages/viewports were actually reviewed and any remaining deviations.

## Report Results Honestly
For each check, report the exact command, pass/fail result, and relevant limitation. Do not claim that tests, browser automation, or screenshot comparisons ran unless they did.
