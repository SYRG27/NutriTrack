import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { findExercise, groupByKey } from "../data/exercises";
import Media, { exerciseMedia } from "./Media";
import Drawer from "./Drawer";

/** Equipment chips match on keywords in the free-text `equipment` field. */
const EQUIP_FILTERS: { label: string; match: string[] }[] = [
  { label: "Machine", match: ["machine", "pec deck", "captain"] },
  { label: "Cable", match: ["cable", "rope", "pulley"] },
  { label: "Free weights", match: ["dumbbell", "barbell", "kettlebell", "bar"] },
  { label: "Bodyweight", match: ["bodyweight", "mat", "bar +", "step"] },
];

export default function GroupPage() {
  const { groupKey = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const group = groupByKey(groupKey);

  const [query, setQuery] = useState("");
  const [equip, setEquip] = useState<string[]>([]);
  const opener = useRef<HTMLButtonElement | null>(null);
  /* True when this page opened the drawer, as opposed to arriving on a shared
     link with ?ex= already in the URL. Only then is there an entry to pop. */
  const pushed = useRef(false);

  const openSlug = params.get("ex");
  const open = group && openSlug ? findExercise(group, openSlug) : undefined;

  const shown = useMemo(() => {
    if (!group) return [];
    const q = query.trim().toLowerCase();
    return group.exercises.filter((e) => {
      if (q && !(`${e.name} ${e.equipment}`.toLowerCase().includes(q))) return false;
      if (equip.length) {
        const hay = e.equipment.toLowerCase();
        const hit = equip.some((label) =>
          EQUIP_FILTERS.find((f) => f.label === label)!.match.some((m) => hay.includes(m)),
        );
        if (!hit) return false;
      }
      return true;
    });
  }, [group, query, equip]);

  if (!group)
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-16">
        <h1 className="text-[32px]">Muscle group not found</h1>
      </main>
    );

  const openExercise = (slug: string, el: HTMLButtonElement | null) => {
    opener.current = el;
    pushed.current = true;
    setParams({ ex: slug });                 // one entry, so Back closes the drawer
  };

  /* Closing pops the entry it pushed rather than adding another. Without this
     every exercise you looked at stayed in the history and Back walked you
     through all of them on the way out. */
  const close = () => {
    if (pushed.current) {
      pushed.current = false;
      navigate(-1);
    } else {
      setParams({}, { replace: true });      // arrived on a shared link
    }
    opener.current?.focus();
  };

  const starters = group.exercises.filter((e) => e.starter).slice(0, 4);
  const filtered = query.trim() !== "" || equip.length > 0;

  const chip = (active: boolean) =>
    `rounded-full border px-[14px] py-[7px] text-[12.5px] transition-colors ${
      active
        ? "border-accent bg-accent-soft text-accent-hi font-600"
        : "border-border bg-surface-2 text-ink-2 hover:border-accent"
    }`;

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-20 pt-9">
      {/* header block */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">{group.region}</p>
          <h1 className="mt-2 text-[clamp(30px,4.6vw,46px)] font-600 leading-[1.04] tracking-[0.02em]">
            {group.name}
          </h1>
        </div>
        <p className="max-w-copy text-[14px] leading-[1.6] text-muted lg:max-w-[380px] lg:text-right">
          {group.blurb}
        </p>
      </div>

      {/* beginner routine */}
      <section className="panel mt-7 p-[18px]">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[13px] font-600 tracking-[0.1em] text-ink">
            Start here — beginner routine
          </h2>
          <span className="pill ml-auto">{group.routineTime}</span>
        </div>
        <div className="mt-4 grid gap-[10px] [grid-template-columns:repeat(auto-fit,minmax(212px,1fr))]">
          {starters.map((e, i) => (
            <button
              key={e.slug}
              onClick={(ev) => openExercise(e.slug, ev.currentTarget)}
              className="flex items-center gap-3 rounded-box-sm border border-border bg-surface-2 px-[13px] py-[12px] text-left transition-colors hover:border-accent"
            >
              <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full border border-accent font-mono text-[11.5px] font-600 text-accent-hi">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] font-600 text-ink">{e.name}</span>
                <span className="mt-[3px] block text-[11.5px] text-muted">
                  {e.dose} · {e.rest} rest
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* controls */}
      <div className="mt-7 flex flex-wrap items-center gap-[10px]">
        <label className="relative flex-1 basis-[240px]">
          <span className="sr-only">Search exercise or equipment</span>
          <span
            className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[14px] text-muted"
            aria-hidden="true"
          >
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercise or equipment"
            className="w-full rounded-full border border-border-input bg-surface-2 py-[10px] pl-[34px] pr-[14px] text-[13px] text-ink outline-none focus:border-accent"
          />
        </label>

        <div className="flex flex-wrap gap-[6px]" role="group" aria-label="Filter by equipment">
          {EQUIP_FILTERS.map((f) => {
            const on = equip.includes(f.label);
            return (
              <button
                key={f.label}
                aria-pressed={on}
                onClick={() =>
                  setEquip(on ? equip.filter((x) => x !== f.label) : [...equip, f.label])
                }
                className={chip(on)}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="microlabel mt-4">
        {shown.length} of {group.exercises.length} exercises shown
      </p>

      {/* grid */}
      {shown.length === 0 ? (
        <div className="mt-5 rounded-card border border-dashed border-border px-5 py-12 text-center">
          <p className="text-[14px] text-muted">
            No exercise matches that search in this group.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setEquip([]);
            }}
            className="mt-3 text-[13px] font-600 text-accent underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(258px,1fr))]">
          {shown.map((e) => (
            <article
              key={e.slug}
              className={`flex flex-col overflow-hidden rounded-card border bg-surface transition-colors ${
                openSlug === e.slug ? "border-accent" : "border-border"
              }`}
            >
              <div className="relative">
                <Media
                  srcs={exerciseMedia(e.slug, e.media.loop ?? e.media.poster)}
                  caption={`${e.name} demo`}
                  className="h-[222px] w-full"
                />
              </div>

              <div className="flex flex-1 flex-col px-[15px] pb-[15px] pt-[14px]">
                <h3 className="text-[18.5px] font-600 leading-[1.15] tracking-[0.03em] text-ink">
                  {e.name}
                </h3>

                <dl className="mt-[13px] flex flex-col gap-[7px]">
                  {[
                    ["Equipment", e.equipment, false],
                    ["Sets × reps", e.dose, true],
                    ["Rest", e.rest, false],
                  ].map(([label, value, accent]) => (
                    <div key={label as string} className="flex gap-3">
                      <dt className="microlabel w-[72px] shrink-0 pt-[2px]">{label as string}</dt>
                      <dd
                        className={`min-w-0 text-[13px] ${
                          accent ? "font-mono font-600 text-accent-hi" : "text-ink-2"
                        }`}
                      >
                        {value as string}
                      </dd>
                    </div>
                  ))}
                </dl>

                <button
                  onClick={(ev) => openExercise(e.slug, ev.currentTarget)}
                  className="mt-auto w-full rounded-full border border-border bg-surface-2 px-4 py-[10px] text-[12.5px] font-600 text-ink transition-colors hover:border-accent hover:text-accent-hi"
                >
                  How to do it →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {filtered && shown.length > 0 && (
        <button
          onClick={() => {
            setQuery("");
            setEquip([]);
          }}
          className="mt-6 text-[13px] text-muted underline underline-offset-4 hover:text-accent"
        >
          Clear filters
        </button>
      )}

      {open && <Drawer group={group} exercise={open} onClose={close} />}
    </main>
  );
}
