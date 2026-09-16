import { useEffect, useState } from "react";

/**
 * Media is data-driven and ships empty. A missing file renders a deliberate
 * placeholder naming what belongs there, so the app is usable before any
 * footage exists. Never fill these by scraping another app's images.
 */
export default function Media({
  srcs,
  caption,
  className = "",
}: {
  srcs: string[];
  caption: string;
  className?: string;
}) {
  // Try each source in turn; the placeholder is the last resort, not the first miss.
  const [i, setI] = useState(0);
  const key = srcs.join("|");
  useEffect(() => setI(0), [key]);

  const src = srcs[i];
  const failed = !src;

  if (failed) {
    return (
      <div
        className={`grid place-items-center overflow-hidden bg-placeholder p-2 ${className}`}
        role="img"
        aria-label={`${caption} — no footage yet`}
      >
        <div className="grid h-full w-full place-items-center rounded-[9px] border border-dashed border-border px-3 text-center">
          <span className="line-clamp-4 font-mono text-[10.5px] leading-[1.45] text-label">
            {caption}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={caption}
      loading="lazy"
      onError={() => setI((n) => n + 1)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Convention first, then an explicit override from the data file.
 *  BASE_URL keeps this correct whether it is served at / or at /train/. */
const base = import.meta.env.BASE_URL;
const resolve = (p: string) => (/^(https?:)?\//.test(p) ? p : base + p);

/**
 * The source photos come in pairs: frame 0 is the setup, frame 1 is the
 * position the exercise is actually in. Frame 1 is what people recognise —
 * frame 0 of a plank is a man kneeling on the floor — so prefer it and fall
 * back to frame 0 where there is only one.
 */
export const exerciseMedia = (slug: string, override?: string) =>
  override
    ? [resolve(override)]
    : [`${base}media/exercises/${slug}-2.jpg`, `${base}media/exercises/${slug}.jpg`];

export const groupMedia = (key: string, override?: string) =>
  override ? [resolve(override)] : [`${base}media/groups/${key}.jpg`];

/** A variation's own photo, or a drawn one where that is what exists. */
export const variationMedia = (slug: string) => [
  `${base}media/variations/${slug}.jpg`,
  `${base}media/variations/${slug}.svg`,
];
