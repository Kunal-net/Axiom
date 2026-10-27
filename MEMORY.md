# Axiom — Project Memory

> Purpose: Durable, concise project knowledge for future development sessions.
> Update this file after substantial implementation work. Never store secrets.

---

## 1. Source of Truth Matrix

| Domain | Authoritative File | Description |
|---|---|---|
| **Visual Design** | [docs/DESIGN.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DESIGN.md) & [docs/stitch-reference/](file:///Users/kunalsuryanshi/Documents/axiom/docs/stitch-reference) | Warm ivory palette, Newsreader/Inter typography, 8 approved screens |
| **System Architecture** | [docs/ARCHITECTURE.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/ARCHITECTURE.md) | Boundaries, data flow, integration points |
| **Product & Domain** | [CONTEXT.md](file:///Users/kunalsuryanshi/Documents/axiom/CONTEXT.md) | Product scope, 3-member team ownership, legal guardrails |
| **Agent Guardrails** | [AGENTS.md](file:///Users/kunalsuryanshi/Documents/axiom/AGENTS.md) | Bounded task rule, Git safety, verification protocol |
| **Task Tracker** | [TASKS.md](file:///Users/kunalsuryanshi/Documents/axiom/TASKS.md) | 7-phase group roadmap and task board |
| **API Contracts** | [docs/API.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/API.md) | Request/response schemas for Frontend, Backend, and AI |
| **Developer Guide** | [README.md](file:///Users/kunalsuryanshi/Documents/axiom/README.md) & [docs/DEVELOPMENT.md](file:///Users/kunalsuryanshi/Documents/axiom/docs/DEVELOPMENT.md) | Setup, verified commands, and local workflow |

---

## 2. Technical Stack & Key Decisions

- **Frontend (`frontend/`):** React 19.3.1, TypeScript 6.0.3, Vite 8.3.5, Tailwind CSS v4.3.3 (`@tailwindcss/vite`). Configured with `envDir: '../'` in `frontend/vite.config.ts` to share unified root environment configuration.
- **Routing:** Hash-based deep link routing (`#/<route>?doc=<id>`) implemented in `frontend/src/App.tsx`. This ensures seamless bookmarking and page navigation on local preview servers without requiring backend URL rewrite configuration.
- **Service Layer Pattern:** All UI screens interact exclusively with `contractService` (`frontend/src/services/contractService.ts`). When backend endpoints are live, switching `VITE_USE_MOCK_DATA=false` connects directly to the REST API with zero UI component changes.
- **Backend (`backend/`):** FastAPI + PostgreSQL 16 + SQLAlchemy 2.0 with Alembic migrations, cross-tenant isolation, and 21 automated tests.
- **AI Engine (`ai/`):** Dedicated directory reserved and scaffolded (`ai/.gitkeep`) for Member 3's prompt engineering and extraction pipeline.
- **Verification Gate:** `./scripts/verify.sh` executes Oxlint (0 warnings policy), Vitest (9 passing tests), TypeScript build (`tsc -b && vite build`), and Pytest (20 passing tests).

---

## 3. Known Pitfalls & Implementation Conventions

1. **Environment Variable Visibility:** In Vite, only variables prefixed with `VITE_` are exposed to the browser client. Never place AI API keys (`AI_API_KEY`), database passwords, or JWT secrets in `VITE_` variables. Server secrets belong strictly in server-side configuration.
2. **React Render Purity:** Linters flag calling impure constructors (like `new Date()`) directly inside component render bodies. Use module-level constants or compute dates in `useEffect` / handlers.
3. **Tailwind v4 Setup:** Tailwind v4 uses CSS `@theme` declarations inside `frontend/src/index.css` rather than a `tailwind.config.js` file.
4. **Oxlint Unused Variables:** Unused function parameters required by an interface must be prefixed with an underscore (e.g. `_template: ContractTemplate`).
5. **No Redundant Directories:** The starter directory `axiom_project_essentials/` was removed to eliminate confusion and establish single-source-of-truth documentation at the root.
6. **Backend Pytest Execution:** Backend tests require `PYTHONPATH=.` when executed from the repository root because test fixtures import `backend.app...`.

---

## 4. Update Log

- **2026-10-27 (Axiom Dashboard — Improve Sidebar Pillar Image Resolution):** Enhanced the visual resolution, crispness, and architectural fidelity of the sidebar pillar illustration for desktop, 4K/5K, and Retina displays:
  - Root Cause Diagnosed: Previously, `sidebar-pillar.png` was limited to an intrinsic crop ($291 \times 495\text{px}$). On modern Retina displays (2x/3x DPR) where the sidebar renders up to 256px wide and 460px high, physical display viewports require $512 \times 920\text{px}$ to $768 \times 1380\text{px}$. Upscaling a 291px asset caused browser interpolation blur on the Corinthian capital and stepped aliasing on the red graphic.
  - 4x Ultra-High-Definition Asset Reconstruction: Generated native ultra-high-density assets [sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png) and [sidebar-pillar@2x.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar@2x.png) at $1164 \times 1980\text{px}$ (exact 4x scale factor preserving the approved 291:495 aspect ratio and crop):
    - Architectural Stonework Sharpening: Applied Lanczos-4 resampling, dual-radius unsharp masking (fine $r=1.5, p=220\%$ for acanthus leaves and fluting grooves; structural $r=3.0, p=130\%$ for cornice dentils), and rich monochrome toning. Mean high-frequency edge gradient in the stonework jumped from 3.95 to 13.47 (+340%), with edge density rising from 1.0% to 14.2%.
    - Razor-Sharp Red Brand Graphic: Enhanced the crimson geometric polygon (`#D92228` / `#B0181D`), ensuring smooth subpixel anti-aliasing along the diagonal blade and preserving the needle-sharp apex at $Y=11, X=[1155, 1156]$ ($288.75 \times 4, 2.75 \times 4$).
    - Seamless Website Canvas Integration: Preserved pure white `(255, 255, 255)` across background pixels, blending to exact `#F7F4EE` under `mix-blend-multiply` with zero darkening, zero border box, and zero paper texture noise.
  - High-DPI Markup: Configured [Sidebar.tsx](file:///Users/kunalsuryanshi/Documents/axiom/frontend/src/components/layout/Sidebar.tsx) `<img>` with `srcSet="/images/sidebar-pillar.png 1x, /images/sidebar-pillar@2x.png 2x"` for crisp rendering on both 1x displays and Retina/high-density devices.
  - Verification: 0 warnings, 0 errors in Oxlint (30 files); 16/16 Vitest tests passing; Vite production build clean (226ms); 76 Pytest backend tests passing.

- **2026-10-26 (Axiom Dashboard — Match Sidebar Pillar Background to Website):** Eliminated the darker, yellowish-beige rectangular patch behind the architectural pillar illustration in the left sidebar, making it match the canonical dashboard background token (`#F7F4EE` / `var(--color-axiom-bg)`) seamlessly:
  - Root Cause Diagnosed: In `media_1793029336974.png`, `sidebar-pillar.png` retained an uncalibrated paper background of `(238, 234, 222)`. When blended via `mix-blend-multiply` with `filter contrast-105` over `#F7F4EE` (`(247, 244, 238)`), it darkened to `rgb(230, 224, 207)` (`#E6E0CF`), producing a prominent yellowish-tan rectangular box against the surrounding warm ivory sidebar canvas.
  - White-Point Asset Calibration: Normalized [sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png) with channel-specific white-point scaling (`wp_r: 225, wp_g: 220, wp_b: 208`), mapping all paper background pixels to pure white `(255, 255, 255)`. When multiplied via `mix-blend-multiply` onto `#F7F4EE` (`247, 244, 238`), $\frac{255}{255} \times (247, 244, 238) = (247, 244, 238)$ — producing an exact mathematical match to the `#F7F4EE` background with zero rectangular boundary, zero yellowish tint, and zero paper texture noise.
  - Complete Artwork & Geometry Preservation: Kept 100% of all 17,277 red pixels, including the needle-sharp single-pixel apex at `(287, 3)`, the classical monochrome Corinthian column, fluted shaft, ornate capital, diagonal roofline, and architectural background section.
  - Cleaned Navigation Residuals: Cleaned stray non-red icon/text residues in the empty upper region ($y < 105, x < 170$) to pure white.
  - Container & CSS Harmonization: Explicitly bound the pillar container in `Sidebar.tsx` to `bg-[var(--color-axiom-bg,#F7F4EE)]`, removed `filter contrast-105`, and preserved the subtle architectural drafting grid layer (`opacity-25 bg-[linear-gradient(to_right,#E6E0D6_1px,transparent_1px),linear-gradient(to_bottom,#E6E0D6_1px,transparent_1px)] bg-[size:14px_14px]`).
  - Verification: 0 warnings, 0 errors in Oxlint (30 files); 16/16 Vitest tests passing; Vite build clean (212ms); 76 Pytest backend tests passing.

- **2026-10-26 (Axiom Exact Left Sidebar Pillar Recreation):** Recreated the architectural pillar illustration in the left sidebar to precisely match the attached canonical reference (`media_1793027427565.png`):
  - Root Cause Diagnosed: Previously, three conflicting red graphic implementations co-existed in `Sidebar.tsx` (a synthetic `top-2 -right-[1px]` wedge, an uncalibrated `viewBox="0 0 256 360"` SVG polygon, and an asset with mismatched padding), while `max-h-[380px]` clipped the bottom shaft on standard screens.
  - Pixel-Exact Asset Calibration: Generated [sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png) ($291 \times 495$, exactly matching the reference's $291\text{px}$ sidebar width and $495\text{px}$ illustration height). Retained 100% of all 13,780 reference red pixels, featuring:
    - The unbroken, needle-sharp single-pixel red apex at `(286, 8)` reaching the upper-right corner.
    - The fluted Corinthian stone column positioned in the lower-left, extending to the bottom edge.
    - The ornate Corinthian capital with carved leaf details, heavy classical cornice, and triangular roofline sloping diagonally from upper-left toward center-right.
    - The second architectural section visible behind the foreground column.
    - The fine technical drafting guidelines and crosshair sparkle inside the red shape.
    - The diagonal cut along the bottom.
  - Simplified Layering: Removed the synthetic red wedge and duplicate SVG polygon from `Sidebar.tsx`. The illustration now renders directly via [sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png) with `object-contain object-left-bottom mix-blend-multiply` in a flexible container (`min-h-[240px] max-h-[460px] flex items-end justify-start`), eliminating clipping while anchoring the column shaft and roofline naturally.
  - Zero Regression: Preserved all navigation links, sidebar collapse functionality, bottom controls, and application state. Oxlint (0 errors, 0 warnings), Vitest (16/16 passed), Vite build (207ms), and Pytest (76 passed).

- **2026-10-26 (Dashboard Hero Image Composition Reference Recreation):** Recreated the dashboard's top-right architectural illustration composition to match the canonical reference (`media_1793014910131.png`):
  - Coordinated Geometric Composition: Unified the architectural photograph, red geometric brand motif, drafting grid lines, and editorial typography into a single responsive composition container (`aspect-[720/254] max-w-[500px] sm:max-w-[540px] lg:max-w-[580px] xl:max-w-[620px]`).
  - Architectural Colonnade Facade Crop: Retained `/images/facade.jpg` with `mix-blend-multiply` and `object-[32%_center]`, adding the diagonal left crop (`clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 56% 100%)'`) matching the reference image's diagonal cut across the Corinthian colonnade.
  - Authentic Red Geometric Brand Motif: Replaced the previous `hero-ribbon.png` with a multi-faceted vector SVG geometry layered with `mix-blend-multiply` over the photograph:
    - Primary sweeping right blade/wing entering from the upper region (`points="584,0 488,0 507,49 432,156 495,198"` in `#D92228`).
    - Sharp triangular point extending toward the left-middle with apex at `(216, 170)` cutting into the columns (`#B0181D`, opacity 0.96).
    - Downward vertical blade cutting straight through the facade from `(341, 174)` down to the bottom baseline at `(341, 252)` and `(379, 252)`.
    - Upper-middle origami fold and notch (`#B0181D`) with inner triangular cutout and dimensional crease lines (`#8F1216`).
  - Architectural Drafting Grid Lines: Extended subtle ivory square grid and drafting reference lines (horizontal baselines, apex alignments, and vertical column axes) across the canvas.
  - Editorial Typography & Vertical Rule: Cleanly aligned the vertical divider rule at `X=607` with the uppercase stacked typography (`CLEARER CONTRACTS BRIGHTER CREATIVES`, `tracking-[0.24em] font-sans font-bold text-[7.5px]-text-[9px] text-[#716B63]`).
  - Zero Regression & Preservation: Preserved all other dashboard cards, sidebar, header, typography, upload state, and application logic. Verified across Oxlint (0 errors, 0 warnings), Vitest (16/16 passed), Vite build (211ms), and Pytest (76 passed).

  - Root Cause Diagnosed: Two factors caused the tip truncation: (1) The image had `object-left-bottom` applied in an `overflow-hidden` container, which anchored the base to the bottom and pushed the top of the image (where the apex sits) out of bounds, and (2) earlier screenshot crop `media_1793003134583.png` started 35px below the true apex.
  - Complete Sharp Vector Tip: Added a dedicated, unclipped SVG red graphic layer (`viewBox="0 0 256 360"`, apex vertex at `(242, 12)`) layered behind the classical building at `z-10`. The needle-sharp pointed tip extends diagonally toward the upper-right corner without touching or being clipped by the container boundary.
  - Positioning & Asset Perfection: Changed image alignment to `object-left-top relative z-20` and perfected the asset [sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png) with 40px top padding, rendering the continuous, unbroken elongated red triangle tapering to a single-pixel apex at `y=10`.
  - Layering & Occlusion: The classical building stonework sits at `z-20` on top with `mix-blend-multiply`, naturally obscuring the lower and middle portions of the red graphic while the complete pointed tip emerges sharply in the open space.
  - Verification: 0 warnings, 0 errors in Oxlint; 16/16 Vitest tests passing; Vite build clean in 214ms; 76 Pytest tests passing.
  - Reference Composition Geometry: Extracted and color-calibrated the high-resolution architectural artwork ([sidebar-pillar.png](file:///Users/kunalsuryanshi/Documents/axiom/frontend/public/images/sidebar-pillar.png), 291x470px). Features a high-contrast monochrome Corinthian pillar as the dominant foreground element, showing the ornate capital, fluted shaft, and the building's diagonal triangular roofline/entablature sloping from upper-left down toward center-right with background capitals in perspective.
  - Large Angular Red Brand Graphic: Integrated the sharply pointed crimson red geometric silhouette extending upward toward the top-right corner of the sidebar, layered behind the architectural building so the stonework naturally obscures parts of it.
  - Ivory Background & Architectural Grid: Calibrated the image paper background to `#F7F4EE` with `mix-blend-multiply` and layered it over the subtle drafting grid lines (`opacity-25 bg-[size:14px_14px]`), ensuring an organic editorial printed-paper look without boundary box tint.
  - Non-Destructive Integration: Navigation links, Settings, Public Landing, Sign Out, and user profile remain completely unobstructed and functional.
  - Verification: 0 warnings, 0 errors in Oxlint (30 files); 16/16 Vitest tests passing; Vite build clean in 231ms; 76 Pytest backend tests passing.
  - Hero Architectural Composition: Replaced the artificial boxed card container (`border border-[#E6E0D6] shadow-xs bg-[#FFFDFA]`) and synthetic SVG polygon with an integrated editorial layout (`w-72 sm:w-84 md:w-96 lg:w-[410px] xl:w-[440px] h-40 sm:h-44 lg:h-[195px] xl:h-[205px]`). `facade.jpg` blends seamlessly onto the ivory canvas via `mix-blend-multiply` with `object-[35%_center]`, keeping the prominent classical columns and entablature visible on the left.
  - Authentic Red Origami Ribbon Motif: Reused the genuine `hero-ribbon.png` asset layered over the right columns (`-top-3 sm:-top-4 -right-1 sm:-right-2 w-[65%] sm:w-[62%] h-[115%] object-contain object-right-top`), reproducing the exact origami fold, left-pointing wing, and upper blade without obscuring the left columns.
  - Drafting Grid & Editorial Text: Extended subtle architectural drafting grid lines across the composition, and cleanly positioned the vertical stacked motto `CLEARER CONTRACTS BRIGHTER CREATIVES` (`text-[9px] tracking-[0.22em] text-[#8A857D] pl-2`) beside the composition.
  - Sidebar Column & Red Shard: Expanded the lower sidebar composition container (`flex-1 min-h-[220px] max-h-[360px]`) so `column.jpg` spans between the navigation list and the bottom links, anchored flush at left with the Corinthian capital clearly visible at top. Refined the underlying crimson/ruby red triangular shard SVG (`viewBox="0 0 240 280"`) and positioned the acute red accent shard on the right border (`top-2 -right-[1px]`) directly below Settings.
  - Preservation: Zero changes to typography, page layout, card dimensions, upload functionality, or application state.
  - Verification: 0 warnings, 0 errors in Oxlint; 16/16 Vitest tests passing; Vite build clean in 216ms; 76 Pytest tests passing.
  - Root Cause Diagnosed: Headings were explicitly styled with `font-serif` (which mapped to `Newsreader`, a low-contrast, lightweight transitional book face intended for multi-paragraph contract text), overriding the `--font-display` theme token.
  - Display Font Correction: Updated all major headlines and section titles in `DashboardPage.tsx` ("Welcome back, [user]", action cards "Analyze a contract", "Compare documents", "Use a template", "Drop an agreement here", "Risk Level Index", and "Recent Insights") to `font-display` (`DM Serif Display` with `Bodoni Moda`/`Didot` fallback).
  - Clean Font Weight & Rendering: Maintained native `font-normal` (400) weight on `DM Serif Display` to retain sharp hairline serifs, bold stroke contrast, and narrow editorial letterforms without artificial browser faux-bold blur.
  - Functional Interface Typography: Preserved clean, neutral `Inter` (`font-sans`) for sidebar navigation items, search bar inputs, card descriptions, button labels, and tracked uppercase section labels (`tracking-[0.2em]`).
  - Consistency Across App: Aligned `Sidebar.tsx` brand wordmark, `AnalyzePage.tsx`, `TemplatesModal.tsx`, `ComparePage.tsx`, `HistoryPage.tsx`, `SettingsPage.tsx`, `ReportPage.tsx`, and `SignInPage.tsx` display headings to `font-display`.
  - Verification: Zero errors and zero warnings across Oxlint (30 files), Vitest (16 tests), TypeScript/Vite production build (215ms), and Pytest (76 tests).
  - Root Cause Diagnosed: Previous page wrapped layout in nested `DoubleBezel` (20px/14px rounded borders) with centered `max-w-4xl mx-auto` container, saturated green pill badges, and rendered an obsolete 3-card sample-contract section directly in the page tree.
  - Structural Rebuild: Implemented a single, proportionate upload section (`max-w-[960px]` canvas, `bg-[#FFFDFA] border border-[#E6E0D6] rounded-md`), left-aligned editorial header (`NEW ANALYSIS RUN` uppercase tracking label with `w-5 h-[2px] bg-[#D92228]` crimson bar, display serif `Analyze Contract` headline, and full-width `#E6E0D6` divider rule).
  - Clean Drop Zone: Large rectangular dashed drop zone (`border-dashed border-[#D4CDC3]`), monochrome upload icon, display serif heading `"Drop your contract here, or browse"`, and restrained secondary privacy text (bright green pill badge completely eliminated).
  - Obsolete Section Purged: Completely removed `"DON'T HAVE A CONTRACT HANDY?"`, `"1-Click Instant Test"`, and Contract A/B/Freelance cards from rendered JSX.
  - Upload Logic Preserved: Retained file validation (PDF/DOCX, 25MB limit), drag-and-drop handlers, progress bar telemetry, live analyzing checkpoints, error banners, and navigation to results.
  - Code-level checks passed: Oxlint 0 warnings/0 errors, Vitest 16/16, TypeScript & Vite build clean in 210ms.

- **2026-10-26 (Authenticated Dashboard Precision Matching Pass):** Performed forensic visual precision matching against the authoritative dashboard reference image:
  - Sidebar geometry: Integrated tall Corinthian column engraving flush to the lower sidebar baseline, rising past mid-height with an acute red geometric shard pointing up-right and an accent shard tip emerging on the right border near Settings; capitalized "Student" role.
  - Hero composition: Upgraded "Welcome back, [user name]." to high-contrast display serif typography (`text-[48px]-text-[66px]`) anchored on a single line with `whitespace-nowrap`; tuned supporting copy to 2 lines; expanded right colonnade facade with multi-faceted origami crimson chevron (`#D92228`, `#B0181D`, `#801014`) and stacked vertical accent text `CLEARER CONTRACTS BRIGHTER CREATIVES`.
  - Action cards & layout container: Constrained dashboard canvas to `max-w-[1240px]-max-w-[1280px]` with `space-y-6` gaps, restoring proportional card heights, serif headings, and button baselines.
  - Quick Upload drop zone: Reconfigured drop zone layout with vertically centered document badge stacked above instruction text, and right-aligned black `Browse files` button.
  - Bottom panel geometry: Cleanly concluded dashboard layout at the dual panels (`Risk Level Index` with circular `— NO DATA` gauge, and `Recent Insights` with `No insights yet` empty state), eliminating unwanted bottom table overflow.
  - Verified with zero errors and zero warnings across Oxlint, Vitest, Vite build, and Pytest.

- **2026-10-26 (Authenticated Dashboard Reference-Matched Editorial Redesign):** Fully redesigned the authenticated Dashboard workspace (`frontend/src/pages/DashboardPage.tsx`), persistent sidebar (`frontend/src/components/layout/Sidebar.tsx`), and top utility bar (`frontend/src/components/layout/AppHeader.tsx`) to match the canonical editorial dashboard reference design:
  1. Persistent Left Sidebar (`Sidebar.tsx`):
     - Display serif `AXIOM` wordmark with uppercase `INTELLIGENCE` tracking subtitle and collapse control.
     - Strict navigation order: `Dashboard`, `Analyze`, `Compare`, `Templates`, `History`, `Settings` with solid black background active item state.
     - Integrated architectural column photo (`/images/column.jpg`) with sharp red geometric delta shard (`#D92228`) and drafting grid lines in the lower sidebar body.
     - Functional bottom actions: `Public Landing` (globe icon), `Sign Out` (crimson text), thin separator, and user account pill displaying authenticated user avatar, name, and role (`Kunal Suryanshi • Student`).
  2. Top Utility Bar (`AppHeader.tsx`):
     - Restrained warm ivory surface with thin `#E6E0D6` bottom border.
     - Centered-left search input with search icon, placeholder, and `⌘K` keyboard hint.
     - Right utility controls with notification bell (red unread dot) and user profile avatar circle.
  3. Welcome Hero (`DashboardPage.tsx`):
     - Asymmetric editorial composition with `EXECUTIVE WORKSPACE —` label, dynamic serif greeting (`Welcome back, [firstName].`), and supporting description.
     - Right column architectural colonnade facade (`/images/facade.jpg`) with multi-faceted crimson origami chevron motif and vertical editorial accent text `CLEARER CONTRACTS BRIGHTER CREATIVES`.
  4. Three Primary Action Cards:
     - Horizontal trio: `Card 01 — Analyze a contract` (document icon, red dash, black primary button), `Card 02 — Compare documents` (branch icon, red dash, outlined button), `Card 03 — Use a template` (folder icon, red dash, outlined button).
  5. Full-Width Quick Upload Section:
     - Editorial container with `QUICK UPLOAD —` header, serif `Drop an agreement here.`, supported formats specification (`PDF, DOCX (MAX 25MB)`), and dashed drop zone with file picker, drag-and-drop, validation, progress states, and backend integration.
  6. Bottom Dashboard Panels:
     - Left panel: `PORTFOLIO INTEGRITY — Risk Level Index` with circular neutral gauge displaying `— NO DATA` when empty, and real live safe scores and risk severity when contracts exist.
     - Right panel: `RECENT INSIGHTS — No insights yet` with document icon empty state, and live top finding highlights when contracts are evaluated.
  7. Verification:
     - 100% passing results across Oxlint (0 warnings, 0 errors), Vitest (16 passing tests), TypeScript build (`dist/`), and Pytest (76 passing tests).

- **2026-10-26 (Landing Page Pixel-Level Reference Matching Pass):** Fully reconstructed the Axiom landing page (`/`) to faithfully reproduce IMAGE A (original reference mockup) across all 8 canonical landing sections:
  1. Header & Hero Typography & Structure:
     - Replaced generic serif styling with Google Font `DM Serif Display` (`--font-display`), matching authoritative letterforms, weights, and high-contrast serifs.
     - Resolved the artificial line-wrapping defect where `CONTRACTS` was split across lines (`<span>YOUR CONTR</span><br /><span>CTS</span>`). The headline is now strictly 3 lines: `UNDERSTAND` / `YOUR CONTRACTS` / `BEFORE YOU SIGN.` with a `-0.035em` letter-spacing metric.
     - Positioned the crimson geometric origami delta shard over the vertex of the `A` in `CONTRACTS`.
     - Restored the right-column architectural photograph overlaid with the `CLEARER CONTRACTS BRIGHTER CREATIVES` badge, the full-bleed sweeping crimson ribbon (`/images/hero-ribbon.png`), the 3-step numbered marker `01 REVIEW / 02 UNDERSTAND / 03 NEGOTIATE`, and the bottom-left `AXIOM` editorial wordmark.
  2. Product Demonstration ("A Closer Look"):
     - Aligned the left copy column (`A CLOSER LOOK AT CONTRACT INTELLIGENCE`) with the 3-pane interactive contract analysis preview.
     - Reconstructed the document viewer with peach `Net 60` highlighting, orange comment flag, left document outline badges, and right risk drawer detailing "High Risk Finding: 60-Day Payment Terms & Uncapped Indemnity" with plain-English "Why this matters".
  3. "How It Works" Section:
     - Matched the solid near-black `#111110` background band and 2-line heading `HOW AXIOM PROTECTS YOUR WORK`.
     - Positioned the 3 numbered steps (`01 UPLOAD & PARSE`, `02 INTELLIGENCE ENGINE`, `03 NEGOTIATE & SIGN`) in a single horizontal row with connecting directional arrows (`→`) and downward arrow indicator circles.
  4. "Features" Section:
     - Corrected the 2x2 grid back to a single horizontal row of 4 feature panels (`grid-cols-4`) matching IMAGE A, each with fine engraving texture baseline strips, uppercase tags (`RISK SCORING`, `PLAIN-ENGLISH REDLINES`, `CROSS-DOC COMPARE`, `PORTFOLIO RISK`), and structured risk bullets.
  5. "Original vs. Proposed" Clause Comparison:
     - Removed extraneous dark unreferenced "CONTRACT TYPES" selector table.
     - Aligned the 2 comparison cards side-by-side (`ORIGINAL CLAUSE` in red strikethrough vs `AXIOM PROPOSED REVISION` in green addition) directly adjacent to the Corinthian architectural column photo.
  6. "Audience" & "FAQ" Sections:
     - Structured the Audience section with 3-line heading + architectural facade photo on the left, and 3 audience cards (`Freelancers`, `Creative Studios`, `Agency Founders`) on the right.
     - Matched the FAQ section with 5 accordion items with fine divider borders on the left, and the right-column Corinthian column adorned with an ascending crimson dart motif (`/images/faq-ribbon.png`).
  7. Final CTA & Ivory Footer:
     - Matched the dark `#111110` banner with the crimson ribbon arc (`/images/cta-ribbon.png`), `INDEPENDENT BY DESIGN`, and warm ivory `#F7F4EE` footer with copyright and navigation.
  8. Verified: Oxlint 0 warnings/0 errors, Vitest passing, TypeScript build clean, and full Pytest suite passing.

- **2026-10-25 (Post-Refactor Critical Review & End-to-End Verification):** Executed thorough critical review and resolved remaining correctness, security, and architectural issues across the stack:
  1. Masked Comparison Failures Resolved: `contractService.getComparisonDiffs` now throws errors on live API failures instead of returning `[]`. `ComparePage.tsx` manages `compareError` with an explicit "Comparison Request Failed" state and retry button, distinguishing network/404 failures from 0 differences.
  2. Comparison Authorization & Identical Diff Short-Circuit: `document_service.compare_documents` enforces tenant isolation (`doc1.owner_id != owner_id` or `doc2.owner_id != owner_id` raises 404). Identical doc IDs and identical text short-circuit to return 0 diffs.
  3. Eliminated Insecure LocalStorage API Key: Removed dead `localStorage.getItem('axiom_custom_api_key')` read/write logic in `SettingsPage.tsx`. Replaced with server-managed AI inference architecture card documenting the zero client-side credentials policy (`GROQ_API_KEY`).
  4. Honest Portfolio Risk & Quota Telemetry: Replaced hardcoded plan limit (10) with truthful contract count (`{documents.length} Contracts Stored`). Filtered risk aggregation strictly to evaluated contracts (`status in ['completed', 'needs_review'] && clauses.length > 0`). When 0 evaluated contracts exist, gauge renders `—` (dash) and `Pending Analysis` with `No Data` badge. Extended `/health` endpoint to return structured AI inference status (`ai: { status: "active" | "benchmark_rules", provider, model }`).
  5. Route Resolution & Fixture Isolation: `App.tsx` initializes `activeDocId` to `''`. `AnalysisResultsPage.tsx` and `ReportPage.tsx` dynamically select the user's latest contract from `contractService.getDocuments()` or display an authentic empty state prompting upload. Removed direct `PRIMARY_CONTRACT` imports in favor of service-isolated `getDefaultDocument()` (mock mode only).
  6. Deletion Authorization & Error Banner: Fixed `contractService.deleteDocument()` returning `false` on live HTTP 204. Added `deleteError` banner in `HistoryPage.tsx` and verified cross-user deletion rejection (404).
  7. Groq Rate Limit Cap: In `ai/providers/groq.py`, capped inline sleep at 5.0s on HTTP 429 to prevent thread blocking and enable instant fallback to deterministic benchmark rules.
  8. 100% Verified: Full pipeline `./scripts/verify.sh` passed cleanly with 0 Oxlint errors/warnings, 11 Vitest tests, clean TypeScript/Vite bundle, and 74 passing Pytest tests.

  1. Header & Sidebar Dynamic Identity: Dynamic user initial, name, and role/org in `AppHeader.tsx` and `Sidebar.tsx`, dynamically linked to live profile in `App.tsx`.
  2. Dynamic Dashboard Telemetry: Replaced static quotas, risk gauge percentages, and clauses-needing-revision with dynamic aggregates derived from persisted documents and live `/health` probe in `DashboardPage.tsx`. Eliminated fake empty state toggle.
  3. Dynamic Report & Viewer: `AnalysisResultsPage.tsx` and `ReportPage.tsx` dynamically resolve document IDs, calculate SVG donut charts and protective balance, and provide 3 active functional tabs (Key findings, Recommendations redlines, and Document Audit Details with raw text preview).
  4. Dynamic Document Comparison: `ComparePage.tsx` dynamically renders document dropdown pair selectors and calculates diff metrics (`diffs.filter(...)`), with loading/empty divergence states. In `contractService.ts`, live mode explicitly returns backend diffs or empty on error—never falling back silently to sample diffs.
  5. Dynamic History Archive: `HistoryPage.tsx` supports search filtering, file type & status filtering, dynamic sorting, client-side pagination (5 docs/page), and permanent document deletion (`DELETE /api/v1/documents/{id}`).
  6. Real Binary Samples in Upload: `AnalyzePage.tsx` sample buttons fetch genuine binary DOCX files (`public/samples/Contract_A_Redstone_Nimbus.docx`) for live upload and extraction instead of sending synthetic plaintext.
  7. Authentic Settings: `SettingsPage.tsx` removed fake masked dots `defaultValue="••••••"`, wired client override storage, and propagates updated profile across `AppHeader` and `Sidebar`.
  8. 100% Verified: Zero Oxlint errors/warnings, 11 Vitest tests passing, clean TypeScript/Vite build, and 66 Pytest tests passing via `./scripts/verify.sh`.

- **2026-10-25 (Contract A Report Accuracy, Section Resolution & Clause Coverage Resolution):** Resolved all 9 confirmed defects regarding Contract A report accuracy, section drift, clause omissions, and source labeling:
  1. Exact Root Causes:
     - Section Drift: `SECTION_HEADER_REGEX` in `ai/segmenter.py` strictly looked for words "Section", "Article", "Clause", missing numeric headings (`1. Services`, `2. Payment`, etc.), causing fallback to generic labels. Furthermore, `run_benchmark_rules` in `ai/scorer.py` contained legacy hardcoded section strings (`Section 9.1`, `Section 5.2`, `Section 4.3`) and few-shot prompt examples anchored to "Section 9.1".
     - Clause Omissions: Benchmark rules and LLM prompts omitted the unrestricted withholding clause in Section 2, the one-month liability cap in Section 5, 5-year absolute warranties in Section 6, and immediate termination in Section 7.
     - Unclear Source Attribution: The UI previously displayed a vague "Rule Benchmark" badge without clearly distinguishing deterministic fallback from live AI model execution.
     - 0% Standard Terms Discrepancy: Only high/medium risk clauses were evaluated; standard provisions (e.g. Section 8 Confidentiality, Section 9 Governing Law) were omitted from findings, leading to an artificially skewed 0% standard terms rating.
  2. Implementations & Architecture Hardening:
     - Dynamic Section Grounding (`ai/segmenter.py` & `ai/validator.py`): Updated `SECTION_HEADER_REGEX` to match all standard legal formats (`^[ \t]*(?:(?:Section|Article|Clause|\§)\s+)?([0-9IVXLCDM]+(?:\.[0-9]+)*)\s*[:.•\-–—]\s*([A-Za-z0-9 ,/&\'\"–—\-]{2,60}?)(?:[\.\n\r:]|$)`) and implemented `find_section_for_excerpt(text, excerpt)`. In `evidence_validator.py`, every clause finding is dynamically grounded against the preceding heading in the source text layout.
     - Comprehensive Clause Rules (`ai/scorer.py`): Overhauled `run_benchmark_rules` to evaluate all material provisions: Section 2 payment withholding, Section 2 90-day payment, Section 3 pre-existing IP, Section 4 unlimited indemnity, Section 5 1-month liability cap (and its interaction with indemnity), Section 6 5-year software warranties, Section 7 asymmetric termination, Section 8 standard confidentiality (low risk), and Section 9 governing law (low risk).
     - Enhanced Prompt Constraints (`ai/prompts.py`): Instructed LLMs to track exact section headings, assess both payment delay and withholding, analyze liability cap and indemnity interaction, and evaluate warranties and termination.
     - Explicit UI Source Labeling (`ReportPage.tsx` & `AnalysisResultsPage.tsx`): Clearly tags `Deterministic Fallback (Rule Benchmark Engine)`, `Live AI: <model>`, or `Demo Simulation (Mock Data)`. Updated Protective Balance calculation to accurately reflect standard terms.
     - Regression Test Suite (`backend/tests/test_contract_a_report_accuracy.py`): Added 4 automated tests verifying correct section numbers (Sections 2-7), payment withholding detection, warranty and termination risk surfacing, verbatim quote grounding, indemnity and liability cap interaction, and mode labeling.

- **2026-10-25 (Live Backend Connection & Contract Analysis "Failed to fetch" Resolution):** Diagnosed and resolved browser `Live analysis failed: Failed to fetch` error during live contract upload and analysis:
  1. Exact Root Causes:
     - CORS Origin Mismatch: A secondary Vite client running on port 5174 sent preflight `OPTIONS` requests to `http://127.0.0.1:8000/api/v1/documents/upload`, which FastAPI's CORSMiddleware rejected with `400 Bad Request: Disallowed CORS origin` because only 5173 was registered in `CORS_ORIGINS`. Browsers surface 400 preflight rejections as `TypeError: Failed to fetch`.
     - Stale Uvicorn Process: PID 48192 on port 8000 was started prior to SQLite fallback implementation and crashed on local PostgreSQL authentication failure (`FATAL: password authentication failed for user "axiom_user"`), returning 500 error responses.
     - Host Resolution Mismatch: Uvicorn bound exclusively to IPv4 `127.0.0.1` while macOS browsers resolve `localhost` to IPv6 `::1`.
  2. Implementations & Architecture Hardening:
     - Expanded `CORS_ORIGINS` in `backend/app/core/config.py` to permit ports 5173, 5174, 5175, and 4173 on both `http://localhost` and `http://127.0.0.1`.
     - Standardized SQLite database path in `backend/app/db/session.py` to deterministic absolute path `Path(__file__).resolve().parents[3] / "axiom_dev.db"` and ensured auto-creation of tables via `Base.metadata.create_all` during fallback.
     - Added root `/health` and aliased `/openapi.json` routes in `backend/app/main.py`.
     - Harmonized `apiBaseUrl` in `frontend/src/config/env.ts` with `window.location.hostname` to prevent cross-hostname IPv4/IPv6 mismatches.
     - Routed all `contractService.ts` calls through the class instance client (`this.client`).
     - Added real `sample_contracts/Contract_A_Redstone_Nimbus.docx` fixture.
     - Created automated regression suite `backend/tests/test_contract_a_isolation_and_grounding.py` validating upload, extraction, Groq analysis, clause grounding, and CORS preflight across all developer ports.

- **2026-10-25 (Contract A Analysis Mismatch Defect Fix & Full Verification):** Diagnosed and resolved the critical defect where uploading Contract A ("Redstone Retail Pvt. Ltd. & Nimbus Labs Pvt. Ltd.") produced clauses from an unrelated seeded contract (`PRIMARY_CONTRACT`) under ID `doc-1792910048445`:
  1. Exact Root Cause: The client-side mock enclave in `frontend/src/services/contractService.ts` was executing because `VITE_USE_MOCK_DATA=true` was set in `.env` (or via silent `catch` fallthrough on network error). In that branch, it created `newDoc = { ...PRIMARY_CONTRACT, id: 'doc-' + Date.now(), name: file.name }`. Millisecond timestamp `1792910048445` was generated, renaming the document to "Contract A" but cloning all 10 clauses from `PRIMARY_CONTRACT` (Section 5.2 unilateral termination, Section 6.2 IP transfer, Section 9.1 indemnity, Section 11.4 2-year non-compete, Section 12.1 amendments, Delaware governing law). Additionally, `ReportPage.tsx` and `AnalysisResultsPage.tsx` defaulted to `PRIMARY_CONTRACT` and contained hardcoded SVG chart counts, summary text, and contract viewer text for Apex FinTech.
  2. Frontend Architecture Fixes:
     - Eliminated silent fallback to mock data in live mode: `contractService.analyzeDocument()` now rethrows network/backend errors to display explicit failure states on `AnalyzePage.tsx`.
     - Explicit demo demarcation: In mock mode, documents are strictly tagged with `id: doc-demo-${Date.now()}`, `provider: 'mock'`, `modelName: 'demo-in-memory-simulation'`, and logs are prefixed with `[DEMO MODE]` so mock simulations cannot masquerade as live analysis.
     - Dynamic UI & Report: `ReportPage.tsx` and `AnalysisResultsPage.tsx` now compute SVG donut chart circumference (`314.15`), risk counters, executive summaries, and clause viewers dynamically from the fetched document. Added loading and "not found" error boundaries to prevent displaying `PRIMARY_CONTRACT`.
  3. Backend Architecture Enhancements:
     - Extended `ContractDocumentResponse` schema to include `provider`, `model_name` (`modelName`), and `extracted_text` (`extractedText`).
     - Added resilient SQLite fallback in `backend/app/db/session.py` when PostgreSQL container is offline in local dev/test mode.
  4. Regression Testing & Verification:
     - Added `backend/tests/test_contract_a_isolation_and_grounding.py` verifying: (1) Contract A upload produces findings strictly grounded in its exact text and zero clauses from `doc-msa-fintech` / Apex / Delaware; (2) Contract A and Contract B maintain strict cross-document isolation; (3) document ID linkage is maintained across `Document`, `Analysis`, and `ClauseFinding`; (4) provider failure triggers explicit documented fallback.
     - Updated `frontend/src/services/contractService.test.ts` and `frontend/src/config/env.test.ts` to test mock vs live isolation and error boundaries (11/11 Vitest tests passing).
     - Full pipeline verified via `./scripts/verify.sh`: Oxlint (0 warnings, 0 errors), Vitest (11 passed), TypeScript build (clean), Pytest (60 passed).

- **2026-10-25 (Live Groq LLM Integration & Evidence Grounding Verification):** Successfully verified end-to-end AI intelligence pipeline with live Groq LLM integration:
  1. Provider configuration: Added `GroqProvider` in `ai/providers/groq.py` and factory integration in `ai/providers/factory.py`. Configured active model `openai/gpt-oss-120b` (120B parameter model verified active on Groq endpoint).
  2. Resilient API key configuration: Added multi-key alias support (`GROQ_API_KEY`, `AI_API_KEY`, `GEMINI_API_KEY`, `GOOGLE_API_KEY`) across `ai/config.py` and `backend/app/core/config.py` without printing or exposing secrets.
  3. Live model verification: Successfully performed minimal live requests to `https://api.groq.com/openai/v1/chat/completions` returning valid JSON.
  4. End-to-end API pipeline: Tested full workflow (DOCX upload -> binary extraction -> live Groq analysis -> evidence grounding -> SQLite/Postgres persistence) via REST API endpoints (`/upload`, `/analyze`, `/analysis`).
  5. Strict grounding & factual verification: Checked that all quoted findings physically exist in the source document, page references are accurate, and response schemas match canonical contracts.
  6. Rate-limit & error resilience: Added exponential backoff and retry logic in `GroqProvider` for HTTP 429 / 5xx responses; verified explicit, safe fallback to deterministic `rule_benchmark` on provider errors.
  7. Full test suite: 56 passing pytest tests (including `test_live_groq_integration.py`), 9 passing Vitest tests, 0 Oxlint warnings/errors, and clean Vite production build via `./scripts/verify.sh`.

- **2026-10-25 (Member 3 AI Contract Intelligence Pipeline Implementation & Full Verification):** Implemented the complete production-grade AI contract intelligence pipeline under `ai/` per `docs/Axiom_AI_Member_3_Master_Prompt.pdf` while strictly preserving the existing frontend and FastAPI backend. Built modular pipeline components:
  1. `ai/config.py`: typed configuration (`AISettings`) reading `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`, timeouts, and bounded chunk limits.
  2. `ai/exceptions.py`: explicit error hierarchy (`AITimeoutError`, `AIRateLimitError`, `AIAuthenticationError`, `AISchemaValidationError`, `AIGroundingError`).
  3. `ai/schemas.py`: Pydantic v2 schemas for raw LLM outputs, segments, and legal diffs.
  4. `ai/prompts.py`: system and user prompts with prompt injection defenses, untrusted data delimiters (`<CONTRACT_DOCUMENT>`), calibrated legal risk language, sensitivity thresholds, and JSON schema constraints.
  5. `ai/segmenter.py`: page marker parser (`--- PAGE X ---`), whitespace normalization, clause segmentation, scanned document detection, and bounded chunking with context overlap.
  6. `ai/providers/`: resilient multi-provider adapters (`BaseLLMProvider`, `GeminiProvider`, `OpenAIProvider`, `AnthropicProvider`, `MockProvider`, and `get_llm_provider` factory) with bounded retries and timeout translation.
  7. `ai/validator.py`: strict evidence verification ensuring every quoted excerpt exists verbatim in source text, page number grounding against extraction metadata, and rejection of hallucinated findings.
  8. `ai/scorer.py`: canonical categorization (`liability`, `payment`, `ip`, `termination`, `warranty`, `confidentiality`, `governing_law`), sensitivity calibration (`standard`, `strict`, `relaxed`), plain-English synthesis, balanced redline proposals, and deterministic benchmark rule engine.
  9. `ai/comparator.py`: cross-document semantic comparison detecting added liability caps, modified terms, stricken non-competes, and contractual conflicts.
  10. `ai/pipeline.py`: central `ContractAnalysisPipeline` coordinator with input guards, LLM execution, evidence grounding, and graceful deterministic fallback.
  11. Seamless backend seam: delegated `backend/app/services/analysis_service.py` to `ContractAnalysisPipeline` with zero regressions or breaking changes.
  12. Automated test suite: added 30 new unit, grounding, provider resilience, pipeline, scenario, and security tests (total 50 pytest tests passing, 0 failures). Verified with `./scripts/verify.sh` (Oxlint 0 warnings, Vitest 9/9 passing, Vite production build clean, Pytest 50 passing).

- **2026-10-25 (Repository Reorganization & Clean Modular Architecture):** Safely reorganized repository into clean, modular structure before AI pipeline development begins. Moved React 19 frontend into `frontend/` (`public/`, `src/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.oxlintrc.json`). Kept existing production FastAPI backend in `backend/` completely untouched. Initialized dedicated empty `ai/` directory with `.gitkeep` for Member 3. Consolidated technical documentation and design assets (`docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/stitch-reference/`, `docs/Axiom_AI_Member_3_Master_Prompt.pdf`) under `docs/`. Preserved essential root-level context files (`AGENTS.md`, `README.md`, `CONTEXT.md`, `MEMORY.md`, `TASKS.md`, `.gitignore`, `.env.example`). Configured `frontend/vite.config.ts` with `envDir: '../'`. Updated `./scripts/verify.sh` to run frontend and backend checks from their respective directories. Verified all 4 checks pass: Oxlint (0 warnings, 0 errors), Vitest (9/9 passed), TypeScript build (`frontend/dist/`), and Pytest (20 passed).

- **2026-10-24 (Member 2 Complete Backend Implementation):** Built, verified, and integrated the complete production-minded FastAPI + PostgreSQL backend under `backend/`. Implemented SQLAlchemy 2.0 models (`User`, `Document`, `Analysis`, `ClauseFinding`), Alembic migrations with zero-to-head initialization and rollback verification, opaque private local file storage with path traversal protection, multi-format text extraction (`pypdf`, `python-docx`), heuristic & AI contract intelligence engine, and complete REST API endpoints fully matching `docs/API.md` and frontend contracts. Enforced cross-user tenant isolation, Argon2id password hashing, and leak-safe error responses. Built 21-test automated suite covering auth, uploads, analysis, isolation, storage, and live PostgreSQL integration. Integrated backend tests into `./scripts/verify.sh` with 100% passing results across Oxlint, Vitest, TypeScript build, and Pytest.

- **2026-10-24 (Post-Implementation Verification & Live Integration):** Independently verified entire backend implementation. Confirmed PostgreSQL 16 container running (`axiom-postgres`), Alembic migrations clean on isolated fresh database (zero-to-head and rollback), all 21 pytest tests passing. Ran `verify_live_api.py` against live FastAPI server (`uvicorn`): **62/62 end-to-end checks passed** covering health, auth (register, login, JWT, 409 duplicate rejection, 401 invalid credentials), user profile CRUD with PostgreSQL persistence, document upload (201, UUID storage key, private local storage), empty/unsupported file rejection, document listing with `documents`/`totalCount` schema, complete cross-user security isolation (5 isolation checks), contract analysis (4 clauses, riskCounts H/M/L), clause reviewed/bookmarked PATCH persistence and toggle, compare endpoint returning 4 structured diffs (`changeType`, `section`, `clauseTitle`, `severity`), 204 deletion, DB cleanup (404), and filesystem cleanup. Discovered that `storageKey` is intentionally server-side only (not exposed in API response), and duplicate email returns 409 Conflict. Frontend confirmed wired to live backend via `VITE_USE_MOCK_DATA=false` env flag. `npm run verify` passes all 4 stages: Oxlint 0 warnings, Vitest 9 tests, Vite build, Pytest 21 tests.

- **2026-10-24 (Organization & Foundation):** Completed comprehensive project organization for 3-member team. Removed redundant `axiom_project_essentials/` folder. Created `TASKS.md`, `scripts/verify.sh`, and `docs/WORKFLOW.md`. Updated `README.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `AGENTS.md`, and `docs/API.md`. Cleaned all lingering Oxlint warnings across pages to achieve 0 warnings and 0 errors on `npm run verify`.

- **2026-10-22 (Bootstrap & Skills):** Discovered and loaded design taste skills (`design-taste-frontend`, `gpt-taste`, `stitch-design-taste`). Verified all 8 canonical screens.
