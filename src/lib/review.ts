import type { Entry, WeighIn } from "./types";
import { dayKey, shiftKey, totalsFor } from "./day";
import { showWeight, type Profile } from "./profile";

export type Review = {
  days: number;               // days with anything logged, out of 7
  kcal: number;               // average across the days logged
  protein: number;
  weightChange: number | null; // lb, negative is down
  headline: string;
  advice: string;
  tone: "good" | "warn" | "info";
};

/**
 * One week, one adjustment. The point is not to show more numbers — it is to
 * say the single most useful thing the week's data supports.
 */
export function weeklyReview(
  entries: Entry[],
  weighIns: WeighIn[],
  profile: Profile,
  target: { kcal: number; protein: number },
): Review {
  const today = dayKey(new Date());
  const week: string[] = [];
  for (let i = 6; i >= 0; i--) week.push(shiftKey(today, -i));

  const byDay = week.map((k) => totalsFor(entries.filter((e) => e.eaten_on === k)));
  const logged = byDay.filter((d) => d.kcal > 0);
  const days = logged.length;
  const kcal = days ? Math.round(logged.reduce((a, d) => a + d.kcal, 0) / days) : 0;
  const protein = days ? Math.round(logged.reduce((a, d) => a + d.protein, 0) / days) : 0;

  // Weight: this week's last reading against the one closest to a fortnight ago.
  const sorted = [...weighIns].sort((a, b) => a.measured_on.localeCompare(b.measured_on));
  const recent = sorted.filter((w) => w.measured_on >= shiftKey(today, -9));
  const older = sorted.filter((w) => w.measured_on < shiftKey(today, -9));
  const weightChange =
    recent.length && older.length
      ? Math.round((Number(recent[recent.length - 1].lb) - Number(older[older.length - 1].lb)) * 10) / 10
      : null;

  const losing = profile.goal !== "gain";
  const unit = profile.units;

  if (days === 0)
    return {
      days, kcal, protein, weightChange, tone: "info",
      headline: "Nothing logged this week",
      advice:
        "The plan cannot tell you anything until there is something to read. Tick off one meal today and it starts working.",
    };

  if (days < 4)
    return {
      days, kcal, protein, weightChange, tone: "warn",
      headline: `Only ${days} day${days === 1 ? "" : "s"} logged`,
      advice:
        "An average of three days is not an average. Aim for five — the gaps are usually the days that matter most.",
    };

  if (protein < target.protein * 0.88) {
    const short = target.protein - protein;
    return {
      days, kcal, protein, weightChange, tone: "warn",
      headline: `Protein is ${short}g short`,
      advice:
        `You averaged ${protein}g against ${target.protein}g. That is the gap that decides whether you lose fat or muscle. ` +
        `A cup of Greek yogurt or a whey shake closes most of it — add one to your afternoon.`,
    };
  }

  if (kcal > target.kcal + 180)
    return {
      days, kcal, protein, weightChange, tone: "warn",
      headline: `${kcal - target.kcal} calories a day over`,
      advice:
        `You averaged ${kcal.toLocaleString()} against ${target.kcal.toLocaleString()}. ` +
        "Half the rice at lunch, or one fewer roti at dinner, is about that much. Change one thing, not five.",
    };

  if (kcal < target.kcal - 300)
    return {
      days, kcal, protein, weightChange, tone: "warn",
      headline: `${target.kcal - kcal} calories a day under`,
      advice:
        "Eating well below the target does not speed anything up — it costs you muscle and makes the week harder than it needs to be. Add a snack back in.",
    };

  if (weightChange != null && losing && weightChange > -0.3 && weightChange < 0.6)
    return {
      days, kcal, protein, weightChange, tone: "info",
      headline: "The scale has stalled",
      advice:
        "Calories and protein are where they should be, but the weight has not moved in a fortnight. " +
        "Trim about 150 calories, or add a 20-minute walk on the days you do not train. Give it two weeks before changing anything else.",
    };

  if (weightChange != null && losing && weightChange < -2.5)
    return {
      days, kcal, protein, weightChange, tone: "warn",
      headline: `Down ${showWeight(Math.abs(weightChange), unit)} in two weeks`,
      advice:
        "That is faster than the plan intends, and past about 1.5 a week the difference comes off as muscle. Eat a bit more.",
    };

  return {
    days, kcal, protein, weightChange, tone: "good",
    headline: "On track",
    advice:
      `${days} days logged, ${kcal.toLocaleString()} calories and ${protein}g protein a day — both where they should be. ` +
      "Nothing to change. Do the same next week.",
  };
}
