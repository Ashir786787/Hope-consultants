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

### Destinations Spotlight (home page only)

One wide component, three horizontal zones side by side: a left list of 7 countries, a middle content well, a right list of 7 countries. Left list, in order: Italy, Germany, Sweden, Finland, Turkey, Portugal, Hungary. Right list, in order: Belgium, Netherlands, Lithuania, Cyprus, Malta, Japan, China. This is the one place on the whole site where a card-style section departs from the .hope-card recipe — style it as its own dark panel (Midnight Blue, .hope-card's dark-variant border and fill) with the same rounded corners as everywhere else, on Midnight Blue or Pure White depending on the section rhythm decided for the home page.

Each country row shows, left to right (or right to left, mirrored, in the right-hand list): a small flag using the ISO code below, a small circular or rounded-square thumbnail using the country's existing project image (locate where these already live in the repo — check public/ for a destinations/countries image folder before building this step; if a country's image is missing, show the flag alone for that row rather than a broken image or an invented placeholder), and the country name. The whole row is one real, keyboard-focusable control (a button, not a bare div), never a separate "info" icon or button next to it.

ISO codes for the flags, exact: Italy IT, Germany DE, Sweden SE, Finland FI, Turkey TR, Portugal PT, Hungary HU, Belgium BE, Netherlands NL, Lithuania LT, Cyprus CY, Malta MT, Japan JP, China CN. The displayed country label is the dataset value "Turkey", not "Türkiye": never rename an existing content value to satisfy a rule, and never add a route alias for a name the data does not use. The flags are drawn in their real national colours, which the owner has approved as a deliberate exception to the rule 3 colour restriction, on the same grounds as the logo artwork: a flag is factual representation, not a design choice. Do not recolour them toward the brand palette in any later step.

Two independent interactions, both required, never conflated:

Hover (pointer proximity), on desktop only. Hovering anywhere over the left list, the middle well, or the right list smoothly grows that zone and shrinks the other two — roughly 35/30/35 percent at rest, roughly 46/27/27 when one zone is hovered, animated over about 0.5s with the standard ease. This runs regardless of whether any country is selected, and reverses smoothly when the pointer leaves all three zones. This is a deliberate, named exception to the "only animate transform and opacity" rule in the motion system section: animate flex-grow or grid-template-columns here, since it is a discrete, hover-triggered reflow, not a continuous scroll-linked animation. Add will-change only while a transition is actively running. Skip this entirely under reduced motion and below desktop width (about 1024px) — the layout below that breakpoint stacks the three zones instead, with no width animation.

Click, independent of hover. Clicking a country row selects it (only one selected at a time; clicking a different row switches the selection). The middle well then shows that country's flag, name, its existing short description text (the same teaser used elsewhere for that country, never invented), and a real, clearly visible "View full page" link to /countries/[slug]. The selected row gets a visible active state (Solar Ember left border or background tint on light, Solar Ember text/border on dark). Clicking the same, already-selected row again also navigates to /countries/[slug] — this is a convenience shortcut, not the only path: the "View full page" link inside the middle well must always be present and independently reachable the moment a country is selected, so keyboard and assistive-technology users are never required to activate the same control twice to proceed. Before anything is selected, the middle well shows a simple idle state (a short prompt and a decorative Hope motif — the globe or a wave arc — never empty white space). Announce the middle well's content changes to assistive technology (aria-live="polite").

Reveal the whole component once on scroll-enter, same as any other section. The row-select and hover-zone animations are independent of that one-time reveal and can run any number of times afterward.

### Blog card

