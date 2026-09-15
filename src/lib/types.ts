export type PlanItem = { n: string; k: number; p: number; e: string };
export type PlanSlot = {
  id: string;
  time: string;
  name: string;
  tone: "leaf" | "turmeric" | "plum" | "indigo";
  items: PlanItem[];
};
export type PlanDay = {
  label: string;
  focus: string;
  gym: { from: string; to: string } | null;
  slots: PlanSlot[];
};

/** A food in the catalogue. `g` means kcal/protein are per 100 g, not per unit. */
export type Food = {
  n: string;
  e: string;
  u: string;
  k: number;
  p: number;
  g: boolean;
  a: string;
};

/** One thing you ate. Mirrors a row of public.entries. */
export type Entry = {
  id: string;
  eaten_on: string;
  eaten_at: string;
  name: string;
  emoji: string | null;
  qty: number | null;
  unit: string | null;
  per_g: boolean;
  unit_kcal: number | null;
  unit_protein: number | null;
  kcal: number;
  protein: number;
  plan_id: string | null;
};

export type WeighIn = { measured_on: string; lb: number };

export const TARGET = { kcal: 2350, protein: 175, startLb: 180, goalLb: 165 };
