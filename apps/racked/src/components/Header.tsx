import { Link, useMatch } from "react-router-dom";

export default function Header() {
  const onGroup = useMatch("/g/:groupKey");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[rgba(13,14,15,0.93)] backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-5 py-[14px]">
        <Link to="/" className="flex items-center gap-3" aria-label="Racked home">
          <span
            className="grid h-[29px] w-[29px] place-items-center rounded-[7px] bg-accent font-display text-[17px] font-600 text-bg"
            aria-hidden="true"
          >
            R
          </span>
          <span className="leading-none">
            <span className="block font-display text-[18px] font-600 uppercase tracking-[0.06em] text-ink">
              Racked
            </span>
            <span className="mt-[3px] block font-body text-[10.5px] font-600 uppercase tracking-[0.14em] text-label">
              Exercise Library
            </span>
          </span>
        </Link>

        {onGroup && (
          <Link
            to="/"
            className="ml-auto rounded-full border border-border bg-surface-2 px-[15px] py-[8px] text-[12.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
          >
            ← All muscle groups
          </Link>
        )}
      </div>
    </header>
  );
}
