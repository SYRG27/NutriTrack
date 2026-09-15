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

export const amountOf = (e: Entry) => {
  if (e.qty == null) return "";
  if (e.per_g) return `${Math.round(e.qty)} g`;
  const u = e.unit ?? "serving";
  const q = e.qty % 1 ? e.qty : Math.round(e.qty);
  const unit = e.qty <= 1 ? u : /(s|sh|ch|x)$/.test(u) ? `${u}es` : `${u}s`;
  return `${q} ${unit}`;
};

export const totalsFor = (entries: Entry[]) =>
  entries.reduce(
    (a, e) => ({ kcal: a.kcal + Number(e.kcal), protein: a.protein + Number(e.protein) }),
    { kcal: 0, protein: 0 },
  );
