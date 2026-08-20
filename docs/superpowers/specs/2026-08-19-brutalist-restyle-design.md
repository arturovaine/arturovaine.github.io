# Neo-Brutalist Restyle — Design Spec

**Date:** 2026-08-19
**Scope:** Restyle only (no layout/section/content changes). Whole site, one pass.

## Goal
Apply a soft neo-brutalist visual language to the portfolio: paper/cream surfaces,
thick muted borders, hard offset shadows (solid, zero blur), monospace accents,
bold sans headings, and "lift on hover" interactions — inspired by the reference
screenshot the user provided.

## Decisions (locked)
- **Light theme (default): "C — Cool paper + Blue"**
- **Dark theme: "E — Slate + Blue"** (brutalist dark counterpart)
- Keep the existing light/dark toggle; it now switches **C ⇄ E**. Default = light (C).
- Reuse the existing theme-override mechanism (`light-theme.css` pattern): a body-class-
  scoped stylesheet that overrides inline Tailwind utilities + component classes with
  `!important`, driven by CSS variables.

## Palette tokens
Light (C):
- `--bg:#EEF1F5` · `--surface:#F7F9FC` · `--surface2:#E5EAF1`
- `--ink:#3C4557` · `--ink2:#232936` · `--soft:#5A6478`
- `--line:#A6B0C2` · `--lines:#5A6478` (shadow color) · `--accent:#2563EB` · `--accentb:#1E3A8A`

Dark (E):
- `--bg:#15181F` · `--surface:#1E232D` · `--surface2:#272D3A`
- `--ink:#C3CAD8` · `--ink2:#F2F5FB` · `--soft:#828CA1`
- `--line:#3C4353` · `--lines:#586074` · `--accent:#3B82F6` · `--accentb:#1D4ED8`

Shared mechanics: `--radius:14px` · border `2.5px` · shadow `5px 5px 0 var(--lines)` ·
small shadow `3px 3px 0 var(--lines)`. Fonts: Inter (700–900 for headings) + JetBrains
Mono for eyebrows/tags/labels (both already loaded).

## Architecture
1. **New file `css/brutalist.css`** — the whole restyle:
   - Palette vars on `body.brutalist` (dark E base) and `body.brutalist.light-theme` (light C).
   - Mechanics + overrides for: body bg/text, headings, header, `.card` + `.card-*`,
     `.project-card`, `.btn-primary/secondary/ghost/chip/carousel/dot`, `.tag`, `.card-tag`,
     `.badge-status` + `.dot`, hero stat boxes, `.text-navy`, modal, cookie banner,
     scroll-to-top, footer, section dividers, and the neutral bg/border Tailwind utilities.
2. **`index.html`** — add `brutalist light-theme` to `<body>`, link `brutalist.css` after
   `tailwind.min.css`, update the inlined critical CSS + `<meta theme-color>` so first paint
   is the light-C paper (no dark→light flash).
3. **`ThemeManager.js`** — default theme `light` (was `dark`); toggle logic unchanged
   (adds/removes `light-theme`).

## Out of scope
No HTML structure changes, no section reordering, no copy changes, no new components.
The signature "pill / ✕ chips" from the reference are a visual language cue applied via
existing elements (badge-status, tags), not new markup.

## Verification
Load the real site at localhost:5173, screenshot light + dark across hero, cards, buttons,
footer, and the project/modal views; confirm parity with the approved mockups.
