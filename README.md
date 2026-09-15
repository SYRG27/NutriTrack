# NutriTrack

Answer a few questions, get a week of meals built around your numbers, and log what you
actually eat.

It works out your resting burn, your daily burn, and a calorie and protein target from your
own timeline — then builds a week of Indian home cooking to match: your diet, your allergies,
your gym hours, portions sized to your target. Everything you eat off-plan, you search and log.

- **Setup** — sex, age, height, weight, goal weight, how many weeks, gym timing and days,
  activity, diet, meals a day, shakes, and anything to keep out. Targets update as you answer.
  Ask for a pace that would cost you muscle and it says so, then plans the pace that won't.
- **Today** — your meals on a clock with the gym block in place. Tap to log. Anything you add
  yourself lands in the meal whose time it belongs to.
- **Search** — 560+ dishes: South and North Indian home cooking with Telugu and Hindi names as
  search terms, plus what people actually eat out here — Chipotle, Cava, McDonald's,
  Chick-fil-A, tacos, Thai, Mexican, Mediterranean, American plates, desserts, fruit, coffee
  shop drinks and grocery protein. Say how much and when; it does the arithmetic. Anything
  missing gets estimated.
- **Week plan** — all seven days with per-day totals, and an honest note when protein can't be
  reached on that diet at those calories.
- **Trends** — 14-day calorie bars against your target, averages, and a weight line to your
  goal, in pounds or kilos.
- **Export** — your whole log as CSV, any time.

Each person sees only their own data. Postgres row-level security enforces it, so it holds
even if someone gets hold of the public key.

Stack: Next.js (App Router) · Supabase (Postgres + magic-link auth + row-level security) · Vercel.

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (free tier is plenty).
2. **SQL Editor** → run [`supabase/schema.sql`](supabase/schema.sql), then
   [`supabase/profiles.sql`](supabase/profiles.sql). Both are safe to re-run.
3. **Authentication → Sign In / Providers → Email** → turn **Confirm email** off, so signing up
   logs people straight in instead of mailing them a link.
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

- [`src/lib/plan.ts`](src/lib/plan.ts) — the base 7-day menu, the diet and allergy swaps, and
  the portion solver. Items carry per-unit calories and protein so portions can be scaled to
  anyone's target.
- [`src/lib/foods.ts`](src/lib/foods.ts) — the food catalogue and the `FAVES` quick-add row.
  A gram-based row (`g` flag) stores its numbers per 100 g; every other row is per unit.

Target maths lives in [`src/lib/profile.ts`](src/lib/profile.ts).

---

## A note on the numbers

Nutrition figures are reasonable published values, rounded. Restaurant portions vary by
location. The calorie maths is Mifflin-St Jeor with standard activity multipliers — a good
estimate, not a measurement. Treat the first three weeks as calibration: if the scale moves
faster or slower than the plan says, adjust the target, not the plan.

This is not medical advice. Anyone with a medical condition, or eating well below their
resting burn, should talk to a doctor or dietitian.
