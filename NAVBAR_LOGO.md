# Hope Consultants — Navbar Logo

## 1. Which logo appears in the navbar

The navbar is **Midnight Blue (`#000C38`)**. The brand identity document (page "Logo Usage") says to use the original full-colour logo on light backgrounds and the **approved white/reversed version on dark backgrounds**. So the navbar uses the **reversed horizontal lockup**: mark on the left, wordmark on the right.

- Source in the PDF: page 5, "LOGO DISPLAY", the large navy tile at the top-left of the mockup grid (the same reversed lockup also appears on the monitor, phone, cap and notebook mockups).
- The tagline line under the lockup in that tile ("Your Study Abroad Partner | Dream | Plan | Achieve") is **not** part of the navbar logo and has been removed.
- The PDF pages are flattened images, so the logo was cut out of the page and the navy background removed. Result: transparent PNG, no background.

## 2. Files (in the `brand/` folder next to this document)

| File | Size | Use |
|---|---|---|
| `brand/logo-white.png` | 765 × 321 px, transparent | Navbar, mobile menu, footer (all on Midnight Blue or Obsidian Veil) |
| `brand/logo-mark-white.png` | 286 × 321 px, transparent | Favicon, browser tab, preloader (the "H" mark alone) |
| `brand/navbar-logo-placement-preview.png` | preview only | Shows placement at desktop, mobile and scrolled states. Do not put it in the repo |

Copy the first two to `public/brand/logo-white.png` and `public/brand/logo-mark-white.png` in the project.

Limits you should know about: this is a cutout from a raster image, so it is sharp enough for navbar use up to 3× pixel density but not for large print or a huge hero display. When the designer can send the original vector (SVG) or the full-colour PNG, replace these files with the same names; nothing else changes. The full-colour version for light backgrounds is not in this pack yet.

## 3. The logo described in words (for the model, which cannot see images)

- Overall shape: horizontal lockup, aspect ratio 765 : 321 (about 2.38 : 1). Mark on the left taking about 37% of the width, wordmark on the right.
- **Mark**: a capital "H" built from two tall vertical bars with fully rounded ends. In the reversed version the **upper half of both bars is white and the lower half is Solar Ember**. A small white wireframe **globe** (circle with meridians and parallels) sits above the right bar, like the dot of an "i". A Solar Ember **swoosh of two flowing wave strokes ending in a paper-plane arrowhead** crosses the H from the lower-left, rising to the right, and points to the right at the top of the crossbar.
- **Wordmark**: "HOPE" in large, thin, wide capital letters, white. Directly below it "CONSULTANTS" in heavy bold capitals, white, smaller, spanning about the same width as HOPE. The font names in the brand document are Qafinite Regular (HOPE) and Montserrat Black (CONSULTANTS); they are baked into the image, never retyped.
- Colours as measured from the artwork: white about `#FFFFFF`, Solar Ember about `rgb(255, 186, 27)`, within a hair of the brand `#FFB703`. **Do not recolour or "correct" it.**

## 4. Placement rules (exact)

| Property | Desktop ≥ 1024px | Mobile and tablet < 1024px |
|---|---|---|
| Navbar height | 80px | 68px |
| Logo height | 52px (width auto, about 124px) | 44px (width auto, about 105px) |
| Position | Far left, vertically centred | Far left, vertically centred |
| Left padding | 64px (same as the page container edge) | 20px |
| Right side | Links centred, primary Solar Ember button at the far right | Hamburger at the far right |
| Link | Whole logo is a link to `/`, minimum hit area 44px tall | Same |
| Scrolled (after 24px) | Logo scales to 0.85 from its left edge (transform only), navbar height unchanged | Same |
| Entrance | Fades in and slides from 12px left after the preloader completes | Same |

Clear space: at least 14px above and below the logo inside the bar and at least 32px between the logo and the first navigation link. Nothing else sits inside that space.

Allowed backgrounds for this file: **Midnight Blue and Obsidian Veil only**. Never place it on Pure White, Fogstone or Solar Ember (the brand document defines separate variants for those; they are not in this pack).

Never: stretch, squash, rotate, recolour, add a drop shadow or glow, put a filter on it, outline it, retype the wordmark, animate its parts, or crop it. Hover effect: none on the image itself; keyboard focus shows the standard 2px Solar Ember outline with 3px offset around the link.

Mobile menu: the same lockup at the top-left of the full-screen panel at the same 44px height, close button at the right. Footer: the same lockup at 56px height on the dark footer.

