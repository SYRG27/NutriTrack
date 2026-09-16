# Racked — exercise library

Pick a muscle group, see every exercise that trains it, open one and learn the form before you
try it in the gym.

```bash
npm install
npm run dev      # http://localhost:5173
```

Needs Node 20+.

## Structure

- `src/data/exercises.ts` — 7 groups, 39 exercises. Slugs are derived from names at build time.
- `src/components/Home.tsx` — muscle group grid.
- `src/components/GroupPage.tsx` — beginner routine, search + filters, exercise cards.
- `src/components/Drawer.tsx` — the detail panel, all eight blocks.
- `src/components/RestTimer.tsx` — seeds from `restSec`, reseeds on exercise change.

Routes are `/` and `/g/:groupKey`. The open exercise is a query param (`/g/chest?ex=push-up`) so
the drawer is shareable and the back button closes it.

## Media

Ships with no media on purpose. Every slot renders a labelled placeholder naming what belongs
there, so the app is usable before any footage exists.

Drop files in and they appear, no code change:

```
public/media/groups/chest.jpg
public/media/exercises/barbell-bench-press.jpg
```

Resolution is by convention first, then `media.poster` / `media.loop` / `media.video` in the data
file override it. If `media.video` is set, the drawer renders a real video player instead.

**Do not fill these by scraping Google, JEFIT or any other app** — those images are copyrighted.
Use your own phone recordings, Wikimedia Commons, or a licensed stock subscription.
