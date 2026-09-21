# NutriTrack

Answer a few questions, get a week of meals built around your numbers, and log what you
actually eat. Plus an exercise library that tells you how to do every movement, and records
what you lifted.

**Live at [nutri-track-lilac.vercel.app](https://nutri-track-lilac.vercel.app)** — installable
to a phone home screen, works offline.

---

## What it does

### Setup, once
Sex, age, height, weight, goal weight, and how long you want to take. Which days you train and
what you train on each of them, what time you get to the gym, how active the rest of your day
is. What you eat — everything, egg only, vegetarian or vegan — how many meals a day, whether
you use protein shakes, and anything to keep out: dairy, nuts, gluten, seafood, onion and
garlic.

From that it works out your resting burn (Mifflin-St Jeor), your daily burn including each
weekly gym session, and a calorie and protein target. The targets come from **your own
timeline**, not a fixed guess — and if the timeline would cost you muscle it says so and plans
the pace that won't:

> 20 lb in 6 weeks would mean 3.3 lb a week — too fast, and most of what you lost would be
> muscle. This plan runs at 1.5 lb a week and gets you there in about 3 months.

### Today
Your meals on a clock, with the gym block in place. Tap an item to log it. Training days get a
pre-workout and post-gym meal around whatever time you train; rest days get neither, a lighter
dinner, and about 8% fewer calories that the training days carry instead.

Two rings at the top: calories and protein against target.

### Logging what you actually ate
**810 foods.** South and North Indian home cooking with Telugu and Hindi names as search terms
(*pappu*, *vepudu*, *senagalu*, *golgappa*), and what people eat out here — Chipotle, Cava,
McDonald's, Chick-fil-A, Panda Express, tacos, Thai, Mexican, Mediterranean, Indian restaurant
platters and tiffin breakfasts, IHOP, bagels, desserts, fruit, coffee-shop drinks, grocery
protein.

You never type a calorie. Type the food, say how much and when — *1 cup, 2 eggs, 150 g* — and
it does the arithmetic. Anything missing gets estimated by Claude. Numbers not matching your
packet? Correct them, and tick **remember my version** so that food comes back with your
figures every time.

### Water
A row of glasses sized from your bodyweight, plus half a litre on days you train. Tap the one
you're on; tap it again to take it back off.

### Week plan and trends
All seven days with per-day totals. Fourteen days of calorie bars against target, your
averages, and a weight line running to your goal — in pounds or kilos, whichever your scale
reads.

Trends opens with a card that reads the week and says **one** thing:

> **Protein is 53g short** — You averaged 110g against 163g. That is the gap that decides
> whether you lose fat or muscle. A cup of Greek yogurt or a whey shake closes most of it.

### The exercise library — `/train`
**93 exercises across 9 muscle groups**, each with the setup, four numbered form cues, the two
mistakes people actually make, and a rest timer already loaded with that exercise's rest
period.

**225 variations** — same movement, whatever is free. A calf raise offers the seated machine,
the leg press and a step. A chest press offers dumbbells, Smith and cable. Each with its own
photo.

**Set logging.** Open an exercise and it says *"Last time, 16 Sep — 3 × 10 @ 180lb"*, with
those numbers already in the boxes. Add a rep or the smallest plate and save.

The header dumbbell in the food log opens **today's session** — the starters for whatever
you're training, with a tick box on each and a progress bar.

---

## Stack

Next.js (App Router) · Supabase (Postgres, auth, row-level security) · Vercel.
The exercise library is a separate Vite + React app in [`apps/racked`](apps/racked), built and
served as static files under `/train`.

Every table is protected by row-level security, so each person sees only their own data — even
though the app is shared.

---

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com). The free tier is plenty.
2. **SQL Editor** → run these in order. All are safe to re-run:
   - [`supabase/schema.sql`](supabase/schema.sql) — meals and weigh-ins
   - [`supabase/profiles.sql`](supabase/profiles.sql) — the questionnaire's answers
   - [`supabase/user_foods.sql`](supabase/user_foods.sql) — your corrected food numbers
   - [`supabase/workout_sets.sql`](supabase/workout_sets.sql) — set logging
   - [`supabase/water_log.sql`](supabase/water_log.sql) — water
3. **Authentication → Sign In / Providers → Email** → turn **Confirm email** off, so signing up
   logs people straight in instead of mailing them a link.
4. **Project Settings → API** → copy the **Project URL** and the **anon public** key. Never the
   `service_role` key — it bypasses row-level security.

### 2. Vercel

Import the repo at [vercel.com/new](https://vercel.com/new) and set two environment variables:

| Variable | |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` — no path, no trailing slash |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the `anon public` key |

Both must be **Config**, not Secret — `NEXT_PUBLIC_` values are compiled into the browser
bundle, so Vercel refuses to treat them as secrets.

Optional: `ANTHROPIC_API_KEY` turns on **Estimate with AI** for foods outside the catalogue.
Without it that button hides and everything else works. Server-side only — never prefix it with
`NEXT_PUBLIC_`.

### 3. Local

```bash
npm install
cp .env.example .env.local     # or: npx vercel env pull .env.local
npm run dev                    # http://localhost:3000
```

Needs **Node 22 or newer**.

### Installing it on a phone

**Android** — a bar offers to install it. **iPhone** — Safari only, then Share → Add to Home
Screen; iOS shows no prompt. After a UI change, delete and re-add it: an installed app keeps
its old shell.

---

## Changing things

| What | Where |
|---|---|
| Meals, portions, diet and allergy swaps | [`src/lib/plan.ts`](src/lib/plan.ts) |
| The food catalogue and the quick-add row | [`src/lib/foods.ts`](src/lib/foods.ts) |
| Target maths, pace caps, protein per kg | [`src/lib/profile.ts`](src/lib/profile.ts) |
| What the weekly review says | [`src/lib/review.ts`](src/lib/review.ts) |
| Water targets | [`src/lib/water.ts`](src/lib/water.ts) |
| Exercises, cues, variations | [`apps/racked/src/data/exercises.ts`](apps/racked/src/data/exercises.ts) |

Plan items carry per-unit calories and protein, so portions scale to anyone's target rather
than being hardcoded.

### Rebuilding the exercise library

```bash
cd apps/racked && npm install && npm run build
rm -rf ../../public/train && cp -R dist ../../public/train
```

The root `tsconfig.json` must keep `"exclude": ["apps"]`, or the Next build tries to type-check
a separate app whose dependencies are not installed at the root.

---

## Images

Exercise photos come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db),
released under the **Unlicense** (public domain). Burpee and jumping jack are public-domain US
military photographs from Wikimedia Commons. Wall sit, assault bike, landmine press, bear crawl
and the outdoor walk are drawn for this app, because no free photograph of them exists.

The source photos come in pairs: **frame 0 is the setup, frame 1 is the exercise**. Frame 1 is
usually the right one — but not for flies, or for lifts whose finish is standing still, where
frame 0 shows the movement. Every picture has been checked by eye against its caption.

**Do not fill gaps from JEFIT, Google or any other app.** Those images are copyrighted. Own
recordings, Wikimedia Commons, or licensed stock only.

---

## A note on the numbers

Nutrition figures are reasonable published values, rounded; restaurant portions vary by
location. The calorie maths is Mifflin-St Jeor with standard activity multipliers — a good
estimate, not a measurement. Treat the first three weeks as calibration: if the scale moves
faster or slower than the plan says, adjust the target, not the plan.

This is not medical advice. Anyone with a medical condition, or eating well below their resting
burn, should talk to a doctor or dietitian.
