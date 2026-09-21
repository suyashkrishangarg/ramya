# ramya ai — website + waitlist platform

the official site for **ramya ai** ([ramyaai.tech](https://ramyaai.tech)) —
homepage, products, about, contact, signup, member profiles, waitlist
with **real google sign-up**, a **realtime google sheets mirror**, welcome emails,
and an **admin console** with a site-links editor — built with next.js 16,
tailwind v4, motion and supabase.

live site: **https://ramyaai.tech** · admin console at **/admin**

```
homepage      /              monochrome editorial landing + waitlist capsule
products      /products      aura desktop (beta) · ramya flow (video & animation · in idea)
about         /about         story + principles
contact       /contact         contact page
signup        /signup        waitlist signup page
profile       /profile       member profile page
waitlist api  POST /api/waitlist     email join → db + realtime sheets push
counter       GET  /api/waitlist      live member count
google oauth  /auth/google           real "continue with google" via supabase
signout       /auth/signout          member sign out
admin login   /admin                credential login (env-based)
dashboard     /admin (after login)  stats · members table · csv · sheet sync · member delete · backfill emails · site links
```

design language: **deep forest black & pure white** — hairline borders, mono
labels, editorial asymmetric grids, outlined display type. no color, no noise.

---

## step 0 · local development (zero accounts needed)

```bash
npm install
npm run dev        # → http://localhost:3000
```

with no supabase env vars set, the app runs on an **embedded postgres**
(`.pglite/` folder) — email signup, admin console, site links and csv export all
work instantly. the google button appears once supabase is connected.

- admin login: your `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`
- `npm run build` to verify a production build

---

## step 1 · create supabase + connect the database (~3 min)

1. sign up at **https://supabase.com** (free) → **new project** (name it `ramya-ai`, pick the region closest to your users, set any database password)
2. grab three values:
   - **project url** → project settings ⚙ → api → `project url` → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → same page → `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **database connection** → sidebar **connect** → choose the **session pooler** tab → copy the **uri** (looks like `postgresql://postgres.xxxx:PASS@aws-0-region.pooler.supabase.com:5432/postgres`) → `DATABASE_URL`
3. the `waitlist` and `settings` tables **create themselves** on first use — no sql to run

---

## step 2 · real google sign-up (~7 min, one time)

**a. google cloud oauth client**

1. **https://console.cloud.google.com** → create project `ramya ai`
2. **api & services → oauth consent screen** → external → app name `ramya ai`, your emails → save
3. **api & services → credentials → create credentials → oauth client id** → web application
   - authorized javascript origins: `https://ramyaai.tech`, your vercel url, `http://localhost:3000`
   - authorized redirect uris:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`  ← from supabase settings → api
     - `http://localhost:3000/auth/callback`
   - copy the **client id** + **client secret**

**b. enable google in supabase**

1. supabase dashboard → **authentication → providers → google**
2. toggle on, paste the google **client id** + **client secret** → save

done — the **"continue with google"** button on the site is now live for everyone.
every google sign-up lands in the waitlist with `source = google`.

---

## step 3 · realtime google sheets mirror (~5 min)

1. create a google sheet, e.g. **"ramya ai — waitlist"**
2. **extensions → apps script** → delete the default code → paste
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
3. **deploy → new deployment** → gear icon → type: **web app**
   - execute as: **me** · who has access: **anyone**
4. copy the web app url (`https://script.google.com/macros/s/…/exec`) → `SHEETS_WEBAPP_URL`

- **every new signup** (email or google) appends a row instantly
- **admin → "sync to sheets"** rewrites the whole sheet from the database
- a sheets outage never blocks a signup (fire-and-forget)

---

## step 4 · deploy to vercel (~5 min)

1. push this folder to a **github repo**
2. **vercel.com → add new project → import** (framework auto-detects next.js)
3. add environment variables:

| key | value |
| :-- | :-- |
| `NEXT_PUBLIC_SUPABASE_URL` | step 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | step 1 |
| `DATABASE_URL` | step 1 (session pooler uri) |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password — **rotate the one used locally** |
| `SHEETS_WEBAPP_URL` | step 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://ramyaai.tech` |

4. **deploy** — tables auto-create on first use
5. also add `https://ramyaai.tech/auth/callback` and your vercel url to the google
   oauth client's authorized redirect uris (step 2a) once the domain is live

---

## step 5 · connect ramyaai.tech

vercel → settings → domains → add `ramyaai.tech` + `www`. at your registrar:

| type | name | value |
| :-- | :-- | :-- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

ssl is automatic. propagation: minutes → a few hours.

---

## chat beta · /chat (invite-only)

agentic chat at **ramyaai.tech/chat** — the python harness lives in
[`agent-service/`](./agent-service) (deployed on render), this site gates
access and proxies to it.

**how access works** (two layers, server-side only):

1. visitor must be a signed-in member (google or email) → else `/signup?next=/chat`
2. member's email must be on the beta list:
   - `CHAT_BETA_EMAILS` env var (comma-separated, fastest for early testers), or
   - a `chat_access` table row (the `grantChatAccess()` helper writes these)

both sources grant — no nav link, `noindex`, blocked in robots, absent from
the sitemap.

**vercel env vars** (in addition to the ones above):

| var | value |
| :-- | :-- |
| `PYTHON_AGENT_URL` | render service url, e.g. `https://ramya-agent-harness.onrender.com` |
| `CHAT_BACKEND_SECRET` | same value as render's `BACKEND_SECRET` |

**keeping render awake (free plan):** cron-job.org (free) → new cronjob →
url `<render-url>/healthz`, every 5 minutes, GET. failure alerts via email.
free render sleeps after ~15 min idle; a cold start looks like a 502 on the
first chat message ("agent is waking up — try again in ~30 seconds").

**limits while in beta:** 5 messages / 30s burst and 20 runs / hour per
member (bump in `app/api/chat/route.ts`). hobby plan functions cap streams
at 60s — `chat` and `research` fit; `deep` may truncate (upgrade for pro).

---

## admin console

---

## admin console

- url **/admin** (linked in the footer) · login: `ADMIN_EMAIL` + `ADMIN_PASSWORD`
- stats: total / today / 7-day / google-vs-email split
- members table: search, source filters, sorting, **csv export**
- **sync to sheets**: full reconcile of the google sheet
- **delete member**: remove a member (+ their supabase auth user when `SUPABASE_SERVICE_ROLE_KEY` is set)
- **backfill emails**: send welcome emails to members who missed theirs
- **site links editor**: add github / x / linkedin / youtube / discord / demo
  video / docs links anytime — they appear in the site footer instantly
  (empty field = hidden)

security notes: credentials live in env vars only — **rotate the password after
launch**. signup + admin login are rate-limited; the signup form has a honeypot.

---

## tech stack

| layer | choice |
| :-- | :-- |
| framework | next.js 16 (app router) + typescript |
| styling | tailwind css v4 — monochrome tokens (deep black / pure white) |
| animation | motion (framer motion) — ease-out-expo reveals, css marquee |
| fonts | geist sans + jetbrains mono via next/font |
| database | supabase postgres + drizzle orm (embedded pglite fallback for local dev) |
| google auth | supabase auth (`@supabase/ssr`) — pkce flow, session cookies |
| admin sessions | jose-signed httpOnly jwt cookie |
| welcome email | resend — skipped + logged when `RESEND_API_KEY` is unset |
| sheets mirror | google apps script web app webhook (realtime, keyless) |

> env template: copy [`.env.example`](.env.example) → `.env.local`.
> welcome emails come from `EMAIL_FROM` once your domain is verified in resend;
> member deletion also removes the supabase auth user when `SUPABASE_SERVICE_ROLE_KEY` is set.

## project structure

```
app/
  (public)/page.tsx           homepage (hero · faq · cost calculator · live counter)
  (public)/products/page.tsx  aura desktop + ramya flow (task-router demo)
  (public)/about · /contact   editorial pages
  signup/page.tsx             waitlist signup page
  profile/                    member profile page
  auth/google/route.ts        google sign-up start (supabase)
  auth/callback/route.ts      oauth callback → waitlist + sheets
  auth/signout/route.ts       sign out
  admin/page.tsx              dashboard (session-guarded)
  admin/login/page.tsx        credential login
  api/waitlist/route.ts       POST join · GET count
  api/admin/…                 login · logout · sync-sheets · settings · delete-member · backfill-emails
  layout.tsx  globals.css   fonts (space grotesk + geist + jetbrains mono) · monochrome tokens
  sitemap.ts  robots.ts  manifest.ts  icon.png  opengraph-image.tsx  not-found.tsx  template.tsx
components/
  nav · nav-shell · footer · logo · section · list-row · marquee
  reveal · stat-counter · live-counter · scroll-progress · cursor-glow · glow
  buttons · badge-pill · hero-lines · member-card · json-ld · skeletons
  faq · cost-calculator · task-router · waitlist-capsule · google-button
  home/…  admin/dashboard · admin/login-form · admin/site-links (+ stats.ts)
lib/
  db · schema · bootstrap   drizzle over supabase postgres / pglite
  waitlist · settings       join logic · site links store
  member · email            member helpers · resend welcome emails
  supabase                  auth client (google provider)
  session                   admin jwt sessions (jose)
  sheets · rate-limit       realtime mirror · abuse guard
  link-keys · supabase helpers
google-apps-script/Code.gs  paste into your sheet's apps script
docs/  designguidelines.md · websitespec.md
implementation_plan.md      website v2 plan (typography · faq · calculator · task-router)
```
