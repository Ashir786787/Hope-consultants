# 00 — Project Map & Discovery

Date: 2026-10-11
Branches: `main` (37 commits) · `audit-and-hardening` (created for this work, not yet pushed)
Scope: read-only discovery. No source or runtime changes were made; the only file created is this report.

---

## 1. Overview

Hope Consultants is a marketing website (study-abroad consultancy) with an authenticated admin panel in the same Next.js app. It is a single Next.js application using the App Router, server-rendered React, MongoDB for content + application data, and Gmail SMTP for transactional email. It is deployed to Vercel (URL not captured here; the local `.vercel` folder is absent and `vercel.json` does not exist). The production domain `hopeconsultants.pk` is purchased but not yet connected; all canonical/URL constants in the code currently use `https://www.hopeconsultants.pk`.

There is **no middleware, no `vercel.json`, no instrumentation hook, no server actions, no analytics, no error-tracking, and no test suite** of any kind in the repo.

---

## 2. Framework, runtime, tooling

| Item | Value |
|---|---|
| Framework | Next.js `16.3.5` (App Router, React Server Components, Turbopack builds) |
| React / React DOM | `19.2.8` |
| TypeScript | `^5`, `strict: true` in `tsconfig.json` |
| Package manager | npm (`package-lock.json` present, lockfile v3) |
| Node (local) | v25.1.0 (npm 11.17.0) |
| Lint | ESLint 9 with `eslint-config-next` 16.3.5 + `eslint-config-prettier` |
| Format | Prettier 3 + `prettier-plugin-tailwindcss` |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) via `globals.css`; `tw-animate-css` |
| UI deps | `@base-ui/react`, `lucide-react`, `class-variance-authority`, `cn`, `react-hook-form`, `@hookform/resolvers`, `zod` v4 |
| Motion deps | `gsap`, `@gsap/react`, `lenis` |
| Data/auth deps | `mongodb` (driver v7), `bcryptjs`, `jose` (JWT), `nodemailer` |
| Custom fonts | Montserrat via `next/font/google` (self-hosted, no runtime Google request) |

No `three.js`, no `framer-motion`, no Auth.js, no ORM (raw `mongodb` driver).

---

## 3. Repository state (reads matter for what follows)

- The branch `audit-and-hardening` was created from `main` **with uncommitted work already in the tree** from a previous, unapproved session. That work touches: `src/app/(site)/{countries,services}/[slug]/page.tsx`, `src/app/(site)/layout.tsx`, `src/app/api/data/[collection]/route.ts`, `src/components/admin/admin-image-field.tsx`, `src/components/blog/blog-card.tsx`, `src/components/countries/country-filter.tsx`, `src/components/onboarding/sections/education-form.tsx`, `src/components/sections/hero.tsx`, `src/components/sections/team-photo.tsx`, `src/hooks/use-content-editor.ts`, `src/lib/content/schemas.ts`, `src/lib/onboarding/schema.ts`, plus untracked `src/components/ui/site-image.tsx` and `src/lib/admin/image-import.ts`. It is uncommitted and unapproved. **Decision needed: commit, discard, or hold.**
- The working tree also contains a `reports/` folder (this report) which is new and untracked.
- MongoDB (the only live store; `data/` is empty except `.gitkeep`) currently contains content the seeds would not produce, because a previous session inserted **test records** (services +2, countries +2, testimonials +2, scholarships +2, blog +2, process +2, team +1 — names prefixed `Test` / `Test -`) and corrected one blog slug. These are live in the database the deployed site reads from. **Decision needed: delete the test records.**
- `.gitignore` ignores `.env*` with an `!.env.example` exception; `git ls-files` confirms **only `.env.example` is tracked**. No secret is committed in the current tree. Full git history scan is deferred to Phase 3.

---

## 4. Routing inventory

### Public site (`src/app/(site)/`, no auth)

