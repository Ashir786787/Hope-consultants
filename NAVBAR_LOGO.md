# Navbar Logo Placement — Hope Consultants

## Context

- The logo is fully contained inside the artwork files in `/public/brand/`. No text is ever needed next to it. Do not re-typeset "HOPE CONSULTANTS" in HTML.
- The master build file calls for `logo-white.png` (reversed lockup) and `logo-mark-white.png` (reversed mark) for the Midnight Blue navbar. **These files are not yet delivered.** Current repo has only `logo-full-color.jpg` (used in a light navbar). Owner approved: use `logo-full-color.jpg` for now, report the gap, and swap in the white versions when supplied.
- Placement and spacing are defined in the paragraphs below. Build the logo rendering to spec, not from my memory of it.

## Files (in `/public/brand/`)

| File | Usage | Size |
|---|---|---|
| `logo-white.png` — **pending, not delivered** | Reversed horizontal lockup. **Dark backgrounds only** (navbar, footer, Midnight sections). | 765 × 321 |
| `logo-mark-white.png` — **pending, not delivered** | The "H+globe+paper-plane" mark only, reversed. Preloader, loading screens, small contexts. | 286 × 321 |
| `logo-full-color.jpg` — **current only file** | Full-colour horizontal lockup. **Light backgrounds only** (current navbar, white section headers, contact page). | existing |

## Placement rule

- **Clear space:** equal to the height of the "H" mark on all sides. Never smaller.
- **Navbar:** the logo sits on the left of the sticky navbar. 54px tall (fixed). The navbar rail gives it space automatically: `padding: 0 40px` on desktop, `24–32px` spacing between logo and nav links. Do not stack text next to it — the logo is the brand, no wordmark text is needed.
- **Footer:** 48px tall, top of the footer content area, left-aligned.
- **Preloader:** the mark only (`logo-mark-white.png`), centered, 120px wide, inside a 192px clear-space circle.
- **Never** rotate, scale unevenly, recolour, add dropshadow, outline, or re-typeset the logo. It appears at exactly the sizes above and never sits on a busy area.