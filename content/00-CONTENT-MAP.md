# 00 — Content Map

Map of every content file in this pack, where it renders, and which home-page section it feeds. Read this before building anything.

## Files at a glance

| File | Purpose | Renders where |
|---|---|---|
| `01-about.md` | About/Story page + home hero + home about preview | `/about`, home hero, home About preview |
| `02-home.md` | Home page copy (headline, services intro, process, stats, FAQ, final CTA) | `/` |
| `03-team.md` | Team member profiles | `/team` |
| `04-scholarships.md` | Scholarship catalogue | `/scholarships` |
| `05-destinations-index.md` | Destinations overview + country cards | `/destinations` |
| `destinations-1.md` | Countries 1–7 (full detail pages) | `/destinations/[slug]` |
| `destinations-2.md` | Countries 8–14 (full detail pages) | `/destinations/[slug]` |
| `06-legal.md` | Privacy, Terms, Refunds, Cookie, Disclaimer | `/privacy`, `/terms`, `/refunds`, `/cookies`, `/disclaimer` |

## Home page section source

| Home section | Feeds from |
|---|---|
| Hero | `01-about.md` (hero intro) + `02-home.md` (headline) |
| Destinations preview (3 cards) | `05-destinations-index.md` (first 3 entries) + `destinations-*.md` for flags/icons |
| Services | `02-home.md` (services intro) |
| Process | `02-home.md` (process steps) |
| Stats | `02-home.md` (stats) |
| FAQ | `02-home.md` (faq) |
| Final CTA | `01-about.md` (mission) + contact |
| Testimonials | external (not in this pack) |

## Destinations which also need a dedicated page (all 14):

1. New Zealand
2. Australia
3. Canada
4. United Kingdom
5. Ireland
6. Germany
7. France
8. Poland
9. Malaysia
10. USA
11. Denmark
12. Netherlands
13. Norway
14. Sweden

## Data gaps (must be reported to the owner, never invented)

- No email, phone or office address yet.
- No social media URLs yet.
- No student testimonials in this pack.
- No images anywhere yet — all imagery falls back to brand-colour SVG/CSS art.
- Contact form backend exists only as a stub. Final wiring is a later step.