| Route | Render | Notes |
|---|---|---|
| `/` | server component with client leaves | Hero, services, destinations spotlight, scholarships, process, testimonial, FAQ, CTA sections; `export const dynamic = "force-dynamic"` |
| `/about` | server + client | Content from `about` collection (singleton) |
| `/process` | server + client | Steps from `process` collection |
| `/services` | server + client | List + client search (`service-browser`) |
| `/services/[slug]` | server | Published-only lookup by slug; `force-dynamic` |
| `/countries` | server + client | List + client filter + search |
| `/countries/[slug]` | server | Lookup by slug; `force-dynamic` |
| `/scholarships` | server + client | List + group tabs + client search (`scholarship-browser`) |
| `/testimonials` | server | Testimonial grid |
| `/blog` | server + client | List + client search |
| `/blog/[slug]` | server | Published-only lookup by slug, content split on blank lines, rendered as text (no HTML) |
| `/contact` | has contact form | Form posts to `/api/contact` |
| `/design-system` | server | Developer page; warns and returns early in production |
| `/privacy`, `/terms`, `/disclaimer`, `/refunds`, `/cookies` | server | Static legal content |
| `/_not-found`, `robots.txt`, `sitemap.xml`, `icon.png`, `apple-icon.png`, `opengraph-image.png` | — | Static/standard |

### Onboarding flow (no auth, public by design — collects personal data)

| Route | Purpose |
|---|---|
| `/onboarding` | Start page |
| `/onboarding/[section]` | One page per section slug: `personal-information`, `education-background`, `study-abroad-preferences`, `financial-and-family-info`, `documentation-status`, `career-and-future-plans`, `consent` (7 sections, order 2–8) |
| `/onboarding/complete` | Success page |

### Admin (`src/app/admin/`)

| Route | Purpose | Guard |
|---|---|---|
| `/admin/login` | Login card (email + password → OTP screen) with `robots: noindex` | none (public) |
| `/admin` | Dashboard (leads/onboarding charts, counts) | `requireAdmin()` in `(panel)/layout.tsx` |
| `/admin/leads` | Lead list + status/notes editing | same |
| `/admin/onboarding` | Onboarding submission list | same |
| `/admin/onboarding/[id]` | Submission detail | same |
| `/admin/content` | Content editor for 9 collections | same, plus per-collection permission |
| `/admin/admins` | Admin users management (create, role, permissions, activate, delete) | same |
| `/admin/settings` | Change own password (OTP-gated) | same |

Admin layout `src/app/admin/layout.tsx` is a plain wrapper; `src/app/admin/(panel)/layout.tsx` performs `requireAdmin()` and `redirect("/admin/login")` for every panel page. **There is no middleware/proxy gate** — protection is per-page on the server. Admin API routes re-check via `requireAdminForApi()` on every request.

---

## 5. API route inventory

All handlers parse `request.json()` defensively; all return `{ error }` JSON with no stack traces. **None set `Cache-Control`**; they are server functions.

| Method(s) | Route | Auth | Validation | Purpose / notes |
|---|---|---|---|---|
| POST | `/api/contact` | none | zod (name/email/subject/message) | Sends email via SMTP, creates a `Lead`, sends confirmation to sender. **No rate limit.** No max length on name/subject/message (email implied by zod email). |
| POST | `/api/onboarding` | none | full zod `onboardingSchema` after `normaliseFullAnswers` | Rate-limited **in-memory** (6/h per IP), validates all sections, stores submission, emails summary + confirmation. |
| PUT | `/api/onboarding/draft` | none | shallow check (answers must be an object; drafts are re-validated only at final submit) | Rate-limited **in-memory** (240/h per IP). Stores partial answers in DB keyed by a random cookie token. |
| POST | `/api/admin/login` | none | manual (email/password presence, min password 8 for first-login) | bcrypt compare; decoy hash on known-bad; OTP challenge + owner email on first login; session cookie on completed logins. **No login rate limit.** |
| POST | `/api/admin/verify-otp` | challenge-bound | `^\d{6}$` + max 5 attempts | Marks verified, starts session, emails owner on first verified login. |
| POST | `/api/admin/resend-otp` | none | email presence | 60 s cooldown, silent non-reveal for unknown accounts. |
| POST | `/api/admin/logout` | session | — | Revokes sessions (sets `sessionsValidAfter`) + deletes cookie. |
| GET | `/api/admin/session` | `requireAdminForApi` | — | Returns `{authenticated, name, email, role}`. |
| POST | `/api/admin/password-change` | `requireAdminForApi` | — | Creates `password_change` OTP → owner email. |
| POST | `/api/admin/password-change/verify` | `requireAdminForApi` | `^\d{6}$`, min 8 chars, ≠ current | Sets new hash. |
| GET, POST | `/api/admin/admins` | `requireAdminForApi` + `hasSection("admins")` | zod on POST | List (summaries, passwordHash omitted) / create (email invite, rollback on send failure). |
| PATCH, DELETE | `/api/admin/admins/[id]` | same | zod `patchSchema` | Owner-only for permission changes; owner cannot be deactivated/deleted; self-delete blocked; waiting access requests can't be approved via this API. |
| GET | `/api/admin/leads` | `requireAdminForApi` + `hasSection("leads")` | — | Full lead list (includes PII + admin notes). |
| PATCH | `/api/admin/leads/[id]` | same | zod (status enum, notes ≤2000) | Update status/notes. |
| PATCH | `/api/admin/onboarding/[id]` | same, `hasSection("onboarding")` | zod (status enum, notes ≤2000) | Update status/notes. |
| GET, PUT | `/api/data/[collection]` | `requireAdminForApi` + `hasSection("content")` + `hasContentCollection` | collection allow-listed; `body.data` otherwise unvalidated | Reads/writes whole collection records. PUT downloads http(s) image links into base64 data URIs via `importRemoteImage` (**SSRF surface**) before saving. |

