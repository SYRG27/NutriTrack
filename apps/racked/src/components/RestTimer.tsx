import { useEffect, useRef, useState } from "react";

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

/** Seeds from the exercise's rest, and reseeds whenever the exercise changes. */
export default function RestTimer({ restSec, exerciseSlug }: { restSec: number; exerciseSlug: string }) {
  const [left, setLeft] = useState(restSec);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);

  // A new exercise means a new rest period; never carry the old one over.
  useEffect(() => {
    setLeft(restSec);
    setRunning(false);
  }, [restSec, exerciseSlug]);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setRunning(false);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) window.clearInterval(tick.current);
      tick.current = null;
    };
  }, [running]);

  const done = left === 0;

  return (
    <div className="mt-5 flex items-center gap-4 rounded-box border border-border bg-surface-2 px-4 py-[14px]">
      <span
        className={`font-mono text-[26px] font-600 leading-none tabular-nums ${
          done ? "text-danger" : running ? "text-accent-hi" : "text-ink"
        }`}
      >
        {mmss(left)}
      </span>

      <span className="min-w-0 flex-1 leading-[1.35]">
        <span className="microlabel block">Rest timer</span>
        <span className="mt-[3px] block text-[12px] text-muted">
          {done ? "time — next set" : "between sets"}
        </span>
      </span>

      <button
        onClick={() => setRunning((r) => !r)}
        disabled={done && !running}
        className="rounded-full border border-accent bg-accent-soft px-[15px] py-[7px] text-[12.5px] font-600 text-accent-hi transition-opacity disabled:opacity-45"
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setLeft(restSec);
        }}
        className="rounded-full border border-border bg-surface px-[15px] py-[7px] text-[12.5px] text-ink-2 hover:border-accent"
      >
        Reset
      </button>
    </div>
  );
}
