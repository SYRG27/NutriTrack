import { useEffect, useState } from "react";

/**
 * Media is data-driven and ships empty. A missing file renders a deliberate
 * placeholder naming what belongs there, so the app is usable before any
 * footage exists. Never fill these by scraping another app's images.
 */
export default function Media({
  src,
  caption,
  className = "",
}: {
  src?: string;
  caption: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => setFailed(!src), [src]);

  if (failed || !src) {
    return (
      <div
        className={`grid place-items-center bg-placeholder p-3 ${className}`}
        role="img"
        aria-label={`${caption} — no footage yet`}
      >
        <div className="grid h-full w-full place-items-center rounded-[9px] border border-dashed border-border px-3 text-center">
          <span className="font-mono text-[11px] leading-[1.5] text-label">{caption}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={caption}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Convention first, then an explicit override from the data file.
 *  BASE_URL keeps this correct whether it is served at / or at /train/. */
const base = import.meta.env.BASE_URL;
export const exerciseMedia = (slug: string, override?: string) =>
  override ?? `${base}media/exercises/${slug}.jpg`;
export const groupMedia = (key: string, override?: string) =>
  override ?? `${base}media/groups/${key}.jpg`;
