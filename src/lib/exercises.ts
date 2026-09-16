export type Group =
  | "chest" | "back" | "shoulders" | "biceps" | "triceps"
  | "legs" | "glutes" | "abs" | "cardio";

export type Equipment =
  | "machine" | "cable" | "barbell" | "dumbbell" | "bodyweight" | "smith" | "cardio";

export type Level = "beginner" | "intermediate";

export type Exercise = {
  id: string;
  name: string;
  group: Group;
  also?: Group[];
  equipment: Equipment;
  level: Level;
  sets: string;
  /** Two to four steps. Enough to do it right without a video. */
  how: string[];
  /** The mistake most people make on this one. */
  watch: string;
};

export const GROUP_LABEL: Record<Group, string> = {
  chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Biceps",
  triceps: "Triceps", legs: "Legs", glutes: "Glutes", abs: "Abs & core",
  cardio: "Cardio",
};

export const GROUP_EMOJI: Record<Group, string> = {
  chest: "🫁", back: "🔙", shoulders: "🎯", biceps: "💪", triceps: "🔨",
  legs: "🦵", glutes: "🍑", abs: "🎽", cardio: "🏃",
};

export const EQUIP_LABEL: Record<Equipment, string> = {
  machine: "Machine", cable: "Cable", barbell: "Barbell", dumbbell: "Dumbbells",
  bodyweight: "Bodyweight", smith: "Smith machine", cardio: "Cardio machine",
};

const E = (
  id: string, name: string, group: Group, equipment: Equipment, level: Level,
  sets: string, how: string[], watch: string, also?: Group[],
): Exercise => ({ id, name, group, equipment, level, sets, how, watch, also });

