import { useNavigate } from "react-router-dom";
import { DATA } from "../data/exercises";
import Media, { groupMedia } from "./Media";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-20 pt-9">
      <h1 className="text-[clamp(32px,5.4vw,56px)] font-600 leading-[1.02] tracking-[0.02em]">
        Pick a muscle group
      </h1>
      <p className="mt-4 max-w-copy text-[15px] leading-[1.65] text-muted">
        Every exercise here comes with the setup, four form cues in order, and the two mistakes
        people actually make. Read the ones you have never done before you get to the gym, not
        while standing in front of the machine guessing.
      </p>

      <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(228px,1fr))]">
        {DATA.map((g) => (
          <button
            key={g.key}
            onClick={() => navigate(`/g/${g.key}`)}
            className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface text-left transition-colors hover:border-accent"
          >
            <Media
              src={groupMedia(g.key, g.hero)}
              caption={`${g.name} reference image`}
              className="h-[168px] w-full"
            />
            <span className="flex items-center gap-3 px-[15px] py-[14px]">
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[21px] font-600 uppercase leading-none tracking-[0.03em] text-ink">
                  {g.name}
                </span>
                <span className="mt-[7px] block text-[12px] text-muted">
                  {g.exercises.length} exercises · {g.region}
                </span>
              </span>
              <span
                className="grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border border-accent text-[13px] text-accent"
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
