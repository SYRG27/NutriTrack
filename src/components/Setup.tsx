"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";
import {
  cmToFtIn, describeDuration, ftInToCm, kgToLb, lbToKg, monthsToWeeks, targetsFor, weeksToMonths,
  DAY_KEYS, DAY_LABEL, SPLIT_LABEL,
  type Activity, type Avoid, type Cuisine, type DayKey, type Diet, type Like,
  type Goal, type Profile, type Sex, type Split, type Units,
} from "@/lib/profile";

type Opt<T> = { v: T; label: string; hint?: string };

function Seg<T extends string | number | boolean>({
  value, onChange, options,
}: { value: T | ""; onChange: (v: T) => void; options: Opt<T>[] }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={value === o.v}
                onClick={() => onChange(o.v)}>
          {o.label}
          {o.hint && <small>{o.hint}</small>}
        </button>
      ))}
    </div>
  );
}

const AVOIDS: { v: Avoid; label: string }[] = [
  { v: "dairy", label: "Dairy / lactose" },
  { v: "nuts", label: "Nuts" },
  { v: "gluten", label: "Wheat / gluten" },
  { v: "seafood", label: "Seafood" },
  { v: "beef", label: "Beef" },
  { v: "pork", label: "Pork" },
  { v: "onion_garlic", label: "Onion & garlic" },
];

const SPLIT_OPTIONS: Split[] = [
  "rest", "chest_back", "arms", "legs", "shoulders", "push", "pull",
  "full_body", "cardio", "core",
];

const PRESETS: { label: string; splits: Record<DayKey, Split> }[] = [
  { label: "Mon–Fri", splits: { mon: "chest_back", tue: "arms", wed: "legs",
      thu: "shoulders", fri: "full_body", sat: "rest", sun: "rest" } },
  { label: "3 days", splits: { mon: "push", tue: "rest", wed: "pull", thu: "rest",
      fri: "legs", sat: "rest", sun: "rest" } },
  { label: "6 days", splits: { mon: "chest_back", tue: "arms", wed: "legs",
      thu: "shoulders", fri: "full_body", sat: "cardio", sun: "rest" } },
  { label: "Not training", splits: { mon: "rest", tue: "rest", wed: "rest",
      thu: "rest", fri: "rest", sat: "rest", sun: "rest" } },
];

const LIKE_GROUPS: { title: string; hint: string; options: { v: Like; label: string }[] }[] = [
  { title: "Breakfasts you would actually eat", hint: "Pick a few — your week rotates through them.",
    options: [
      { v: "idli", label: "Idli & sambar" }, { v: "dosa", label: "Dosa" },
      { v: "pesarattu", label: "Pesarattu" }, { v: "upma", label: "Upma" },
      { v: "poha", label: "Poha" }, { v: "curd_rice", label: "Curd rice" },
      { v: "idiyappam", label: "Idiyappam" }, { v: "oats", label: "Oats" },
      { v: "eggs", label: "Eggs" }, { v: "paratha", label: "Paratha" },
    ] },
  { title: "Proteins you like", hint: "These anchor your lunches and dinners.",
    options: [
      { v: "chicken", label: "Chicken" }, { v: "fish", label: "Fish" },
      { v: "prawns", label: "Prawns" }, { v: "goat", label: "Goat / mutton" },
      { v: "egg_curry", label: "Egg curry" }, { v: "paneer", label: "Paneer" },
      { v: "tofu", label: "Tofu" }, { v: "soya", label: "Soya chunks" },
      { v: "dal", label: "Dal only" },
    ] },
  { title: "Evening snacks", hint: "",
    options: [
      { v: "fruit", label: "Fruit" }, { v: "nuts", label: "Trail mix" },
      { v: "sprouts", label: "Sprouts" }, { v: "yogurt", label: "Greek yogurt" },
      { v: "chana", label: "Roasted chana" },
    ] },
];

