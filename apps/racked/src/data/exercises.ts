export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Region = "Push" | "Pull" | "Core" | "Lower body";

export interface Media {
  poster?: string;
  loop?: string;
  video?: string;
}

export interface Exercise {
  slug: string;
  name: string;
  equipment: string;
  dose: string;
  rest: string;
  restSec: number;
  level: Level;
  tempo: string;
  starter: boolean;
  summary: string;
  setup: string;
  cues: string[];
  mistakes: string[];
  swap: string;
  media: Media;
}

export interface MuscleGroup {
  key: string;
  name: string;
  region: Region;
  blurb: string;
  routineTime: string;
  hero?: string;
  exercises: Exercise[];
}

/** Slugs are derived, never hand-written. */
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type RawExercise = Omit<Exercise, "slug" | "media"> & { media?: Media };

const group = (
  key: string,
  name: string,
  region: Region,
  blurb: string,
  routineTime: string,
  exercises: RawExercise[],
): MuscleGroup => ({
  key,
  name,
  region,
  blurb,
  routineTime,
  exercises: exercises.map((e) => ({ ...e, slug: slugify(e.name), media: e.media ?? {} })),
});

export const DATA: MuscleGroup[] = [
  group("chest", "Chest", "Push",
    "Press to build it, fly to finish it. Two presses and one fly is a complete chest day.",
    "~35 min", [
    {
      name: "Chest Press Machine",
      equipment: "Seated chest press machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "The safest way to learn pressing. The machine holds the path for you, so you can think about the muscle instead of balancing a bar.",
      setup:
        "A seated machine with two handles at chest height. Adjust the seat with the lever or pin on the side — most gyms label it. Start with the lightest plate and add from there.",
      cues: [
        "Set the seat so the handles sit level with the middle of your chest, not your throat or your belly.",
        "Sit back hard. Shoulder blades pinned to the pad, feet flat on the floor.",
        "Push the handles away until your arms are nearly straight — stop just short of locking out.",
        "Lower for a slow count of three until you feel the stretch across your chest, then press again.",
      ],
      mistakes: [
        "Letting the stack slam back down. The lowering half is where most of the growth happens.",
        "Seat set too high, so you are pressing upward and loading your shoulders instead.",
      ],
      swap: "Push-up",
    },
    {
      name: "Incline Dumbbell Press",
      equipment: "Adjustable bench + dumbbells",
      dose: "3 × 8–12", rest: "2 min", restSec: 120,
      level: "Beginner", tempo: "2-0-2", starter: true,
      summary:
        "Hits the upper chest, the part that actually changes how your shirt sits. Dumbbells let each side work on its own.",
      setup:
        "Set an adjustable bench to roughly 30 degrees — usually the second or third notch. Any steeper and your shoulders take over the work.",
      cues: [
        "Sit with a dumbbell on each thigh, then kick them up to your shoulders as you lie back.",
        "Start with the dumbbells level with your upper chest, elbows about 45 degrees out from your body.",
        "Press up and slightly inward until the dumbbells are almost touching above your chest.",
        "Lower under control until your upper arms are level with your torso and you feel the stretch.",
      ],
      mistakes: [
        "Flaring your elbows straight out to the sides — that puts the whole load on the shoulder joint.",
        "Setting the bench too upright, which turns it into a shoulder press.",
      ],
      swap: "Chest Press Machine",
    },
    {
      name: "Pec Deck Fly",
      equipment: "Pec deck / chest fly machine",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "A finisher. Presses use your triceps too; this isolates the chest so you can empty it at the end of the session.",
      setup:
        "Seated machine with two vertical pads or handles. Set the starting width so your arms open just past your shoulders — no further, however good the stretch feels.",
      cues: [
        "Sit with your back flat against the pad and your feet planted.",
        "Keep a soft, fixed bend in your elbows — this is a hinge at the shoulder, not a press.",
        "Bring the handles together in front of your chest and squeeze for a full second.",
        "Open slowly until you feel the stretch, then stop and reverse.",
      ],
      mistakes: [
        "Setting the arms too far back at the start. This is the single most common way to hurt a shoulder on a machine.",
        "Bending and straightening your elbows, which quietly turns it into a press.",
      ],
      swap: "Cable Crossover",
    },
    {
      name: "Cable Crossover",
      equipment: "Dual cable tower + D-handles",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Constant tension from top to bottom, which a dumbbell fly cannot give you. Good for feeling the chest work if you never do.",
      setup:
        "Set both pulleys above head height and clip on a D-handle each side. Start light — this looks easier than it is.",
      cues: [
        "Take a handle in each hand and step forward into a small split stance.",
        "Chest up, slight lean forward, soft bend in the elbows that does not change.",
        "Draw your hands down and together in front of your hips, crossing them slightly.",
        "Squeeze, then let the cables pull your arms open slowly and under control.",
      ],
      mistakes: [
        "So much weight that your torso swings. If your body moves, the chest is not doing the work.",
        "Standing directly between the pulleys instead of stepping forward, which kills the tension at the front.",
      ],
      swap: "Pec Deck Fly",
    },
    {
      name: "Barbell Bench Press",
      equipment: "Flat bench + barbell",
      dose: "4 × 6–8", rest: "2–3 min", restSec: 150,
      level: "Intermediate", tempo: "2-1-1", starter: false,
      summary:
        "The strength benchmark for the upper body. Worth learning properly once you can press your bodyweight on a machine.",
      setup:
        "Flat bench inside a rack. Set the safety pins just below your chest height so a failed rep lands on steel, not on you.",
      cues: [
        "Lie with your eyes directly under the bar, feet planted, shoulder blades squeezed together and down.",
        "Grip slightly wider than shoulder width. Unrack and bring the bar over your chest.",
        "Lower to the middle of your chest with your elbows tucked to about 45 degrees.",
        "Press back up in a straight line, keeping your shoulder blades pinned throughout.",
      ],
      mistakes: [
        "Benching heavy with no spotter and no safety pins. This is the lift people get trapped under.",
        "Bouncing the bar off your chest to get through a rep.",
      ],
      swap: "Incline Dumbbell Press",
    },
    {
      name: "Push-Up",
      equipment: "Bodyweight, or hands on a bench",
      dose: "3 × max reps", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-0-1", starter: false,
      summary:
        "Free, portable, and a genuine measure of upper body strength. Ten clean floor push-ups is the standard to aim for.",
      setup:
        "Nothing required. If floor push-ups are too hard, put your hands on a bench — the higher the surface, the easier it gets.",
      cues: [
        "Hands slightly wider than your shoulders, directly under them.",
        "Body in one straight line from your head to your heels. Squeeze your glutes.",
        "Lower until your chest is a fist's height from the floor, elbows tucked back rather than flared.",
        "Press up without letting your hips sag or pike.",
      ],
      mistakes: [
        "Hips sagging towards the floor, which loads your lower back instead of your chest.",
        "Half reps. Chest to fist height or it does not count.",
      ],
      swap: "Chest Press Machine",
    },
  ]),

  group("back", "Back", "Pull",
    "One vertical pull and one horizontal pull covers the whole back. Everything else is detail.",
    "~35 min", [
    {
      name: "Lat Pulldown",
      equipment: "Lat pulldown machine + wide bar",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "The vertical pull that builds the width down the sides of your back. Where you start if you cannot do a pull-up yet.",
      setup:
        "Seated machine with a cable coming from above. Set the thigh pad down tight so you cannot lift off the seat when the weight gets heavy.",
      cues: [
        "Grip the bar a bit wider than your shoulders, palms facing away.",
        "Sit tall, lock your thighs under the pad, then lean back about 15 degrees and hold that angle.",
        "Pull the bar to your upper chest by driving your elbows down towards your back pockets.",
        "Let the bar rise slowly until your arms are straight and you feel the stretch in your lats.",
      ],
      mistakes: [
        "Pulling with your hands and arms. Think about the elbows and the back does the work.",
        "Rocking backwards to heave the bar down. Your torso angle should not change mid-set.",
      ],
      swap: "Assisted Pull-Up",
    },
    {
      name: "Seated Cable Row",
      equipment: "Low cable row + V-handle",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The horizontal pull. Builds the thickness through the middle of your back and pulls your shoulders out of a desk posture.",
      setup:
        "A low pulley with a footplate. Clip on the V-handle. Sit with your knees slightly bent — never locked straight.",
      cues: [
        "Sit tall, chest up, a small bend in the knees, arms extended forward.",
        "Pull the handle to your stomach, leading with your elbows and keeping them close to your body.",
        "Squeeze your shoulder blades together at the back and hold for a second.",
        "Let the handle travel forward slowly, allowing a stretch without rounding your lower back.",
      ],
      mistakes: [
        "Rocking your torso backwards and forwards like a rowing machine. Your chest should stay roughly still.",
        "Rounding your lower back at the front of the movement.",
      ],
      swap: "Chest-Supported Row",
    },
    {
      name: "Chest-Supported Row",
      equipment: "Chest-supported row machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The best back machine for a beginner, because the pad physically stops you from cheating with your lower back.",
      setup:
        "An angled bench with handles in front. Set the seat height so the handles line up with your mid-chest when you lie on the pad.",
      cues: [
        "Lie face down with your chest on the pad and your feet planted.",
        "Take the handles with your arms fully extended.",
        "Pull back, keeping your elbows close to your ribs, until your hands reach your torso.",
        "Squeeze the shoulder blades, then lower under control to a full stretch.",
      ],
      mistakes: [
        "Lifting your chest off the pad to get more weight up — that is the one thing this machine exists to prevent.",
        "Shrugging your shoulders up towards your ears as you pull.",
      ],
      swap: "One-Arm Dumbbell Row",
    },
    {
      name: "One-Arm Dumbbell Row",
      equipment: "Flat bench + one dumbbell",
      dose: "3 × 10 each side", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Trains one side at a time, so your stronger side cannot cover for the weaker one. Most people have a noticeable difference.",
      setup:
        "One flat bench and one dumbbell. Put the same knee and hand on the bench as the side you are not working.",
      cues: [
        "Left knee and left hand on the bench, right foot on the floor, back flat and roughly parallel to the ground.",
        "Let the dumbbell hang straight down from your right shoulder.",
        "Pull it up to your hip, elbow brushing past your ribs.",
        "Lower it the whole way down until your arm is straight and your shoulder stretches forward.",
      ],
      mistakes: [
        "Twisting your torso to help the weight up. Keep both shoulders level with the floor.",
        "Pulling to your chest instead of your hip, which turns it into a shoulder exercise.",
      ],
      swap: "Seated Cable Row",
    },
    {
      name: "Face Pull",
      equipment: "Cable tower + rope attachment",
      dose: "3 × 15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: false,
      summary:
        "The exercise that keeps your shoulders healthy through years of pressing. Light weight, high reps, every single week.",
      setup:
        "Rope attachment on a cable set to roughly face height. Use a light plate — this is not a strength movement.",
      cues: [
        "Hold the rope ends with your thumbs pointing backwards, arms straight out in front.",
        "Step back until there is tension on the cable before you start.",
        "Pull the rope towards your forehead, spreading your hands apart as it comes.",
        "Squeeze the back of your shoulders for a second, then return slowly.",
      ],
      mistakes: [
        "Loading it heavy and leaning back. If you are leaning, halve the weight.",
        "Pulling to your chin instead of your forehead, which misses the rear shoulder.",
      ],
      swap: "Rear Delt Fly",
    },
    {
      name: "Assisted Pull-Up",
      equipment: "Assisted pull-up machine, or bar + band",
      dose: "3 × 6–10", rest: "2 min", restSec: 120,
      level: "Intermediate", tempo: "2-0-2", starter: false,
      summary:
        "The goal is five clean unassisted reps. The machine takes weight off until you get there — reduce the assistance over weeks.",
      setup:
        "Machine with a knee or foot platform. More weight selected means more help, which is the opposite of every other machine in the gym.",
      cues: [
        "Grip the bar slightly wider than your shoulders and set your knees on the pad.",
        "Start from a dead hang with your arms completely straight.",
        "Pull your chest towards the bar by driving your elbows down and back.",
        "Lower all the way to straight arms before the next rep.",
      ],
      mistakes: [
        "Half reps from a bent-arm start. A pull-up counts from a dead hang.",
        "Never reducing the assistance. Drop it by one plate whenever you can do ten.",
      ],
      swap: "Lat Pulldown",
    },
  ]),

  group("shoulders", "Shoulders", "Push",
    "Presses build the front, raises build the side, and the rear delts are what almost everyone skips.",
    "~30 min", [
    {
      name: "Shoulder Press Machine",
      equipment: "Seated shoulder press machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Overhead pressing with the balance taken care of. The place to build the strength before you try it with dumbbells.",
      setup:
        "Seated machine with handles beside your head. Set the seat so the handles start at about ear height.",
      cues: [
        "Sit with your back flat against the pad and your feet planted.",
        "Take the handles with your palms facing forward, elbows under your wrists.",
        "Press straight up until your arms are nearly extended, without locking hard.",
        "Lower under control until your elbows are level with your shoulders — no lower.",
      ],
      mistakes: [
        "Dropping your elbows well below shoulder level, which is a stretch on the joint, not a rep.",
        "Arching your lower back off the pad to help the weight up.",
      ],
      swap: "Dumbbell Shoulder Press",
    },
    {
      name: "Dumbbell Lateral Raise",
      equipment: "Light dumbbells",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "The exercise that builds width at the top of your arms. Nothing else trains the side of the shoulder properly.",
      setup:
        "The lightest dumbbells on the rack are usually correct here. 5 kg done well beats 12 kg swung.",
      cues: [
        "Stand tall, dumbbells at your sides, a slight fixed bend in the elbows.",
        "Raise both arms out to the sides, leading with your elbows, not your hands.",
        "Stop when your hands are level with your shoulders — no higher.",
        "Lower over a slow count of three. The lowering is most of the work.",
      ],
      mistakes: [
        "Swinging from the hips to get the weight up. If your body rocks, go lighter.",
        "Raising above shoulder height, which hands the work to your traps.",
      ],
      swap: "Cable Lateral Raise",
    },
    {
      name: "Rear Delt Fly",
      equipment: "Pec deck set to reverse, or dumbbells",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The back of the shoulder. Almost everyone's weak point, and the reason a lot of people look rounded from the side.",
      setup:
        "On a pec deck, swap the handles to the front position and sit facing the pad. Otherwise, bend forward with light dumbbells.",
      cues: [
        "Sit facing the machine with your chest against the pad.",
        "Take the handles with a soft, fixed bend in the elbows.",
        "Pull your arms out and back in a wide arc, leading with the elbows.",
        "Squeeze the back of your shoulders, then return slowly to the front.",
      ],
      mistakes: [
        "Using so much weight that your elbows bend and it becomes a row.",
        "Skipping it because you cannot see the muscle in the mirror.",
      ],
      swap: "Face Pull",
    },
    {
      name: "Dumbbell Shoulder Press",
      equipment: "Upright bench + dumbbells",
      dose: "3 × 8–12", rest: "2 min", restSec: 120,
      level: "Beginner", tempo: "2-0-2", starter: true,
      summary:
        "Each arm works independently, so neither can hide. Harder than the machine at the same weight, and better for it.",
      setup:
        "Set an adjustable bench fully upright, or one notch back from vertical for an easier lower back position.",
      cues: [
        "Sit with the dumbbells resting on your thighs, then kick them up to shoulder height one at a time.",
        "Start with your palms facing forward and your elbows just below your wrists.",
        "Press up until your arms are almost straight, bringing the dumbbells slightly towards each other.",
        "Lower under control back to ear height.",
      ],
      mistakes: [
        "Arching your lower back into the bench to press more weight. Brace your stomach and squeeze your glutes.",
        "Clashing the dumbbells together at the top.",
      ],
      swap: "Shoulder Press Machine",
    },
    {
      name: "Cable Lateral Raise",
      equipment: "Low cable + D-handle",
      dose: "3 × 12–15 each side", rest: "60 sec", restSec: 60,
      level: "Intermediate", tempo: "2-1-3", starter: false,
      summary:
        "Same movement as the dumbbell raise, but the cable keeps tension at the bottom where a dumbbell gives you a rest.",
      setup:
        "Set the pulley at the lowest point, clip on a single D-handle, and stand side-on with the cable running across your body.",
      cues: [
        "Take the handle in the hand furthest from the machine, across the front of your body.",
        "Stand tall and hold the frame with your free hand for balance.",
        "Raise your arm out to the side until your hand is level with your shoulder.",
        "Lower slowly, resisting the cable all the way down.",
      ],
      mistakes: [
        "Leaning away from the machine to get more range. Stay upright.",
        "Letting the weight stack drop and yank your arm down.",
      ],
      swap: "Dumbbell Lateral Raise",
    },
    {
      name: "Barbell Overhead Press",
      equipment: "Barbell + squat rack",
      dose: "4 × 6–8", rest: "2–3 min", restSec: 150,
      level: "Advanced", tempo: "2-1-1", starter: false,
      summary:
        "The strongest thing you can do for shoulders, and the least forgiving of a lazy core. Earn it on the machine first.",
      setup:
        "Set the bar in a rack at roughly upper-chest height so you can unrack it without a shrug. Safety pins set just below your chin.",
      cues: [
        "Bar resting on your front shoulders, hands just outside shoulder width, elbows under the bar.",
        "Brace your stomach hard and squeeze your glutes so your lower back cannot arch.",
        "Press the bar straight up, tilting your head back slightly so it passes your face.",
        "Lock out with the bar over the middle of your feet, then lower back to your shoulders.",
      ],
      mistakes: [
        "Leaning back until it becomes a standing incline press. If your ribs flare, brace harder or go lighter.",
        "Pressing around your face in an arc instead of moving your head out of the way.",
      ],
      swap: "Dumbbell Shoulder Press",
    },
  ]),

  group("biceps", "Biceps", "Pull",
    "Curls with your palm up, curls with your palm in. That is genuinely the whole menu.",
    "~20 min", [
    {
      name: "Dumbbell Curl",
      equipment: "Dumbbells",
      dose: "3 × 10–12", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "The default. Each arm works on its own and you get a full range from straight to squeezed.",
      setup: "Any pair of dumbbells you can control for twelve reps without your body moving.",
      cues: [
        "Stand tall, dumbbells at your sides, palms facing forward.",
        "Curl one or both up, keeping your elbows pinned against your ribs.",
        "Squeeze at the top without letting your elbows swing forward.",
        "Lower all the way to straight arms over three seconds.",
      ],
      mistakes: [
        "Swinging the weight up with your lower back. Your elbows are the only joint that should move.",
        "Stopping halfway down. The bottom half of the rep is the half people skip.",
      ],
      swap: "Cable Curl",
    },
    {
      name: "Hammer Curl",
      equipment: "Dumbbells",
      dose: "3 × 10–12", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Palms facing each other. Builds the muscle under the biceps that pushes it up and thickens the whole arm.",
      setup: "Same dumbbells as a normal curl, usually a little heavier because the position is stronger.",
      cues: [
        "Stand with the dumbbells at your sides, palms facing in towards your legs.",
        "Curl straight up, keeping that palms-in grip the whole way.",
        "Bring the dumbbell up to your shoulder without rotating your wrist.",
        "Lower slowly to straight arms.",
      ],
      mistakes: [
        "Turning it into a normal curl halfway up. The grip does not change.",
        "Letting your elbows drift forward so your shoulders take over.",
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Preacher Curl Machine",
      equipment: "Preacher curl machine or bench",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "The pad locks your arms in place, so there is no way to cheat with your back. Brutal at the bottom of the rep.",
      setup:
        "Set the seat so your armpits rest on the top edge of the pad and your upper arms lie flat on it.",
      cues: [
        "Sit with your chest against the top of the pad and your arms flat along it.",
        "Take the handles with your palms up and your arms nearly straight.",
        "Curl up, stopping just short of vertical so the tension stays on the muscle.",
        "Lower under control until your arms are nearly straight — nearly, not snapped.",
      ],
      mistakes: [
        "Letting your arms snap fully straight at the bottom under load. This is where biceps tear.",
        "Lifting your chest off the pad to get the last rep.",
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Cable Curl",
      equipment: "Low cable + straight or EZ bar",
      dose: "3 × 12", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The cable pulls the whole way through, so there is no easy point in the rep. You will need less weight than you think.",
      setup: "Clip a straight or EZ bar to the lowest pulley and stand one step back from the machine.",
      cues: [
        "Hold the bar with your palms up, shoulder-width apart, arms straight down.",
        "Stand a step back so the cable is already under tension before you start.",
        "Curl the bar to chest height with your elbows fixed at your sides.",
        "Lower slowly, resisting the cable rather than letting it pull you straight.",
      ],
      mistakes: [
        "Standing too close, so the cable goes slack at the bottom.",
        "Leaning back as you curl.",
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Barbell Curl",
      equipment: "Straight or EZ barbell",
      dose: "3 × 8–12", rest: "75 sec", restSec: 75,
      level: "Intermediate", tempo: "2-1-3", starter: false,
      summary:
        "Lets you load both arms heavier than dumbbells. Use the EZ bar if straight-bar curls bother your wrists.",
      setup: "A barbell you can curl for eight reps without moving your feet. Start with the empty bar to check the wrist position.",
      cues: [
        "Hold the bar shoulder-width with your palms up, standing tall.",
        "Curl the bar to chest height, elbows still at your sides.",
        "Pause at the top without letting your elbows travel forward.",
        "Lower over three seconds to straight arms.",
      ],
      mistakes: [
        "Bending your knees and swinging the bar up with your hips.",
        "Shortening the range at the bottom to squeeze out extra reps.",
      ],
      swap: "Cable Curl",
    },
  ]),

  group("triceps", "Triceps", "Push",
    "Two thirds of your arm is triceps. Push down for the outer head, press overhead for the long one.",
    "~20 min", [
    {
      name: "Rope Pushdown",
      equipment: "High cable + rope attachment",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The easiest triceps exercise to get right, and the one most people load too heavy. Spread the rope at the bottom.",
      setup: "Rope attachment on the highest pulley setting. Stand close enough that your elbows can stay at your sides.",
      cues: [
        "Hold the rope ends with your palms facing each other, elbows tucked against your ribs.",
        "Push down until your arms are straight, spreading the rope apart at the bottom.",
        "Squeeze for a second with your arms locked out.",
        "Let the rope rise only until your forearms are parallel to the floor, then push again.",
      ],
      mistakes: [
        "Elbows drifting forward and away from your body — that makes it a chest press.",
        "Leaning your bodyweight over the bar to force the last reps.",
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Overhead Triceps Extension",
      equipment: "One dumbbell, or a rope on a low cable",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "3-1-2", starter: true,
      summary:
        "The only way to properly load the long head of the triceps — the part that runs down the back of your arm.",
      setup:
        "One dumbbell held in both hands, or a rope on a low pulley that you face away from. Start lighter than you expect.",
      cues: [
        "Hold the dumbbell with both hands, arms straight overhead, elbows pointing at the ceiling.",
        "Bend at the elbows to lower it behind your head, keeping your upper arms still.",
        "Go down until you feel a deep stretch along the back of your arms.",
        "Press back up to straight without letting your elbows flare outwards.",
      ],
      mistakes: [
        "Elbows flaring out wide, which shifts the work off the triceps.",
        "Arching your lower back as the weight goes behind you.",
      ],
      swap: "Rope Pushdown",
    },
    {
      name: "Triceps Dip Machine",
      equipment: "Seated dip machine",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Heavy triceps work with your back supported. A good way to load the movement before you can do real dips.",
      setup: "Seated machine with handles at your sides. Set the seat so your elbows start at about 90 degrees.",
      cues: [
        "Sit with your back flat against the pad and grip the handles at your sides.",
        "Keep your torso upright — do not lean forward over the handles.",
        "Press down until your arms are straight.",
        "Return under control until your elbows reach roughly 90 degrees.",
      ],
      mistakes: [
        "Leaning forward, which turns it into a chest exercise.",
        "Going deeper than 90 degrees, which strains the front of the shoulder.",
      ],
      swap: "Bench Dip",
    },
    {
      name: "Bench Dip",
      equipment: "One flat bench",
      dose: "3 × 10–15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-0-2", starter: true,
      summary:
        "No machine needed. Bend your knees to make it easier, straighten your legs or add a plate to make it harder.",
      setup: "Sit on the edge of a bench with your hands beside your hips, then slide your backside off the front.",
      cues: [
        "Hands on the bench edge beside your hips, fingers pointing forward.",
        "Legs out in front with your heels on the floor, backside hovering just off the bench.",
        "Lower until your elbows reach about 90 degrees, keeping your back close to the bench.",
        "Press back up to straight arms.",
      ],
      mistakes: [
        "Dropping too deep. Below 90 degrees this becomes hard on the shoulder joint.",
        "Letting your hips drift forward away from the bench.",
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Close-Grip Bench Press",
      equipment: "Flat bench + barbell",
      dose: "3 × 8–10", rest: "2 min", restSec: 120,
      level: "Intermediate", tempo: "2-1-1", starter: false,
      summary:
        "The heaviest triceps exercise there is. Shoulder-width grip, not narrow — narrow wrecks wrists for no extra benefit.",
      setup: "Flat bench in a rack with the safety pins set. Grip the bar at about shoulder width.",
      cues: [
        "Lie as you would for a bench press but grip the bar shoulder-width apart.",
        "Unrack and lower the bar to your lower chest with your elbows tucked tight to your ribs.",
        "Keep your forearms vertical throughout.",
        "Press straight back up, driving through the heels of your hands.",
      ],
      mistakes: [
        "Gripping too narrow, which puts the whole load through the wrist joint.",
        "Letting your elbows flare out, which hands the work to your chest.",
      ],
      swap: "Triceps Dip Machine",
    },
  ]),

  group("abs", "Abs & Core", "Core",
    "Train the core to resist movement, not just to crunch. Bracing is what protects your back under a heavy bar.",
    "~15 min", [
    {
      name: "Plank",
      equipment: "Mat, bodyweight",
      dose: "3 × 30–60 sec", rest: "45 sec", restSec: 45,
      level: "Beginner", tempo: "Hold", starter: true,
      summary:
        "Teaches you to brace, which is the skill that keeps your lower back safe under a squat or a deadlift.",
      setup: "A mat, or any patch of floor. No equipment and no excuse.",
      cues: [
        "Forearms flat on the floor directly under your shoulders.",
        "Legs straight back, weight on your toes, body in one line from head to heels.",
        "Squeeze your glutes and pull your belly button up towards your spine.",
        "Breathe normally and hold. When your form breaks, the set is over.",
      ],
      mistakes: [
        "Hips sagging towards the floor, which loads the lower back instead of the abs.",
        "Holding your breath for the whole set.",
      ],
      swap: "Dead Bug",
    },
    {
      name: "Dead Bug",
      equipment: "Mat, bodyweight",
      dose: "3 × 10 each side", rest: "45 sec", restSec: 45,
      level: "Beginner", tempo: "3-1-3", starter: true,
      summary:
        "The safest core exercise there is, and one of the most effective. Slow is the entire point of it.",
      setup: "Lie on your back on a mat. Nothing else needed.",
      cues: [
        "Lie on your back with your arms straight up and your knees bent at 90 degrees above your hips.",
        "Press your lower back flat into the floor and keep it there.",
        "Slowly lower one arm behind your head and the opposite leg towards the floor.",
        "Return to the start and swap sides. If your back lifts, shorten the range.",
      ],
      mistakes: [
        "Rushing. Three seconds out, three seconds back.",
        "Letting your lower back arch off the floor, which defeats the whole exercise.",
      ],
      swap: "Plank",
    },
    {
      name: "Hanging Knee Raise",
      equipment: "Pull-up bar or captain's chair",
      dose: "3 × 10–15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "Works the lower abs, which crunches largely miss. Use the captain's chair until you can hang without swinging.",
      setup:
        "The captain's chair is the padded frame where your forearms rest and your back is supported. Easier and steadier than a bar.",
      cues: [
        "Support yourself on your forearms with your back flat against the pad.",
        "Start with your legs hanging straight down.",
        "Pull your knees up towards your chest, curling your hips slightly at the top.",
        "Lower slowly, resisting all the way down, without swinging.",
      ],
      mistakes: [
        "Swinging your legs up with momentum. If you cannot stop the swing, do them on the chair.",
        "Only lifting the legs without curling the hips, which makes it a hip flexor exercise.",
      ],
      swap: "Cable Crunch",
    },
    {
      name: "Cable Crunch",
      equipment: "High cable + rope",
      dose: "3 × 15", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "The one ab exercise you can properly add weight to, which is how abs grow like any other muscle.",
      setup: "Rope on the highest pulley. Kneel facing the machine, about an arm's length back.",
      cues: [
        "Kneel and hold the rope ends at the sides of your head.",
        "Keep your hips still — they should not move for the whole set.",
        "Crunch down by curling your ribs towards your hips, rounding your upper back.",
        "Return slowly until you feel the stretch through your stomach.",
      ],
      mistakes: [
        "Pulling with your arms. Your hands should stay glued to the sides of your head.",
        "Hinging at the hips instead of curling your spine.",
      ],
      swap: "Bicycle Crunch",
    },
    {
      name: "Bicycle Crunch",
      equipment: "Mat, bodyweight",
      dose: "3 × 20 total", rest: "45 sec", restSec: 45,
      level: "Beginner", tempo: "2-0-2", starter: false,
      summary:
        "Hits the obliques down the sides of your waist along with the front. Slow beats fast here by a distance.",
      setup: "A mat. Fingertips resting lightly behind your ears, never laced behind your head.",
      cues: [
        "Lie on your back with your legs lifted and knees bent.",
        "Bring one knee towards your chest and rotate the opposite shoulder across to meet it.",
        "Straighten the other leg out without letting it touch the floor.",
        "Alternate slowly, keeping your lower back pressed down.",
      ],
      mistakes: [
        "Yanking on your neck with your hands. Fingertips only, no pulling.",
        "Going fast. Speed makes it easier, not harder.",
      ],
      swap: "Dead Bug",
    },
  ]),

  group("legs", "Legs", "Lower body",
    "A squat, a hinge and a curl. Skip the hinge and the curl and you train half a leg.",
    "~45 min", [
    {
      name: "Leg Press",
      equipment: "45-degree leg press machine",
      dose: "3 × 10–12", rest: "2 min", restSec: 120,
      level: "Beginner", tempo: "2-1-2", starter: true,
      summary:
        "Heavy leg work with your back fully supported. The safest way to load your legs before you learn to squat.",
      setup:
        "The angled sled machine. Release the safety handles at the side once your feet are set, and put them back before you get out.",
      cues: [
        "Feet shoulder-width on the middle of the platform, toes turned slightly out.",
        "Release the safeties and lower the sled until your knees reach about 90 degrees.",
        "Stop before your lower back lifts off the seat — that is your range limit, not the machine's.",
        "Press back up through your whole foot without snapping your knees locked.",
      ],
      mistakes: [
        "Going so deep that your hips curl up off the seat, which rounds your lower back under load.",
        "Locking the knees hard at the top of every rep.",
      ],
      swap: "Goblet Squat",
    },
    {
      name: "Goblet Squat",
      equipment: "One dumbbell or kettlebell",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90,
      level: "Beginner", tempo: "3-1-2", starter: true,
      summary:
        "The best squat to learn on. Holding the weight in front automatically keeps your chest up and your back safe.",
      setup: "One dumbbell held vertically against your chest, or a kettlebell by the horns. 10–16 kg is a sensible start.",
      cues: [
        "Hold the weight against your chest with both hands, elbows tucked in.",
        "Feet shoulder-width, toes turned slightly out, chest up.",
        "Sit straight down between your heels until your thighs are about parallel to the floor.",
        "Drive up through the middle of your feet, keeping your chest tall the whole way.",
      ],
      mistakes: [
        "Knees caving inwards as you stand up. Push them out towards your little toes.",
        "Rising onto your toes. Keep your heels planted.",
      ],
      swap: "Leg Press",
    },
    {
      name: "Romanian Deadlift",
      equipment: "Dumbbells or a barbell",
      dose: "3 × 10–12", rest: "2 min", restSec: 120,
      level: "Beginner", tempo: "3-1-2", starter: true,
      summary:
        "The hinge. Trains your hamstrings and glutes, which squats and presses barely touch. Feel it in the back of your thighs or you are doing it wrong.",
      setup: "A pair of dumbbells, or a barbell. Go much lighter than you would for a squat while you learn the movement.",
      cues: [
        "Stand holding the weights in front of your thighs, knees slightly bent.",
        "Push your hips back and let the weights slide down the front of your legs.",
        "Keep that same slight knee bend — the knees do not bend further as you descend.",
        "Stop when you feel a strong stretch in your hamstrings, then squeeze your glutes to stand.",
      ],
      mistakes: [
        "Bending your knees more on the way down, which turns it into a squat and removes the hamstring work.",
        "Rounding your lower back to reach further down. Range stops where your back would round.",
      ],
      swap: "Seated Leg Curl",
    },
    {
      name: "Seated Leg Curl",
      equipment: "Seated or lying leg curl machine",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75,
      level: "Beginner", tempo: "2-1-3", starter: true,
      summary:
        "Direct hamstring work. Half your leg is behind you, and it is the half most beginners never train.",
      setup: "Set the pad to rest just above your heels and the thigh pad down snug so your legs cannot lift.",
      cues: [
        "Sit or lie with the pad just above your heels, knees lined up with the machine's pivot.",
        "Curl your heels towards your backside as far as the machine allows.",
        "Squeeze the back of your thighs for a second at the end.",
        "Lower slowly to a full stretch without letting the stack bang down.",
      ],
      mistakes: [
        "Lifting your hips off the seat to move more weight.",
        "Skipping hamstrings entirely because they do not show in the mirror.",
      ],
      swap: "Romanian Deadlift",
    },
    {
      name: "Walking Lunge",
      equipment: "Dumbbells, or bodyweight",
      dose: "3 × 10 each leg", rest: "90 sec", restSec: 90,
      level: "Intermediate", tempo: "2-0-2", starter: false,
      summary:
        "One leg at a time, which exposes any imbalance immediately. Also trains your balance, which a machine never does.",
      setup: "A clear stretch of floor about ten metres long. Dumbbells at your sides, or nothing at all to start.",
      cues: [
        "Stand tall with the weights at your sides, chest up.",
        "Step forward far enough that your front shin stays vertical when you drop.",
        "Lower until both knees are at about 90 degrees and your back knee is just off the floor.",
        "Push through the front heel to stand, then step straight through into the next rep.",
      ],
      mistakes: [
        "Steps too short, which pushes your front knee past your toes and loads the joint.",
        "Letting your torso fall forward over the front leg.",
      ],
      swap: "Leg Press",
    },
    {
      name: "Standing Calf Raise",
      equipment: "Calf raise machine or a step",
      dose: "3 × 15–20", rest: "60 sec", restSec: 60,
      level: "Beginner", tempo: "2-2-3", starter: false,
      summary:
        "Calves need a full stretch and a real pause to grow. Bouncing through twenty fast reps does nothing.",
      setup: "Machine with shoulder pads and a raised platform, or simply the edge of a step with something to hold.",
      cues: [
        "Balls of your feet on the platform, heels hanging off the back.",
        "Rise up onto your toes as high as you can go.",
        "Hold the top for two full seconds.",
        "Lower slowly until you feel a deep stretch in the calf, then pause before the next rep.",
      ],
      mistakes: [
        "Bouncing up and down using the tendon rather than the muscle.",
        "Cutting the range short at the bottom.",
      ],
      swap: "Leg Press",
    },
  ]),
];

export const GROUPS = DATA;
export const groupByKey = (key: string) => DATA.find((g) => g.key === key);
export const findExercise = (group: MuscleGroup, slug: string) =>
  group.exercises.find((e) => e.slug === slug);
