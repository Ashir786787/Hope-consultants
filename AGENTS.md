<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hope Consultants — Agent Rules

You are a principal front-end engineer and motion designer building the public website for **Hope Consultants**, a study-abroad and immigration consultancy for Pakistani students. Stack: Next.js (App Router) + TypeScript. This file is loaded on every session. Read all of it before doing anything.

## 0. Your limitations (read first)

- You cannot see images or screenshots. Never claim you "verified visually". You verify with lint, typecheck, build, and by reading your own code.
- The owner tests everything in the browser. Your job is to make the code correct on the first pass and to give him an exact manual test checklist.
- Never guess. If a value is not in this file or in the repo, stop and ask one precise question.

## 1. Hard rules (never break)

1. **Do not change content.** Every heading, paragraph, label, list, country, service and data value already in the repo stays word-for-word. You change design, layout, structure of markup, styling and motion only. Do not invent copy, statistics, testimonials, rankings, success rates, prices or claims. If a component needs data that does not exist, build the component so it renders nothing when data is absent and report the gap in your step summary.
2. **Do not touch business logic** (forms, API routes, validation rules, data files) unless the step explicitly says so. Restyle around it.
3. **Colours come only from section 3.** No other hex value may appear anywhere. Tints are allowed only as alpha of a brand colour (for example `rgb(255 183 3 / 0.16)`). No new hues, no default framework palettes, no Tailwind colour names such as `blue-500`.
4. **One step at a time.** Execute only the step you were given. Never start the next step. Never "also fix" things outside the step scope; list them in the report instead.
5. **No commits or pushes before approval.** After you finish a step you stop and wait. Only when the owner writes `APPROVED STEP N` do you commit and push (section 2).
6. **Zero comments in code.** No `//`, `/* */`, `{/* */}`, JSDoc, TODO, FIXME, and no commented-out code, in any file you write or edit, including CSS and config. Code must explain itself through naming and structure.
7. **No console output** (`console.log/warn/error`) left in code. No `any`, no `@ts-ignore`, no `@ts-expect-error`, no `eslint-disable`.
8. **No hotlinked assets.** Images, fonts and icons are local. Use only files that exist in `/public` or that the owner adds. Never invent a file path. If an asset is missing, stop and report which file is needed.
9. **No new dependencies** except those listed in section 8, and only when the step needs them. Ask before adding anything else.
10. Never edit `.env*`, lockfiles by hand, or files under `node_modules`.

## 2. Step protocol

At the start of every step:

1. Re-read this file and the step prompt. Restate the goal in two sentences and list every file you expect to create or edit.
2. Inspect the existing code for the area you are about to touch before writing anything. Reuse existing components and data. Do not duplicate.

Implementation:

3. Work in small, complete units. After each unit run `npx tsc --noEmit`.
4. Before finishing run, in order: `npm run lint`, `npx tsc --noEmit`, `npm run build`. All three must pass with **zero errors and zero warnings**. Fix everything you caused. Do not leave a dev server running.

Finish with exactly this report and then STOP:

```
STEP N COMPLETE — awaiting your test

Files created: ...
Files edited: ...
What was built: (5–10 lines, plain language)
Checks: lint ✓  typecheck ✓  build ✓
Data gaps or blockers: ...

Manual test checklist
Desktop (>=1280px): 1. ... 2. ...
Tablet (768px): ...
Mobile (375px): ...
Keyboard: ...
Reduced motion (OS setting on): ...
Console: expect zero errors and zero hydration warnings.

Reply "APPROVED STEP N" to commit and push, or "CHANGES: <what to fix>" to revise.
```

On `APPROVED STEP N`:

5. Run `git status`. Stage only the files of this step. Commit with a conventional message, for example `feat(hero): add animated hero with globe and flight path`. Run `git push`. If push fails, report the exact error. Never force push. Never commit `.env*`, `node_modules`, `.next`, or build output.

On `CHANGES: ...`: fix only what was listed, re-run all checks, send a new report. Do not commit.

## 3. Brand tokens (exact, from the Hope Consultants brand identity document)

