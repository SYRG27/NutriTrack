export default function Dial({
  label,
  value,
  sub,
  frac,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  frac: number;
  color: string;
}) {
  const C = 113;
  return (
    <div className="dial">
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="23" cy="23" r="18" fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle
          cx="23"
          cy="23"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - Math.min(1, frac))}
          transform="rotate(-90 23 23)"
        />
      </svg>
      <div>
        <div className="lab">{label}</div>
        <div className="val mono">{value}</div>
        <div className="sub mono">{sub}</div>
      </div>
    </div>
  );
}