## 5. Paste-ready prompt for OpenCode

Use this after Step 1 (foundation) exists. If you already ran Step 2, this simply replaces its logo and navbar-size decisions.

```text
Read AGENTS.md completely. Execute the NAVBAR LOGO task only. Follow the step protocol and stop for approval at the end. Do not commit until I write "APPROVED STEP 2-LOGO".

Assets: public/brand/logo-white.png (765x321, transparent, reversed horizontal lockup) and public/brand/logo-mark-white.png (286x321, transparent, the H mark alone). Confirm both files exist first; if either is missing, stop and tell me. Do not create, recolour, redraw or convert any logo. The logo is a Solar Ember and white artwork of a capital H with a globe, a paper-plane swoosh and the words HOPE and CONSULTANTS. It is used only on Midnight Blue or Obsidian Veil backgrounds.

1. Logo component (components/ui/logo.tsx): a server-safe component built on next/image. Props: variant ('lockup' | 'mark'), priority (boolean, default false), className. Intrinsic size comes from a constant map: lockup 765x321 from /brand/logo-white.png, mark 286x321 from /brand/logo-mark-white.png. Alt text "Hope Consultants". Pass sizes="(min-width: 1024px) 124px, 105px" for the lockup. The component never sets an explicit pixel width and height other than the intrinsic attributes; display size is controlled by CSS with height set and width auto, so the aspect ratio can never distort. No tone prop for now, because only the reversed version exists.

2. Navbar logo link: a Next Link to "/" wrapping the lockup with priority. Class navbar-logo: display inline-flex, align-items center, min-height 44px, transform-origin left center, transition transform 0.5s var(--ease-out). Image height 44px with width auto below 1024px; 52px with width auto at 1024px and above. The navbar is 80px tall at 1024px and above and 68px below. Logo left padding follows the page container (64px desktop, 20px mobile). Vertically centred by flex alignment, not by magic margins. At least 32px between the logo and the first nav link.

3. Scrolled state: when the navbar is in its scrolled state (after 24px of scroll), the logo scales to 0.85 using transform only. The navbar height does not change.

4. Entrance: the logo fades in and moves from translateX(-12px) to 0 over 0.7s with the standard ease, starting on the hope:intro-complete event or immediately if the intro has already run or is skipped. Under reduced motion it is simply visible.

5. Focus: keyboard focus on the logo link shows the global Solar Ember focus ring. No hover effect on the image.

6. Reuse the same Logo component in the mobile menu panel (top-left, 44px height) and in the footer (56px height on the dark footer). Do not create a second logo implementation.

7. No filters, drop shadows, glows, rotations, cropping or colour changes on the logo anywhere. No comments in code.

Verify with lint, typecheck and build. In your report include a manual checklist: logo sharpness on a retina display and on a normal display, alignment with the navbar centre line at 1440, 1024, 768 and 375 wide, clear space to the first link, the scaled state after scrolling 24px, the entrance after the preloader, the focus ring by pressing Tab, the click goes to the home page, the same logo in the mobile menu and the footer, and no layout shift when the page loads (the logo area must not jump).
```

## 6. What to check yourself when it is built

1. At 1440px the logo top and bottom should have about 14px of space inside the navbar and its left edge lines up with the hero text below.
2. The white parts of the logo are pure white and the lower half of the H is warm yellow-gold, not orange and not washed out.
3. At 375px the words CONSULTANTS are still readable. If they feel too small, tell the agent to raise the mobile logo height from 44px to 48px and the mobile navbar to 72px.
4. No visible fringe (light halo) around the letters against the navy. If you see one, the cutout edge needs to be redone; send me a screenshot and I will refine it, or ask the designer for the original SVG.

## Current repo state (addendum)

- **Status:** neither white logo file is delivered yet. `public/brand/` contains only `logo-full-color.jpg` (full-colour lockup on a white JPG background). Owner approved using the full-colour file for now; record this as a gap and swap to the white files when supplied.
- **Navbar background:** currently light (`hope-white/80`). The master file specifies Midnight Blue `#000C38`. The navbar must be re-coloured to Midnight Blue so the reversed logo has a valid background once delivered.
- **Current `<Logo>`:** `src/components/ui/logo.tsx` always renders `/brand/logo-full-color.jpg` at 258×317 and ignores its `tone`/`variant` props. It must be rebuilt to the spec above when STEP 2 runs.