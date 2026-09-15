import type { Entry } from "./types";

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseKey = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const shiftKey = (k: string, days: number) => {
  const d = parseKey(k);
  d.setDate(d.getDate() + days);
  return dayKey(d);
};

export const nowHM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/** Postgres hands back "19:15:00"; the UI only ever wants "19:15". */
export const hm = (t: string) => t.slice(0, 5);

export const h12 = (t: string) => {
  const [H, M] = hm(t).split(":").map(Number);
  const ap = H < 12 ? "am" : "pm";
  return `${H % 12 || 12}:${String(M).padStart(2, "0")}${ap}`;
};

export const planIdOf = (slotId: string, name: string) => `${slotId}|${name}`;

/** Quarters read as quarters: 0.75 is three quarters of a cup, not 0.75 of one. */
const VULGAR: Record<string, string> = { "0.25": "\u00BC", "0.5": "\u00BD", "0.75": "\u00BE" };

export function fmtQty(q: number) {
  const rounded = Math.round(q * 100) / 100;
  const whole = Math.floor(rounded);
  const frac = VULGAR[String(Math.round((rounded - whole) * 100) / 100)];
  if (frac) return whole ? `${whole}${frac}` : frac;
  return String(rounded);
}

/* Dish names that read wrong with an English plural on them. */
const INVARIANT = new Set(["pesarattu", "idiyappam", "upma", "poha", "rice", "sambar", "dal"]);

/** "cup" stays "cup" for anything up to one, and for a fraction of one. */
export function unitFor(unit: string, q: number) {
  if (unit === "g") return "g";
  if (q <= 1 || INVARIANT.has(unit)) return unit;
  return /(s|sh|ch|x)$/.test(unit) ? `${unit}es` : `${unit}s`;
}

export const amountOf = (e: Entry) => {
  if (e.qty == null) return "";
  if (e.per_g) return `${Math.round(e.qty)} g`;
  const u = e.unit ?? "serving";
  return `${fmtQty(e.qty)} ${unitFor(u, e.qty)}`;
};

export const totalsFor = (entries: Entry[]) =>
  entries.reduce(
    (a, e) => ({ kcal: a.kcal + Number(e.kcal), protein: a.protein + Number(e.protein) }),
    { kcal: 0, protein: 0 },
  );
