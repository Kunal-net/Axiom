Axiom — Frontend Design System
Product: Axiom Category: AI-powered contract intelligence Target users: Freelancers, independent professionals, and small businesses Design direction: Premium, editorial, minimal, trustworthy Reference: Solva Framer template + Axiom Stitch mockups Primary objective: Make complex contract analysis feel simple, understandable, and professional.
1. Design Philosophy
Axiom should feel like a premium legal-tech product rather than a generic AI SaaS dashboard.
The visual language should combine the elegance of an editorial website with the clarity of a professional document-review application.
Core principles


Clarity over decoration — Every element must help users understand, navigate, or analyze contracts.

Trust through design — Use restrained colors, readable typography, consistent layouts, and evidence-backed findings.

Editorial elegance — Use expressive serif typography for major headlines and clean sans-serif typography for application UI.

Whitespace is intentional — Avoid unnecessary borders, visual clutter, and dense layouts.

Consistent interactions — Buttons, navigation, cards, inputs, tables, and dialogs must behave predictably.

Evidence before AI claims — Risk findings should display the original clause, explanation, and document location.

Functional over decorative — Prioritize usable workflows and realistic product interactions.
Use the Solva reference for visual direction, not as a pixel-for-pixel copy.
2. Brand Identity
Brand personality


Intelligent

Calm

Precise

Professional

Approachable

Reliable
Brand positioning
Axiom helps freelancers understand contracts before signing by identifying risky clauses, comparing documents, and explaining legal language in plain English.
Brand voice
Use language that is concise, helpful, and non-alarmist.
Preferred:


"Understand this clause"

"Why this may be risky"

"Review suggested revision"

"Compare documents"

"View supporting evidence"
Avoid:


Unsupported guarantees

Fear-driven warnings

Excessive legal jargon

Claims that AI replaces a qualified lawyer
Logo
Use a minimal geometric symbol paired with the Axiom wordmark.
The logo should work in:


Full desktop navigation

Collapsed sidebar

Mobile navigation

Favicon and application icon
Keep the logo monochromatic by default.
3. Color System
Use a warm, neutral palette inspired by Solva.
Base colors
TokenHexUsageBackground#F7F4EEMain application backgroundSurface#FFFDFACards, dialogs, panelsSurface Secondary#F0ECE4Secondary cards and muted areasSurface Hover#EAE5DCHover statesBorder#E6E0D6Borders and separatorsText Primary#1D1B18Headings and primary textText Secondary#716B63Descriptions and secondary labelsText Muted#979087Supporting metadataPrimary#1C1B19Primary buttons and active controlsPrimary Hover#34312CPrimary button hoverPrimary Foreground#FFFFFFText on dark buttons
Risk colors
SeverityBackgroundTextUsageHigh#FCE4DF#A83224Significant potential riskMedium#FFF0D8#92530CClause requiring attentionLow#E1EFE4#286344Lower-priority findingInformational#E5EBF5#365B91Neutral information
Risk colors must be used consistently across the dashboard, analysis workspace, comparison screen, and reports.
Important: Never communicate severity using color alone. Include text labels and, where appropriate, icons.
Color rules


Use warm backgrounds rather than pure white across entire pages.

Reserve near-black for primary actions, headings, and active navigation.

Avoid purple gradients and excessive saturated colors.

Use red only when it communicates a meaningful risk or error.

Keep shadows subtle.

Maintain readable text contrast.
4. Typography
Use a two-font system.
Display typography
Preferred font: DM Serif Display.
Alternatives: Instrument Serif, Georgia.
Use for:


Landing page hero headline

Major section headings

Report titles

Editorial feature headings
Characteristics:


Expressive

Elegant

High contrast

Comfortable line height
Interface typography
Preferred font: Inter.
Alternatives: Geist, system sans-serif.
Use for:


Navigation

Buttons

Form labels

Tables

Document metadata

Risk findings

Dashboard headings

Body copy
Typography scale
ElementDesktop sizeWeightHero heading64–76 pxRegularPage heading36–44 pxRegularSection heading30–40 pxRegularCard heading17–20 pxMediumBody text14–16 pxRegularSecondary text12–14 pxRegularMetadata11–12 pxRegularButton text13–14 pxMedium
Use clamp() for responsive display headings.
Example:
.hero-title {
  font-family: "DM Serif Display", Georgia, serif;
  font-size: clamp(2.75rem, 5vw, 4.75rem);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: -0.045em;
}
Avoid oversized typography inside the authenticated application. Dashboard usability takes priority over visual drama.
5. Spacing and Layout
Use a consistent spacing scale.
TokenValuespace-14pxspace-28pxspace-312pxspace-416pxspace-520pxspace-624pxspace-832pxspace-1040pxspace-1248pxspace-1664pxspace-2080pxspace-2496px
Page layout


