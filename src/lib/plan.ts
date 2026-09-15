import type { PlanDay, PlanItem, PlanSlot, FoodTag } from "./types";
import type { Avoid, Diet, Like, Profile } from "./profile";
import { SPLIT_LABEL, isTrainingDay, splitFor, targetsFor } from "./profile";
import { fmtQty, unitFor } from "./day";

/* ---------------------------------------------------------------------------
   Pools of Telugu home cooking. A person's plan is assembled from the ones
   they said they would actually eat, rotated so the week is not the same day
   seven times, and sized to their own target.
--------------------------------------------------------------------------- */

const I = (
  n: string, q: number, u: string, k: number, p: number, e: string,
  tag: FoodTag = "veg", extra: Partial<PlanItem> = {},
): PlanItem => ({ n, q, u, k, p, e, tag, ...extra });

type Choice = { key: Like; items: PlanItem[] };

const BREAKFASTS: Choice[] = [
  { key: "idli", items: [I("Idli", 3, "idli", 70, 2, "🍚"), I("Sambar", 1, "cup", 120, 6, "🥣")] },
  { key: "dosa", items: [I("Dosa", 2, "dosa", 150, 3, "🫓"), I("Coconut chutney", 1, "serving", 90, 2, "🥥", "veg", { fixed: true })] },
  { key: "pesarattu", items: [I("Pesarattu", 2, "pesarattu", 150, 6, "🫓"), I("Ginger chutney", 1, "serving", 60, 1, "🌶️", "veg", { fixed: true })] },
  { key: "upma", items: [I("Upma", 1.5, "cup", 220, 5, "🥣")] },
  { key: "poha", items: [I("Poha", 1.5, "cup", 200, 4, "🥣"), I("Peanuts", 20, "g", 5.67, 0.26, "🥜")] },
  { key: "curd_rice", items: [I("Curd rice", 1, "bowl", 250, 7, "🍚", "dairy")] },
  { key: "idiyappam", items: [I("Idiyappam", 3, "idiyappam", 95, 2, "🍜"), I("Coconut chutney", 1, "serving", 90, 2, "🥥", "veg", { fixed: true })] },
  { key: "oats", items: [I("Oats", 1, "cup", 160, 6, "🥣"), I("Banana", 1, "banana", 105, 1, "🍌", "veg", { fixed: true })] },
  { key: "eggs", items: [I("Omelette", 3, "egg", 95, 7, "🍳", "egg")] },
  { key: "paratha", items: [I("Aloo paratha", 1, "paratha", 330, 7, "🫓"), I("Curd", 1, "cup", 100, 6, "🥛", "dairy")] },
];

/** The protein that anchors lunch and dinner. */
const MAINS: { key: Like; lunch: PlanItem; dinner: PlanItem }[] = [
  { key: "chicken",
    lunch:  I("Chicken curry", 180, "g", 2.0, 0.25, "🍗", "meat"),
    dinner: I("Chicken tikka", 150, "g", 1.87, 0.27, "🍗", "meat") },
  { key: "fish",
    lunch:  I("Fish curry", 180, "g", 1.67, 0.21, "🐟", "fish"),
    dinner: I("Fish fry", 150, "g", 1.8, 0.22, "🐟", "fish") },
  { key: "prawns",
    lunch:  I("Prawn curry", 180, "g", 1.45, 0.21, "🦐", "fish"),
    dinner: I("Grilled shrimp", 150, "g", 1.67, 0.22, "🦐", "fish") },
  { key: "goat",
    lunch:  I("Goat curry", 130, "g", 2.75, 0.23, "🍛", "meat"),
    dinner: I("Mutton keema", 120, "g", 2.6, 0.24, "🍛", "meat") },
  { key: "egg_curry",
    lunch:  I("Egg curry", 3, "egg", 110, 7, "🍛", "egg"),
    dinner: I("Egg bhurji", 3, "egg", 115, 7, "🍳", "egg") },
  { key: "paneer",
    lunch:  I("Paneer curry", 1, "cup", 320, 16, "🧀", "dairy"),
    dinner: I("Paneer, air fried", 120, "g", 2.9, 0.2, "🧀", "dairy") },
  { key: "tofu",
    lunch:  I("Tofu curry", 1, "cup", 250, 18, "🧈"),
    dinner: I("Tofu, air fried", 150, "g", 1.9, 0.22, "🧈") },
  { key: "soya",
    lunch:  I("Soya chunks curry", 1, "cup", 250, 25, "🫘"),
    dinner: I("Soya chunks curry", 1, "cup", 250, 25, "🫘") },
  { key: "dal",
    lunch:  I("Dal", 1.5, "katori", 140, 8, "🫘"),
    dinner: I("Dal", 1.5, "katori", 140, 8, "🫘") },
];