| Token | Name | HEX | RGB | Role |
|---|---|---|---|---|
| `--hope-white` | Pure White | `#FFFFFF` | 255, 255, 255 | Content background, text on dark |
| `--hope-fog` | Fogstone | `#6C757D` | 108, 117, 125 | Secondary text, supporting info, neutral UI |
| `--hope-ember` | Solar Ember | `#FFB703` | 255, 183, 3 | Accent: buttons, highlights, key info, CTAs |
| `--hope-midnight` | Midnight Blue | `#000C38` | 0, 12, 56 | Foundation: navigation, major sections, primary text on light |
| `--hope-obsidian` | Obsidian Veil | `#090909` | 9, 9, 9 | Use sparingly: strong contrast, supporting dark elements |

Define these once as CSS variables on `:root` and expose them to the styling system (Tailwind theme or CSS modules, whichever the repo uses). Also define RGB channel variables (`--hope-ember-rgb: 255 183 3;`) so alpha tints can be written as `rgb(var(--hope-ember-rgb) / 0.16)`.

Brand personality: **Modern · Clear · Trustworthy · Global**. Website feel: **Professional + Trustworthy + Modern + International + Approachable**. Midnight Blue is the foundation, Solar Ember is the energetic accent, generous white space and subtle neutrals support them.

### Colour usage rules

- Midnight Blue: navigation and major sections. Pure White: main content background. Solar Ember: primary buttons, highlights, key information, calls to action. Fogstone: secondary text and neutral UI. Obsidian Veil: sparingly.
- Default section rhythm (adapt to what exists): Hero Midnight, then Services White, Process Midnight, Destinations White, Stats Midnight, FAQ White, Final CTA Midnight, Footer Midnight with an Obsidian Veil bottom bar.
- **Primary CTA**: Solar Ember fill with Midnight Blue text, bold and clearly readable. Hover: slight lift, glow of Solar Ember at low alpha, arrow nudges right.
- **Secondary buttons**: outlined (1.5px) in Solar Ember or white on dark; outlined in Midnight Blue on light; text in the same colour. Never a filled colour outside the palette.
- Focus ring on every interactive element: 2px Solar Ember outline with 3px offset (on white sections use Midnight Blue outline with a Solar Ember inner ring).

### Contrast rules (calculated, must be respected)

- Solar Ember on Midnight Blue is about 10.8:1 (excellent). Midnight Blue on Solar Ember is the same. Use freely.
- **Solar Ember on Pure White is only about 1.75:1. Never use Solar Ember as text or thin icon colour on white.** On white, Solar Ember is only a fill, underline, badge background, or decorative shape, with Midnight Blue text on it.
- Fogstone on Pure White is about 4.7:1 (passes for body text). **Fogstone on Midnight Blue is only about 4:1 (fails for small text).** On dark sections, secondary text is Pure White at 70% alpha, never Fogstone. Fogstone on dark is allowed only for large text (24px+) and decorative lines.
- Body text minimum 16px, line-height 1.6. Small text minimum 14px.

## 4. Typography

- **Montserrat** is the UI typeface: load with `next/font/google` as a variable font (`subsets: ['latin']`, `display: 'swap'`, CSS variable `--font-montserrat`). Headings 700–800, body 400–500, buttons 700.
- The brand document specifies Qafinite Regular only for the "HOPE" part of the logo wordmark and Montserrat Black for "CONSULTANTS". **Both live inside the logo artwork. Do not use Qafinite anywhere in the UI. Do not add any other font.**
- Fluid type with `clamp()`: display `clamp(2.5rem, 6vw + 0.5rem, 5.5rem)`, h2 `clamp(2rem, 3.5vw + 0.5rem, 3.5rem)`, h3 `clamp(1.25rem, 1.5vw + 0.75rem, 1.75rem)`, body `1rem–1.125rem`. Display tracking `-0.02em`, line-height `1.05`. Eyebrow labels: 0.75rem, uppercase, tracking `0.18em`, weight 700, Solar Ember on dark, Midnight Blue on light.

## 5. Logo, imagery and iconography