export const EXERCISES: Exercise[] = [
  /* ------------------------------- CHEST ------------------------------- */
  E("chest-press-machine", "Chest press machine", "chest", "machine", "beginner", "3 × 10–12", [
    "Set the seat so the handles sit level with the middle of your chest.",
    "Sit back with your shoulder blades pinned against the pad, feet flat.",
    "Push the handles away until your arms are nearly straight, then lower slowly for three seconds.",
  ], "Don't let the handles slam back — the slow lowering is where the muscle is built.", ["triceps", "shoulders"]),

  E("pec-deck", "Pec deck / chest fly machine", "chest", "machine", "beginner", "3 × 12–15", [
    "Set the handles so your arms open just past your shoulders, no further.",
    "Keep a soft bend in your elbows and squeeze the handles together in front of your chest.",
    "Hold the squeeze for a second, then open slowly.",
  ], "Going too far back at the start is how shoulders get hurt. Stop when you feel the stretch."),

  E("incline-db-press", "Incline dumbbell press", "chest", "dumbbell", "beginner", "3 × 8–12", [
    "Set the bench to about 30 degrees — any steeper and it becomes a shoulder exercise.",
    "Start with the dumbbells at chest level, elbows at roughly 45 degrees from your body.",
    "Press up and slightly together, then lower under control until you feel the stretch.",
  ], "Flaring your elbows straight out to the sides. Tuck them in a little.", ["shoulders", "triceps"]),

  E("flat-db-press", "Flat dumbbell press", "chest", "dumbbell", "beginner", "3 × 8–12", [
    "Lie flat, dumbbells at chest height, wrists stacked over elbows.",
    "Press up until your arms are almost straight — don't lock out hard.",
    "Lower slowly until your upper arms are level with the bench.",
  ], "Bouncing the weight off your chest. Control it all the way down.", ["triceps"]),

  E("bench-press", "Barbell bench press", "chest", "barbell", "intermediate", "4 × 6–10", [
    "Lie with your eyes under the bar, feet planted, shoulder blades squeezed together.",
    "Unrack, lower the bar to the middle of your chest with elbows tucked to about 45 degrees.",
    "Press back up in a straight line. Use a spotter or the safety pins.",
  ], "Never bench heavy without a spotter or safety bars. This is the lift people get pinned under.", ["triceps", "shoulders"]),

  E("cable-crossover", "Cable crossover", "chest", "cable", "beginner", "3 × 12–15", [
    "Set both pulleys above head height and take a handle in each hand.",
    "Step forward into a small split stance, chest up, slight bend in the elbows.",
    "Bring your hands down and together in front of your hips, squeeze, return slowly.",
  ], "Using so much weight that you lean into it. If your body swings, drop the weight."),

  E("pushup", "Push-up", "chest", "bodyweight", "beginner", "3 × as many as you can", [
    "Hands slightly wider than your shoulders, body in one straight line from head to heels.",
    "Lower until your chest is a fist's height from the floor, elbows tucked.",
    "Push back up without letting your hips sag.",
    "Too hard? Do them with your hands on a bench until you can do ten on the floor.",
  ], "Hips sagging or sticking up. Squeeze your glutes and brace your stomach.", ["triceps", "abs"]),

  /* -------------------------------- BACK -------------------------------- */
  E("lat-pulldown", "Lat pulldown", "back", "machine", "beginner", "3 × 10–12", [
    "Set the thigh pad so your legs are locked down and you can't lift off the seat.",
    "Grip the bar a bit wider than your shoulders, lean back very slightly.",
    "Pull the bar to your upper chest by driving your elbows down, then let it rise slowly.",
  ], "Pulling with your arms. Think about driving your elbows to your back pockets.", ["biceps"]),

  E("seated-row", "Seated cable row", "back", "cable", "beginner", "3 × 10–12", [
    "Sit tall with a slight bend in your knees, chest up.",
    "Pull the handle to your stomach, squeezing your shoulder blades together.",
    "Let it stretch forward slowly without rounding your lower back.",
  ], "Rocking backwards and forwards. Your torso should barely move.", ["biceps"]),

  E("chest-supported-row", "Chest-supported row machine", "back", "machine", "beginner", "3 × 10–12", [
    "Lie face down on the pad so your chest is supported and your feet are planted.",
    "Pull the handles back, elbows close to your body, squeezing the shoulder blades.",
    "Lower under control until your arms are straight.",
  ], "This one is great for beginners precisely because the pad stops you cheating. Don't lift off it.", ["biceps"]),

  E("one-arm-db-row", "One-arm dumbbell row", "back", "dumbbell", "beginner", "3 × 10 each side", [
    "Put one knee and one hand on a bench, back flat and parallel to the floor.",
    "Let the dumbbell hang, then pull it to your hip, elbow brushing your side.",
    "Lower it all the way down for a full stretch.",
  ], "Twisting your torso to get the weight up. Keep your shoulders square.", ["biceps"]),

  E("lat-pullover", "Cable lat pullover", "back", "cable", "intermediate", "3 × 12–15", [
    "Set the pulley high, hold a straight bar with arms almost straight.",
    "Step back, hinge forward slightly, and pull the bar down to your thighs using your lats only.",
    "Let it rise back up slowly.",
  ], "Bending your elbows turns it into a triceps exercise. Keep them almost locked."),

  E("pullup", "Pull-up / assisted pull-up", "back", "bodyweight", "intermediate", "3 × as many as you can", [
    "Hang from the bar with hands slightly wider than your shoulders.",
    "Pull your chest to the bar by driving your elbows down and back.",
    "Lower all the way until your arms are straight.",
    "Use the assisted pull-up machine or a band until you can do five clean ones.",
  ], "Half reps. A pull-up only counts from a dead hang.", ["biceps"]),

  E("face-pull", "Face pull", "back", "cable", "beginner", "3 × 15", [
    "Set a rope at about face height and hold it with thumbs pointing back.",
    "Pull the rope towards your forehead, spreading your hands apart.",
    "Squeeze the back of your shoulders for a second, then return slowly.",
  ], "This is the one that keeps your shoulders healthy. Light weight, high reps, every week.", ["shoulders"]),

  E("deadlift", "Barbell deadlift", "back", "barbell", "intermediate", "3 × 5–8", [
    "Bar over the middle of your feet, shins almost touching it.",
    "Hinge at the hips, flat back, grip just outside your knees.",
    "Push the floor away and stand up, keeping the bar against your legs.",
    "Learn this with light weight — form matters more here than on anything else.",
  ], "Rounding your lower back. If it rounds, the weight is too heavy. Full stop.", ["legs", "glutes"]),

  /* ----------------------------- SHOULDERS ------------------------------ */
  E("shoulder-press-machine", "Shoulder press machine", "shoulders", "machine", "beginner", "3 × 10–12", [
    "Set the seat so the handles start at about ear height.",
    "Press straight up until your arms are nearly extended.",
    "Lower slowly until your elbows are level with your shoulders.",
  ], "Dropping your elbows below shoulder level. That's a stretch, not a rep.", ["triceps"]),

  E("db-shoulder-press", "Dumbbell shoulder press", "shoulders", "dumbbell", "beginner", "3 × 8–12", [
    "Sit on an upright bench, dumbbells at ear height, palms facing forward.",
    "Press up until your arms are almost straight, without banging the weights together.",
    "Lower under control.",
  ], "Arching your lower back to push the weight up. Brace your stomach.", ["triceps"]),

  E("lateral-raise", "Dumbbell lateral raise", "shoulders", "dumbbell", "beginner", "3 × 12–15", [
    "Stand with light dumbbells at your sides, slight bend in the elbows.",
    "Raise them out to the sides until your hands are level with your shoulders.",
    "Lower slowly. Count three seconds down.",
  ], "Going too heavy and swinging. This is the exercise where 5 kg done properly beats 12 kg swung."),

  E("rear-delt-fly", "Rear delt fly", "shoulders", "machine", "beginner", "3 × 12–15", [
    "Sit facing the pad on the pec deck with the handles set to the front.",
    "Keep a soft elbow bend and pull the handles out and back.",
    "Squeeze the back of your shoulders, then return slowly.",
  ], "Most people's rear delts are the weak link. Train them every shoulder day.", ["back"]),

  E("front-raise", "Front raise", "shoulders", "dumbbell", "beginner", "3 × 12", [
    "Hold dumbbells in front of your thighs, palms facing your legs.",
    "Raise one arm straight in front of you to shoulder height.",
    "Lower slowly and alternate.",
  ], "Swinging from the hips. If you have to lean back, it's too heavy."),

  E("overhead-press", "Barbell overhead press", "shoulders", "barbell", "intermediate", "4 × 6–8", [
    "Bar on your front shoulders, hands just outside shoulder width, elbows under the bar.",
    "Brace your stomach and glutes, press the bar straight overhead, moving your head back slightly.",
    "Lock out with the bar over the middle of your feet, then lower to your shoulders.",
  ], "Leaning back to turn it into an incline press. Squeeze your glutes to stay upright.", ["triceps"]),

  /* ------------------------------ BICEPS -------------------------------- */
  E("db-curl", "Dumbbell curl", "biceps", "dumbbell", "beginner", "3 × 10–12", [
    "Stand tall, dumbbells at your sides, palms forward.",
    "Curl up without letting your elbows drift forward.",
    "Lower all the way down — the bottom half of the rep is the part people skip.",
  ], "Swinging the weight up with your back. Keep your elbows pinned to your ribs."),

  E("hammer-curl", "Hammer curl", "biceps", "dumbbell", "beginner", "3 × 10–12", [
    "Same as a curl, but hold the dumbbells with your palms facing each other, like a hammer.",
    "Curl up to your shoulder, keeping your wrist straight.",
    "Lower slowly.",
  ], "This one builds the thickness on the outside of the arm. Don't skip it."),

  E("preacher-curl", "Preacher curl machine", "biceps", "machine", "beginner", "3 × 10–12", [
    "Set the seat so your armpits rest on the top of the pad.",
    "Curl the handles up, stopping just short of the top so tension stays on.",
    "Lower until your arms are nearly straight.",
  ], "Letting your arms snap straight at the bottom. That's how biceps tears happen."),

  E("cable-curl", "Cable curl", "biceps", "cable", "beginner", "3 × 12", [
    "Set the pulley at the bottom, stand a step back from the machine.",
    "Curl the bar up with your elbows fixed at your sides.",
    "Lower slowly against the cable's pull.",
  ], "The cable keeps tension the whole way, so you can go lighter than with dumbbells."),

  E("barbell-curl", "Barbell curl", "biceps", "barbell", "beginner", "3 × 8–12", [
    "Hold the bar shoulder-width, arms straight, standing tall.",
    "Curl to chest height, elbows still.",
    "Lower over three seconds.",
  ], "Using your whole body. If your knees bend, the weight is too heavy."),

  /* ------------------------------ TRICEPS ------------------------------- */
  E("rope-pushdown", "Rope pushdown", "triceps", "cable", "beginner", "3 × 12–15", [
    "Set the rope high, elbows tucked against your sides.",
    "Push down and spread the rope apart at the bottom.",
    "Let it come back up only until your forearms are parallel to the floor.",
  ], "Elbows drifting away from your body turns this into a chest exercise."),

  E("overhead-tricep-ext", "Overhead triceps extension", "triceps", "dumbbell", "beginner", "3 × 10–12", [
    "Hold one dumbbell with both hands, arms straight overhead.",
    "Bend at the elbows to lower it behind your head, keeping your upper arms still.",
    "Press back up.",
  ], "Elbows flaring out wide. Keep them pointing at the ceiling."),

  E("tricep-dip-machine", "Triceps dip machine", "triceps", "machine", "beginner", "3 × 10–12", [
    "Sit with your back flat against the pad, hands on the handles.",
    "Press down until your arms are straight.",
    "Return slowly until your elbows are at about 90 degrees.",
  ], "Leaning forward. Stay upright and let the triceps do the work."),

  E("close-grip-bench", "Close-grip bench press", "triceps", "barbell", "intermediate", "3 × 8–10", [
    "Lie on a bench and grip the bar about shoulder-width, no narrower.",
    "Lower to your lower chest with elbows tucked tight to your body.",
    "Press straight up.",
  ], "Gripping too narrow hurts the wrists. Shoulder-width is close enough.", ["chest"]),

  E("bench-dip", "Bench dip", "triceps", "bodyweight", "beginner", "3 × 10–15", [
    "Hands on a bench behind you, legs out in front, heels on the floor.",
    "Lower until your elbows are at 90 degrees, keeping your back close to the bench.",
    "Press back up.",
  ], "Going too deep. Stop at 90 degrees — deeper is hard on the shoulder."),

  /* -------------------------------- LEGS -------------------------------- */
  E("leg-press", "Leg press", "legs", "machine", "beginner", "3 × 10–12", [
    "Feet shoulder-width on the middle of the platform, toes slightly out.",
    "Lower until your knees are at about 90 degrees — no further.",
    "Press back up without locking your knees at the top.",
  ], "Letting your lower back lift off the seat at the bottom. That's the range limit.", ["glutes"]),

  E("goblet-squat", "Goblet squat", "legs", "dumbbell", "beginner", "3 × 10–12", [
    "Hold one dumbbell against your chest with both hands.",
    "Feet shoulder-width, toes slightly out, chest up.",
    "Sit down between your heels until your thighs are about parallel, then stand up.",
  ], "The best squat to learn on — the weight in front keeps you upright automatically.", ["glutes"]),

  E("barbell-squat", "Barbell back squat", "legs", "barbell", "intermediate", "4 × 6–10", [
    "Bar on your upper back, not your neck. Feet shoulder-width, toes slightly out.",
    "Brace your stomach, sit down and back until your thighs are parallel or lower.",
    "Drive up through the middle of your foot.",
    "Always use the safety pins in the rack.",
  ], "Knees caving inwards. Push them out over your toes as you stand.", ["glutes", "abs"]),

  E("leg-extension", "Leg extension", "legs", "machine", "beginner", "3 × 12–15", [
    "Set the pad just above your ankles, back against the seat.",
    "Straighten your legs, squeeze at the top for a second.",
    "Lower slowly.",
  ], "Swinging the weight up with a kick. Slow and controlled."),

  E("leg-curl", "Lying or seated leg curl", "legs", "machine", "beginner", "3 × 12–15", [
    "Set the pad just above your heels.",
    "Curl your heels towards your backside as far as they go.",
    "Lower slowly to a full stretch.",
  ], "Hamstrings are half your leg and most beginners ignore them. Never skip this."),

  E("romanian-deadlift", "Romanian deadlift", "legs", "dumbbell", "beginner", "3 × 10–12", [
    "Hold dumbbells in front of your thighs, knees slightly bent and staying that way.",
    "Push your hips back and let the weights slide down your legs until you feel the stretch in your hamstrings.",
    "Squeeze your glutes to stand back up.",
  ], "Bending your knees more as you go down. It's a hip movement, not a squat.", ["glutes", "back"]),

  E("walking-lunge", "Walking lunge", "legs", "dumbbell", "beginner", "3 × 10 each leg", [
    "Dumbbells at your sides, chest up.",
    "Step forward and lower until both knees are at about 90 degrees.",
    "Push through the front heel to stand and step through with the other leg.",
  ], "Tiny steps. Step far enough that your front shin stays vertical.", ["glutes"]),

  E("calf-raise", "Calf raise", "legs", "machine", "beginner", "3 × 15–20", [
    "Balls of your feet on the platform, heels hanging off.",
    "Rise onto your toes as high as you can and hold for a second.",
    "Lower until you feel a deep stretch.",
  ], "Bouncing. Calves need the pause at the top and the stretch at the bottom."),

  /* ------------------------------- GLUTES ------------------------------- */
  E("hip-thrust", "Barbell hip thrust", "glutes", "barbell", "beginner", "3 × 10–12", [
    "Upper back against a bench, bar across your hips with a pad.",
    "Drive through your heels until your hips are level with your knees.",
    "Squeeze hard at the top for a second, then lower.",
  ], "Arching your lower back at the top instead of squeezing the glutes. Tuck your chin.", ["legs"]),

  E("glute-bridge", "Glute bridge", "glutes", "bodyweight", "beginner", "3 × 15", [
    "Lie on your back, knees bent, feet flat and close to your backside.",
    "Push your hips up until your body is a straight line from knees to shoulders.",
    "Squeeze and lower.",
  ], "A good warm-up before any leg day."),

  E("cable-kickback", "Cable glute kickback", "glutes", "cable", "beginner", "3 × 12 each side", [
    "Ankle strap on the low pulley, face the machine and hold on.",
    "Kick the working leg straight back, squeezing the glute.",
    "Return slowly without letting the weight touch down.",
  ], "Arching your back to get more range. Keep your torso still."),

  /* -------------------------------- ABS --------------------------------- */
  E("plank", "Plank", "abs", "bodyweight", "beginner", "3 × 30–60 seconds", [
    "Forearms on the floor under your shoulders, body in a straight line.",
    "Squeeze your glutes and pull your belly button in.",
    "Breathe normally and hold.",
  ], "Hips sagging or sticking up. If your form breaks, the set is over."),

  E("hanging-knee-raise", "Hanging knee raise", "abs", "bodyweight", "beginner", "3 × 10–15", [
    "Hang from a bar or use the captain's chair with your back on the pad.",
    "Pull your knees up towards your chest, curling your hips slightly.",
    "Lower slowly without swinging.",
  ], "Swinging. If you're using momentum, do it on the captain's chair instead."),

  E("cable-crunch", "Cable crunch", "abs", "cable", "beginner", "3 × 15", [
    "Kneel facing a high pulley, rope held at the sides of your head.",
    "Crunch down by curling your ribs towards your hips.",
    "Return slowly.",
  ], "Pulling with your arms. Your hands shouldn't move relative to your head."),

  E("bicycle-crunch", "Bicycle crunch", "abs", "bodyweight", "beginner", "3 × 20", [
    "Lie on your back, hands lightly behind your head, legs up.",
    "Bring one knee in and turn your opposite shoulder towards it.",
    "Alternate slowly, keeping your lower back on the floor.",
  ], "Yanking on your neck. Fingertips only behind your head."),

  E("dead-bug", "Dead bug", "abs", "bodyweight", "beginner", "3 × 10 each side", [
    "Lie on your back, arms straight up, knees bent at 90 degrees above your hips.",
    "Lower one arm behind your head and the opposite leg towards the floor.",
    "Return and swap. Keep your lower back pressed into the floor the whole time.",
  ], "The safest core exercise there is, and one of the best. Slow is the point."),

  /* ------------------------------- CARDIO ------------------------------- */
  E("incline-walk", "Incline treadmill walk", "cardio", "cardio", "beginner", "20–30 min", [
    "Set the incline to 8–12% and the speed to a brisk walk you can hold.",
    "Don't hold the handrails — that's what makes it feel easy and burn nothing.",
    "You should be able to talk but not sing.",
  ], "This is the best fat-loss cardio for someone lifting: high burn, no interference with leg day."),

  E("stationary-bike", "Stationary bike", "cardio", "cardio", "beginner", "20–30 min", [
    "Set the seat so your leg is almost straight at the bottom of the pedal stroke.",
    "Hold a steady resistance where your breathing is up but conversational.",
  ], "Sitting too low. It wrecks your knees over time."),

  E("elliptical", "Elliptical", "cardio", "cardio", "beginner", "20–30 min", [
    "Use the moving handles so it's not just your legs.",
    "Keep a steady pace for the whole block.",
  ], "Easiest on the joints of any machine — good if your knees complain."),

  E("stairmaster", "Stairmaster", "cardio", "cardio", "intermediate", "15–20 min", [
    "Stand upright, light touch on the rails for balance only.",
    "Take full steps rather than short shuffles.",
  ], "Leaning on the rails. It cuts the work roughly in half."),

  E("rowing-machine", "Rowing machine", "cardio", "cardio", "beginner", "15–20 min", [
    "Drive with your legs first, then lean back, then pull the handle to your ribs.",
    "Reverse it: arms out, lean forward, then bend the knees.",
  ], "Pulling with the arms first. It's legs, back, arms — in that order.", ["back"]),
];

