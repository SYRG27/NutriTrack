export type Sex = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "very";
export type Goal = "lose" | "maintain" | "gain";
export type Diet = "nonveg" | "egg" | "veg" | "vegan";
export type GymWhen = "morning" | "evening" | "none";
export type Cuisine = "south" | "north";
export type Units = "lb" | "kg";
/** Things to keep out of the plan entirely, beyond the diet choice. */
export type Avoid = "dairy" | "nuts" | "gluten" | "seafood" | "beef" | "pork" | "onion_garlic";

export type Profile = {
  user_id?: string;
  name: string;
  sex: Sex;
  age: number;
  height_cm: number;
  weight_lb: number;
  goal_weight_lb: number;
  activity: Activity;
  goal: Goal;
  diet: Diet;
  gym_when: GymWhen;
  gym_days: number;
  cuisine: Cuisine;
  target_weeks: number;   // how long they want to take
  units: Units;           // what the scale in their bathroom reads
  meals_per_day: number;  // 3 = no snacks, 4 = plus a snack, 5 = every slot
  avoid: Avoid[];         // allergies and things they will not eat
  uses_supplements: boolean; // false = whole-food protein instead of shakes
};

/** Neutral stand-in, used only where a Profile is needed before one exists
 *  (tests, previews). The questionnaire starts empty — nothing here is
 *  shown to anyone as a default. */
export const BLANK_PROFILE: Profile = {
  name: "", sex: "male", age: 30, height_cm: 175, weight_lb: 170,
  goal_weight_lb: 160, activity: "moderate", goal: "lose",
  diet: "nonveg", gym_when: "evening", gym_days: 4, cuisine: "south",
  target_weeks: 20, units: "lb", meals_per_day: 5,
  avoid: [], uses_supplements: true,
};

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,   // desk job, little movement
  light: 1.375,     // light exercise 1-3 days
  moderate: 1.55,   // training 3-5 days
  very: 1.725,      // training 6-7 days or physical job
};

export const LB_PER_KG = 2.20462;
export const toKg = (lb: number) => lb / LB_PER_KG;

/** Mifflin-St Jeor — the standard clinical estimate of resting burn. */
export function bmrFor(p: Profile) {
  const kg = toKg(p.weight_lb);
  return 10 * kg + 6.25 * p.height_cm - 5 * p.age + (p.sex === "male" ? 5 : -161);
}

export function tdeeFor(p: Profile) {
  return bmrFor(p) * ACTIVITY_FACTOR[p.activity];
}

/* A pound of bodyweight is about 3,500 kcal, so 1 lb a week is a 500 kcal
   daily gap. These are the rates that keep muscle on: faster than 1.5 lb a
   week of loss costs muscle, and faster than 0.75 lb a week of gain is
   mostly fat. */
const SAFE_RATE = {
  lose: { min: 0.25, max: 1.5 },
  gain: { min: 0.15, max: 0.75 },
};

/**
 * What the person asked for, and what is actually achievable. `capped` is
 * true when their timeline needed a faster rate than is healthy — the plan
 * uses the safe rate and reports the honest finish date instead.
 */
export function paceFor(p: Profile) {
  const gap = Math.abs(p.weight_lb - p.goal_weight_lb);
  const dir: "lose" | "gain" = p.weight_lb >= p.goal_weight_lb ? "lose" : "gain";

  if (p.goal === "maintain" || gap < 1)
    return { dir, gap: 0, wanted: 0, rate: 0, capped: false, weeks: 0 };

  const weeks = Math.max(1, p.target_weeks);
  const wanted = gap / weeks;
  const { min, max } = SAFE_RATE[dir];
  const rate = Math.min(max, Math.max(min, wanted));
  return {
    dir, gap, wanted, rate,
    capped: wanted > max + 0.001,
    weeks: Math.ceil(gap / rate),
  };
}

/**
 * Daily targets, derived from their own timeline rather than a fixed guess.
 * Calories never drop below 1.1x resting burn — past that you lose muscle
 * with the fat however fast the scale moves. Protein is per kg of
 * bodyweight, highest while cutting, because that is what protects muscle
 * in a deficit.
 */
export function targetsFor(p: Profile) {
  const bmr = bmrFor(p);
  const tdee = tdeeFor(p);
  const pace = paceFor(p);
  const daily = pace.rate * 500;                       // 500 kcal a day per lb a week
  const raw =
    p.goal === "maintain" ? tdee : pace.dir === "lose" ? tdee - daily : tdee + daily;
  const kcal = Math.round(Math.max(raw, bmr * 1.1) / 10) * 10;
  const kg = toKg(p.weight_lb);
  const protein = Math.round(
    kg * (p.goal === "lose" ? 2.0 : p.goal === "gain" ? 1.8 : 1.6),
  );
  return { kcal, protein, bmr: Math.round(bmr), tdee: Math.round(tdee), pace };
}

export const KG_PER_LB = 0.453592;
export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
/** Show a weight in whichever unit they told us their scale reads. */
export const showWeight = (lb: number, units: Units) =>
  units === "kg" ? `${(lb * KG_PER_LB).toFixed(1)} kg` : `${Math.round(lb * 10) / 10} lb`;

export const cmToFtIn = (cm: number) => {
  const total = Math.round(cm / 2.54);
  return { ft: Math.floor(total / 12), inch: total % 12 };
};
export const ftInToCm = (ft: number, inch: number) =>
  Math.round((ft * 12 + inch) * 2.54);