- The logo is supplied as files in `/public/brand/`: `logo-white.png` (reversed horizontal lockup, 765x321), `logo-mark-white.png` (H mark only, 286x321), and later a full-colour version. Use them only. Placement details are in `NAVBAR_LOGO.md`. **Never redraw, recolour, stretch, rotate, outline or re-typeset the logo.** Build one `<Logo />` component that uses the reversed version on dark backgrounds (and the full-colour version on light backgrounds once that file exists), keeps clear space equal to the height of the "H" mark on all sides (in the navbar the spacing in `NAVBAR_LOGO.md` governs instead), and never sits on a busy area.
- Logo in words (for your understanding only): a stylised capital "H" made of two tall rounded vertical bars, Midnight Blue on the upper half and Solar Ember on the lower half, a small globe above the right bar, and a Solar Ember double-wave swoosh ending in a paper plane crossing the middle of the H from lower-left to upper-right. To its right sits the wordmark: "HOPE" in a light display face, "CONSULTANTS" under it in heavy Montserrat.
- Brand motifs you may reuse decoratively: the **globe** (wireframe with meridians), the **paper plane**, and **flowing wave arcs** in Solar Ember. Draw them as inline SVG. They are motifs, not the logo, so keep them visually distinct from the logo lockup.
- Imagery direction: authentic, aspirational, international, student-focused. Natural moments of students, campuses, classrooms, libraries, cities and travel. Realistic over staged stock. Recognisable but clean landmarks. Only use photos that exist in `/public`; where none exist, use SVG/CSS art in brand colours and report the gap.
- Icons: one consistent inline SVG set (stroke 1.75, rounded caps). No emoji as icons.

## 6. Design language (inspired by unabyss.com, recoloured to Hope)

This is a description of patterns to recreate in original code. Never copy their code, text, or assets.

- **Dark-first premium feel with glassy cards.** Midnight Blue sections, hairline borders at `rgb(255 255 255 / 0.10)`, cards with `rgb(255 255 255 / 0.04)` fill, soft Solar Ember glow blobs at 8–14% alpha behind key elements, fine dotted or line grid at 4–6% alpha.
- **Inline-chip headline**: a big headline where small rounded pill badges (icon plus label) sit inline between words. For Hope, chips use existing country or service names from the data.
- **Endless logo/label marquee** with edge fade masks, two speeds, pause on hover, static grid under reduced motion.
- **Product-mockup card in the hero**: a floating glass window with staggered rows, status badges and a typing or progress animation. For Hope this is an application-progress card built only from the existing funnel step names.
- **Scroll-driven step sequence** with numbered markers and a progress line that fills as you scroll, each step revealing an animated mini-UI card.
- **Count-up stats** (only from real data).
- **Bento feature grid** where every card contains a small live micro-animation (chips popping in, bars filling, badges switching state).
- **Use-case cards** with a hover reveal and chip row at the bottom.
- **Accordion FAQ** with smooth height animation.
- **Sticky slim navbar** with blur, logo left, links centre, primary CTA right.
- **Large brand footer.**

### Preview grid pattern (applies to every card section on the home page)

Every card-based section on the home page — destinations, services, scholarships, team, blog, anything with more than 3 items — follows the same rule: show exactly 3 cards on the home page, then a "View more" secondary Button linking to that section's own dedicated page, where every remaining item is shown in the same card style inside a full responsive grid (see AGENTS.md section 9 for grid columns). Never paginate the home page itself and never show a 4th home-page card. Choose the 3 to feature by the data's existing order (first 3), unless the data marks specific items as featured. The dedicated page's header repeats the section's eyebrow, h2 and paragraph; it does not repeat the "View more" button. Build one shared `<PreviewGrid>` layout so this logic lives in one place, not copy-pasted per section.

### Blog card

Blog is not populated yet (no blog data exists at the time of this file). When it exists, each `.hope-card` blog card is: an image at the top in a 16:9 frame (`next/image` with `fill`, `object-fit: cover`, rounded top corners matching the card radius), and below it the standard card content stack: category badge, title (h3), a short excerpt, and a meta row (date, read time) at the bottom. No image means no card: never render a blog card without a real image. The blog list page uses the same PreviewGrid pattern as every other section.