const SIDES: PlanItem[] = [
  I("Beans poriyal", 1, "serving", 80, 3, "🥬"),
  I("Cabbage fry", 1, "serving", 85, 3, "🥬"),
  I("Beetroot poriyal", 1, "serving", 90, 3, "🥬"),
  I("Gutti vankaya", 1, "serving", 190, 4, "🍆"),
  I("Bendakaya vepudu", 1, "serving", 160, 3, "🥬"),
  I("Avial", 1, "cup", 120, 3, "🥥"),
  I("Thotakura fry", 1, "serving", 110, 4, "🥬"),
];

const SNACKS: Choice[] = [
  { key: "fruit", items: [I("Banana", 1, "banana", 105, 1, "🍌", "veg", { fixed: true })] },
  { key: "fruit", items: [I("Apple", 1, "apple", 95, 0.5, "🍎", "veg", { fixed: true })] },
  { key: "nuts", items: [I("Trail mix pack", 1, "pack", 140, 4, "🥜", "veg", { fixed: true })] },
  { key: "sprouts", items: [I("Sprouts salad", 1, "cup", 120, 8, "🥗")] },
  { key: "yogurt", items: [I("Greek yogurt", 1, "cup", 145, 25, "🥛", "dairy")] },
  { key: "chana", items: [I("Roasted chana", 30, "g", 4.0, 0.23, "🥜")] },
];

const POST_GYM = (): PlanItem[] => [
  I("Whey shake", 1, "scoop", 120, 24, "🥤", "dairy", { fixed: true }),
  I("Greek yogurt", 1, "cup", 145, 25, "🥛", "dairy", { fixed: true, alt: true }),
  I("Boiled egg whites", 4, "white", 17, 3.5, "🥚", "egg", { fixed: true, alt: true }),
];

const RICE = (q: number) => I("Rice + quinoa", q, "cup", 215, 6, "🍚");
const CURD = () => I("Curd", 1, "cup", 100, 6, "🥛", "dairy");
const BUTTERMILK = () => I("Buttermilk", 1, "glass", 60, 3, "🥛", "dairy", { fixed: true });
const BANANA = () => I("Banana", 1, "banana", 105, 1, "🍌", "veg", { fixed: true });

/* ---------------------------------------------------------------------------
   Diet swaps. A replacement keeps roughly the calories and protein of what it
   replaces, so swapping a diet does not quietly change the day's totals.
--------------------------------------------------------------------------- */

type Swap = Pick<PlanItem, "n" | "q" | "u" | "k" | "p" | "e" | "tag">;