IDs throughout are random UUIDs compared as strings; no user-supplied value reaches a MongoDB query as anything but an exact-match string; no query object from a request body is ever passed to the driver.

---

## 6. Middleware / server actions / instrumentation

- **Middleware:** none (`middleware.ts` absent everywhere).
- **Server actions:** none — all mutations are API routes.
- **Instrumentation / telemetry:** none.
- **Cron / revalidation:** none; `(site)` pages and detail pages are `force-dynamic`, so every request reads MongoDB (see §8 performance note).

---

## 7. Data layer

### Storage selection (`src/lib/store.ts`)
- If `MONGODB_URI` is set → all nine content collections live in MongoDB. First read seeds from TypeScript files and writes them to Mongo. `data/` JSON is the fallback only when no URI is configured (currently empty).
- Collections: `services`, `countries`, `testimonials`, `scholarships`, `process`, `blog`, `site` (singleton settings), `about` (singleton), `team`.

### Application collections (all in the same DB, `MONGODB_DB || "hope-consultants"`, MongoDB Atlas via `mongodb+srv`)
| Collection | Purpose | Indexes ensured in code | Sensitive fields |
|---|---|---|---|
| `content` | One document per content collection (`{key, data}`) | none | none (public content) |
| `adminUsers` | Admins + open access requests | unique `email`, TTL on `purgeAt` | `passwordHash` (bcrypt), `sessionsValidAfter` (revocation), owner/roles |
| `otpChallenges` | One active OTP per admin+purpose | unique `(adminUserId, purpose)`, TTL on `purgeAt` | `codeHash` (bcrypt), `ip`, verification history |
| `leads` | Contact-form enquiries | `submittedAt`, `status` | name, email, message, notes (admin-only UI) |
| `onboardingSubmissions` | Full onboarding answers | `submittedAt`, `status` | **full personal data**: CNIC/passport no., DOB, financial info, family info, docs status |
| `onboardingDrafts` | Partial answers keyed by cookie token | `updatedAt`, TTL `purgeAt` (30 days) | same personal data |

### Connection handling (`src/lib/mongo.ts`) — already good
- `MongoClient` cached on `globalThis` (`__hopeMongoClient`), `serverSelectionTimeoutMS: 10000`.
- Reads project `_id: 0` by default.
- `mongoEnsureIndex` is idempotent; unique index on `email` and TTL indexes are created from code.