Desktop design target: 1440px wide.

Marketing content maximum width: approximately 1360px.

Standard dashboard content padding: 28–36px.

Landing page horizontal padding: 32–48px.

Section spacing: 80–112px on desktop.

Card internal padding: 20–28px.

Mobile horizontal padding: 20px.
Grid
Use a responsive grid rather than fixed-width layouts.


Feature grids: three or four columns.

Dashboard action cards: three columns on desktop.

Analysis workspace: three-column layout.

Document comparison: two document panes with a findings panel.

Mobile: single-column layouts.
Do not allow content to overflow horizontally at common screen widths.
6. Surfaces, Cards, and Borders
Cards


Background: #FFFDFA.

Border: 1px solid #E6E0D6.

Border radius: 16–20px.

Padding: 20–28px.

Shadow: minimal, used only where depth improves hierarchy.
Buttons
Primary:


Near-black background.

White text.

Rounded corners.

Medium font weight.

Subtle hover transition.
Secondary:


Transparent or surface background.

Neutral border.

Dark text.
Tertiary:


Text-only action.

No unnecessary border.
Button sizes:


Small: 32px height.

Medium: 40px height.

Large: 48px height.
All interactive controls must have visible hover, focus, active, loading, and disabled states as appropriate.
Inputs


Height: 42–46px.

Border: neutral.

Background: surface color.

Radius: 10–12px.

Clear focus ring.

Helpful error messages beneath the field.
Tables
Use restrained horizontal separators and ample row padding.
Avoid heavy gridlines, excessive badges, and unnecessarily dense tables.
7. Navigation Architecture
The application should have two distinct navigation experiences.
Public navigation


Logo

Product

How it works

Use cases

Pricing

FAQ

Sign in

Get started
Authenticated sidebar


Dashboard

Analyze

Compare

History

Templates

Settings
The sidebar should:


Remain consistent across application pages.

Clearly identify the active page.

Use small, consistent icons.

Support collapse on narrower screens.

Show the account area at the bottom on desktop.
Do not introduce unrelated navigation items unless they support a real product feature.
8. Page Specifications
Page 1: Landing Page
Purpose: Explain Axiom's value and encourage users to try the product.
Hero
Headline:
"Understand your contracts before you sign."
Supporting copy:
"Axiom analyzes, compares, and explains contracts in plain language — so you can spot risks, understand your obligations, and make confident decisions."
Primary CTA: Try Axiom for free
Secondary CTA: See how it works
Include a sophisticated document illustration showing a highlighted clause and a contextual risk card.
Feature strip


Detect risks

Compare contracts

Plain-language explanations

Save time
How it works
Three steps:


Upload your document.

Review AI findings.

Get your report.
Additional sections


Product preview

Freelancer use cases

Key benefits

FAQ

Final CTA

Footer
The landing page should be visually polished but not overloaded with animations or decorative elements.
Page 2: Dashboard
Purpose: Give users a clear starting point for contract work.
Header


Greeting

Short supporting description

Search field

Profile menu
Primary actions
Three cards:


Analyze a contract

Compare documents

Use a template
Recent documents
Columns:


Name

Type

Date

Risk count

Status

Actions
Include realistic document examples such as:


Freelance Agreement.pdf

NDA CompanyX.pdf

Service Contract.docx
These are sample records for the prototype, not real user data.
Dashboard states
Support:


First-time user

Documents available

Loading

Failed document retrieval
Page 3: Analyze Contract
Purpose: Upload a document and begin analysis.
Upload area


Drag-and-drop zone

File picker

Supported file types: PDF and DOCX, subject to backend support

File size limit supplied by the application configuration

Upload progress

File removal action

Validation feedback
Processing states
Represent the workflow as:


Uploading

Extracting text

Analyzing clauses

Generating report
Show actual progress only when supported by the backend. Otherwise, use clearly labeled processing states without fabricated percentages.
Provide helpful error messages and a retry action.
Page 4: Analysis Results
Purpose: Make contract risks easy to understand and investigate.
This is the most important application screen.
Layout
Desktop:


