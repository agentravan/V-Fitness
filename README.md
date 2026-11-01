# V Fitness — Website & Gym Management Demo

A modern, motion-rich rebuild of [vfitness.com](https://www.vfitness.com/) on **Next.js (App Router)**, **Tailwind CSS v4**, **Framer Motion** and **Lucide**, with an interactive **gym-management demo portal** at `/dashboard`. Ready for one-click deployment on Vercel.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, programs grid, BMI/calorie calculator with plan recommendation, testimonials carousel, embedded + modal lead form, FAQ |
| `/about` | Story, facilities, coaching specialties, club gallery |
| `/pricing` | Plans with Monthly / Quarterly / Annual toggle and comparison table |
| `/dashboard` | Demo staff portal (noindex) — 1-click login `demo@vfitness.com` / `demo` |
| `/api/lead` | Edge route that validates lead submissions and forwards them to `LEAD_WEBHOOK_URL` |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/llms.txt` | SEO / GEO plumbing |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy to Vercel

1. Import this repo in Vercel (framework preset: **Next.js**, no extra settings).
2. Optional environment variables (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` – canonical domain, e.g. `https://www.vfitness.com`
   - `LEAD_WEBHOOK_URL` – Zapier / Make / n8n / CRM endpoint that receives each lead as JSON. Without it, leads are written to the Vercel function logs.

## Editing content

All business data lives in **`lib/site.ts`** — address, phones, hours, geo-coordinates, programs, plans, FAQs, gallery. The page copy, JSON-LD schema and `/llms.txt` all read from it.

Before launch, confirm the items marked `TODO(confirm)` in that file:

- **Opening hours** and **map coordinates** (not published on the current site)
- **Performance** and **Elite Coaching** tier prices (Essential mirrors the live rates)
- **Testimonials** are flagged `sample: true` and show a "Sample" tag — replace them with real, consented member reviews
- Club photos are loaded from the existing WordPress uploads; copy them into `public/images` and update `gallery` when the old site is retired

## SEO & GEO

- Per-page metadata, canonical URLs, OpenGraph + Twitter cards, generated OG image
- JSON-LD `@graph` with `ExerciseGym` / `SportsActivityLocation` / `HealthClub` / `LocalBusiness`: address, `GeoCoordinates`, opening hours, price range, area served, offer catalog
- `FAQPage` and `BreadcrumbList` schema; FAQ answers written as self-contained facts that AI answer engines can quote
- `/llms.txt` plain-text brief for LLM crawlers; `robots.txt` allows public pages and blocks `/dashboard` and `/api`
- Semantic landmarks (`header`, `main`, `section`, `article`, `footer`, `address`), one `h1` per page, descriptive `alt` text, skip link, reduced-motion support

## Club OS demo portal (`/dashboard`)

Staff sign-in (Admin / Front desk / Trainer) with a 1-click demo login (`demo@vfitness.com` / `demo`). All data is generated in the browser relative to today and saved in `localStorage` for the day; **Reset demo data** restores it.

| Module | What it does |
| --- | --- |
| Overview | KPIs (248 active, 42 check-ins, 12 expiring, shop sales, PT sessions, monthly revenue), 12-month revenue chart, live check-ins, expiring list with bulk reminders, top sellers, low-stock alert, activity log |
| Attendance | Check-in desk (search or simulated QR scan), check-out, hourly and 7-day charts, today's log with time in/out and duration |
| Members | Customer tracking with search, status/plan filters (incl. "At risk"), sort, pagination, profile drawer (8-week visit grid, packages, orders, renew, remind, check-in), add member |
| Orders | Protein bar & pro shop POS (categories, cart, card/cash/member account), orders list with paid/collected workflow, inventory with low-stock and restock |
| Packages | PT and class-pack tracker: sessions used/left, log session, renew, ending-soon reminders, plan mix and trainer load |
| Analytics | Joins vs churn, active-member trend, retention, visit frequency, revenue mix, demographics and goals, weekday × hour peak grid, top products, at-risk win-back list |

Reminder and win-back sending is simulated — connect `sendReminder` in `components/dashboard/store.tsx` to the WhatsApp Business API, an SMS gateway or email provider for production. Prices in the portal are in AED.
