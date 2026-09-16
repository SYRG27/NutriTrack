# Racked — the /train page

Source for the exercise library served at `nutri-track.vercel.app/train/`.
It is a standalone Vite app; NutriTrack just hosts the built output.

```bash
cd apps/racked
npm install
npm run dev              # http://localhost:5173 on its own

npm run build            # then publish it into the Next app:
rm -rf ../../public/train && cp -R dist ../../public/train
```

Served under `/train/` with a hash router, so Next never has to know about its
routes and its Tailwind styles cannot touch NutriTrack's own CSS.

## Images

`public/media/**` comes from [free-exercise-db](https://github.com/yuhonas/free-exercise-db),
released under the Unlicense (public domain). The mapping from our exercise names to
theirs was hand-checked, not fuzzy-matched.

Three exercises are not in that dataset and were filled separately:

| Exercise | Source | Licence |
|---|---|---|
| Burpee | Wikimedia Commons, *Airborne Burpee* (Marine Corps photo by Sgt. Ryan Young) | Public domain |
| Jumping Jack | Wikimedia Commons, USMC photo by Lance Cpl. Ryan M. Joyner | Public domain |
| Wall Sit | `wall-sit.svg`, drawn for this app | Ours |

No free photo of a wall sit exists on Commons, so it is a diagram instead — which is
arguably clearer for an isometric hold anyway.

Do not replace any of these with images from JEFIT, Google or any other app — those are
copyrighted. Own recordings, Wikimedia Commons or licensed stock only.
