import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SPLIT_LABEL, findExercise, groupByKey, sessionFor } from "../data/exercises";
import Media, { exerciseMedia } from "./Media";
import Drawer from "./Drawer";

/** What NutriTrack sends you to: today's split, turned into exercises. */
export default function DayPage() {
  const { split = "rest" } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const opener = useRef<HTMLButtonElement | null>(null);
  const pushed = useRef(false);
  const [done, setDone] = useState<string[]>([]);

  const blocks = useMemo(() => sessionFor(split), [split]);
  const label = SPLIT_LABEL[split] ?? "Today";

  const openSlug = params.get("ex");
  const openGroupKey = params.get("g");
  const openGroup = openGroupKey ? groupByKey(openGroupKey) : undefined;
  const open = openGroup && openSlug ? findExercise(openGroup, openSlug) : undefined;

  const openExercise = (groupKey: string, slug: string, el: HTMLButtonElement | null) => {
    opener.current = el;
    pushed.current = true;
    setParams({ g: groupKey, ex: slug });
  };
  const close = () => {
    if (pushed.current) {
      pushed.current = false;
      navigate(-1);
    } else {
      setParams({}, { replace: true });
    }
    opener.current?.focus();
  };

  const total = blocks.reduce((a, b) => a + b.picks.length, 0);

  if (!blocks.length)
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-16">
        <h1 className="text-[32px]">Rest day</h1>
        <p className="mt-3 text-[14px] text-muted">
          Nothing scheduled. A walk still counts.
        </p>
        <Link to="/" className="mt-5 inline-block text-[13px] font-600 text-accent underline underline-offset-4">
          Browse all muscle groups
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-20 pt-9">
      <p className="eyebrow">Today&rsquo;s session</p>
      <h1 className="mt-2 text-[clamp(30px,4.6vw,46px)] font-600 leading-[1.04] tracking-[0.02em]">
        {label}
      </h1>
      <p className="mt-3 max-w-copy text-[14px] leading-[1.6] text-muted">
        {total} exercises, in order. Tap one to read the form before you start it, and tick it
        off as you go — {done.length} of {total} done.
      </p>

      <div className="mt-4 h-[5px] w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${total ? (done.length / total) * 100 : 0}%` }}
        />
      </div>

      {blocks.map(({ group, picks }) => (
        <section key={group.key} className="mt-9">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-[19px] font-600 tracking-[0.04em] text-ink">{group.name}</h2>
            <Link
              to={`/g/${group.key}`}
              className="text-[12.5px] text-accent underline underline-offset-4"
            >
              all {group.exercises.length} {group.name.toLowerCase()} exercises →
            </Link>
          </div>

          <div className="mt-4 grid gap-[14px] [grid-template-columns:repeat(auto-fill,minmax(258px,1fr))]">
            {picks.map((e) => {
              const id = `${group.key}/${e.slug}`;
              const ticked = done.includes(id);
              return (
                <article
                  key={e.slug}
                  className={`flex flex-col overflow-hidden rounded-card border bg-surface transition-colors ${
                    openSlug === e.slug && openGroupKey === group.key
                      ? "border-accent"
                      : ticked
                        ? "border-accent/40"
                        : "border-border"
                  }`}
                >
                  <div className="relative">
                    <Media
                      srcs={exerciseMedia(e.slug, e.media.loop ?? e.media.poster)}
                      caption={`${e.name} demo`}
                      className={`h-[190px] w-full ${ticked ? "opacity-45" : ""}`}
                    />
                    <button
                      onClick={() =>
                        setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
                      }
                      aria-pressed={ticked}
                      aria-label={`Mark ${e.name} done`}
                      className={`absolute right-3 top-3 grid h-[32px] w-[32px] place-items-center rounded-full border text-[14px] backdrop-blur transition-colors ${
                        ticked
                          ? "border-accent bg-accent text-bg"
                          : "border-border bg-[rgba(10,11,12,0.7)] text-ink-2 hover:border-accent"
                      }`}
                    >
                      ✓
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col px-[15px] pb-[15px] pt-[13px]">
                    <h3 className="text-[17px] font-600 leading-[1.15] tracking-[0.03em] text-ink">
                      {e.name}
                    </h3>
                    <p className="mt-[8px] font-mono text-[12.5px] font-600 text-accent-hi">
                      {e.dose} · {e.rest} rest
                    </p>
                    <button
                      onClick={(ev) => openExercise(group.key, e.slug, ev.currentTarget)}
                      className="mt-auto w-full rounded-full border border-border bg-surface-2 px-4 py-[9px] text-[12.5px] font-600 text-ink transition-colors hover:border-accent hover:text-accent-hi"
                      style={{ marginTop: "16px" }}
                    >
                      How to do it →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
        <Link
          to="/"
          className="rounded-full border border-border bg-surface-2 px-[15px] py-[9px] text-[12.5px] text-ink-2 hover:border-accent hover:text-ink"
        >
          Browse all muscle groups
        </Link>
        <a
          href="/"
          className="rounded-full border border-border bg-surface-2 px-[15px] py-[9px] text-[12.5px] text-ink-2 hover:border-accent hover:text-ink"
        >
          ← Back to NutriTrack
        </a>
      </div>

      {open && openGroup && <Drawer group={openGroup} exercise={open} onClose={close} />}
    </main>
  );
}