/* --------------------------- putting a day together --------------------------- */

/** Which muscles each training split covers. */
export const SPLIT_GROUPS: Record<string, Group[]> = {
  chest_back: ["chest", "back"],
  arms: ["biceps", "triceps"],
  legs: ["legs", "glutes", "abs"],
  shoulders: ["shoulders", "back"],
  push: ["chest", "shoulders", "triceps"],
  pull: ["back", "biceps"],
  full_body: ["legs", "chest", "back", "shoulders"],
  cardio: ["cardio", "abs"],
  core: ["abs", "cardio"],
  rest: [],
};

export const byGroup = (g: Group) => EXERCISES.filter((e) => e.group === g);

/**
 * A session for the day: a couple of exercises per muscle the split covers,
 * easiest first, so a beginner can start at the top and work down.
 */
export function sessionFor(split: string, level: Level = "beginner"): Exercise[] {
  const groups = SPLIT_GROUPS[split] ?? [];
  const perGroup = groups.length <= 2 ? 3 : 2;
  const out: Exercise[] = [];

  groups.forEach((g) => {
    const pick = byGroup(g)
      .filter((e) => level === "intermediate" || e.level === "beginner")
      .slice(0, perGroup);
    out.push(...pick);
  });

  // Always finish a lifting day with something for the core.
  if (groups.length && !groups.includes("abs") && !groups.includes("cardio"))
    out.push(EXERCISES.find((e) => e.id === "plank")!);

  return out;
}