### Content shapes
- `services` seed: 10 items `{slug, name, description, image?}`.
- `countries` seed: 14 items keyed by a `CountrySlug` union (`CountryDestination` with `sections[]`, `images[]`, `flag`, `group`, etc.). **Note:** the type is a closed union of 14 slugs, while the admin content editor can create arbitrary slugs; the country detail page was recent-fixed to be `force-dynamic` and to tolerate missing `images`.
- `testimonials` seed: 1 · `scholarships`: 18 · `process`: 8 steps · `blog`: 5 posts · `team`: 3 members.
- `about` (singleton) and `site` (singleton settings: email, phone, phoneHref, whatsapp, tiktok) — footer contact reads `getSite()`.

---

## 8. Auth system (custom, no framework)

Architecture documented in AGENTS.md §11.3 and confirmed in code. Summary:

- **First sign-in for an unknown email** creates an `AdminUser` (open access request, inactive, 24 h TTL, `MAX_OPEN_ACCESS_REQUESTS` cap default 25) with the password the person typed (bcrypt cost 12, min 8 chars), then emails a 6-digit OTP **to owner addresses only**; the code is never sent to the requester.
- **Returning admin** (`hasCompletedFirstLogin`): bcrypt compare against stored hash, generic error on failure, decoy bcrypt compare to equalise timing, no user enumeration; session starts immediately.
- **OTP verify** (`first_login` / `password_change`): bcrypt hash compare, 10 min expiry, max 5 attempts, 60 s resend cooldown, one active challenge per admin+purpose.
- **Session**: JWT (HS256 via `jose`) in an `httpOnly; SameSite=Strict; Secure (prod)` cookie, 12 h expiry, updated from a millisecond `iatMs` claim every authenticated API call; `sessionsValidAfter` revocation kills all sessions of an admin on next request; logout revokes + deletes the cookie.
- **Passwords**: bcryptjs cost 12 (OTP hashes cost 10), min length 8, no plaintext stored. Re-login in the same millisecond is protected by the explicit `iatMs` claim.
- **Password change** requires a fresh owner-approved OTP in the same request as the new password.
- **Authorization**: per-section flags (`permissions`) and per-collection content flags on each admin; enforced in every route handler *and* the panel layout. None of it is UI-only.
- Owner seeding happens via `scripts/migrate-admin-owner.mjs` from `ADMIN_OWNER_EMAIL`, or `seed-admin.mjs` (no password set by design).

### Auth gaps observed (Phase 3 candidates, not changed yet)
- No rate limiting on `/api/admin/login` (password brute force) — OTP attempt limits protect first-login, but completed accounts have no per-IP throttle.
- In-memory `rateLimit` (`src/lib/rate-limit.ts`) does **not** work across Vercel instances.
- No CSRF/origin check on state-changing routes (mitigated by SameSite=Strict cookies).
- Session cookie lacks an explicit `domain` (fine) but login endpoints are not origin-restricted.
- `JWT_SECRET` and all secrets have **no startup schema validation**; failures surface only when a feature is used.

---

## 9. Email

- **Two transport paths**: `src/lib/mail.ts` (contact/onboarding forms; SMTP_HOST/PORT/secure; single-transporter cache) and `src/lib/email/transporter.ts` (admin mail via Gmail SMTP using `GMAIL_USER`/`GMAIL_APP_PASSWORD`, transport cached on `globalThis`).
- Senders: public forms → `CONTACT_FROM ?? SMTP_USER ?? no-reply@hopeconsultants.example`; admin mail → `Hope Consultants <GMAIL_USER>`.
- Messages: contact confirmation, onboarding confirmation (both plain text), OTP approval email, admin invitation, admin-activated notification. All plain text, no HTML, no attachment handling, no header-injection risk found (subjects/addresses constructed from validated fields; nodemailer rejects malformed headers).
- **Not verified yet**: whether Gmail SMTP works from the Vercel runtime (Gmail sometimes blocks Vercel IP ranges), and any DNS auth records for the future domain (Phase 5).

---

## 10. Media & assets

- `public/`: hero video playlist (`hero-clip-1..4.mp4` + poster), brand logos, country image folders (14 countries), university images, scholarship images, services images, team photos, parents image, `.gitkeep` files. No `.env`, dumps, or internal files found with a glob pass (Phase 3 will do a deeper artifact scan).
- Server-side resolvers read the filesystem: `lib/hero-media.ts`, `lib/university-media.ts`, `lib/team-media.ts`, `lib/parents-media.ts` (server-only; consumer components use `import type`).
- Images render through `next/image` (`fill`, `sizes`, AVIF/WebP) and a shared `CoverImage`; hero video is the sole `<video>`.
- Brand palette implemented as CSS variables in `globals.css` and mapped into the Tailwind v4 `@theme`.

