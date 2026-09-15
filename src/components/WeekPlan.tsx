import { PLAN, planTotals } from "@/lib/plan";
import { h12 } from "@/lib/day";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function WeekPlan() {
  return (
    <div className="section">
      <div className="sechead">Your week</div>
      <div className="secsub">
        Target ~2,350 kcal and ~175g protein a day · 180 lbs now, 165 lbs by March.
      </div>

      {ORDER.map((i) => {
        const p = PLAN[i];
        const t = planTotals(p);
        return (
          <div className="daycard" key={i}>
            <h3>
              {p.label} <span className="daytag">{p.focus}</span>
              <em>
                {t.kcal} kcal · {t.protein}g
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
                <div className="wi">{s.items.map((x) => x.n).join(" · ")}</div>
              </div>
            ))}
          </div>
        );
      })}

      <div className="card" style={{ marginBottom: 10 }}>
        <div className="sechead" style={{ fontSize: 15 }}>
          How to run it
        </div>
        <div className="note">
          Weights first, then 20 minutes of cardio — never the other way round on a lifting day.
          <br />
          Weigh in twice a week, same time, in the morning. Judge the 3-week trend, not one reading.
          <br />
          If the average stops falling for 3 weeks, trim ~150 kcal — usually half the rice or one phulka.
          <br />
          If you are dropping faster than 1.5 lb a week, eat a bit more or you will lose muscle with the fat.
          <br />
          Swap freely inside a meal as long as the calories and protein land close.
        </div>
      </div>
    </div>
  );
}
