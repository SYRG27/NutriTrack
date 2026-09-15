/** A planned item. `k` and `p` are per ONE unit, so portions can be scaled
 *  to whatever calorie target the person's profile works out to. */
export type PlanItem = {
  n: string;            // dish name, without the amount
  q: number;            // how many units
  u: string;            // idli, cup, katori, g, serving...
  k: number;            // kcal per unit
  p: number;            // protein grams per unit
  e: string;            // emoji
  tag: FoodTag;         // what it is made of, for the diet swaps
  fixed?: boolean;      // true = never scale this portion (coffee, buttermilk)
  alt?: boolean;        // true = an alternative to the item above, not an addition
};

export type FoodTag = "meat" | "fish" | "egg" | "dairy" | "veg";
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

/** Fallback only — a signed-in person's real targets come from their profile. */
export const TARGET = { kcal: 2000, protein: 140, startLb: 170, goalLb: 160 };
