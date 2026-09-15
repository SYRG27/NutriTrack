/** The mark: a calorie ring most of the way round, with a leaf inside it. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 32 32"
      role="img" aria-label="NutriTrack" style={{ flex: "none" }}
    >
      <circle cx="16" cy="16" r="13" fill="none" stroke="var(--line)" strokeWidth="3" />
      <path
        d="M16 3a13 13 0 1 1-9.2 22.2"
        fill="none" stroke="var(--leaf)" strokeWidth="3" strokeLinecap="round"
      />
      <path
        d="M10.4 21.6c-.6-5.2 3.4-9.9 10.8-10.4.6 6.2-3.6 10.7-10.8 10.4z"
        fill="var(--leaf)"
      />
      <path
        d="M10.8 21.4c2.2-3.4 5.2-5.6 8.6-6.8"
        fill="none" stroke="var(--surface)" strokeWidth="1.3" strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="brand">
        Nutri<span>Track</span>
      </span>
    </span>
  );
}
