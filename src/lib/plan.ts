import type { PlanDay, PlanItem, PlanSlot, FoodTag } from "./types";
import type { Avoid, Diet, GymWhen, Profile } from "./profile";
import { targetsFor } from "./profile";

/* ---------------------------------------------------------------------------
   The base menu: South Indian, non-vegetarian, written around an evening gym.
   Every portion carries its own per-unit calories, so the same menu can be
   scaled to anyone's target and swapped to any diet.
--------------------------------------------------------------------------- */

const I = (
  n: string, q: number, u: string, k: number, p: number, e: string,
  tag: FoodTag = "veg", extra: Partial<PlanItem> = {},
): PlanItem => ({ n, q, u, k, p, e, tag, ...extra });

const CHICKEN = (g: number) => I("Chicken curry", g, "g", 2.0, 0.25, "🍗", "meat");
const FISH    = (g: number) => I("Fish curry", g, "g", 1.67, 0.21, "🐟", "fish");
const RICE    = (q: number) => I("Rice + quinoa", q, "cup", 215, 6, "🍚");
const CURD    = () => I("Curd", 1, "cup", 100, 6, "🥛", "dairy");
const BUTTERMILK = () => I("Buttermilk", 1, "glass", 60, 3, "🥛", "dairy", { fixed: true });
const BANANA  = () => I("Banana", 1, "banana", 105, 1, "🍌", "veg", { fixed: true });
const TRAILMIX = () => I("Trail mix pack", 1, "pack", 140, 4, "🥜", "veg", { fixed: true });

const POST_GYM = (): PlanItem[] => [
  I("Whey shake", 1, "scoop", 120, 24, "🥤", "dairy", { fixed: true }),
  I("Greek yogurt", 1, "cup", 145, 25, "🥛", "dairy", { fixed: true, alt: true }),
  I("Boiled egg whites", 4, "white", 17, 3.5, "🥚", "egg", { fixed: true, alt: true }),
];

const SNACK = (first: PlanItem): PlanSlot => ({
  id: "s", time: "16:30", name: "Evening snack", tone: "plum",
  items: [first, TRAILMIX()],
});

const PRE = (): PlanSlot => ({
  id: "pre", time: "18:00", name: "Pre-workout", tone: "indigo", items: [BANANA()],
});

const PG = (): PlanSlot => ({
  id: "pg", time: "20:45", name: "Post-gym", tone: "leaf", items: POST_GYM(),
});