Left: risk summary and clause list.

Center: document viewer.

Right: selected clause explanation.
Risk summary
Display:


High-risk clauses

Medium-risk clauses

Low-risk clauses
Counts must come from actual analysis results.
Document viewer


Page navigation

Zoom controls

Highlighted source clauses

Selected clause state

Clear page references
Clause details
Display:


Clause title

Severity

Original text

Plain-language explanation

Why it may be risky

Supporting evidence

Suggested revision
Actions:


Copy revision

View in document

Mark as reviewed, if supported

Navigate to the next finding
Never fabricate page references or claim a clause exists when it has not been extracted.
Page 5: Compare Documents
Purpose: Help users identify meaningful differences and conflicts between related documents.
Layout


Original document selector

Revised document selector

Comparison action

Summary of differences

Side-by-side document panes

Difference details panel
Difference types


Added text

Removed text

Modified clauses

Potential conflicts

Unchanged content
Use restrained red and green highlighting for deleted and added content, respectively.
Provide text labels in addition to color.
Actions


Select a difference

Navigate to its source

Filter results

Return to document selection

Export findings, if implemented
Distinguish textual differences from actual contractual conflicts. A textual change does not automatically mean the documents contradict each other.
Page 6: Analysis Report
Purpose: Present a clear, shareable summary of contract findings.
Sections


Report title and document details

Overall risk summary

Executive summary

Key findings

Clause-by-clause analysis

Supporting evidence

Suggested revisions

Comparison findings, when available

Disclaimer and limitations
Actions


Download report

Copy finding

Share or print, where supported
Reports should use a clean document-like layout that works both on screen and in print.
Any generated PDF must preserve page references and readable text.
Page 7: History
Purpose: Help users return to earlier analyses.
Components


Search

Document type filter

Status filter

Sort controls

Document table

Pagination or incremental loading
Each record should include:


Document name

Type

Date

Risk summary

Processing status

Available actions
Selecting a record should reopen its corresponding saved analysis or report when available.
Include empty, loading, and error states.
Page 8: Settings and Profile
Purpose: Provide basic account and application preferences.
Sections


Profile information

Preferences

Security

Plan or usage, if applicable
Do not display nonfunctional settings or invented subscription entitlements.
Include form validation, save feedback, and error handling.
9. Reusable Component Library
Build the interface from reusable components.
Brand and layout


AxiomLogo

PublicNavbar

AppSidebar

AppHeader

PageContainer

SectionHeading
Inputs and actions


Button

Input

Select

SearchInput

FileDropzone

DocumentSelector

FilterMenu
Product components


DocumentCard

RecentDocumentsTable

RiskBadge

RiskSummary

ClauseList

ClauseDetailPanel

DocumentViewer

ComparisonViewer

AnalysisProgress

ReportSummary
Feedback and overlays


EmptyState

LoadingState

ErrorState

Toast

ConfirmDialog

Tooltip
Components should share design tokens and have clear interfaces. Avoid duplicating the same UI implementation across multiple pages.
10. Interaction and Motion
Use motion to clarify interface behavior, not to distract.
Recommended transitions


Hover transitions: 150–200ms.

Dropdowns and popovers: 150–200ms.

Sidebar transitions: 200–250ms.

Dialog transitions: 180–250ms.
Interactions


Buttons respond to hover and click.

Cards show subtle hover feedback when interactive.

Navigation reflects the active page.

Selecting a clause updates its details.

Selecting a finding scrolls to or highlights its source when supported.

File uploads provide clear feedback.

Long-running analysis exposes progress and failure states.

Copy actions confirm completion.

Destructive actions request confirmation when necessary.
Respect prefers-reduced-motion.
Avoid excessive parallax, large animated backgrounds, and unnecessary page transitions.
11. Responsive Behavior
Design desktop-first, then adapt for tablet and mobile.
Desktop: 1200px and above


Full sidebar

Three-column analysis workspace

Side-by-side comparison

Multi-column cards
Tablet: 768–1199px


Collapsible sidebar

Reduced page padding

Flexible card grids

Analysis panels that can be resized or stacked

Comparison panels with controlled scrolling
Mobile: below 768px


Compact navigation

Single-column card layouts

Full-width primary actions

Stacked analysis panels

Clause details in a drawer or dedicated section

Comparison views that switch between documents rather than compressing both panes