/** The form's own shape: everything a person types starts empty. */
type Draft = {
  name: string;
  sex: Sex | "";
  age: string;
  units: Units;
  ft: string; inch: string;
  weight: string; goalWeight: string;
  months: number | "";
  goal: Goal | "";
  splits: Record<DayKey, Split>;
  gym_time: string;
  likes: Like[];
  activity: Activity | "";
  diet: Diet | "";
  cuisine: Cuisine;
  meals_per_day: number;
  uses_supplements: boolean;
  avoid: Avoid[];
};

const EMPTY: Draft = {
  name: "", sex: "", age: "", units: "lb",
  ft: "", inch: "", weight: "", goalWeight: "", months: "",
  goal: "",
  splits: { mon: "rest", tue: "rest", wed: "rest", thu: "rest", fri: "rest", sat: "rest", sun: "rest" },
  gym_time: "19:00", likes: [],
  activity: "", diet: "",
  cuisine: "south", meals_per_day: 5, uses_supplements: true, avoid: [],
};

function draftFrom(p: Profile): Draft {
  const { ft, inch } = cmToFtIn(p.height_cm);
  const w = (lb: number) =>
    p.units === "kg" ? String(Math.round(lbToKg(lb) * 10) / 10) : String(Math.round(lb));
  return {
    name: p.name, sex: p.sex, age: String(p.age), units: p.units,
    ft: String(ft), inch: String(inch),
    weight: w(p.weight_lb), goalWeight: w(p.goal_weight_lb),
    months: Math.max(1, Math.round(weeksToMonths(p.target_weeks))),
    goal: p.goal,
    splits: (p.splits as Record<DayKey, Split>) ?? EMPTY.splits,
    gym_time: p.gym_time ?? "19:00",
    likes: p.likes ?? [],
    activity: p.activity,
    diet: p.diet, cuisine: p.cuisine, meals_per_day: p.meals_per_day,
    uses_supplements: p.uses_supplements, avoid: p.avoid ?? [],
  };
}

const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

/** Everything answered? Then this is a real profile. Otherwise say what's missing. */
function toProfile(d: Draft): { profile: Profile } | { missing: string[] } {
  const missing: string[] = [];
  if (!d.name.trim()) missing.push("your name");
  if (!d.sex) missing.push("sex");
  if (!Number.isFinite(num(d.age))) missing.push("age");

  const height_cm = Number.isFinite(num(d.ft))
    ? ftInToCm(num(d.ft), Number.isFinite(num(d.inch)) ? num(d.inch) : 0)
    : NaN;
  if (!Number.isFinite(height_cm) || height_cm < 120) missing.push("height");

  const toLb = (v: number) => (d.units === "kg" ? kgToLb(v) : v);
  const weight_lb = toLb(num(d.weight));
  if (!Number.isFinite(weight_lb)) missing.push("weight");
  if (!d.goal) missing.push("your goal");

  const goal_weight_lb = d.goal === "maintain" && !Number.isFinite(num(d.goalWeight))
    ? weight_lb
    : toLb(num(d.goalWeight));
  if (!Number.isFinite(goal_weight_lb)) missing.push("target weight");
  if (d.months === "" && d.goal !== "maintain") missing.push("a timeline");
  if (!d.activity) missing.push("how active your day is");
  if (!d.diet) missing.push("what you eat");

  const trainingCount = DAY_KEYS.filter((k) => d.splits[k] !== "rest").length;

  if (missing.length) return { missing };

  return {
    profile: {
      name: d.name.trim(), sex: d.sex as Sex, age: num(d.age), height_cm,
      weight_lb, goal_weight_lb, activity: d.activity as Activity,
      goal: d.goal as Goal, diet: d.diet as Diet,
      splits: d.splits, gym_time: d.gym_time, likes: d.likes,
      // Derived, so nobody has to answer the same thing twice.
      gym_days: trainingCount,
      gym_when: trainingCount === 0 ? "none"
        : Number(d.gym_time.split(":")[0]) < 12 ? "morning" : "evening",
      cuisine: d.cuisine,
      target_weeks: d.months === "" ? 24 : monthsToWeeks(Number(d.months)),
      units: d.units, meals_per_day: d.meals_per_day,
      avoid: d.avoid, uses_supplements: d.uses_supplements,
    },
  };
}