export const BASE_PLAN: Record<number, PlanDay> = {
  1: {
    label: "Monday", focus: "Chest + Back", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "07:30", name: "Breakfast", tone: "turmeric", items: [
        I("Idli", 2, "idli", 70, 2, "🍚"),
        I("Sambar", 1, "cup", 120, 6, "🥣"),
        I("Omelette", 2, "egg", 95, 7, "🍳", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1), CHICKEN(180),
        I("Dal", 1, "katori", 140, 8, "🫘"),
        I("Beans poriyal", 1, "serving", 80, 3, "🥬"),
        CURD(),
      ]},
      SNACK(BANANA()), PRE(), PG(),
      { id: "d", time: "21:15", name: "Dinner", tone: "indigo", items: [
        I("Grilled fish", 150, "g", 1.67, 0.22, "🐟", "fish"),
        I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
        RICE(0.5), BUTTERMILK(),
      ]},
    ],
  },
  2: {
    label: "Tuesday", focus: "Biceps + Triceps", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "07:30", name: "Breakfast", tone: "turmeric", items: [
        I("Pesarattu", 2, "pesarattu", 150, 6, "🫓"),
        I("Ginger chutney", 1, "serving", 60, 1, "🌶️", "veg", { fixed: true }),
        I("Boiled eggs", 2, "egg", 70, 6, "🥚", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1), FISH(180),
        I("Rasam", 1, "cup", 60, 2, "🍲", "veg", { fixed: true }),
        I("Cabbage fry", 1, "serving", 85, 3, "🥬"),
        CURD(),
      ]},
      SNACK(I("Apple", 1, "apple", 95, 0.5, "🍎", "veg", { fixed: true })), PRE(), PG(),
      { id: "d", time: "21:15", name: "Dinner", tone: "indigo", items: [
        I("Chicken tikka", 150, "g", 1.87, 0.27, "🍗", "meat"),
        I("Kachumber salad", 1, "serving", 60, 2, "🥗", "veg", { fixed: true }),
        I("Phulka", 2, "phulka", 70, 3, "🫓"),
        BUTTERMILK(),
      ]},
    ],
  },
  3: {
    label: "Wednesday", focus: "Legs + Abs", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "07:30", name: "Breakfast", tone: "turmeric", items: [
        I("Upma", 1.5, "cup", 220, 5, "🥣"),
        I("Boiled eggs", 2, "egg", 70, 6, "🥚", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1),
        I("Egg curry", 3, "egg", 110, 7, "🍛", "egg"),
        I("Dal", 1, "katori", 140, 8, "🫘"),
        I("Beetroot poriyal", 1, "serving", 90, 3, "🥬"),
        CURD(),
      ]},
      SNACK(I("Sprouts salad", 1, "cup", 120, 8, "🥗")), PRE(), PG(),
      { id: "d", time: "21:15", name: "Dinner", tone: "indigo", items: [
        I("Shrimp stir fry", 180, "g", 1.44, 0.21, "🦐", "fish"),
        I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
        I("Phulka", 1, "phulka", 70, 3, "🫓"),
        BUTTERMILK(),
      ]},
    ],
  },
  4: {
    label: "Thursday", focus: "Shoulders + Back", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "07:30", name: "Breakfast", tone: "turmeric", items: [
        I("Curd rice", 1, "bowl", 250, 7, "🍚", "dairy"),
        I("Boiled eggs", 2, "egg", 70, 6, "🥚", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1), CHICKEN(180),
        I("Gutti vankaya", 1, "serving", 190, 4, "🍆"),
        I("Rasam", 1, "cup", 60, 2, "🍲", "veg", { fixed: true }),
        CURD(),
      ]},
      SNACK(I("Apple", 1, "apple", 95, 0.5, "🍎", "veg", { fixed: true })), PRE(), PG(),
      { id: "d", time: "21:15", name: "Dinner", tone: "indigo", items: [
        I("Fish fry", 150, "g", 1.8, 0.22, "🐟", "fish"),
        I("Kachumber salad", 1, "serving", 60, 2, "🥗", "veg", { fixed: true }),
        I("Phulka", 2, "phulka", 70, 3, "🫓"),
        BUTTERMILK(),
      ]},
    ],
  },
  5: {
    label: "Friday", focus: "Full body + cardio", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "07:30", name: "Breakfast", tone: "turmeric", items: [
        I("Dosa", 1, "dosa", 150, 3, "🫓"),
        I("Omelette", 3, "egg", 95, 7, "🍳", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1), FISH(180),
        I("Dal", 1, "katori", 140, 8, "🫘"),
        I("Beans poriyal", 1, "serving", 80, 3, "🥬"),
        CURD(),
      ]},
      SNACK(BANANA()), PRE(), PG(),
      { id: "d", time: "21:15", name: "Dinner", tone: "indigo", items: [
        CHICKEN(150),
        I("Phulka", 2, "phulka", 70, 3, "🫓"),
        I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
        BUTTERMILK(),
      ]},
    ],
  },
  6: {
    label: "Saturday", focus: "Rest day", gym: null,
    slots: [
      { id: "b", time: "08:30", name: "Breakfast", tone: "turmeric", items: [
        I("Rava dosa", 2, "dosa", 160, 3.5, "🫓"),
        I("Coconut chutney", 1, "serving", 90, 2, "🥥", "veg", { fixed: true }),
        I("Boiled eggs", 2, "egg", 70, 6, "🥚", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1),
        I("Goat curry", 120, "g", 2.75, 0.23, "🍛", "meat"),
        I("Rasam", 1, "cup", 60, 2, "🍲", "veg", { fixed: true }),
        I("Veg fry", 1, "serving", 90, 3, "🥬"),
        CURD(),
      ]},
      SNACK(I("Fruit bowl", 1, "bowl", 120, 2, "🍉")),
      { id: "d", time: "20:00", name: "Dinner", tone: "indigo", items: [
        I("Fish fry", 150, "g", 1.8, 0.22, "🐟", "fish"),
        I("Kachumber salad", 1, "serving", 60, 2, "🥗", "veg", { fixed: true }),
        I("Phulka", 1, "phulka", 70, 3, "🫓"),
        BUTTERMILK(),
      ]},
    ],
  },
  0: {
    label: "Sunday", focus: "Optional gym", gym: { from: "19:00", to: "20:30" },
    slots: [
      { id: "b", time: "08:30", name: "Breakfast", tone: "turmeric", items: [
        I("Idiyappam", 3, "idiyappam", 95, 2, "🍜"),
        I("Egg curry", 2, "egg", 110, 7, "🍛", "egg"),
      ]},
      { id: "l", time: "13:00", name: "Lunch", tone: "leaf", items: [
        RICE(1),
        I("Chicken pepper fry", 150, "g", 2.0, 0.25, "🍗", "meat"),
        I("Dal", 1, "katori", 140, 8, "🫘"),
        I("Avial", 1, "cup", 120, 3, "🥥"),
        CURD(),
      ]},
      SNACK(BANANA()), PRE(), PG(),
      { id: "d", time: "20:30", name: "Dinner", tone: "indigo", items: [
        I("Grilled shrimp", 150, "g", 1.67, 0.22, "🦐", "fish"),
        I("Sautéed vegetables", 1, "serving", 90, 3, "🥦"),
        I("Phulka", 1, "phulka", 70, 3, "🫓"),
        BUTTERMILK(),
      ]},
    ],
  },
};

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