Tables adapted to cards or horizontally scrollable containers
Avoid simply scaling down the desktop interface.
All essential functionality must remain accessible on mobile.
12. Accessibility
Target WCAG 2.2 AA where practical.
Requirements:


Semantic HTML.

Keyboard-accessible navigation.

Visible focus indicators.

Sufficient text contrast.

Labels for all form controls.

Accessible dialogs and menus.

Screen-reader-friendly risk labels.

Status messages announced appropriately.

No reliance on color alone.

Appropriate text resizing and zoom support.

Reduced-motion support.
Risk findings and document annotations must remain understandable without visual color cues.
13. Frontend Implementation Guidance
The design must be realistic to implement in a working hackathon MVP.
Recommended approach
Use the project's existing framework and conventions. If the frontend is not yet established, a suitable baseline is:


React

TypeScript

Vite or the existing supported framework

Tailwind CSS

A reusable component library such as shadcn/ui

Lucide icons
Do not introduce a new framework or replace existing infrastructure without a concrete reason.
Implementation principles


Keep shared design tokens in one place.

Use reusable components.

Separate API integration from presentation components.

Model loading, success, empty, and error states explicitly.

Use real backend data when available.

Keep sample data isolated from production logic.

Validate file uploads on both client and server.

Handle network failures gracefully.

Avoid hardcoded user-specific data.

Use accessible form controls.

Keep the application responsive.
Suggested organization
src/
  components/
    ui/
    layout/
    documents/
    analysis/
    comparison/
    reports/
  pages/
    LandingPage.tsx
    DashboardPage.tsx
    AnalyzePage.tsx
    AnalysisResultsPage.tsx
    ComparePage.tsx
    ReportPage.tsx
    HistoryPage.tsx
    SettingsPage.tsx
  hooks/
  services/
  types/
  lib/
  styles/
Adapt this structure to the repository instead of restructuring working code unnecessarily.
14. Data Integrity and AI Trust
Axiom deals with legal documents, so correctness and transparency are essential.


Clearly distinguish AI-generated explanations from original contract text.

Preserve source excerpts and page references whenever available.

Do not invent analysis findings, citations, or document metadata.

Never present sample data as real user data.

Show processing and failure states honestly.

Treat AI outputs as assistance rather than definitive legal advice.

Include an appropriate legal disclaimer.

Do not expose uploaded contract contents unnecessarily.

Avoid logging sensitive document text or personal information.

Ensure user-facing reports accurately reflect the backend response.
Suggested disclaimer:
"Axiom provides AI-assisted contract analysis for informational purposes only. It does not provide legal advice or replace review by a qualified legal professional."
15. Design References and Stitch Workflow
Google Stitch should be used to establish and refine the visual design.
Reference hierarchy


Solva Framer template — overall aesthetic and section composition.

Axiom landing page mockup — brand and marketing layout.

Axiom dashboard mockup — authenticated application layout.

Axiom analysis mockup — primary product workflow.

Comparison, report, history, and settings mockups — secondary workflows.
Stitch workflow


Establish the landing page and design system.

Create the dashboard using the same colors, typography, and spacing.

Design the contract analysis workspace in detail.

Add the upload and processing states.

Create comparison and report screens.

Finish history and settings.

Review consistency across all screens.

Implement the approved design in the existing codebase.

Test responsiveness and functional workflows.
Do not generate eight visually unrelated pages. All screens must feel like the same product.
16. Definition of Done
The design is ready for implementation when:


All eight main pages have a consistent visual identity.

Landing page hierarchy and CTAs are clear.

Dashboard navigation and primary actions are obvious.

Contract analysis is the strongest product screen.

Clause findings connect to source evidence.

Comparison clearly distinguishes changes from potential conflicts.

Reports are readable and exportable where implemented.

Loading, error, empty, and success states are covered.

Mobile and tablet layouts have been considered.

Keyboard navigation and focus states are defined.

Shared components and tokens are reusable.

The design can be implemented with the project's existing stack.

All displayed product claims and sample data are clearly identified.
Final Design Direction
Axiom should feel like a refined, dependable workspace where freelancers can understand complex contracts without feeling overwhelmed.
Warm ivory surfaces. Editorial serif headlines. Precise sans-serif UI. Subtle borders. Clear risk indicators. Evidence-backed analysis.
The landing page earns trust. The dashboard provides direction. The analysis workspace delivers the product's core value.
Every design decision should reinforce those three goals.