# Axiom — Design System

## Status and Source of Truth
The approved Google Stitch project is the visual source of truth:
https://stitch.withgoogle.com/projects/17845469504253765522

The project brief describes eight canonical screens. Inspect the actual Stitch project, exports, screenshots, and repository assets before implementation. This file captures the known starting direction and must be reconciled with the actual designs.

## Visual Direction
- Editorial, restrained, high-quality contract intelligence product.
- Avoid generic dashboard templates, gratuitous gradients, excessive rounded cards, and decorative UI not present in the reference.
- Prioritize typography, spacing, alignment, and calm visual hierarchy.
- Keep application chrome consistent across authenticated screens.

## Starting Design Tokens
Verify these against Stitch before treating them as final.

```css
:root {
  --color-page: #F7F4EE;
  --color-surface: #FFFDFA;
  --color-border: #E6E0D6;
  --color-ink: #1C1B19;
}
```

Typography direction:
- Editorial headings: DM Serif Display or Newsreader, according to the reference.
- Interface text: Inter.
- Use reliable font fallbacks and avoid layout shifts where practical.

## Canonical Screens
1. Public landing page
2. Dashboard
3. Analyze contract
4. Analysis workspace/results
5. Compare documents
6. Analysis report
7. Document history
8. Settings and profile

## Components and States
Define and reuse styles for:
- Public and authenticated navigation.
- Buttons and links.
- Inputs, selects, file upload, and form validation.
- Cards, tables, filters, tabs, dialogs, and menus.
- Risk severity indicators.
- Loading skeletons, empty states, errors, and success feedback.
- Responsive navigation and mobile-adapted data layouts.

## Risk Communication
If the product supports High/Medium/Low severity:
- Use consistent red/amber/green treatments matching the actual design.
- Pair color with text or an icon; never use color alone.
- Do not invent severity scoring or imply that mock findings are real.

## Responsive and Accessible Behavior
- Desktop is the primary reference, but tablet and mobile layouts must remain usable.
- Prevent accidental horizontal overflow.
- Preserve readable line lengths and intentional spacing.
- Provide keyboard focus indicators, semantic labels, and adequate contrast.
- Respect reduced-motion preferences.

## Visual QA Checklist
For each of the eight screens:
- Compare screenshot to the matching Stitch reference.
- Check content width, margins, typography, line breaks, spacing, and vertical rhythm.
- Check colors, borders, radii, icons, and asset fidelity.
- Check interaction states and responsive layouts.
- Revisit all screens after changing shared tokens or components.

Record verified deviations and decisions here. Do not claim screenshots were compared unless that review occurred.
