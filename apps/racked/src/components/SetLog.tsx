import { useEffect, useRef, useState } from "react";
import type { Exercise, MuscleGroup } from "../data/exercises";
import {
  addSet, currentUser, describe, preferredUnit, removeSet, setsFor, type WorkoutSet,
} from "../lib/sets";

/** What you lifted, and what you lifted last time. */
export default function SetLog({
  exercise,
  group,
}: {
  exercise: Exercise;
  group: MuscleGroup;
}) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [todays, setTodays] = useState<WorkoutSet[]>([]);
  const [last, setLast] = useState<WorkoutSet[]>([]);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [busy, setBusy] = useState(false);
  const repsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    setReady(false);
    (async () => {
      const [user, u] = await Promise.all([currentUser(), preferredUnit()]);
      if (!alive) return;
      setSignedIn(!!user);
      setUnit(u);
      if (user) {
        const { todays, last, lastDate } = await setsFor(exercise.slug);
        if (!alive) return;
        setTodays(todays);
        setLast(last);
        setLastDate(lastDate);
        // Start from what you did last time; most sessions repeat or add a little.
        if (last.length) {
          setReps(last[last.length - 1].reps?.toString() ?? "");
          setWeight(last[last.length - 1].weight?.toString() ?? "");
        }
      }
      setReady(true);
    })();
    return () => { alive = false; };
  }, [exercise.slug]);

  if (!ready) return null;

  if (!signedIn)
    return (
      <div className="mt-5 rounded-box border border-border bg-surface-2 px-4 py-[13px]">
        <p className="text-[13px] leading-[1.55] text-muted">
          <a href="/login" className="text-accent underline underline-offset-4">Sign in</a>{" "}
          to record your sets here and see what you lifted last time.
        </p>
      </div>
    );

  const save = async () => {
    const r = Number(reps);
    if (!Number.isFinite(r) || r <= 0) return;
    setBusy(true);
    const w = weight.trim() === "" ? null : Number(weight);
    const row = await addSet({
      exercise_slug: exercise.slug,
      exercise_name: exercise.name,
      group_key: group.key,
      set_index: todays.length + 1,
      reps: r,
      weight: Number.isFinite(w as number) ? (w as number) : null,
      unit,
    });
    if (row) setTodays((t) => [...t, row]);
    setBusy(false);
    repsRef.current?.focus();
  };

  const drop = async (id: string) => {
    setTodays((t) => t.filter((s) => s.id !== id));
    await removeSet(id);
  };

  const prettyDate = lastDate
    ? new Date(lastDate + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" })
    : null;

  return (
    <div className="mt-5">
      <h3 className="text-[13px] font-600 tracking-[0.1em] text-ink">Your sets</h3>

      {last.length > 0 && (
        <p className="mt-[8px] text-[13px] text-muted">
          Last time, {prettyDate} —{" "}
          <span className="font-mono font-600 text-accent-hi">{describe(last)}</span>
        </p>
      )}

      <ul className="mt-[11px] flex flex-col gap-[6px]">
        {todays.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-box-sm border border-border bg-surface-2 px-[12px] py-[9px]"
          >
            <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border border-accent font-mono text-[11px] font-600 text-accent-hi">
              {i + 1}
            </span>
            <span className="flex-1 font-mono text-[13.5px] text-ink">
              {s.reps} reps{s.weight ? ` @ ${s.weight} ${s.unit}` : ""}
            </span>
            <button
              onClick={() => drop(s.id)}
              aria-label={`Remove set ${i + 1}`}
              className="h-[24px] w-[24px] rounded-[6px] text-[14px] text-muted hover:text-danger"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-[10px] flex items-end gap-[8px]">
        <label className="flex-1">
          <span className="microlabel mb-[5px] block">Reps</span>
          <input
            ref={repsRef}
            type="number" inputMode="numeric" min="1" value={reps}
            onChange={(e) => setReps(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded-[10px] border border-border-input bg-surface-2 px-[11px] py-[9px] font-mono text-[14px] text-ink outline-none focus:border-accent"
          />
        </label>
        <label className="flex-1">
          <span className="microlabel mb-[5px] block">Weight ({unit})</span>
          <input
            type="number" inputMode="decimal" step="0.5" min="0" value={weight}
            placeholder="—"
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded-[10px] border border-border-input bg-surface-2 px-[11px] py-[9px] font-mono text-[14px] text-ink outline-none focus:border-accent"
          />
        </label>
        <button
          onClick={save}
          disabled={busy || !reps}
          className="rounded-full border border-accent bg-accent-soft px-[17px] py-[10px] text-[12.5px] font-600 text-accent-hi disabled:opacity-45"
        >
          Add set
        </button>
      </div>

      <p className="mt-[9px] text-[12px] leading-[1.5] text-muted">
        Leave the weight blank for bodyweight or a hold. Beat last time by a rep or the smallest
        plate — that is the whole game.
      </p>
    </div>
  );
}