const VEG_FOR_MEAT: Record<string, Swap> = {
  "Chicken curry":      { n: "Paneer curry", q: 1.2, u: "cup", k: 320, p: 16, e: "🧀", tag: "dairy" },
  "Chicken tikka":      { n: "Paneer tikka", q: 150, u: "g", k: 2.2, p: 0.2, e: "🧀", tag: "dairy" },
  "Chicken pepper fry": { n: "Kadai paneer", q: 1.2, u: "cup", k: 320, p: 16, e: "🧀", tag: "dairy" },
  "Goat curry":         { n: "Rajma", q: 1.4, u: "cup", k: 240, p: 12, e: "🫘", tag: "veg" },
  "Fish curry":         { n: "Chana masala", q: 1.2, u: "cup", k: 270, p: 12, e: "🫘", tag: "veg" },
  "Fish fry":           { n: "Paneer, air fried", q: 120, u: "g", k: 2.9, p: 0.2, e: "🧀", tag: "dairy" },
  "Grilled fish":       { n: "Paneer, air fried", q: 110, u: "g", k: 2.9, p: 0.2, e: "🧀", tag: "dairy" },
  "Shrimp stir fry":    { n: "Soya chunks curry", q: 1, u: "cup", k: 250, p: 25, e: "🫘", tag: "veg" },
  "Grilled shrimp":     { n: "Tofu, air fried", q: 150, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
};

const VEGAN_FOR_DAIRY_EGG: Record<string, Swap> = {
  "Omelette":            { n: "Tofu scramble", q: 1, u: "cup", k: 220, p: 20, e: "🍳", tag: "veg" },
  "Boiled eggs":         { n: "Tofu, air fried", q: 100, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
  "Boiled egg whites":   { n: "Tofu, air fried", q: 80, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
  "Egg curry":           { n: "Chana masala", q: 1.2, u: "cup", k: 270, p: 12, e: "🫘", tag: "veg" },
  "Curd":                { n: "Soy yogurt", q: 1, u: "cup", k: 95, p: 6, e: "🥛", tag: "veg" },
  "Curd rice":           { n: "Lemon rice", q: 1, u: "cup", k: 280, p: 5, e: "🍚", tag: "veg" },
  "Buttermilk":          { n: "Nimbu pani", q: 1, u: "glass", k: 40, p: 0, e: "🍋", tag: "veg" },
  "Whey shake":          { n: "Plant protein powder", q: 1, u: "scoop", k: 120, p: 21, e: "🥤", tag: "veg" },
  "Greek yogurt":        { n: "Soy yogurt", q: 1.5, u: "cup", k: 95, p: 6, e: "🥛", tag: "veg" },
  "Paneer curry":        { n: "Tofu curry", q: 1.2, u: "cup", k: 250, p: 18, e: "🧈", tag: "veg" },
  "Paneer tikka":        { n: "Tofu, air fried", q: 160, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
  "Paneer, air fried":   { n: "Tofu, air fried", q: 150, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
  "Kadai paneer":        { n: "Tofu curry", q: 1.2, u: "cup", k: 250, p: 18, e: "🧈", tag: "veg" },
  "Coconut chutney":     { n: "Tomato chutney", q: 1, u: "serving", k: 50, p: 1, e: "🍅", tag: "veg" },
};

const NORTH_FOR_SOUTH: Record<string, Swap> = {
  "Idli":            { n: "Aloo paratha", q: 1, u: "paratha", k: 330, p: 7, e: "🫓", tag: "veg" },
  "Sambar":          { n: "Dal tadka", q: 1, u: "katori", k: 170, p: 9, e: "🫘", tag: "veg" },
  "Pesarattu":       { n: "Missi roti", q: 2, u: "roti", k: 180, p: 6, e: "🫓", tag: "veg" },
  "Ginger chutney":  { n: "Green chutney", q: 1, u: "serving", k: 40, p: 1, e: "🌿", tag: "veg" },
  "Upma":            { n: "Poha", q: 1.5, u: "cup", k: 200, p: 4, e: "🥣", tag: "veg" },
  "Curd rice":       { n: "Paneer paratha", q: 1, u: "paratha", k: 360, p: 12, e: "🫓", tag: "dairy" },
  "Dosa":            { n: "Kulcha", q: 1, u: "kulcha", k: 240, p: 6, e: "🫓", tag: "veg" },
  "Rava dosa":       { n: "Chapati", q: 2, u: "chapati", k: 100, p: 3.5, e: "🫓", tag: "veg" },
  "Idiyappam":       { n: "Poori", q: 2, u: "poori", k: 130, p: 2.5, e: "🫓", tag: "veg" },
  "Rasam":           { n: "Dal fry", q: 1, u: "katori", k: 180, p: 9, e: "🫘", tag: "veg" },
  "Avial":           { n: "Mixed veg (North)", q: 1, u: "cup", k: 200, p: 5, e: "🥘", tag: "veg" },
  "Beans poriyal":   { n: "Bhindi masala", q: 1, u: "serving", k: 170, p: 3, e: "🥬", tag: "veg" },
  "Cabbage fry":     { n: "Aloo gobi", q: 1, u: "serving", k: 180, p: 4, e: "🥔", tag: "veg" },
  "Beetroot poriyal":{ n: "Jeera aloo", q: 1, u: "serving", k: 170, p: 3, e: "🥔", tag: "veg" },
  "Gutti vankaya":   { n: "Baingan bharta", q: 1, u: "cup", k: 190, p: 4, e: "🍆", tag: "veg" },
  "Veg fry":         { n: "Aloo matar", q: 1, u: "serving", k: 190, p: 6, e: "🥔", tag: "veg" },
  "Rice + quinoa":   { n: "Jeera rice + quinoa", q: 1, u: "cup", k: 230, p: 6, e: "🍚", tag: "veg" },
  "Chicken curry":   { n: "Butter chicken", q: 170, u: "g", k: 2.1, p: 0.22, e: "🍗", tag: "meat" },
  "Chicken pepper fry": { n: "Kadai chicken", q: 150, u: "g", k: 1.9, p: 0.24, e: "🍗", tag: "meat" },
  "Goat curry":      { n: "Rogan josh", q: 120, u: "g", k: 2.5, p: 0.23, e: "🍛", tag: "meat" },
  "Grilled fish":    { n: "Fish tikka", q: 150, u: "g", k: 1.75, p: 0.23, e: "🐟", tag: "fish" },
  "Fish fry":        { n: "Fish tikka", q: 150, u: "g", k: 1.75, p: 0.23, e: "🐟", tag: "fish" },
  "Grilled shrimp":  { n: "Chicken seekh kebab", q: 2, u: "kebab", k: 120, p: 11, e: "🍢", tag: "meat" },
};

function applySwaps(item: PlanItem, map: Record<string, Swap>): PlanItem {
  const s = map[item.n];
  return s ? { ...item, ...s } : item;
}

/** Swaps for an allergy or a hard no, applied after the diet swaps. */
const AVOID_SWAPS: Record<Avoid, Record<string, Swap>> = {
  dairy: {
    "Curd":         { n: "Soy yogurt", q: 1, u: "cup", k: 95, p: 6, e: "🥛", tag: "veg" },
    "Buttermilk":   { n: "Nimbu pani", q: 1, u: "glass", k: 40, p: 0, e: "🍋", tag: "veg" },
    "Greek yogurt": { n: "Soy yogurt", q: 1.5, u: "cup", k: 95, p: 6, e: "🥛", tag: "veg" },
    "Whey shake":   { n: "Plant protein powder", q: 1, u: "scoop", k: 120, p: 21, e: "🥤", tag: "veg" },
    "Curd rice":    { n: "Lemon rice", q: 1, u: "cup", k: 280, p: 5, e: "🍚", tag: "veg" },
    "Paneer curry": { n: "Tofu curry", q: 1.2, u: "cup", k: 250, p: 18, e: "🧈", tag: "veg" },
    "Paneer tikka": { n: "Tofu, air fried", q: 160, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
    "Paneer, air fried": { n: "Tofu, air fried", q: 150, u: "g", k: 1.9, p: 0.22, e: "🧈", tag: "veg" },
    "Kadai paneer": { n: "Tofu curry", q: 1.2, u: "cup", k: 250, p: 18, e: "🧈", tag: "veg" },
  },
  nuts: {
    "Trail mix pack": { n: "Roasted chana", q: 1, u: "pack", k: 120, p: 7, e: "🫘", tag: "veg" },
    "Coconut chutney": { n: "Tomato chutney", q: 1, u: "serving", k: 50, p: 1, e: "🍅", tag: "veg" },
  },
  gluten: {
    "Phulka":   { n: "Jonna roti", q: 1, u: "roti", k: 110, p: 3, e: "🫓", tag: "veg" },
    "Chapati":  { n: "Jonna roti", q: 1, u: "roti", k: 110, p: 3, e: "🫓", tag: "veg" },
    "Missi roti": { n: "Jonna roti", q: 2, u: "roti", k: 110, p: 3, e: "🫓", tag: "veg" },
    "Upma":     { n: "Poha", q: 1.5, u: "cup", k: 200, p: 4, e: "🥣", tag: "veg" },
    "Rava dosa": { n: "Dosa", q: 2, u: "dosa", k: 150, p: 3, e: "🫓", tag: "veg" },
    "Aloo paratha": { n: "Akki roti", q: 2, u: "roti", k: 150, p: 3, e: "🫓", tag: "veg" },
    "Paneer paratha": { n: "Akki roti", q: 2, u: "roti", k: 150, p: 3, e: "🫓", tag: "veg" },
    "Kulcha":   { n: "Dosa", q: 1, u: "dosa", k: 150, p: 3, e: "🫓", tag: "veg" },
    "Poori":    { n: "Dosa", q: 2, u: "dosa", k: 150, p: 3, e: "🫓", tag: "veg" },
  },
  seafood: {
    "Fish curry":      { n: "Chicken curry", q: 180, u: "g", k: 2.0, p: 0.25, e: "🍗", tag: "meat" },
    "Fish fry":        { n: "Chicken 65", q: 150, u: "g", k: 2.27, p: 0.2, e: "🍗", tag: "meat" },
    "Grilled fish":    { n: "Tandoori chicken", q: 150, u: "g", k: 1.75, p: 0.28, e: "🍗", tag: "meat" },
    "Fish tikka":      { n: "Chicken tikka", q: 150, u: "g", k: 1.87, p: 0.27, e: "🍗", tag: "meat" },
    "Shrimp stir fry": { n: "Chicken pepper fry", q: 150, u: "g", k: 2.0, p: 0.25, e: "🍗", tag: "meat" },
    "Grilled shrimp":  { n: "Tandoori chicken", q: 150, u: "g", k: 1.75, p: 0.28, e: "🍗", tag: "meat" },
  },
  beef: {},
  pork: {},
  onion_garlic: {
    "Kachumber salad": { n: "Cucumber raita", q: 1, u: "cup", k: 90, p: 4, e: "🥛", tag: "dairy" },
    "Ginger chutney":  { n: "Tomato chutney", q: 1, u: "serving", k: 50, p: 1, e: "🍅", tag: "veg" },
  },
};

/** No shakes: whole-food protein instead. */
const NO_SUPPLEMENT: Record<string, Swap> = {
  "Whey shake": { n: "Greek yogurt", q: 1, u: "cup", k: 145, p: 25, e: "🥛", tag: "dairy" },
  "Plant protein powder": { n: "Soy yogurt", q: 2, u: "cup", k: 95, p: 6, e: "🥛", tag: "veg" },
};

const BANNED: Record<Diet, FoodTag[]> = {
  nonveg: [],
  egg: ["meat", "fish"],
  veg: ["meat", "fish", "egg"],
  vegan: ["meat", "fish", "egg", "dairy"],
};

/* --------------------------- portion scaling --------------------------- */

/* Things you can serve a quarter of, versus things you count. Nobody puts
   one and a half eggs on a plate. */
const DIVISIBLE = ["cup", "katori", "glass", "serving", "bowl", "plate", "tbsp", "2 tbsp", "tsp"];

const roundQty = (q: number, unit: string) => {
  if (unit === "g") return Math.max(25, Math.round(q / 25) * 25);
  if (DIVISIBLE.includes(unit)) return Math.max(0.25, Math.round(q * 4) / 4);
  return Math.max(1, Math.round(q));
};

export const itemKcal = (i: PlanItem) => i.q * i.k;
export const itemProtein = (i: PlanItem) => i.q * i.p;

/** Alternatives ("or Greek yogurt") are choices, so only the first one counts. */
export function slotTotals(slot: PlanSlot) {
  const counted = slot.items.filter((i) => !i.alt);
  return {
    kcal: Math.round(counted.reduce((a, i) => a + itemKcal(i), 0)),
    protein: Math.round(counted.reduce((a, i) => a + itemProtein(i), 0)),
  };
}

export function planTotals(day: PlanDay) {
  return day.slots.reduce(
    (a, s) => {
      const t = slotTotals(s);
      return { kcal: a.kcal + t.kcal, protein: a.protein + t.protein };
    },
    { kcal: 0, protein: 0 },
  );
}

export function itemLabel(i: PlanItem) {
  if (i.u === "g") return `${i.n}, ${Math.round(i.q)}g`;
  if (i.q === 1 && (i.u === "serving" || i.u === "bowl" || i.u === "plate")) return i.n;
  return `${i.n}, ${fmtQty(i.q)} ${unitFor(i.u, i.q)}`;
}

/* ------------------------------- scaling -------------------------------
   One factor is not enough: scaling everything to hit the calories leaves a
   vegetarian plan far short on protein, because the swapped-in dishes carry
   fewer grams per calorie. So solve two factors at once - one for the
   protein-dense dishes, one for the rest - to land on both targets.
------------------------------------------------------------------------- */

const PROTEIN_DENSE = 0.06;            // grams of protein per kcal
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Factors = { protein: number; other: number; fixed: number };

function factors(day: PlanDay, target: { kcal: number; protein: number }): Factors {
  let Kp = 0, Pp = 0, Ko = 0, Po = 0, Kf = 0, Pf = 0;

  day.slots.forEach((slot) =>
    slot.items.forEach((i) => {
      if (i.alt) return;                             // a choice, not an addition
      const k = i.q * i.k, p = i.q * i.p;
      if (i.fixed) { Kf += k; Pf += p; }
      else if (i.p / Math.max(i.k, 1) >= PROTEIN_DENSE) { Kp += k; Pp += p; }
      else { Ko += k; Po += p; }
    }),
  );

  /* A small target can be swallowed whole by the unscalable extras - the
     banana, the trail mix, the buttermilk. They keep their portion where
     there is room, and shrink when there is not. */
  const fixedBudget = target.kcal * 0.4;
  const fs = Kf > fixedBudget ? clamp(fixedBudget / Kf, 0.4, 1) : 1;
  Kf *= fs; Pf *= fs;

  const tK = target.kcal - Kf;
  const tP = target.protein - Pf;
  const det = Kp * Po - Ko * Pp;

  let fp = 1, fo = 1;
  if (Math.abs(det) > 1e-6) {
    fp = (tK * Po - Ko * tP) / det;
    fo = (Kp * tP - tK * Pp) / det;
  }

  // Keep portions believable, then let the non-protein side absorb whatever
  // calories are left so the day still lands on its calorie target.
  fp = clamp(fp, 0.6, 2.8);
  fo = Ko > 0 ? clamp((tK - fp * Kp) / Ko, 0.4, 2.4) : 1;
  return { protein: fp, other: fo, fixed: fs };
}

function scaleItems(items: PlanItem[], f: Factors): PlanItem[] {
  return items.map((i) => {
    if (i.fixed) return f.fixed === 1 ? i : { ...i, q: roundQty(i.q * f.fixed, i.u) };
    const dense = i.p / Math.max(i.k, 1) >= PROTEIN_DENSE;
    return { ...i, q: roundQty(i.q * (dense ? f.protein : f.other), i.u) };
  });
}

/**
 * Rounding to real portions (half a cup, 25 g) leaves the day a little off
 * target, and on a small target the rounding floors can leave it a lot off.
 * Calories are the constraint that decides whether the scale moves, so nudge
 * the whole day until they land, and let protein be what it can be.
 */
function settle(day: PlanDay, target: { kcal: number; protein: number }): PlanDay {
  for (let pass = 0; pass < 6; pass++) {
    const now = planTotals(day).kcal;
    if (!now || Math.abs(now - target.kcal) / target.kcal < 0.035) break;
    const adj = clamp(target.kcal / now, 0.75, 1.35);
    day = {
      ...day,
      slots: day.slots.map((slot) => ({
        ...slot,
        items: slot.items.map((i) => ({ ...i, q: roundQty(i.q * adj, i.u) })),
      })),
    };
  }
  return day;
}

/** How much of the protein target this plan actually reaches. */
export function proteinShortfall(
  plan: Record<number, PlanDay>,
  target: { protein: number },
) {
  const days = [0, 1, 2, 3, 4, 5, 6];
  const avg = days.reduce((a, d) => a + planTotals(plan[d]).protein, 0) / days.length;
  return { average: Math.round(avg), short: avg < target.protein * 0.9 };
}

/* ------------------------------ meal times ------------------------------ */

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHM = (mins: number) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const GYM_LENGTH = 90;

/* ------------------------------ the builder ------------------------------ */

const allowed = (item: PlanItem, banned: FoodTag[]) => !banned.includes(item.tag);

/** Their picks if they made any, otherwise everything the diet allows. */
function pool<T>(all: T[], keyOf: (x: T) => Like, likes: Like[], ok: (x: T) => boolean) {
  const usable = all.filter(ok);
  const liked = usable.filter((x) => likes.includes(keyOf(x)));
  return liked.length ? liked : usable;
}

/**
 * Build one person's week. Training days get a pre-workout and a post-gym
 * meal around whatever time they train; rest days get neither and eat a
 * little lighter, so the week averages out to their target rather than every
 * day being identical.
 */
export function buildPlan(profile: Profile): Record<number, PlanDay> {
  const target = targetsFor(profile);
  const banned = BANNED[profile.diet];
  const likes = profile.likes ?? [];
  const out: Record<number, PlanDay> = {};

  const breakfasts = pool(BREAKFASTS, (b) => b.key, likes,
    (b) => b.items.every((i) => allowed(i, banned)));
  const mains = pool(MAINS, (m) => m.key, likes,
    (m) => allowed(m.lunch, banned) && allowed(m.dinner, banned));
  const snacks = pool(SNACKS, (s) => s.key, likes,
    (s) => s.items.every((i) => allowed(i, banned)));

  const gymStart = toMin(profile.gym_time || "19:00");
  const morning = gymStart < 12 * 60;

  for (let day = 0; day < 7; day++) {
    const training = isTrainingDay(profile, day);
    const split = splitFor(profile, day);

    const bfast = breakfasts[day % breakfasts.length].items.map((i) => ({ ...i }));
    const main = mains[day % mains.length];
    const main2 = mains[(day + Math.max(1, Math.floor(mains.length / 2))) % mains.length];
    const side = SIDES[day % SIDES.length];
    const snack = snacks[day % snacks.length].items.map((i) => ({ ...i }));

    // Eggs go with any breakfast for someone who eats them.
    if (likes.includes("eggs") && !banned.includes("egg") &&
        !bfast.some((i) => i.tag === "egg"))
      bfast.push(I("Boiled eggs", 2, "egg", 70, 6, "🥚", "egg"));

    const slots: PlanSlot[] = [];
    const bTime = training && morning ? toHM(gymStart + GYM_LENGTH + 15) : training ? "07:30" : "08:30";

    if (training && morning) {
      slots.push({ id: "pre", time: toHM(gymStart - 45), name: "Pre-workout", tone: "indigo",
        items: [BANANA()] });
      slots.push({ id: "pg", time: bTime, name: "Post-gym breakfast", tone: "turmeric",
        items: [POST_GYM()[0], ...bfast] });
    } else {
      slots.push({ id: "b", time: bTime, name: "Breakfast", tone: "turmeric", items: bfast });
    }

    slots.push({ id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
      RICE(1), { ...main.lunch },
      ...(main.key === "dal" ? [] : [I("Dal", 1, "katori", 140, 8, "🫘")]),
      { ...side }, CURD(),
    ]});

    if (profile.meals_per_day >= 5)
      slots.push({ id: "s", time: "16:30", name: "Evening snack", tone: "plum", items: snack });

    if (training && !morning) {
      if (profile.meals_per_day >= 4)
        slots.push({ id: "pre", time: toHM(gymStart - 60), name: "Pre-workout", tone: "indigo",
          items: [BANANA()] });
      slots.push({ id: "pg", time: toHM(gymStart + GYM_LENGTH + 15), name: "Post-gym",
        tone: "leaf", items: POST_GYM() });
    }

    const dinnerTime = training && !morning ? toHM(gymStart + GYM_LENGTH + 45) : "20:00";
    slots.push({ id: "d", time: dinnerTime, name: training ? "Dinner" : "Dinner, light",
      tone: "indigo", items: training
        ? [{ ...main2.dinner }, I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
           I("Phulka", 2, "phulka", 70, 3, "🫓"), BUTTERMILK()]
        // Rest day: no rice, no roti stack — the protein, vegetables and that is it.
        : [{ ...main2.dinner }, I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
           I("Kachumber salad", 1, "serving", 60, 2, "🥗", "veg", { fixed: true }), BUTTERMILK()],
    });

    let dayPlan: PlanDay = {
      label: DAY_NAMES[day],
      focus: training ? SPLIT_LABEL[split] : "Rest day",
      gym: training ? { from: toHM(gymStart), to: toHM(gymStart + GYM_LENGTH) } : null,
      slots,
    };

    // Diet, allergy and supplement swaps.
    dayPlan = {
      ...dayPlan,
      slots: dayPlan.slots.map((slot) => ({
        ...slot,
        items: slot.items.map((raw) => {
          let item = raw;
          if (banned.includes(item.tag)) item = applySwaps(item, VEG_FOR_MEAT);
          if (banned.includes(item.tag)) item = applySwaps(item, VEGAN_FOR_DAIRY_EGG);
          if (banned.includes(item.tag)) item = applySwaps(item, VEGAN_FOR_DAIRY_EGG);
          (profile.avoid ?? []).forEach((a) => { item = applySwaps(item, AVOID_SWAPS[a]); });
          if (!profile.uses_supplements) item = applySwaps(item, NO_SUPPLEMENT);
          return item;
        }),
      })),
    };

    /* Training days earn a little more, rest days a little less. Averaged over
       the week this still lands on their target. */
    const trainingCount = [0, 1, 2, 3, 4, 5, 6].filter((d) => isTrainingDay(profile, d)).length;
    const dayTarget = {
      ...target,
      kcal: Math.round(
        trainingCount === 0 || trainingCount === 7
          ? target.kcal
          : training
            ? target.kcal * (1 + 0.08 * (7 - trainingCount) / 7)
            : target.kcal * (1 - 0.08 * trainingCount / 7),
      ),
    };

    const f = factors(dayPlan, dayTarget);
    dayPlan = { ...dayPlan, slots: dayPlan.slots.map((s) => ({ ...s, items: scaleItems(s.items, f) })) };
    out[day] = settle(dayPlan, dayTarget);
  }

  return out;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