export default function Setup({ initial }: { initial: Profile | null }) {
  const [d, setD] = useState<Draft>(initial ? draftFrom(initial) : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((prev) => ({ ...prev, [k]: v }));

  /** Switching lb <-> kg converts what is typed; 190 lb becomes 86.2 kg. */
  function setUnits(next: Units) {
    setD((prev) => {
      if (prev.units === next) return prev;
      const conv = (v: string) => {
        const n = Number(v);
        if (v.trim() === "" || !Number.isFinite(n)) return v;
        const out = next === "kg" ? lbToKg(n) : kgToLb(n);
        return String(Math.round(out * 10) / 10);
      };
      return { ...prev, units: next, weight: conv(prev.weight), goalWeight: conv(prev.goalWeight) };
    });
  }

  const result = useMemo(() => toProfile(d), [d]);
  const ready = "profile" in result;
  const t = useMemo(() => (ready ? targetsFor(result.profile) : null), [result, ready]);
  const unit = d.units;
  const kg = d.units === "kg";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!("profile" in result)) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) {
      setError("Your session expired — log in again.");
      setBusy(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({ ...result.profile, user_id: uid, updated_at: new Date().toISOString() });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.replace("/");
  }

  return (
    <form className="setup" onSubmit={save}>
      <div className="setuphead"><Logo size={30} /></div>
      <p className="setupsub">
        A few questions, then NutriTrack works out what you should be eating each day and builds
        you a week of meals around it. You can change any of it later.
      </p>

      <div className="grp">
        <div className="grptitle">About you</div>
        <div className="grpsub">This is what the calorie maths is built on.</div>

        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" required placeholder="First name" value={d.name}
                 onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="field">
          <span className="fieldlabel">Sex</span>
          <Seg<Sex> value={d.sex} onChange={(v) => set("sex", v)}
            options={[{ v: "male", label: "Male" }, { v: "female", label: "Female" }]} />
        </div>

        <div className="pair">
          <div className="field">
            <label htmlFor="age">Age</label>
            <input id="age" type="number" inputMode="numeric" min={14} max={90} required
                   placeholder="e.g. 28" value={d.age}
                   onChange={(e) => set("age", e.target.value)} />
          </div>
          <div className="field">
            <span className="fieldlabel">Your scale reads</span>
            <Seg<Units> value={d.units} onChange={setUnits}
              options={[{ v: "lb", label: "Pounds" }, { v: "kg", label: "Kilos" }]} />
          </div>
        </div>

        <div className="field">
          <span className="fieldlabel">Height</span>
          <div className="pair">
            <div>
              <input type="number" inputMode="numeric" min={4} max={7} required
                     placeholder="feet" value={d.ft}
                     onChange={(e) => set("ft", e.target.value)} />
            </div>
            <div>
              <input type="number" inputMode="numeric" min={0} max={11}
                     placeholder="inches" value={d.inch}
                     onChange={(e) => set("inch", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="grp">
        <div className="grptitle">Your goal</div>
        <div className="grpsub">Where you are, where you want to be, and by when.</div>

        <div className="field">
          <Seg<Goal> value={d.goal} onChange={(v) => set("goal", v)} options={[
            { v: "lose", label: "Lose fat", hint: "get lean" },
            { v: "maintain", label: "Stay here", hint: "recomp" },
            { v: "gain", label: "Bulk up", hint: "build mass" },
          ]} />
        </div>

        <div className="pair">
          <div className="field">
            <label htmlFor="now">Weight now ({unit})</label>
            <input id="now" type="number" inputMode="decimal" step="0.1" required
                   placeholder={kg ? "e.g. 78" : "e.g. 172"} value={d.weight}
                   onChange={(e) => set("weight", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="goalw">Target ({unit})</label>
            <input id="goalw" type="number" inputMode="decimal" step="0.1"
                   placeholder={kg ? "e.g. 70" : "e.g. 155"} value={d.goalWeight}
                   onChange={(e) => set("goalWeight", e.target.value)} />
          </div>
        </div>

        {d.goal !== "maintain" && (
          <div className="field">
            <span className="fieldlabel">In how long?</span>
            <Seg<number> value={d.months} onChange={(v) => set("months", v)} options={[
              { v: 1, label: "1 month" }, { v: 2, label: "2" }, { v: 3, label: "3" },
              { v: 4, label: "4" }, { v: 6, label: "6" }, { v: 9, label: "9" },
              { v: 12, label: "1 year" },
            ]} />
          </div>
        )}
      </div>

      <div className="grp">
        <div className="grptitle">Your training week</div>
        <div className="grpsub">
          Set what you do each day. Rest days get a lighter plan and no gym meals.
        </div>

        <div className="field">
          <span className="fieldlabel">Start from</span>
          <div className="avoid">
            {PRESETS.map((pre) => (
              <button key={pre.label} type="button"
                      onClick={() => set("splits", { ...pre.splits })}>
                {pre.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="week">
            {DAY_KEYS.map((k) => (
              <label className="weekrow" key={k}>
                <span className="wd">{DAY_LABEL[k].slice(0, 3)}</span>
                <select
                  value={d.splits[k]}
                  aria-label={`What you train on ${DAY_LABEL[k]}`}
                  onChange={(e) => set("splits", { ...d.splits, [k]: e.target.value as Split })}
                >
                  {SPLIT_OPTIONS.map((sp) => (
                    <option key={sp} value={sp}>{SPLIT_LABEL[sp]}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        {DAY_KEYS.some((k) => d.splits[k] !== "rest") && (
          <div className="field">
            <label htmlFor="gymtime">What time do you train?</label>
            <input id="gymtime" type="time" value={d.gym_time}
                   onChange={(e) => set("gym_time", e.target.value || "19:00")} />
            <p className="grpsub" style={{ margin: "6px 0 0" }}>
              Your pre-workout and post-gym meals land around this, and dinner after it.
            </p>
          </div>
        )}

        <div className="field">
          <span className="fieldlabel">Rest of the day</span>
          <Seg<Activity> value={d.activity} onChange={(v) => set("activity", v)} options={[
            { v: "sedentary", label: "Desk job", hint: "sitting" },
            { v: "light", label: "Some walking" },
            { v: "moderate", label: "On my feet" },
            { v: "very", label: "Physical work" },
          ]} />
        </div>
      </div>

      <div className="grp">
        <div className="grptitle">Food</div>
        <div className="grpsub">
          What your plan gets built from. Anything you eat off-plan, you can still search and log.
        </div>

        <div className="field">
          <span className="fieldlabel">You eat</span>
          <Seg<Diet> value={d.diet} onChange={(v) => set("diet", v)} options={[
            { v: "nonveg", label: "Everything" },
            { v: "egg", label: "Egg only", hint: "no meat" },
            { v: "veg", label: "Vegetarian" },
            { v: "vegan", label: "Vegan" },
          ]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Home cooking</span>
          <Seg<Cuisine> value={d.cuisine} onChange={(v) => set("cuisine", v)}
            options={[{ v: "south", label: "South Indian" }, { v: "north", label: "North Indian" }]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Meals a day</span>
          <Seg<number> value={d.meals_per_day} onChange={(v) => set("meals_per_day", v)} options={[
            { v: 3, label: "3", hint: "no snacks" },
            { v: 4, label: "4", hint: "+ pre-gym" },
            { v: 5, label: "5", hint: "+ snack" },
          ]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Protein shakes</span>
          <Seg<boolean> value={d.uses_supplements} onChange={(v) => set("uses_supplements", v)}
            options={[{ v: true, label: "I use them" }, { v: false, label: "Food only" }]} />
        </div>

        {LIKE_GROUPS.map((g) => (
          <div className="field" key={g.title}>
            <span className="fieldlabel">{g.title}</span>
            {g.hint && <p className="grpsub" style={{ margin: "-2px 0 8px" }}>{g.hint}</p>}
            <div className="avoid">
              {g.options.map((o) => {
                const on = d.likes.includes(o.v);
                return (
                  <button key={o.v} type="button" aria-pressed={on} className={on ? "liked" : ""}
                    onClick={() => set("likes", on ? d.likes.filter((x) => x !== o.v) : [...d.likes, o.v])}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="field">
          <span className="fieldlabel">Keep out of my plan</span>
          <div className="avoid">
            {AVOIDS.map((a) => {
              const on = d.avoid.includes(a.v);
              return (
                <button key={a.v} type="button" aria-pressed={on}
                  onClick={() => set("avoid", on ? d.avoid.filter((x) => x !== a.v) : [...d.avoid, a.v])}>
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="preview">
        {t && "profile" in result ? (
          <>
            <div className="pvrow">
              <div>
                <div className="pvlab">Eat a day</div>
                <div className="pvnum mono">{t.kcal.toLocaleString()}</div>
              </div>
              <div>
                <div className="pvlab">Protein a day</div>
                <div className="pvnum mono">{t.protein}g</div>
              </div>
              <div>
                <div className="pvlab">You burn a day</div>
                <div className="pvnum mono" style={{ color: "var(--muted)" }}>
                  {t.tdee.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pvnote">
              You burn about <b>{t.tdee.toLocaleString()}</b> a day — your body at rest, your
              day{" "}
              {result.profile.gym_when === "none" || result.profile.gym_days === 0
                ? "with no training on top"
                : `and ${result.profile.gym_days} gym sessions a week`}
              .{" "}
              {result.profile.goal === "maintain" ? (
                <>Eating the same holds you where you are.</>
              ) : t.gap < 0 ? (
                <>
                  Eating <b>{t.kcal.toLocaleString()}</b> leaves you {Math.abs(t.gap)} short of
                  that each day, and it is that gap — not the food itself — that moves the scale.
                </>
              ) : (
                <>
                  Eating <b>{t.kcal.toLocaleString()}</b> puts you {t.gap} above it each day,
                  which is the surplus you build on.
                </>
              )}
            </div>

            <div className="pvnote">
              {result.profile.goal === "maintain" ? (
                <>Holding steady while you train.</>
              ) : t.pace.capped ? (
                <span className="pvwarn">
                  {d.months} month{d.months === 1 ? "" : "s"} would mean{" "}
                  {t.pace.wanted.toFixed(1)} {unit} a week — too fast, and most of what you lost
                  would be muscle. This plan runs at {t.pace.rate.toFixed(2)} {unit} a week and
                  gets you there in about {describeDuration(t.pace.weeks)}.
                </span>
              ) : (
                <>
                  That is {t.pace.rate.toFixed(2)} {unit} a week for about{" "}
                  {describeDuration(t.pace.weeks)} — the rate that keeps muscle on while the
                  weight moves.
                </>
              )}
            </div>
          </>
        ) : (
          <div className="pvnote">
            Still need {"missing" in result ? result.missing.join(", ") : ""}. Your targets appear
            here as soon as they are in.
          </div>
        )}

        {error && <div className="pvnote pvwarn">{error}</div>}
        <button className="save" type="submit" disabled={busy || !ready}
                style={{ width: "100%", marginTop: 12 }}>
          {busy ? "Saving…" : initial ? "Save changes" : "Build my plan"}
        </button>
      </div>
    </form>
  );
}
