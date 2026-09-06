# ramya ai — website + waitlist platform

the official site for **ramya ai** (`ramyaai.tech`) — homepage, products, waitlist
with **real google sign-up**, a **realtime google sheets mirror**, and an **admin
dashboard** — built with next.js, tailwind v4, framer motion and turso (libsql).

```
homepage      /            concept, vision, architecture, market, waitlist capsule
products      /products    aura desktop (beta) · ramya flow (coming soon)
waitlist api  POST /api/waitlist     email join → db + realtime sheets push
counter       GET  /api/waitlist      live member count
google oauth  /api/auth/google      real "continue with google" sign-up
admin login   /admin                credential login (env-based)
dashboard     /admin (after login)  stats · searchable table · csv · sheet sync
```

---

## step 0 · local development

```bash
npm install
npm run dev        # → http://localhost:3000
```

works instantly with **zero accounts** — `.env.local` defaults to a local file
database (`local.db`). email signups + admin console are fully functional locally.

- admin login locally: your `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`
- `npm run build` to verify a production build

---

## step 1 · create the production database (turso, ~1 min)

1. sign up at **https://turso.dev** (free)
2. create a database (any name, e.g. `ramya-waitlist`, location closest to your users)
3. copy the **database url** (`libsql://…`) → `TURSO_DATABASE_URL`
4. create a **database token** → `TURSO_AUTH_TOKEN`

> the table is created automatically on first use — no migrations to run.

---

## step 2 · google oauth for the real "continue with google" button (~7 min)

1. go to **https://console.cloud.google.com** → create a project (e.g. `ramya ai`)
2. **api & services → oauth consent screen**
   - user type: **external** → fill app name `ramya ai`, support email, developer email
   - scopes: add `.../auth/userinfo.email` and `.../auth/userinfo.profile`
   - test users: add your own gmail while in "testing" mode
     *(or set publishing status → "in production" so anyone can sign up — recommended for launch)*
3. **api & services → credentials → create credentials → oauth client id**
   - application type: **web application**
   - authorized javascript origins:
     - `https://ramyaai.tech`
     - `https://your-project.vercel.app` (your actual vercel url)
     - `http://localhost:3000`
   - authorized redirect uris:
     - `https://ramyaai.tech/api/auth/google/callback`
     - `https://your-project.vercel.app/api/auth/google/callback`
     - `http://localhost:3000/api/auth/google/callback`
4. copy **client id** → `GOOGLE_CLIENT_ID` and **client secret** → `GOOGLE_CLIENT_SECRET`

until these are set, the site shows a disabled "continue with google · soon" button
and email signup works normally.

---

## step 3 · realtime google sheets mirror (~5 min)

1. create a google sheet, e.g. **"ramya ai — waitlist"**
2. **extensions → apps script** → delete the default code → paste the contents of
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
3. **deploy → new deployment**
   - gear icon → type: **web app**
   - description: `ramya ai waitlist sync`
   - execute as: **me**
   - who has access: **anyone**
4. copy the **web app url** (`https://script.google.com/macros/s/…/exec`)
   → `SHEETS_WEBAPP_URL`

how it behaves:
- **every new signup** (email or google) appends a row instantly — realtime mirror
- **admin → "sync to sheets"** rewrites the whole sheet from the database (reconcile)
- a sheets outage never blocks a signup (fire-and-forget with timeout)

---

## step 4 · deploy to vercel (~5 min)

1. push this folder to a **github repo**
2. **vercel.com → add new project → import** the repo (framework auto-detects next.js)
3. add **environment variables** (settings → environment variables):

| key | value |
| :-- | :-- |
| `TURSO_DATABASE_URL` | from step 1 |
| `TURSO_AUTH_TOKEN` | from step 1 |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password — **rotate the one used locally** |
| `GOOGLE_CLIENT_ID` | from step 2 |
| `GOOGLE_CLIENT_SECRET` | from step 2 |
| `SHEETS_WEBAPP_URL` | from step 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://ramyaai.tech` |

4. **deploy** — the waitlist table auto-creates on first use
5. after deploy: open the site → submit a test email → check the google sheet

---

## step 5 · connect ramyaai.tech

in vercel: **settings → domains → add** `ramyaai.tech` (and `www.ramyaai.tech`)

at your domain registrar (where ramyaai.tech is registered) add dns records:

| type | name | value |
| :-- | :-- | :-- |
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

ssl is issued automatically. dns propagation: minutes → a few hours.

---

## admin console

- url: **/admin** (linked discreetly in the footer)
- login: your `ADMIN_EMAIL` + `ADMIN_PASSWORD` (stored only in env vars)
- features: live stats (total / today / 7-day / google-vs-email), searchable member
  table, source filters, sorting, **csv export**, **full sheet reconcile**
- sessions: hs256-signed httpOnly cookie, 7-day expiry, brute-force rate limited

security notes:
- credentials live in env vars — never in code; **rotate the password after launch**
- signup + login endpoints are rate-limited; signup form has a honeypot field

---

## tech stack

| layer | choice |
| :-- | :-- |
| framework | next.js 16 (app router) + typescript |
| styling | tailwind css v4 — designguide.md tokens (obsidian · cyan · emerald · violet) |
| animation | motion (framer motion) — ease-out-expo reveals, cursor-tracked card glow |
| fonts | geist sans + jetbrains mono via next/font |
| database | turso (libsql) + drizzle orm — file-db fallback for local dev |
| google oauth | hand-rolled minimal client (`lib/google.ts`) — no beta auth libs |
| sessions | jose-signed httponly jwt cookies (admin + member) |
| sheets mirror | google apps script web app webhook (realtime, keyless) |

## project structure

```
app/
  page.tsx                  homepage
  products/page.tsx         aura desktop + ramya flow
  admin/page.tsx            dashboard (session-guarded)
  admin/login/page.tsx      credential login
  api/waitlist/route.ts     POST join · GET count
  api/auth/google/…         oauth start + callback
  api/admin/…               login · logout · sync-sheets
  layout.tsx  globals.css   fonts · theme tokens · theme script
  sitemap.ts  robots.ts  icon.png
components/
  nav · footer · logo · theme-toggle · buttons · badge-pill
  reveal · glow-card · stat-counter · waitlist-capsule · google-button
  home/…  admin/…
lib/
  db · schema · bootstrap   drizzle + turso (auto schema bootstrap)
  waitlist · sheets         join logic + realtime mirror
  session · google          jwt sessions + oauth client
  rate-limit                best-effort in-memory limiter
google-apps-script/Code.gs  paste into your sheet's apps script
```

## design system (designguide.md)

- dark obsidian pro default (`#08090a`) with light alabaster theme — toggle in nav,
  logo swaps automatically per theme
- electric cyan `#00f0ff` interactive · emerald `#34d399` local/free · violet
  `#818cf8` cloud/reasoning
- the lowercase regime: all ui copy lowercase; casing preserved for third-party
  names (chatgpt, claude, cursor) and acronyms (byok, arr, api)
