"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";
import {
  cmToFtIn, ftInToCm, kgToLb, lbToKg, targetsFor,
  type Activity, type Avoid, type Cuisine, type Diet, type GymWhen,
  type Goal, type Profile, type Sex, type Units,
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

/** The form's own shape: everything a person types starts empty. */
type Draft = {
  name: string;
  sex: Sex | "";
  age: string;
  units: Units;
  ft: string; inch: string; cm: string;
  weight: string; goalWeight: string; weeks: string;
  goal: Goal | "";
  gym_when: GymWhen | "";
  gym_days: number | "";
  activity: Activity | "";
  diet: Diet | "";
  cuisine: Cuisine;
  meals_per_day: number;
  uses_supplements: boolean;
  avoid: Avoid[];
};

const EMPTY: Draft = {
  name: "", sex: "", age: "", units: "lb",
  ft: "", inch: "", cm: "", weight: "", goalWeight: "", weeks: "",
  goal: "", gym_when: "", gym_days: "", activity: "", diet: "",
  cuisine: "south", meals_per_day: 5, uses_supplements: true, avoid: [],
};

function draftFrom(p: Profile): Draft {
  const { ft, inch } = cmToFtIn(p.height_cm);
  const w = (lb: number) =>
    p.units === "kg" ? String(Math.round(lbToKg(lb) * 10) / 10) : String(Math.round(lb));
  return {
    name: p.name, sex: p.sex, age: String(p.age), units: p.units,
    ft: String(ft), inch: String(inch), cm: String(Math.round(p.height_cm)),
    weight: w(p.weight_lb), goalWeight: w(p.goal_weight_lb), weeks: String(p.target_weeks),
    goal: p.goal, gym_when: p.gym_when, gym_days: p.gym_days, activity: p.activity,
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

  const height_cm = d.units === "kg"
    ? num(d.cm)
    : Number.isFinite(num(d.ft)) ? ftInToCm(num(d.ft), Number.isFinite(num(d.inch)) ? num(d.inch) : 0) : NaN;
  if (!Number.isFinite(height_cm) || height_cm < 120) missing.push("height");

  const toLb = (v: number) => (d.units === "kg" ? kgToLb(v) : v);
  const weight_lb = toLb(num(d.weight));
  if (!Number.isFinite(weight_lb)) missing.push("weight");
  if (!d.goal) missing.push("your goal");

  const goal_weight_lb = d.goal === "maintain" && !Number.isFinite(num(d.goalWeight))
    ? weight_lb
    : toLb(num(d.goalWeight));
  if (!Number.isFinite(goal_weight_lb)) missing.push("target weight");
  if (!Number.isFinite(num(d.weeks)) && d.goal !== "maintain") missing.push("a timeline");
  if (!d.gym_when) missing.push("when you train");
  if (d.gym_days === "" && d.gym_when !== "none") missing.push("days a week");
  if (!d.activity) missing.push("how active your day is");
  if (!d.diet) missing.push("what you eat");

  if (missing.length) return { missing };

  return {
    profile: {
      name: d.name.trim(), sex: d.sex as Sex, age: num(d.age), height_cm,
      weight_lb, goal_weight_lb, activity: d.activity as Activity,
      goal: d.goal as Goal, diet: d.diet as Diet, gym_when: d.gym_when as GymWhen,
      gym_days: d.gym_when === "none" ? 0 : Number(d.gym_days),
      cuisine: d.cuisine,
      target_weeks: Number.isFinite(num(d.weeks)) ? num(d.weeks) : 12,
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

  const result = useMemo(() => toProfile(d), [d]);
  const ready = "profile" in result;
  const t = useMemo(() => (ready ? targetsFor(result.profile) : null), [result, ready]);
  const unit = d.units;

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

  const kg = d.units === "kg";

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
            <Seg<Units> value={d.units} onChange={(v) => set("units", v)}
              options={[{ v: "lb", label: "Pounds" }, { v: "kg", label: "Kilos" }]} />
          </div>
        </div>

        <div className="field">
          <span className="fieldlabel">Height</span>
          {kg ? (
            <input type="number" inputMode="numeric" min={120} max={220} required
                   placeholder="centimetres" value={d.cm}
                   onChange={(e) => set("cm", e.target.value)} />
          ) : (
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
          )}
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
            <label htmlFor="weeks">In how many weeks?</label>
            <input id="weeks" type="number" inputMode="numeric" min={2} max={104}
                   placeholder="e.g. 24" value={d.weeks}
                   onChange={(e) => set("weeks", e.target.value)} />
          </div>
        )}
      </div>

      <div className="grp">
        <div className="grptitle">Training</div>
        <div className="grpsub">When you train decides when your meals land.</div>

        <div className="field">
          <span className="fieldlabel">Gym time</span>
          <Seg<GymWhen> value={d.gym_when} onChange={(v) => set("gym_when", v)} options={[
            { v: "morning", label: "Mornings" },
            { v: "evening", label: "Evenings" },
            { v: "none", label: "Not training" },
          ]} />
        </div>

        {d.gym_when !== "none" && (
          <div className="field">
            <span className="fieldlabel">Days a week</span>
            <Seg<number> value={d.gym_days} onChange={(v) => set("gym_days", v)}
              options={[2, 3, 4, 5, 6].map((n) => ({ v: n, label: String(n) }))} />
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
                <div className="pvlab">Calories a day</div>
                <div className="pvnum mono">{t.kcal}</div>
              </div>
              <div>
                <div className="pvlab">Protein</div>
                <div className="pvnum mono">{t.protein}g</div>
              </div>
              <div>
                <div className="pvlab">You burn about</div>
                <div className="pvnum mono">{t.tdee}</div>
              </div>
            </div>

            <div className="pvnote">
              {result.profile.goal === "maintain" ? (
                <>Eating at roughly what you burn, so the scale holds while you train.</>
              ) : t.pace.capped ? (
                <span className="pvwarn">
                  {d.weeks} weeks would mean {t.pace.wanted.toFixed(1)} {unit} a week — too fast,
                  and most of what you lost would be muscle. This plan runs at{" "}
                  {t.pace.rate.toFixed(2)} {unit} a week and gets you there in about{" "}
                  {t.pace.weeks} weeks.
                </span>
              ) : (
                <>
                  {t.pace.rate.toFixed(2)} {unit} a week for about {t.pace.weeks} weeks — the rate
                  that keeps muscle on while the weight moves.
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