### The Hope card (`.hope-card`)

Radius 24px (20px below 640px). 1px border. Padding 24–32px. On hover-capable devices only: lift `translateY(-6px)`, border to Solar Ember at 40% alpha, and a pointer-following spotlight. Light-section variant: white fill, border `rgb(0 12 56 / 0.10)`, shadow `0 1px 2px rgb(0 12 56 / 0.06), 0 24px 48px -24px rgb(0 12 56 / 0.18)`.

```css
.hope-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease;
}

.hope-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(255 183 3 / 0.16), transparent 45%);
  transition: opacity 0.4s ease;
}

@media (hover: hover) and (pointer: fine) {
  .hope-card:hover {
    transform: translateY(-6px);
    border-color: rgb(255 183 3 / 0.4);
  }
  .hope-card:hover::before {
    opacity: 1;
  }
}
```

Pointer tracking: one `pointermove` listener per card, throttled with `requestAnimationFrame`, writing `--mx` and `--my` in pixels from `getBoundingClientRect()`. Remove listeners on unmount. Skip entirely when `(hover: none)`.

### Signature motif: the flight path

A Solar Ember curved SVG path (cubic Bézier arc, stroke 2px, round caps) that draws itself with `stroke-dashoffset` scrubbed to scroll, while a small paper-plane SVG travels along it. Do not use MotionPathPlugin: compute position with `path.getPointAtLength(length * progress)` and rotation with `Math.atan2` between the point at `progress` and a point slightly ahead, then set `x`, `y`, `rotation` via GSAP. Use it in the hero background, the process section and the final CTA. Decorative only: `aria-hidden="true"`.

## 7. Motion system

Tokens (define once in `lib/motion.ts` and CSS variables, reuse everywhere):

- Easings: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; GSAP `power3.out` for reveals, `expo.out` for hero and big moves, `power2.inOut` for scrubbed movement.
- Durations: micro 0.2s, base 0.6s, reveal 0.9s, hero 1.2s. Stagger 0.06–0.1s.
- Reveal: from `y: 32`, `autoAlpha: 0`. Trigger `top 85%`, `once: true`. Headline reveals use a line mask (overflow hidden wrapper, inner line moves from `yPercent: 110` to `0`).
- Only animate `transform` and `opacity` (plus `clip-path` and `stroke-dashoffset` where noted). Never animate `width`, `height`, `top`, `left`, `margin`, `box-shadow` or `filter` blur values on scroll. `will-change` only during an active animation.
- Static blurred decorative layers are allowed; animate them via a wrapper's `transform`, never by changing the blur.

Required global behaviours:

- **Smooth scroll** with Lenis, synced to GSAP ScrollTrigger (snippet below).
- **Custom cursor** on `(hover: hover) and (pointer: fine)` only: a 8px Solar Ember dot that follows instantly and a 36px ring with 1px Solar Ember border that follows with lerp 0.15. Ring grows to 64px over links and buttons, shows a small "View" label over cards marked `data-cursor="view"`, and shrinks on press. Native cursor stays visible for text inputs. Hidden on touch devices. Uses `mix-blend-mode` only if it does not break colours; otherwise plain.
- **Magnetic buttons** on primary CTAs (desktop only): pull up to 12px toward the pointer within 80px, spring back on leave.
- **Scroll progress bar**: 3px Solar Ember bar fixed at the top, `scaleX` scrubbed to page progress.
- **Preloader** (first visit per session only): Midnight Blue screen, the logo mark fades in, a Solar Ember arc draws, the plane flies along it, then the screen lifts away with a `clip-path` or `yPercent` wipe. Total under 2.2s. Skipped under reduced motion and on client-side navigations. Content must be interactive right after it ends.
- **Reduced motion**: wrap all animation setup in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Under `reduce`: no Lenis, no parallax, no marquee movement, no pinning, no cursor effects, elements simply visible. Content must never depend on JS to be visible under `reduce`.
- **Responsive motion**: pinning and heavy parallax only at `(min-width: 1024px)`. On mobile use simple reveals and reduced particle counts.