const roundQty = (q: number, unit: string) => {
  if (unit === "g") return Math.max(25, Math.round(q / 25) * 25);
  const countable = !["cup", "katori", "glass", "serving", "bowl", "scoop", "pack"].includes(unit);
  const step = countable ? 0.5 : 0.25;
  return Math.max(step, Math.round(q / step) * step);
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
  if (i.q === 1 && (i.u === "serving" || i.u === "bowl")) return i.n;
  const q = i.q % 1 ? i.q : Math.round(i.q);
  const unit = i.q <= 1 ? i.u : /(s|sh|ch|x)$/.test(i.u) ? `${i.u}es` : `${i.u}s`;
  return `${i.n}, ${q} ${unit}`;
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

/* ----------------------- gym timing rearrangement ----------------------- */

const GYM_HOURS: Record<Exclude<GymWhen, "none">, { from: string; to: string }> = {
  morning: { from: "08:00", to: "09:00" },
  evening: { from: "19:00", to: "20:30" },
};

function retime(day: PlanDay, gym: GymWhen): PlanDay {
  if (gym === "evening") return day;

  if (gym === "none") {
    // No gym: the pre-workout and post-gym slots have nothing to bracket.
    const slots = day.slots
      .filter((s) => s.id !== "pre" && s.id !== "pg")
      .map((s) => (s.id === "d" ? { ...s, time: "20:00" } : s));
    return { ...day, gym: null, slots };
  }

  // Morning gym: train first, then breakfast becomes the post-gym meal.
  const breakfast = day.slots.find((s) => s.id === "b");
  const post = day.slots.find((s) => s.id === "pg");
  const slots: PlanSlot[] = [];

  slots.push({ id: "pre", time: "07:15", name: "Pre-workout", tone: "indigo",
    items: [I("Banana", 1, "banana", 105, 1, "🍌", "veg", { fixed: true })] });

  slots.push({
    id: "pg", time: "09:15", name: "Post-gym breakfast", tone: "turmeric",
    items: [...(post?.items ?? []).slice(0, 1), ...(breakfast?.items ?? [])],
  });

  day.slots.forEach((s) => {
    if (s.id === "b" || s.id === "pre" || s.id === "pg") return;
    slots.push(s.id === "d" ? { ...s, time: "20:00" } : s);
  });

  return { ...day, gym: GYM_HOURS.morning, slots };
}

/* ------------------------------ the builder ------------------------------ */

/**
 * Turn the base menu into this person's plan: their cuisine, their diet,
 * their gym timing, and portions scaled to the calories their profile works
 * out to. Nothing here touches the food catalogue — they can still log
 * anything they like on top.
 */
export function buildPlan(profile: Profile): Record<number, PlanDay> {
  const target = targetsFor(profile);
  const banned = BANNED[profile.diet];
  const out: Record<number, PlanDay> = {};

  for (const key of [0, 1, 2, 3, 4, 5, 6]) {
    let day = BASE_PLAN[key];

    day = {
      ...day,
      slots: day.slots.map((slot) => ({
        ...slot,
        items: slot.items.map((raw) => {
          let item = raw;
          if (profile.cuisine === "north") item = applySwaps(item, NORTH_FOR_SOUTH);
          if (banned.includes(item.tag)) item = applySwaps(item, VEG_FOR_MEAT);
          if (banned.includes(item.tag)) item = applySwaps(item, VEGAN_FOR_DAIRY_EGG);
          if (banned.includes(item.tag)) item = applySwaps(item, VEGAN_FOR_DAIRY_EGG);
          profile.avoid.forEach((a) => { item = applySwaps(item, AVOID_SWAPS[a]); });
          if (!profile.uses_supplements) item = applySwaps(item, NO_SUPPLEMENT);
          return item;
        }),
      })),
    };

    // Fewer meals: fold the snack, and the pre-workout, back into the big ones.
    // This happens BEFORE scaling, or dropping a slot would drop its calories too.
    if (profile.meals_per_day <= 4) day = { ...day, slots: day.slots.filter((s) => s.id !== "s") };
    if (profile.meals_per_day <= 3) day = { ...day, slots: day.slots.filter((s) => s.id !== "pre") };

    const f = factors(day, target);
    day = { ...day, slots: day.slots.map((s) => ({ ...s, items: scaleItems(s.items, f) })) };
    day = settle(day, target);

    out[key] = retime(day, profile.gym_when);
  }

  return out;
}

/** The author's own plan, for anyone who has not filled in a profile yet. */
export const PLAN = BASE_PLAN;
