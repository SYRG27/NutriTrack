import { useEffect, useRef } from "react";
import type { Exercise, MuscleGroup } from "../data/exercises";
import Media, { exerciseMedia, variationMedia } from "./Media";
import RestTimer from "./RestTimer";
import SetLog from "./SetLog";

export default function Drawer({
  group,
  exercise,
  onClose,
}: {
  group: MuscleGroup;
  exercise: Exercise;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  // Escape closes; body scroll locks while it is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const stat = (label: string, value: string, accent = false) => (
    <div className="rounded-box-sm border border-border bg-surface-3 px-[13px] py-[11px]">
      <span className="microlabel block">{label}</span>
      <span
        className={`mt-[6px] block font-mono text-[15px] font-600 ${
          accent ? "text-accent-hi" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[rgba(6,7,8,0.64)]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed right-0 top-0 z-50 h-full w-[min(470px,100vw)] overflow-y-auto border-l border-border bg-surface shadow-drawer [animation:drawer-in_220ms_ease-out]"
      >
        <style>{`@keyframes drawer-in{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}`}</style>

        {/* 1 — media */}
        <div className="relative">
          {exercise.media.video ? (
            <video
              controls
              poster={exercise.media.poster}
              className="h-[clamp(190px,30vh,280px)] w-full bg-placeholder object-cover"
            >
              <source src={exercise.media.video} />
            </video>
          ) : (
            <Media
              srcs={exerciseMedia(exercise.slug, exercise.media.loop ?? exercise.media.poster)}
              caption={`${exercise.name} demo`}
              className="h-[clamp(190px,30vh,280px)] w-full"
            />
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-[34px] w-[34px] place-items-center rounded-full border border-border bg-[rgba(13,14,15,0.8)] text-[14px] text-ink backdrop-blur hover:border-accent"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-10 pt-5">
          {/* 2 — identity */}
          <p className="eyebrow">{group.name}</p>
          <h2 id="drawer-title" className="mt-[7px] text-[25px] font-600 leading-[1.1] tracking-[0.02em]">
            {exercise.name}
          </h2>
          <p className="mt-[10px] max-w-copy text-[14px] leading-[1.6] text-ink-2">
            {exercise.summary}
          </p>

          {/* 3 — stats */}
          <div className="mt-5 grid gap-[10px] [grid-template-columns:repeat(auto-fit,minmax(118px,1fr))]">
            {stat("Sets × reps", exercise.dose, true)}
            {stat("Rest", exercise.rest)}
            {stat("Tempo", exercise.tempo)}
          </div>

          {/* 4 — rest timer */}
          <RestTimer restSec={exercise.restSec} exerciseSlug={exercise.slug} />

          {/* 5 — what you actually lifted */}
          <SetLog exercise={exercise} group={group} />

          {/* 6 — the point of the app */}
          <h3 className="mt-8 text-[13px] font-600 tracking-[0.1em] text-ink">
            Correct form, step by step
          </h3>
          <ol className="mt-[14px] flex flex-col gap-[14px]">
            {exercise.cues.map((c, i) => (
              <li key={c} className="flex gap-[12px]">
                <span className="mt-[1px] grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border border-accent font-mono text-[11.5px] font-600 text-accent-hi">
                  {i + 1}
                </span>
                <span className="max-w-copy text-[14px] leading-[1.6] text-ink-2">{c}</span>
              </li>
            ))}
          </ol>

          {/* 7 — mistakes */}
          <h3 className="mt-8 text-[13px] font-600 tracking-[0.1em] text-ink">Mistakes to avoid</h3>
          <ul className="mt-[14px] flex flex-col gap-[12px]">
            {exercise.mistakes.map((m) => (
              <li key={m} className="flex gap-[12px]">
                <span className="mt-[2px] font-mono text-[13px] font-600 text-danger" aria-hidden="true">
                  ✕
                </span>
                <span className="max-w-copy text-[14px] leading-[1.6] text-ink-2">{m}</span>
              </li>
            ))}
          </ul>

          {/* 8 — other ways to do the same thing */}
          {exercise.variations.length > 0 && (
            <>
              <h3 className="mt-8 text-[13px] font-600 tracking-[0.1em] text-ink">
                Other ways to do it
              </h3>
              <p className="mt-[6px] max-w-copy text-[13px] leading-[1.55] text-muted">
                Same movement, whatever is free. Pick one and stick with it for the session.
              </p>
              <ul className="mt-[13px] flex flex-col gap-[10px]">
                {exercise.variations.map((v) => (
                  <li
                    key={v.slug}
                    className="flex gap-[13px] overflow-hidden rounded-box-sm border border-border bg-surface-2 p-[11px]"
                  >
                    <Media
                      srcs={variationMedia(v.slug)}
                      caption={v.name}
                      className="h-[92px] w-[92px] shrink-0 rounded-[9px] object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-600 leading-[1.25] text-ink">
                        {v.name}
                      </span>
                      <span className="microlabel mt-[6px] block">{v.equipment}</span>
                      <span className="mt-[7px] block max-w-copy text-[12.5px] leading-[1.5] text-ink-2">
                        {v.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* 9 — setup */}
          <h3 className="mt-8 text-[13px] font-600 tracking-[0.1em] text-ink">
            The machine / setup — {exercise.equipment}
          </h3>
          <div className="mt-[12px] rounded-box border border-border bg-surface-2 px-4 py-[14px]">
            <p className="max-w-copy text-[13.5px] leading-[1.65] text-ink-2">{exercise.setup}</p>
          </div>

          {/* 10 — swap */}
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <span className="microlabel">Swap it for:</span>
            <span className="pill">{exercise.swap}</span>
          </div>
        </div>
      </div>
    </>
  );
}