Blog is not populated yet (no blog data exists at the time of this file). When it exists, each `.hope-card` blog card is: an image at the top in a 16:9 frame (`next/image` with `fill`, `object-fit: cover`, rounded top corners matching the card radius`), and below it the standard card content stack: category badge, title (h3), a short excerpt, and a meta row (date, read time) at the bottom. No image means no card: never render a blog card without a real image. The blog list page uses the same PreviewGrid pattern as every other section.

### Cinematic media reveal (hero background layer)

A background layer for the hero (and, later, the compact country-page hero) that plays or shows a real project asset — a video or a still image — the moment it's ready, with a soft reveal: initial state transform: scale(1.1), filter: blur(30px), opacity: 0; animated to scale(1), blur(0), opacity: 1 over the hero duration token (lib/motion.ts, expo.out), starting on the same hope:intro-complete event the rest of the hero already uses. A Midnight Blue scrim at about 50% alpha sits between the media and the text for contrast, using the brand colour rather than a generic black overlay.

Assets: public/hero/hero-background.mp4, public/hero/hero-background.webm (optional, video takes priority if both exist), public/hero/hero-background-poster.jpg (shown before the video can play, and used as the plain background if no video exists), or public/hero/hero-background.jpg for an image-only background. All of these are optional — the agent must check which, if any, exist and build accordingly, never inventing a placeholder image or linking out to any external URL for this. If none exist, the hero keeps its current flat background exactly as already built, and this is reported as a data gap, not silently skipped without saying so.

Video behaviour: autoplay, loop, muted, playsInline, no controls, object-fit: cover, explicit width/height or a fixed-aspect wrapper so it never causes layout shift. Pause the video (via IntersectionObserver) whenever the hero scrolls out of view, and resume when it scrolls back in — never let it keep decoding off-screen. Respect (prefers-reduced-motion: reduce) by never autoplaying: show the poster/still image only, statically, no blur/scale/fade animation, in that case. Respect navigator.connection?.saveData the same way, falling back to the still image so a slow or metered connection never has to load video.

### Hero aurora (the shifting brand light field)

The hero's ambient background is not stock footage and not static decoration: it is a slow, continuously shifting light field built entirely from brand-colour CSS gradients and the existing `GlobeMotif`. It exists so the top of the page reads as premium and alive with zero image bytes, zero licence risk and zero layout shift. There is no filmed video on this site; if real media ever arrives, `CinematicReveal` picks it up and the aurora simply reads as lens flare over it.

It is one component, `components/motion/hero-aurora.tsx`, and it owns the hero's light entirely. Do not add a second glow source to the hero: the two static Solar Ember radial blobs the hero used to carry were removed when the aurora landed, so the composition has a single, moving key light. The dot grid and the `FlightPath` plane stay as they are and are not part of the aurora.

Only `transform` and `opacity` are ever animated, and every layer is `pointer-events-none` and `aria-hidden`. There are **no `filter: blur()` layers and no animated parent wrapper**: a blur on a large element is expensive, and animating `scale` or `opacity` on an element that *contains* other layers makes the browser re-rasterise all of them every frame, which reads as jank. Softness comes from multi-stop radial gradients instead, and the sweep is a soft radial light pool rather than a blurred band. Never reintroduce a shared parent transform around the layers. The drift loops run on deliberately co-prime durations (15, 19, 23, 26, 29, 37 seconds) so the composition has no visible loop point. Every loop is paused by one IntersectionObserver when the hero leaves the screen, so nothing animates off-screen. Under `prefers-reduced-motion: reduce` the whole field holds a composed still frame and the light sweep is hidden entirely. `navigator.connection.saveData` deliberately does **not** disable it, because that flag exists to avoid downloading a video and this layer downloads nothing.

The aurora is a server-renderable decorative layer wrapped for client animation, so it must never be relied on to carry meaning, and no content may depend on it being visible.

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

## 11. Admin panel (/admin, same repo)

The admin panel is a separate authenticated area of the same Next.js app, for Hope Consultants staff only. It is not part of the marketing site's design language: no custom cursor, no preloader, no scroll-jacking, no flight-path motifs. It borrows its layout from a reference screenshot of another project's admin panel (dark login card, light dashboard with a dark sidebar). Past the login screen, every colour is restricted to the five brand tokens in section 3 — never the reference's purple, green, orange or blue accents; the login screen itself is the one named exception, in section 11.1. Motion here is utilitarian, not cinematic: fast fades, gentle lifts, number count-ups, skeleton loaders, toast notifications. Everything in sections 1–10 of this file still applies (no comments, no invented content, strict TypeScript, one step at a time, commit only after approval) unless a rule below says otherwise for this area specifically.

Precedence: where section 11 conflicts with an earlier section, section 11 wins, and only for the files and routes it names. Everything else in sections 1–10 stays in force.

### 11.1 Colour mapping for the admin panel

The login screen (/admin/login) is an explicit, deliberate exception to the five-brand-colour rule everywhere else in this file. It keeps the reference screenshot's own colours exactly, sampled from the actual image, not approximated:

| Role | Value |
|---|---|
| Page background | `#0b0b0b` |
| Card background | `#171717`, with a subtle 1px border of `#2e2e2e`, centred on the page, rounded corners (about 24px radius) matching the reference |
| Input field background | `#262626`, no visible border until focus, focus ring in the accent colour below |
| Accent colour (icon tile fill, primary button fill, focus rings) | `#4F39F6` (a vivid indigo/violet) |
| Heading text | white, `#ffffff` |
| Subheading and helper text | muted grey, `#a1a1a1` |
| Icon glyphs inside inputs (envelope, lock, eye toggle) | muted grey, roughly `#6b7280` |

Define these as their own small set of local CSS variables or literal values scoped to this one page/component (for example `--admin-login-bg`, `--admin-login-card`, `--admin-login-accent`) — do not reuse `--hope-midnight`, `--hope-ember` or any other brand token here, and do not let this page's styles leak onto any other page. This page's copy still changes to Hope Consultants (see the STEP A3 prompt for exact text); only the wording changes, not the colours, spacing, icon, or layout — reproduce the reference as closely as code allows.

Once this page exists, do not "improve" it toward the brand palette in a later polish step. If the owner wants it recoloured later, that is a new explicit instruction, not something implied by any other rule in this file.

Everything past the login screen (the dashboard shell, sidebar, cards, charts, all /admin/* pages except /admin/login) uses the real Hope brand tokens from section 3, as already specified below — this exception is scoped to the login screen only:

Dashboard shell: Pure White content area, Midnight Blue sidebar, white sidebar text, Solar Ember pill/underline on the active sidebar item.
Stat cards: Pure White fill, Midnight Blue heading text, Fogstone supporting text. The reference screenshot colours each stat card's top accent bar and icon a different hue (green, purple, orange, blue) — do not do this here. Use only Solar Ember and Midnight Blue for these accents, varied by which one, not by introducing new hues.
Charts: line/area chart in Solar Ember (stroke) with a Solar Ember-alpha fill under the line. The status donut uses exactly four segment colours, in this order regardless of which status is largest: Solar Ember, Midnight Blue, Fogstone, Obsidian Veil. Never add a fifth colour to a chart.

### 11.2 What this panel is for (scope, do not add features beyond this)

Staff sign-in with the OTP flow in 11.3.
A dashboard with real counts (leads, admins) and two charts (a leads-over-time line/area chart, a lead-status donut). No revenue, orders, products, reviews, discount codes or newsletter sections — those belong to the NovaCart reference project, not Hope Consultants. Only Dashboard, Leads, Admin Users, Settings and Logout exist as sidebar items unless a later step adds more.
A Leads (enquiries) section fed automatically by the public site's existing contact/consultation form. It lists every enquiry newest first and lets a signed-in admin change its status (New, Contacted, Converted, Lost) and write an internal note. The note exists only in the admin panel and is never shown on the public site.
An Admin Users section for managing who can sign in.
A Settings page for the signed-in admin to change their own password (OTP-gated per 11.3).
The existing site content editor built in the earlier steps (services, countries, scholarships, resources, process, blog, site) continues to exist and is not part of the sidebar. It is reachable at /admin/content, behind the same authentication as everything else in /admin.

### 11.3 Authentication and OTP rules (exact)

Data model

AdminUser: name, email (unique), passwordHash (bcrypt, **nullable** — null means this person has not chosen a password yet), role (string, default "Administrator"), isOwner (boolean, default false, set from ADMIN_OWNER_EMAIL by scripts/migrate-admin-owner.mjs), hasCompletedFirstLogin (boolean, default false), isActive (boolean, default true), isAccessRequest (boolean, default false — see "Open sign-in requests"), createdAt, lastLoginAt, firstLoginVerifiedAt, sessionsValidAfter (nullable ISO string; the moment from which older session tokens stop being accepted — see "Session"), purgeAt (a real BSON Date, set only on an unverified open access request, 24 hours after it was made, with a TTL index on the same field so abandoned requests delete themselves; null on every real account).
OtpChallenge: adminUserId, purpose ("first_login" | "password_change"), codeHash (bcrypt, and never store the plain 6-digit code or any digits from it), expiresAt (10 minutes from creation), attempts (default 0, max 5), createdAt, verifiedAt, failedAt, attemptsUsed, ip, purgeAt (a real BSON Date, because a TTL index silently never fires on a string field). One active challenge per admin+purpose at a time; creating a new one invalidates the previous. On success the record is marked verified rather than deleted, and on 5 failed attempts it is marked failed, so the verification history survives; a TTL index on purgeAt removes records after 90 days.
Lead: fields mirror exactly whatever the existing contact/consultation form already collects (inspect it during the audit step, do not invent fields) plus: status ("New" default, "Contacted", "Converted", "Lost"), sourcePage, submittedAt, and an admin-only notes field that only exists in the admin panel, never on the public form.

Login

Admin submits email and the password they want to use.
Nobody is pre-registered and nobody is refused for being unknown. Any email address can begin a sign-in, and the owner's one-time code is the actual gate, so there is no separate approval step, no invite that can be leaked, and no way to lock a colleague out by forgetting to add them. Because the gate is the code, the password alone is never enough.
If the account exists and hasCompletedFirstLogin is true, this is a returning admin: the password must match and isActive must be true. On any failure return one generic message ("Invalid email or password") — never reveal which part failed or whether the account exists. On success start the session immediately (see "Session" below), update lastLoginAt, and send no code.
If the account does not exist, or exists but hasCompletedFirstLogin is false, this is someone's first sign-in and no default password was ever issued: treat the submitted password as their own, require at least 12 characters, hash it with bcrypt and save it, then continue to the OTP step. This is the only way a password is ever set on a first sign-in, and there is no default or seeded password anywhere.
If the account exists, hasCompletedFirstLogin is false, isActive is false and isAccessRequest is false, the owner deliberately deactivated that never-verified person: return the generic message and do not reopen it. isAccessRequest exists so that "waiting for a code" and "switched off by the owner" can never be confused for one another.
If hasCompletedFirstLogin is false: do not start a session yet. Generate a random 6-digit code, hash it, store it as an OtpChallenge with purpose first_login, email it to the **owner** addresses only (every admin where isOwner is true, resolved with listOwnerEmails() and never hardcoded), and respond telling the client to show the OTP screen. The code is never sent to the person who asked for it; the owner reads it out or passes it on privately.
OTP screen: admin enters the 6-digit code. Verify against the stored hash for that admin+purpose, check it has not expired and attempts have not been exceeded. On success: if purpose was first_login, set hasCompletedFirstLogin = true and isActive = true, clear isAccessRequest and purgeAt, start the session, update lastLoginAt, delete the challenge. On failure: increment attempts and show the remaining count; after 5 failed attempts, invalidate the challenge and require the admin to request a new code.
Resend: a "Resend code" control with a 60-second cooldown, generates a new challenge and invalidates the old one. An email with no account, a completed account, or a deactivated account is silently accepted and sends nothing.

Open sign-in requests

An unknown email is not a lookup failure but a stored request. The login route creates the AdminUser with the bcrypt password the person just typed, isAccessRequest: true and isActive: false, so the account exists, keeps its history, and is listed on the Admin Users page as "Waiting for your code" with the owner's own text that the code is the only way in. Re-submitting the same email simply re-hashes the password onto the same request; it never creates a second row and never grants access.
The request carries a real BSON Date in purgeAt, 24 hours out, with a TTL index, so an abandoned request deletes itself and the owner never has to clear a queue by hand. On successful verification purgeAt is unset, and because the field is then absent the account is permanent.
The owner's inbox is the attack surface of an open panel, so requests are bounded: at most MAX_OPEN_ACCESS_REQUESTS (default 25, 0 closes registration) may be waiting at once, each request is one row regardless of how many times it is retried, the 60-second resend cooldown and the 5-attempt limit apply per request, and the owner can delete a request they do not recognise from the Admin Users page. A full queue returns a plain 429 telling the person to contact the owner directly. This is a deliberate trade: the owner, not the database, decides who gets in, so the code must never be sent to the requester and the owner should be able to recognise the name, email and IP in the notification.

Session

Issue a JWT in an httpOnly, secure, sameSite=strict cookie on successful login. Short-ish expiry (for example 12 hours), refreshed on activity.
Refresh happens through requireAdminForApi(), which the admin API routes call instead of requireAdmin(). A server component render must never try to write the cookie, so requireAdmin() stays read-only and is what the (panel) layout and pages use.
Every protected admin API route and the /admin layout re-check the admin still exists and isActive is true against the database on each request — never trust the JWT payload alone for this. Deleting or deactivating an admin must lock them out immediately, mid-session, not just once their token expires.
A JWT is valid until it expires unless the database says otherwise, so a stolen or copied cookie would otherwise survive signing out. Logout must therefore actually revoke: set the admin's sessionsValidAfter to the current time, and have the per-request check reject any token issued at or before that moment. The token carries a millisecond issuedAt claim so a re-login in the same second as the logout is not caught out by the revocation. Because the timestamp lives on the admin rather than on a token id, signing out ends all of that person's sessions at once, which is the correct behaviour for a panel with one person per account. endSession() revokes and then deletes the cookie, so no caller can clear the cookie while leaving the token live. A missing sessionsValidAfter on an older record means "never revoked" and must not lock anyone out.
This is the only place session revocation happens today. Changing a password does not currently revoke other sessions; if that is ever wanted, set sessionsValidAfter there too.

Deleting or deactivating an admin

Deleting removes the AdminUser document; deactivating just flips isActive to false. Either way, their current session stops working on the very next request (see the re-check rule above), matching "till he is not deleted" from the request. An open access request is never approved by this button: the owner cannot reactivate isAccessRequest: true from the panel, because the one-time code is the only approval path.

Adding a new admin (from the Admin Users page, by an already-logged-in admin)

The creating admin enters the new admin's name, email and role. The system creates the AdminUser with passwordHash: null and hasCompletedFirstLogin: false, and emails the new admin an invitation containing no password of any kind. On their first sign-in they choose their own password, exactly like the seeded owner, and then confirm it with a 6-digit code. This is a settled decision: **no password is ever emailed to anyone, under any circumstances.** An invite that carried a password would put a live secret in an inbox; since the panel has no need for a pre-issued credential, the invite just explains that the recipient chooses their own password on arrival. The temporary-password generator was deleted rather than left dormant. If the invitation email cannot be sent, the created account is rolled back, so an admin never exists without their invite landing.

Changing your own password (Settings page, already signed in)

Admin requests a password change from the Settings page. The system sends a fresh OTP (purpose password_change) to the **owner** addresses, exactly like first login, and never to the admin changing the password; the owner relays it.
Admin enters the code and their new password together, in one request to /api/admin/password-change/verify, so the hash is never sent to the browser. The new password must be at least 12 characters and must not equal the current one. hasCompletedFirstLogin is untouched by this (it stays true) — this OTP is a one-time re-check for the sensitive action, not a re-onboarding. A verified challenge cannot be reused, and the change does not touch sessionsValidAfter, so the admin's other sessions keep working.

Seeding the first admin

A one-time seed script creates the first AdminUser (name and email from environment variables only, **no password**) with passwordHash: null and hasCompletedFirstLogin: false, so the very first real sign-in goes through the choose-your-own-password rule and then OTP, exactly like every other admin. There is no seed password to leak, store or rotate. Never hardcode the seed email in source; read it from .env.local, which is already git-ignored. `npm run reset:admin-password -- --email=<email> --forget` returns an existing admin to the same passwordless state.

### 11.4 Sending the OTP email

Build one function, sendOtpEmail({ approverEmails, code, purpose, requesterEmail, requesterIp }), behind a single small module (for example lib/email/send-otp.ts), and call it from nowhere else in the codebase except the auth routes. It takes **approver** addresses, never a requester address, so it is structurally impossible for a code to reach the person who triggered it, and it throws when no owner address is available rather than falling back to the requester. Implement it first with Nodemailer over Gmail SMTP, using a Gmail address and an app password (not the account's real password) read from environment variables — this needs no paid signup and works immediately. When a custom domain exists later, the only change is inside this one function (switching to Resend or another provider with a branded "from" address); no calling code changes. The email itself: plain, professional, Hope-branded in text only (Midnight Blue/Solar Ember mentioned isn't meaningful in an email client's default styling, so keep it simple HTML or plain text) — one sentence naming what is being approved, the requester's email address and IP so the owner can recognise the request, the 6-digit code in large clear text, the purpose in one sentence ("Use this code to finish signing in to the Hope Consultants admin panel" or "...to confirm your password change"), and a one-line expiry note ("This code expires in 10 minutes"). Never log the OTP code to the console or to any persisted log in a way that would be readable later.

Three messages are sent from this area, all through the one shared transport in `lib/email/transporter.ts`, and all called only from auth routes: `sendOtpEmail(...)` for the code, `sendAdminInvitationEmail(admin)` when an admin is created, and `sendAdminActivatedEmail({ admin, ownerEmails, ip })` once a first sign-in is verified. Only the third and the OTP go to owner addresses; the activated account is never emailed a code and never receives a "you are registered" mail, because it started life as a self-service request. The owner notification names the account, the role, the verification time and the IP, and keeps codes and passwords out of it. Changing provider later means editing only the transporter.

### 11.5 Contact form to Leads pipeline

Find the existing public contact/consultation form's submit handler. Without changing what it already does (its existing success behaviour, any existing notification, its validation), add one more effect: create a Lead document from the exact fields the form already collects, with status: "New" and sourcePage set to wherever the form was submitted from. This is the one explicit exception to the "do not touch business logic without the step saying so" rule in section 1 — this section is that permission, scoped only to adding the Lead-creation side effect.

### 11.6 Keeping the panel current, and the new-enquiry badge

The panel is a set of server components, so "live" updates are done with `router.refresh()` from `components/motion`-style client leaves, never by polling a JSON API and never by moving data fetching into the client. One component, `components/admin/admin-auto-refresh.tsx`, is mounted once in the `(panel)` layout and calls `router.refresh()` on a 20-second interval and whenever the tab regains focus or becomes visible again. It must check `document.visibilityState === "visible"` before refreshing, so a backgrounded tab does no work, and it must clear its interval and remove both listeners on unmount. It renders nothing. Because `router.refresh()` re-renders server components but preserves client component state, an open lead row, a half-typed note and an in-progress content-editor form all survive a refresh; never replace this with a full remount or a `key` change, which would discard that state.

The Leads item in the sidebar carries a new-enquiry badge: a dot plus the number of leads still at status "New", shown only when that count is above zero, and announced to assistive technology as "new awaiting a reply". The count comes from `countLeadsByStatus()` in the panel layout, so the badge, the leads list and the dashboard all refresh from the same single request. "New" is the whole mechanism on purpose: a fresh enquiry arrives as "New" and the badge clears when an admin moves it to "Contacted", so no read-tracking field, migration or per-device state is needed. Do not add a separate unread/read flag to accomplish this; if the owner ever asks for a badge that survives a status change, that is a real schema change and needs its own step.

Because the active sidebar item fills with Solar Ember, the badge must invert when it sits on the active item: Ember pill with Midnight Blue text and dot on the resting sidebar, Midnight Blue pill with Ember text and dot when active. An Ember badge on an Ember background is invisible.