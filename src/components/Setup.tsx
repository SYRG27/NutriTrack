"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Logo from "./Logo";
import {
  BLANK_PROFILE, cmToFtIn, ftInToCm, kgToLb, lbToKg, targetsFor,
  type Activity, type Avoid, type Cuisine, type Diet, type GymWhen,
  type Goal, type Profile, type Sex, type Units,
} from "@/lib/profile";

type Opt<T> = { v: T; label: string; hint?: string };

function Seg<T extends string | number | boolean>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: Opt<T>[] }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button
          key={String(o.v)} type="button"
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
        >
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

export default function Setup({ initial }: { initial: Profile | null }) {
  const [p, setP] = useState<Profile>(initial ?? BLANK_PROFILE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  const t = useMemo(() => targetsFor(p), [p]);
  const { ft, inch } = cmToFtIn(p.height_cm);
  const kg = p.units === "kg";
  const w = (lb: number) => (kg ? Math.round(lbToKg(lb) * 10) / 10 : Math.round(lb));
  const unlb = (val: number) => (kg ? kgToLb(val) : val);
  const unit = kg ? "kg" : "lb";

  async function save(e: React.FormEvent) {
    e.preventDefault();
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
      .upsert({ ...p, user_id: uid, updated_at: new Date().toISOString() });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.replace("/");
  }

  const gaining = p.goal === "gain";

  return (
    <form className="setup" onSubmit={save}>
      <div className="setuphead"><Logo size={30} /></div>
      <p className="setupsub">
        A handful of questions, then NutriTrack works out what you should be eating each
        day and builds you a week of meals around it. You can change any of this later.
      </p>

      <div className="grp">
        <div className="grptitle">About you</div>
        <div className="grpsub">This is what the calorie maths is built on.</div>

        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" required value={p.name} placeholder="Sai"
                 onChange={(e) => set("name", e.target.value)} />
        </div>

        <div className="field">
          <span className="fieldlabel">Sex</span>
          <Seg<Sex> value={p.sex} onChange={(v) => set("sex", v)}
            options={[{ v: "male", label: "Male" }, { v: "female", label: "Female" }]} />
          <p className="grpsub" style={{ margin: "6px 0 0" }}>
            Men and women burn differently at rest; this changes the number by a few hundred calories.
          </p>
        </div>

        <div className="pair">
          <div className="field">
            <label htmlFor="age">Age</label>
            <input id="age" type="number" inputMode="numeric" min={14} max={90} required
                   value={p.age} onChange={(e) => set("age", +e.target.value)} />
          </div>
          <div className="field">
            <span className="fieldlabel">Your scale reads</span>
            <Seg<Units> value={p.units} onChange={(v) => set("units", v)}
              options={[{ v: "lb", label: "Pounds" }, { v: "kg", label: "Kilos" }]} />
          </div>
        </div>

        <div className="field">
          <span className="fieldlabel">Height</span>
          {kg ? (
            <input type="number" inputMode="numeric" min={130} max={220} required
                   value={Math.round(p.height_cm)} placeholder="cm"
                   onChange={(e) => set("height_cm", +e.target.value)} />
          ) : (
            <div className="pair">
              <div>
                <input type="number" inputMode="numeric" min={4} max={7} required value={ft}
                       onChange={(e) => set("height_cm", ftInToCm(+e.target.value, inch))} />
                <span className="fieldlabel" style={{ marginTop: 4 }}>feet</span>
              </div>
              <div>
                <input type="number" inputMode="numeric" min={0} max={11} required value={inch}
                       onChange={(e) => set("height_cm", ftInToCm(ft, +e.target.value))} />
                <span className="fieldlabel" style={{ marginTop: 4 }}>inches</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grp">
        <div className="grptitle">Your goal</div>
        <div className="grpsub">Where you are, where you want to be, and by when.</div>

        <div className="field">
          <Seg<Goal> value={p.goal} onChange={(v) => set("goal", v)} options={[
            { v: "lose", label: "Lose fat", hint: "get lean" },
            { v: "maintain", label: "Stay here", hint: "recomp" },
            { v: "gain", label: "Bulk up", hint: "build mass" },
          ]} />
        </div>

        <div className="pair">
          <div className="field">
            <label htmlFor="now">Weight now ({unit})</label>
            <input id="now" type="number" inputMode="decimal" step="0.1" required
                   value={w(p.weight_lb)}
                   onChange={(e) => set("weight_lb", unlb(+e.target.value))} />
          </div>
          <div className="field">
            <label htmlFor="goalw">Target ({unit})</label>
            <input id="goalw" type="number" inputMode="decimal" step="0.1" required
                   value={w(p.goal_weight_lb)}
                   onChange={(e) => set("goal_weight_lb", unlb(+e.target.value))} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="weeks">In how many weeks?</label>
          <input id="weeks" type="number" inputMode="numeric" min={2} max={104} required
                 value={p.target_weeks}
                 onChange={(e) => set("target_weeks", +e.target.value)} />
        </div>
      </div>

      <div className="grp">
        <div className="grptitle">Training</div>
        <div className="grpsub">When you train decides when your meals land.</div>

        <div className="field">
          <span className="fieldlabel">Gym time</span>
          <Seg<GymWhen> value={p.gym_when} onChange={(v) => set("gym_when", v)} options={[
            { v: "morning", label: "Mornings" },
            { v: "evening", label: "Evenings" },
            { v: "none", label: "Not training" },
          ]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Days a week</span>
          <Seg<number> value={p.gym_days} onChange={(v) => set("gym_days", v)}
            options={[0, 2, 3, 4, 5, 6].map((n) => ({ v: n, label: String(n) }))} />
        </div>

        <div className="field">
          <span className="fieldlabel">Rest of the day</span>
          <Seg<Activity> value={p.activity} onChange={(v) => set("activity", v)} options={[
            { v: "sedentary", label: "Desk job", hint: "sitting" },
            { v: "light", label: "Some walking" },
            { v: "moderate", label: "On my feet" },
            { v: "very", label: "Physical work" },
          ]} />
        </div>
      </div>

      <div className="grp">
        <div className="grptitle">Food</div>
        <div className="grpsub">What your plan gets built from. Anything you eat off-plan, you can still log.</div>

        <div className="field">
          <span className="fieldlabel">You eat</span>
          <Seg<Diet> value={p.diet} onChange={(v) => set("diet", v)} options={[
            { v: "nonveg", label: "Everything" },
            { v: "egg", label: "Egg only", hint: "no meat" },
            { v: "veg", label: "Vegetarian" },
            { v: "vegan", label: "Vegan" },
          ]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Home cooking</span>
          <Seg<Cuisine> value={p.cuisine} onChange={(v) => set("cuisine", v)}
            options={[{ v: "south", label: "South Indian" }, { v: "north", label: "North Indian" }]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Meals a day</span>
          <Seg<number> value={p.meals_per_day} onChange={(v) => set("meals_per_day", v)} options={[
            { v: 3, label: "3", hint: "no snacks" },
            { v: 4, label: "4", hint: "+ pre-gym" },
            { v: 5, label: "5", hint: "+ snack" },
          ]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Protein shakes</span>
          <Seg<boolean> value={p.uses_supplements} onChange={(v) => set("uses_supplements", v)}
            options={[{ v: true, label: "I use them" }, { v: false, label: "Food only" }]} />
        </div>

        <div className="field">
          <span className="fieldlabel">Keep out of my plan</span>
          <div className="avoid">
            {AVOIDS.map((a) => {
              const on = p.avoid.includes(a.v);
              return (
                <button key={a.v} type="button" aria-pressed={on}
                  onClick={() => set("avoid", on ? p.avoid.filter((x) => x !== a.v) : [...p.avoid, a.v])}>
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="preview">
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
          {p.goal === "maintain" ? (
            <>Eating at roughly what you burn, so the scale holds while you train.</>
          ) : t.pace.capped ? (
            <span className="pvwarn">
              {p.target_weeks} weeks would mean {t.pace.wanted.toFixed(1)} {unit} a week — too fast,
              and most of it would be muscle. This plan runs at {t.pace.rate.toFixed(2)} {unit} a week
              and gets you there in about {t.pace.weeks} weeks.
            </span>
          ) : (
            <>
              {t.pace.rate.toFixed(2)} {unit} a week for about {t.pace.weeks} weeks
              {gaining ? " of steady gaining" : " of steady loss"} — the rate that keeps muscle on.
            </>
          )}
        </div>

        {error && <div className="pvnote pvwarn">{error}</div>}
        <button className="save" type="submit" disabled={busy} style={{ width: "100%", marginTop: 12 }}>
          {busy ? "Saving…" : initial ? "Save changes" : "Build my plan"}
        </button>
      </div>
    </form>
  );
}