---

## 11. Third-party services (complete list)

| Service | Use | Where |
|---|---|---|
| MongoDB Atlas (`mongodb+srv://…`) | All content + app data | `lib/mongo.ts` via `MONGODB_URI` |
| Gmail SMTP (app password) | All outgoing email | `lib/email/transporter.ts` |
| Generic SMTP (env-driven) | Contact/onboarding email | `lib/mail.ts` |
| Google Fonts (`next/font`) | Montserrat (fetched once at build, self-hosted) | `app/layout.tsx` |
| Vercel | Hosting | dashboard (not inspectable from here) |

No analytics, no maps, no chat, no Turnstile/reCAPTCHA, no external CDN, no hotlinked assets.

---

## 12. Environment variables

Present in `.env.local` (names only; values masked). No `NEXT_PUBLIC_` prefix exists anywhere, so **nothing is compiled into the client bundle** (verified by code search).

| Name | Kind | Used by | Notes |
|---|---|---|---|
| `MONGODB_URI` | **private** | `lib/mongo.ts`, scripts | `mongodb+srv` with embedded credentials. Long value (masked `mon…r0`). |
| `MONGODB_DB` | private | `lib/mongo.ts`, scripts | optional, default `hope-consultants` |
| `JWT_SECRET` | **private** | `lib/admin/session.ts` | must be ≥32 chars or session throws |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | **private** | `lib/email/transporter.ts` | admin mail + OTP + confirmations |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | **private** | `lib/mail.ts`, `lib/email/transporter.ts` | public-form mail |
| `CONTACT_TO`, `CONTACT_FROM` | **private** | contact/onboarding routes | recipient + from for public mail |
| `ADMIN_OWNER_EMAIL` | **private** | migrate script | owner designation |
| `MAX_OPEN_ACCESS_REQUESTS` | private | `admin-user.ts` | default 25 |
| `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL` | private | seed script | first-admin creation |
| `SEED_ADMIN_PASSWORD`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `RESET_ADMIN_PASSWORD`, `RESET_ADMIN_EMAIL` | private | `.env.example` only / reset script | **legacy or script-only**; `ADMIN_PASSWORD`/`ADMIN_SECRET` are unused by any code (pre-JWT leftovers) |

`.env.example` is committed and placeholder-only (good). Secrets are read lazily in modules, not validated up front (Phase 3 gap: add startup schema validation that never prints values).

---

## 13. Build & deployment config

- `next.config.ts`: image remote patterns only for `hopeconsultants.pk` / `www.hopeconsultants.pk`; `outputFileTracingIncludes` for `./data/**`. **No `headers()`, no `poweredByHeader` setting** → default `X-Powered-By: Next.js` header present, **no CSP/HSTS/Referrer-Policy/X-Frame-Options**.
- `tsconfig`: strict, bundler resolution, `@/* → src/*`.
- `package.json` scripts: `dev`, `build`, `start`, `lint`, `seed:admin`, `reset:admin-password`, `migrate:admin-owner`.
- No `vercel.json`; project settings (plan, function region, env vars, deployment protection) live in the Vercel dashboard and were **not inspectable from this machine**.
- Production build (verified before this audit): 28 routes, all content pages `ƒ` (dynamic), zero errors/warnings.

---

## 14. Security posture — first-pass observations (listed, **not changed**; fixing is Phase 3)

