"use client";

import { GLASS_ML, showVolume, waterTarget } from "@/lib/water";
import type { Profile } from "@/lib/profile";

/**
 * Tap the glass you are on. Tapping the one already filled takes it back off,
 * so a mis-tap costs one more tap rather than a trip to a form.
 */
export default function Water({
  profile,
  dayIndex,
  ml,
  onChange,
}: {
  profile: Profile;
  dayIndex: number;
  ml: number;
  onChange: (ml: number) => void;
}) {
  const target = waterTarget(profile, dayIndex);
  const drunk = Math.round(ml / GLASS_ML);
  const done = ml >= target.ml;

  return (
    <div className="section">
      <div className="sechead">Water</div>
      <div className="secsub">
        {showVolume(ml, profile.units)} of {showVolume(target.ml, profile.units)} ·{" "}
        {drunk}/{target.glasses} glasses
        {done && " · done ✓"}
      </div>

      <div className="card" style={{ padding: "14px 13px 12px" }}>
        <div className="glasses">
          {Array.from({ length: target.glasses }, (_, i) => {
            const filled = i < drunk;
            return (
              <button
                key={i}
                className={`glass${filled ? " on" : ""}`}
                aria-label={`${i + 1} glass${i ? "es" : ""}`}
                aria-pressed={filled}
                onClick={() => onChange((i + 1 === drunk ? i : i + 1) * GLASS_ML)}
              >
                <svg width="17" height="21" viewBox="0 0 17 21" aria-hidden="true">
                  <path
                    d="M2.5 1.5h12l-1.3 17a1.5 1.5 0 0 1-1.5 1.4H5.3a1.5 1.5 0 0 1-1.5-1.4z"
                    fill={filled ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        <div className="glassfoot">
          <span className="note" style={{ margin: 0 }}>
            One glass is {showVolume(GLASS_ML, profile.units)}. Add {target.glasses > 11 ? "a couple more" : "one more"} on a hot day.
          </span>
          {ml > 0 && (
            <button className="forget" style={{ marginTop: 0 }} onClick={() => onChange(0)}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
