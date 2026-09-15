import { itemLabel, planTotals, proteinShortfall } from "@/lib/plan";
import { describeDuration, showWeight, targetsFor, type Profile } from "@/lib/profile";
import { h12 } from "@/lib/day";
import type { PlanDay } from "@/lib/types";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function WeekPlan({
  plan, profile,
}: { plan: Record<number, PlanDay>; profile: Profile }) {
  const t = targetsFor(profile);
  const prot = proteinShortfall(plan, t);
  const goalLine =
    profile.goal === "maintain"
      ? `holding at ${showWeight(profile.weight_lb, profile.units)}`
      : `${showWeight(profile.weight_lb, profile.units)} now, ${showWeight(profile.goal_weight_lb, profile.units)} in about ${describeDuration(t.pace.weeks)}`;

  return (
    <div className="section">
      <div className="sechead">Your week</div>
      <div className="secsub">
        Target ~{t.kcal.toLocaleString()} kcal and ~{t.protein}g protein a day · {goalLine}.
      </div>

      <div className="weekgrid">
      {ORDER.map((i) => {
        const p = plan[i];
        const d = planTotals(p);
        return (
          <div className="daycard" key={i}>
            <h3>
              {p.label} <span className="daytag">{p.focus}</span>
              <em>
                {d.kcal} kcal · {d.protein}g
              </em>
            </h3>
            {p.gym && (
              <div className="wslot">
                <span className="wl" style={{ color: "var(--chilli)" }}>
                  Gym {h12(p.gym.from)}–{h12(p.gym.to)}
                </span>
              </div>
            )}
            {p.slots.map((s) => (
              <div className="wslot" key={s.id}>
                <div className="wl">
                  {h12(s.time)} · {s.name}
                </div>
                <div className="wi">
                  {s.items.map((x) => (x.alt ? `or ${itemLabel(x)}` : itemLabel(x))).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        );
      })}
      </div>

      {prot.short && (
        <div className="card" style={{ marginBottom: 10, borderColor: "var(--turmeric)" }}>
          <div className="sechead" style={{ fontSize: 15, color: "var(--turmeric)" }}>
            Protein runs short on this plan
          </div>
          <div className="note">
            These meals average about {prot.average}g a day against your {t.protein}g target.
            Getting there on {profile.diet === "vegan" ? "a vegan" : profile.diet === "veg" ? "a vegetarian" : "this"} diet
            means leaning on the cheapest protein per calorie — soya chunks, tofu, sprouts, Greek
            yogurt, egg whites or a shake. Search any of those and add one to a meal.
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 10 }}>
        <div className="sechead" style={{ fontSize: 15 }}>
          How to run it
        </div>
        <div className="note">
          Weights first, then 20 minutes of cardio — never the other way round on a lifting day.
          <br />
          Weigh in twice a week, same time, in the morning. Judge the 3-week trend, not one reading.
          <br />
          If the average stops moving for 3 weeks, change the target by ~150 kcal — usually half the rice or one roti.
          <br />
          If you are dropping faster than 1.5 lb a week, eat a bit more or you will lose muscle with the fat.
          <br />
          Swap freely inside a meal as long as the calories and protein land close.
        </div>
      </div>
    </div>
  );
}