| # | Observation | Severity (draft) |
|---|---|---|
| S1 | No security headers (no CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`); `X-Powered-By` on | High |
| S2 | In-memory rate limiter only; ineffective across Vercel instances; `/api/admin/login` and `/api/contact` have **no** rate limit at all | High |
| S3 | `importRemoteImage` accepts any http(s) URL from the admin editor (authenticated SSRF surface; no private-IP / hostname allow-list, unlimited redirects) | Medium (admin-authenticated) |
| S4 | No environment startup validation; secrets fail lazily | Medium |
| S5 | `/api/data/[collection]` PUT accepts arbitrarily shaped `body.data` (no zod validation of records); admin content fields have no max lengths server-side | Medium |
| S6 | Public forms have no spam protection (no honeypot/Turnstile) | Medium |
| S7 | No CSRF origin check on admin routes; mitigated by SameSite=Strict but no explicit Origin verification | Low/Medium |
| S8 | Legal/static and `/design-system` are public; `/design-system` early-returns in production (fine) | Low |
| S9 | No 404/error boundary customisation (uses Next defaults) — will add if approved | Low |
| S10 | No monitoring/error tracking; no uptime monitor configured | Medium (ops) |

## 15. What is absent (gaps relative to a production business site)

- No automated tests (unit, integration, or e2e) and no Playwright.
- No analytics, no error tracking, no uptime monitoring.
- No backup procedure for MongoDB (relies on Atlas free-tier limits).
- No CSP/security headers, no rate limiting store, no spam protection.
- No `.well-known/security.txt`, no custom 404/500 pages.
- No staging environment defined in Vercel (preview deployments exist by default).
- No documentation of environment variables for Vercel (this report and Phase 4 checklist will cover it).

---

## 16. Verification status (what I could check locally vs not)

**Checked (from code + local build):** route inventory, auth flow logic, validation coverage, email construction, DB connection caching, index creation, cookie flags, no `NEXT_PUBLIC_`/no `any`/no console logs (grep), `.env` not tracked, package versions, production build clean, no middleware/server actions/instrumentation, no dangerous `dangerouslySetInnerHTML` on user content (only static JSON-LD), all UUID IDs compared as strings (no operator-injection shape), `_id` projected out.

**Not possible from this machine (needs you or dashboard access):** Vercel plan/region/env-var/deployment-protection settings; MongoDB Atlas cluster details (tier, region, users/roles, network access, backups); whether Gmail SMTP actually sends from Vercel; DNS/registrar state of `hopeconsultants.pk`; the *live deployed* build's headers/content (Phase 1 will test the running app locally; Phase 4 on a preview URL).

---

## 17. Questions you must answer before I continue

1. **Uncommitted work** (blog image import + education form + flags + 404 fixes from the last session, listed in §3): commit as one unit on this branch, discard it, or hold it until you want it? *(It is currently mixed into the working tree the audit shares.)*
2. **Test records I inserted into MongoDB** (`Test`-prefixed items in services, countries, testimonials, scholarships, blog, process, team) plus the corrected blog slug: delete the test items now, or leave them until Phase 1? *(They will render on the live site if deployed.)*
3. **Canonical domain.** All code today hardcodes `https://www.hopeconsultants.pk` (metadataBase, Open Graph, sitemap, robots, admin-invitation links). Your task says the canonical is `https://hopeconsultants.pk` (apex) with `www` redirecting to it. Which is canonical? I will not change this without your word.
4. **Vercel**: which plan (Hobby/Pro)? Is Deployment Protection already on? Is the app currently even connected/live, or only built locally? What function region?
5. **MongoDB Atlas**: confirm it is the free M0 tier, and give me the cluster region. Do you know the current database user name/roles and the network access setting (0.0.0.0/0 vs CIDR)?
6. **Admin password minimum length** is currently 8 characters (a prior commit lowered it from 12). Restore 12, keep 8, or decide during Phase 2?
7. **Spam protection**: do you want a Turnstile/honeypot added to the public forms in Phase 3? (Recommended: yes, honeypot at minimum.)
8. **security.txt**: confirm a contact email I may publish at `/.well-known/security.txt` (e.g. `hopeconsultants.pk@gmail.com`), or skip it.
9. **HSTS `preload`**: I will set Strict-Transport-Security in Phase 3; adding the `preload` directive requires you to commit to the HSTS preload list — approve with or without `preload`.
10. **Email on the new domain**: for Phase 5, do you want SPF/DKIM/DMARC records provided so mail from `hopeconsultants.pk` (or the Gmail address) authenticates?

Answer these and approve moving to **Phase 1** and I will run the full test/audit pass (still fixing nothing).