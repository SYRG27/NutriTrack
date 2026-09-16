"use client";

import { useState } from "react";
import type { Entry, WeighIn } from "@/lib/types";
import { targetsFor, showWeight, type Profile } from "@/lib/profile";
import { amountOf, dayKey, parseKey, totalsFor } from "@/lib/day";
import { weeklyReview } from "@/lib/review";

const DL = "SMTWTFS";

export default function Trends({
  entriesByDay,
  weighIns,
  onSaveWeight,
  profile,
  allEntries,
}: {
  entriesByDay: Map<string, Entry[]>;
  allEntries: Entry[];
  weighIns: WeighIn[];
  onSaveWeight: (lb: number) => Promise<void>;
  profile: Profile;
}) {
  const t = targetsFor(profile);
  const TARGET = {
    kcal: t.kcal, protein: t.protein,
    startLb: profile.weight_lb, goalLb: profile.goal_weight_lb,
  };
  const unit = profile.units;
  const review = weeklyReview(allEntries, weighIns, profile, t);
  const today = dayKey(new Date());
  const existing = weighIns.find((w) => w.measured_on === today);
  const [lb, setLb] = useState(existing ? String(existing.lb) : "");

  const keys: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(dayKey(d));
  }
  const rows = keys.map((k) => ({ key: k, ...totalsFor(entriesByDay.get(k) ?? []) }));
  const maxK = Math.max(TARGET.kcal + 450, ...rows.map((r) => r.kcal));
  const done = rows.filter((r) => r.kcal > 0);
  const avgK = done.length ? Math.round(done.reduce((a, r) => a + r.kcal, 0) / done.length) : 0;
  const avgP = done.length ? Math.round(done.reduce((a, r) => a + r.protein, 0) / done.length) : 0;

  const w = [...weighIns].sort((a, b) => a.measured_on.localeCompare(b.measured_on));
  const cur = w.length ? Number(w[w.length - 1].lb) : TARGET.startLb;
  const lost = Math.round((TARGET.startLb - cur) * 10) / 10;
  const togo = Math.round((cur - TARGET.goalLb) * 10) / 10;

  function exportCsv() {
    const out: (string | number)[][] = [
      ["date", "time", "item", "amount", "calories", "protein_g", "weight_lb"],
    ];
    [...entriesByDay.keys()].sort().forEach((k) => {
      (entriesByDay.get(k) ?? [])
        .slice()
        .sort((a, b) => a.eaten_at.localeCompare(b.eaten_at))
        .forEach((e) =>
          out.push([
            k,
            e.eaten_at.slice(0, 5),
            e.name,
            amountOf(e) || "1 serving",
            Math.round(e.kcal),
            Math.round(e.protein * 10) / 10,
            "",
          ]),
        );
    });
    w.forEach((x) => out.push([x.measured_on, "", "Weigh-in", "", "", "", x.lb]));

    const csv = out.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "nutritrack-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Weight chart geometry
  const W = 400, H = 112, pad = 10;
  const lo = Math.min(TARGET.goalLb - 1, ...w.map((d) => Number(d.lb)));
  const hi = Math.max(TARGET.startLb, ...w.map((d) => Number(d.lb))) + 1;
  const X = (i: number) => pad + (i * (W - 2 * pad)) / Math.max(1, w.length - 1);
  const Y = (v: number) => pad + ((hi - v) * (H - 2 * pad)) / (hi - lo);

  return (
    <div className="section trendswrap">
      <div className={`review ${review.tone}`}>
        <div className="revtop">
          <span className="revlab">This week</span>
          <span className="revdays mono">{review.days}/7 days logged</span>
        </div>
        <div className="revhead">{review.headline}</div>
        <p className="revbody">{review.advice}</p>
        {review.days > 0 && (
          <div className="revstats">
            <span><b className="mono">{review.kcal.toLocaleString()}</b> kcal a day</span>
            <span><b className="mono">{review.protein}g</b> protein a day</span>
            {review.weightChange != null && (
              <span>
                <b className="mono">
                  {review.weightChange > 0 ? "+" : ""}
                  {review.weightChange}
                </b>{" "}
                {unit} in a fortnight
              </span>
            )}
          </div>
        )}
      </div>

      <div className="sechead">Last 14 days</div>
      <div className="secsub">Bars are calories eaten; the dashed line is your {TARGET.kcal.toLocaleString()} target.</div>

      <div className="card">
        <div className="bars" style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute", left: 0, right: 0,
              bottom: `${((TARGET.kcal / maxK) * 100).toFixed(1)}%`,
              borderTop: "1.5px dashed var(--muted)", pointerEvents: "none",
            }}
          />
          {rows.map((r) => (
            <div className="barcol" key={r.key}>
              <div
                className={`bar${r.kcal > TARGET.kcal + 120 ? " over" : ""}`}
                style={{ height: `${((r.kcal / maxK) * 100).toFixed(1)}%` }}
                title={`${r.key}: ${Math.round(r.kcal)} kcal`}
              />
              <div className="barlab">{DL[parseKey(r.key).getDay()]}</div>
            </div>
          ))}
        </div>
        <div className="legend">
          <span><i style={{ background: "var(--leaf)" }} />On target</span>
          <span><i style={{ background: "var(--chilli)" }} />Over</span>
        </div>
      </div>

      <div style={{ height: 18 }} />
      <div className="sechead">Averages</div>
      <div className="secsub">
        Across the {done.length} day{done.length === 1 ? "" : "s"} you logged.
      </div>
      <div className="card">
        <div className="stat">
          <span>Calories a day</span>
          <b className="mono" style={{ color: avgK > TARGET.kcal + 120 ? "var(--chilli)" : "var(--leaf)" }}>
            {avgK}
          </b>
        </div>
        <div className="stat">
          <span>Protein a day</span>
          <b className="mono" style={{ color: avgP < TARGET.protein - 20 ? "var(--chilli)" : "var(--turmeric)" }}>
            {avgP}g
          </b>
        </div>
        <div className="stat">
          <span>Days logged</span>
          <b className="mono">{done.length}/14</b>
        </div>
      </div>

      <div style={{ height: 18 }} />
      <div className="sechead">Weight</div>
      <div className="secsub">
        {lost > 0 ? `${showWeight(lost, unit)} down · ` : ""}{showWeight(Math.abs(togo), unit)} to go. Weigh in twice a week, mornings.
      </div>
      <div className="card">
        {w.length > 1 ? (
          <svg viewBox={`0 0 ${W} ${H + 20}`} width="100%" height="130" role="img"
               aria-label={`Weight trend toward ${TARGET.goalLb} pounds`}>
            <line x1={pad} y1={Y(TARGET.goalLb)} x2={W - pad} y2={Y(TARGET.goalLb)}
                  stroke="var(--leaf)" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x={W - pad} y={Y(TARGET.goalLb) - 6} textAnchor="end" fontSize="11"
                  fill="var(--leaf)" fontFamily="IBM Plex Mono, monospace">
              goal {showWeight(TARGET.goalLb, unit)}
            </text>
            <polyline points={w.map((d, i) => `${X(i)},${Y(Number(d.lb))}`).join(" ")}
                      fill="none" stroke="var(--indigo)" strokeWidth="2.5"
                      strokeLinejoin="round" strokeLinecap="round" />
            {w.map((d, i) => (
              <circle key={d.measured_on} cx={X(i)} cy={Y(Number(d.lb))}
                      r={i === w.length - 1 ? 4.5 : 2.5} fill="var(--indigo)" />
            ))}
            <text x={X(w.length - 1)} y={Math.min(H + 16, Y(cur) + 18)} textAnchor="end"
                  fontSize="12" fill="var(--ink)" fontFamily="IBM Plex Mono, monospace">
              {showWeight(cur, unit)}
            </text>
          </svg>
        ) : (
          <div className="empty">Save two weigh-ins and the trend line appears here.</div>
        )}

        <form
          className="form"
          style={{ boxShadow: "none", border: "none", padding: "10px 0 0", background: "none" }}
          onSubmit={async (e) => {
            e.preventDefault();
            const v = parseFloat(lb);
            if (Number.isFinite(v)) await onSaveWeight(v);
          }}
        >
          <div className="row">
            <div style={{ flex: 1 }}>
              <label htmlFor="wIn">Weight today ({unit})</label>
              <input id="wIn" className="mono" type="number" inputMode="decimal" step="0.1"
                     min="80" max="400" value={lb} placeholder={String(TARGET.startLb)}
                     onChange={(e) => setLb(e.target.value)} />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
              <button className="save" type="submit" style={{ width: "100%" }}>Save</button>
            </div>
          </div>
        </form>
      </div>

      <div className="note">
        Losing about 0.5 lb a week is the target — that keeps the muscle on while the belly goes.
        Flat for three weeks means trim ~150 kcal; faster than 1.5 lb a week means eat a little more.
      </div>

      <div style={{ height: 18 }} />
      <div className="sechead">Your data</div>
      <div className="secsub">Every meal you have logged, as a spreadsheet you keep.</div>
      <button className="save" style={{ width: "100%" }} onClick={exportCsv}>
        Download my whole log (CSV)
      </button>
    </div>
  );
}
