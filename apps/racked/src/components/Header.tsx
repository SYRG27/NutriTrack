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

        <nav className="ml-auto flex items-center gap-2">
          {onGroup && (
            <Link
              to="/"
              className="rounded-full border border-border bg-surface-2 px-[15px] py-[8px] text-[12.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
            >
              ← All muscle groups
            </Link>
          )}
          {/* Out of the library and back to the food log. */}
          <a
            href="/"
            className="flex items-center gap-[7px] rounded-full border border-border bg-surface-2 px-[13px] py-[8px] text-[12.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="3" opacity=".35" />
              <path d="M16 3a13 13 0 1 1-9.2 22.2" fill="none" stroke="oklch(0.78 0.16 72)" strokeWidth="3" strokeLinecap="round" />
              <path d="M10.4 21.6c-.6-5.2 3.4-9.9 10.8-10.4.6 6.2-3.6 10.7-10.8 10.4z" fill="oklch(0.78 0.16 72)" />
            </svg>
            <span className="hidden sm:inline">NutriTrack</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