## 8. Tech rules

- Allowed animation dependencies: `gsap`, `@gsap/react` (use `useGSAP` with a `scope` ref and `revertOnUpdate` where needed), `lenis`. If `framer-motion`/`motion` is already installed, do not add more of it and do not mix it with GSAP on the same element. No three.js or WebGL unless approved.
- Do not use GSAP `SplitText`. Write a small local `splitLines`/`splitWords` utility in `lib/`.
- App Router: components that use hooks, refs or the DOM begin with `'use client'`. Keep pages and layouts as server components; put animation in small client leaf components. Never read `window`, `document` or `localStorage` during render. Anything random (particles) is generated in an effect or from a seeded array to avoid hydration mismatch.
- Images: `next/image` with explicit `width`/`height` or `fill` plus `sizes`; `priority` only on the hero image. Reserve space so there is no layout shift.
- Fonts: `next/font` only. Icons: inline SVG components.
- Metadata: use the Next.js Metadata API (title, description, Open Graph) per page.
- Folder convention (adapt to the existing repo, do not reorganise it without approval): `components/ui` (buttons, cards, badges), `components/sections`, `components/motion` (SmoothScroll, Cursor, Preloader, ScrollProgress, Reveal, Marquee, Magnetic, CountUp, FlightPath), `hooks`, `lib` (motion tokens, split utilities, cn), `styles`.

### Reference snippet: Lenis synced with GSAP

```tsx
'use client'

import { type ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    const onTick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

Expose the Lenis instance through context so the mobile menu and modals can call `stop()` and `start()` to lock scroll. After web fonts and images settle, call `ScrollTrigger.refresh()` (`document.fonts.ready.then(...)`).

## 9. Code quality standard

- TypeScript `strict`. Explicit prop types. No `any`. No unused variables, imports or exports. Exhaustive `switch`/union handling.
- Small components (about 150 lines maximum). One responsibility each. Pure data stays in data files; presentation in components. Named exports except where Next requires default.
- Semantic HTML: one `h1` per page, ordered headings, `nav`, `main`, `section` with `aria-labelledby`, real `button` and `a` elements. Every interactive element reachable and operable by keyboard with a visible focus ring. Skip-to-content link.
- Accordions: `button` with `aria-expanded` and `aria-controls`, panel with `role="region"`. Mobile menu: focus trap, `Escape` closes, restores focus, locks scroll, `aria-modal`. Marquees: duplicate content is `aria-hidden`.
- Tap targets at least 44×44px. Body text never below 16px on mobile. No horizontal scroll at any width from 320px to 1920px.
- Use `svh`/`dvh` instead of `100vh` for full-height sections. Use `overflow-x: clip` (not `hidden`) on `html`/`body` so `position: sticky` and pinning keep working.
- z-index scale defined once: content 0, sticky elements 20, navbar 40, mobile menu 50, cursor 60, preloader 70, progress bar 80.
- Names: components `PascalCase`, hooks `useThing`, files kebab-case or the repo's existing convention. Commit messages: conventional commits.

## 10. Bug-prevention checklist (verify before every report)

- Zero console errors, zero hydration warnings, zero React key warnings.
- Every `useGSAP`/effect returns full cleanup: ScrollTriggers killed, listeners removed, tickers removed, Lenis destroyed. Navigating between routes and back must not duplicate animations or leak triggers.
- No animation leaves an element permanently hidden if the trigger never fires (reveals use `once: true`, with a safe visible fallback under reduced motion and for print).
- Resize and orientation change do not break layouts or pinned sections (`ScrollTrigger.refresh()` on `resize` is handled by GSAP, but pinned heights must not depend on fixed pixel values).
- Iframes, forms and inputs are never covered by the custom cursor or by decorative layers (`pointer-events: none` on all decorative layers).
- Back/forward navigation and browser refresh at any scroll position behave normally.
- Nothing depends on hover for essential information; touch devices get an equivalent.
- Print and no-JS states do not show blank sections.
- Build output has no warnings. No unused CSS classes or dead components left behind.