import { isTrainingDay, toKg, type Profile } from "./profile";

export const GLASS_ML = 250;
const ML_PER_OZ = 29.5735;

/**
 * About 35 ml per kg of bodyweight, plus half a litre on a day you train and
 * sweat. Rounded to a whole glass, because that is how anyone actually counts.
 */
export function waterTarget(profile: Profile, dayIndex: number) {
  const base = toKg(profile.weight_lb) * 35;
  const training = isTrainingDay(profile, dayIndex) ? 500 : 0;
  const ml = Math.round((base + training) / GLASS_ML) * GLASS_ML;
  return { ml, glasses: Math.round(ml / GLASS_ML) };
}

/** Their scale reads pounds, so show ounces; kilos, so show litres. */
export function showVolume(ml: number, units: "lb" | "kg") {
  if (units === "kg") {
    const l = ml / 1000;
    return `${l % 1 === 0 ? l : l.toFixed(2).replace(/0$/, "")} L`;
  }
  return `${Math.round(ml / ML_PER_OZ)} oz`;
}
