# NutriTrack

A personal food log built around one specific 7-day South Indian meal plan and one goal:
180 lb → 165 lb in six months, keeping the muscle.

Tick off what you ate from the plan, add anything you ate instead, and watch the calorie and
protein rings. Everything is yours — your Supabase database, your Vercel project, your data.

- **Today** — the day's plan on a clock, gym block included. Tap an item to log it.
- **Ate something else** — search ~140 South Indian and everyday foods (Telugu names work too:
  *pappu*, *majjiga*, *chepala pulusu*, *senagalu*), say how much and when. It does the arithmetic.
  Anything missing gets estimated by Claude.
- **Week plan** — all seven days with per-day calorie and protein totals.
- **Trends** — 14-day calorie bars against the 2,350 target, averages, and a weight line to 165 lb.
- **Export** — your whole log as CSV, any time.

Stack: Next.js (App Router) · Supabase (Postgres + magic-link auth + row-level security) · Vercel.

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is plenty).
2. **SQL Editor** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   That creates `entries` and `weigh_ins` with row-level security, so rows are readable only by
   the user who wrote them.
3. **Project Settings → API** → copy the **Project URL** and the **anon public** key.
4. **Authentication → URL Configuration** → set **Site URL** to your Vercel domain and add
   `http://localhost:3000/auth/callback` and `https://YOUR_DOMAIN/auth/callback` to
   **Redirect URLs**.

### 2. Local

```bash
npm install
cp .env.example .env.local     # fill in the two Supabase values
npm run dev                    # http://localhost:3000
```

Needs **Node 22 or newer**. If `node -v` shows older, `nvm install 22 && nvm use 22`.

### 3. Vercel

```bash
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel --prod
```

Or import the repo at [vercel.com/new](https://vercel.com/new) and paste the same variables in
**Settings → Environment Variables**.

On your phone, open the production URL and **Add to Home Screen** — it runs full-screen like an app.

---

## Environment variables

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key — safe in the browser; row-level security is what protects the data |
| `NEXT_PUBLIC_SITE_URL` | no | Where magic-link emails send people back to |
| `ANTHROPIC_API_KEY` | no | Turns on **Estimate with AI** for foods outside the catalogue. Without it that button is hidden and everything else works. Server-side only — never prefix it with `NEXT_PUBLIC_` |
| `ALLOWED_EMAILS` | no | Comma-separated allowlist. Anyone else who signs in is signed straight back out |

---

## Changing the plan

Everything lives in two files, no database migration needed:

- [`src/lib/plan.ts`](src/lib/plan.ts) — the 7-day meal plan: meals, times, gym blocks,
  per-item calories and protein.
- [`src/lib/foods.ts`](src/lib/foods.ts) — the food catalogue and the `FAVES` quick-add row.
  A gram-based row (`g` flag) stores its numbers per 100 g; every other row is per unit.

Daily targets are `TARGET` in [`src/lib/types.ts`](src/lib/types.ts).

---

## Importing your data from the Claude artifact version

Download the CSV from the artifact's **Trends** tab, then in the Supabase SQL editor import it
into `entries` (`date` → `eaten_on`, `time` → `eaten_at`, `item` → `name`, `calories` → `kcal`,
`protein_g` → `protein`), setting `user_id` to your own `auth.users.id`.
