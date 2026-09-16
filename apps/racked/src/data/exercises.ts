export type Region = "Push" | "Pull" | "Core" | "Lower body" | "Conditioning" | "Anywhere";

/** Another way to do the same movement with whatever the gym has free. */
export interface Variation {
  slug: string;
  name: string;
  equipment: string;
  note: string;
}

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
  tempo: string;
  starter: boolean;
  summary: string;
  setup: string;
  cues: string[];
  mistakes: string[];
  variations: Variation[];
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

type RawVariation = Omit<Variation, "slug">;
type RawExercise = Omit<Exercise, "slug" | "media" | "variations"> & {
  media?: Media;
  variations?: RawVariation[];
};

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
  exercises: exercises.map((e) => ({
    ...e,
    slug: slugify(e.name),
    media: e.media ?? {},
    variations: (e.variations ?? []).map((v) => ({ ...v, slug: slugify(v.name) })),
  })),
});

export const DATA: MuscleGroup[] = [
  group("chest", "Chest", "Push",
    "Press to build it, fly to finish it. Two presses and one fly is a complete chest day.",
    "~35 min", [
    {
      name: "Chest Press Machine",
      equipment: "Seated chest press machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Hammer strength press", equipment: "Plate-loaded machine", note: "Each arm moves on its own, so the strong side cannot carry the weak one." },
        { name: "Smith machine bench press", equipment: "Smith machine", note: "A fixed bar path with safeties you can set at any height. Closest thing to benching without a spotter." },
      ],
      swap: "Push-up",
    },
    {
      name: "Incline Dumbbell Press",
      equipment: "Adjustable bench + dumbbells",
      dose: "3 × 8–12", rest: "2 min", restSec: 120, tempo: "2-0-2", starter: true,
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
      variations: [
        { name: "Incline barbell press", equipment: "Barbell + incline bench", note: "Heavier overall, but both arms are locked to one bar." },
        { name: "Incline machine press", equipment: "Incline chest press machine", note: "Same angle, no balancing. Good when you are already tired." },
        { name: "Incline cable press", equipment: "Two low cables + bench", note: "Tension stays on the chest at the top where a dumbbell goes weightless." },
      ],
      swap: "Chest Press Machine",
    },
    {
      name: "Pec Deck Fly",
      equipment: "Pec deck / chest fly machine",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Dumbbell fly", equipment: "Flat or incline bench + dumbbells", note: "Bigger stretch at the bottom, almost no tension at the top." },
        { name: "Cable fly", equipment: "Two cables at shoulder height", note: "Even tension all the way. The best version if the pec deck is taken." },
      ],
      swap: "Cable Crossover",
    },
    {
      name: "Cable Crossover",
      equipment: "Dual cable tower + D-handles",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "High-to-low crossover", equipment: "Pulleys set high", note: "Hands finish at your hips. Hits the lower chest." },
        { name: "Low-to-high crossover", equipment: "Pulleys set low", note: "Hands finish at chin height. Hits the upper chest." },
        { name: "Single-arm crossover", equipment: "One pulley", note: "Twice the time, but you can feel one side at a time." },
      ],
      swap: "Pec Deck Fly",
    },
    {
      name: "Barbell Bench Press",
      equipment: "Flat bench + barbell",
      dose: "4 × 6–8", rest: "2–3 min", restSec: 150, tempo: "2-1-1", starter: false,
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
      variations: [
        { name: "Dumbbell bench press", equipment: "Flat bench + dumbbells", note: "Safer alone — you can drop dumbbells, you cannot drop a bar." },
        { name: "Smith machine bench", equipment: "Smith machine", note: "Set the safeties and press without a spotter." },
      ],
      swap: "Incline Dumbbell Press",
    },
    {
      name: "Push-Up",
      equipment: "Bodyweight, or hands on a bench",
      dose: "3 × max reps", rest: "60 sec", restSec: 60, tempo: "2-0-1", starter: false,
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
      variations: [
        { name: "Incline push-up", equipment: "Hands on a bench or bar", note: "The higher your hands, the easier. Where to start if floor reps are too hard." },
        { name: "Decline push-up", equipment: "Feet on a bench", note: "Shifts the load to the upper chest and shoulders." },
        { name: "Weighted push-up", equipment: "Plate on your upper back", note: "Once you can do twenty, this is how you keep progressing." },
      ],
      swap: "Chest Press Machine",
    },
    {
      name: "Dumbbell Fly",
      equipment: "Flat bench + dumbbells",
      dose: "3 × 12", rest: "75 sec", restSec: 75, tempo: "3-1-2", starter: false,
      summary:
        "The stretch at the bottom is the whole point. Go lighter than feels right.",
      setup:
        "Flat bench, light dumbbells. If you have never done these, start with a pair you could curl for fifteen.",
      cues: [
        "Lie flat with the dumbbells pressed above your chest, palms facing each other.",
        "Set a soft bend in your elbows and lock it there for the whole set.",
        "Open your arms out and down in a wide arc until you feel a deep stretch across your chest.",
        "Bring them back together above your chest without letting the elbows straighten or bend further.",
      ],
      mistakes: [
        "Turning it into a press by bending your elbows on the way up.",
        "Dropping so deep that your shoulders roll forward. Stop where the stretch is, not past it.",
      ],
      variations: [
        { name: "Cable fly", equipment: "Two cables at shoulder height", note: "Tension stays on at the top where dumbbells go weightless." },
        { name: "Pec deck", equipment: "Pec deck machine", note: "The same arc with the path set for you." },
      ],
      swap: "Pec Deck Fly",
    },
    {
      name: "Decline Press",
      equipment: "Decline bench + dumbbells or barbell",
      dose: "3 × 10", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: false,
      summary:
        "Hits the lower chest, the line along the bottom edge. Most people never train it directly.",
      setup:
        "A decline bench, usually with ankle rollers. Get set on it before someone hands you the weights.",
      cues: [
        "Hook your feet under the rollers and lie back on the decline.",
        "Start with the weight over your lower chest, elbows at about 45 degrees.",
        "Press up until your arms are nearly straight.",
        "Lower under control to the bottom edge of your chest.",
      ],
      mistakes: [
        "Sitting up quickly at the end of a set — blood rushes and it will spin the room.",
        "Bouncing the weight off your ribs at the bottom.",
      ],
      variations: [
        { name: "Decline machine press", equipment: "Decline chest press machine", note: "Same angle, no setup faff." },
        { name: "Dip, leaning forward", equipment: "Dip bars", note: "Lean your torso forward and the chest takes the work." },
      ],
      swap: "Flat Dumbbell Press",
    },
    {
      name: "Smith Machine Bench Press",
      equipment: "Smith machine + bench",
      dose: "4 × 8", rest: "2 min", restSec: 120, tempo: "2-1-1", starter: false,
      summary:
        "Barbell loading with a fixed path and safeties you can set. The best way to press heavy with nobody spotting you.",
      setup:
        "Wheel a flat bench under the Smith bar. Set the safety stops just below your chest, then test them with the empty bar.",
      cues: [
        "Lie so the bar lines up with the middle of your chest, and twist the hooks to unrack.",
        "Lower to your chest with elbows tucked to about 45 degrees.",
        "Press straight up — the machine holds the line for you.",
        "To finish, twist the bar back into the hooks before letting go.",
      ],
      mistakes: [
        "Not setting the safety stops. They are the entire reason to use this machine.",
        "Lying too far up the bench, so the bar comes down on your throat.",
      ],
      variations: [
        { name: "Barbell bench press", equipment: "Barbell + rack", note: "Free bar. Harder, and you need a spotter." },
        { name: "Machine chest press", equipment: "Chest press machine", note: "No bar handling at all." },
      ],
      swap: "Barbell Bench Press",
    },
    {
      name: "Incline Cable Press",
      equipment: "Two low cables + incline bench",
      dose: "3 × 12", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: false,
      summary:
        "Upper chest with tension that never lets up, including at the top where a dumbbell gives you a rest.",
      setup:
        "Drag an adjustable bench between two cable towers and set it to about 30 degrees. Pulleys at their lowest point.",
      cues: [
        "Set the bench between the towers and grab a handle in each hand before you sit.",
        "Lie back with the handles at chest height, elbows at roughly 45 degrees.",
        "Press up and slightly together until your arms are nearly straight.",
        "Let the cables draw your hands back down slowly.",
      ],
      mistakes: [
        "Setting the bench too far forward, so the cables pull you off it.",
        "Rushing. The cable rewards a slow return more than anything else.",
      ],
      variations: [
        { name: "Incline dumbbell press", equipment: "Dumbbells + incline bench", note: "Simpler to set up, heavier loading." },
        { name: "Low-to-high cable fly", equipment: "Two low cables, no bench", note: "Standing version, same upper-chest emphasis." },
      ],
      swap: "Incline Dumbbell Press",
    },
  ]),

  group("back", "Back", "Pull",
    "One vertical pull and one horizontal pull covers the whole back. Everything else is detail.",
    "~35 min", [
    {
      name: "Lat Pulldown",
      equipment: "Lat pulldown machine + wide bar",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Close-grip pulldown", equipment: "V-handle", note: "Narrower grip, more stretch at the bottom, more biceps." },
        { name: "Neutral-grip pulldown", equipment: "Parallel bar handle", note: "Easier on the shoulders if the wide grip pinches." },
        { name: "Single-arm pulldown", equipment: "One D-handle", note: "One side at a time, with a bit of rotation at the bottom." },
      ],
      swap: "Assisted Pull-Up",
    },
    {
      name: "Seated Cable Row",
      equipment: "Low cable row + V-handle",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Wide-grip row", equipment: "Straight bar", note: "Hits the upper back and rear shoulders more than the V-handle." },
        { name: "Machine row", equipment: "Seated row machine", note: "Same movement with a fixed path if the cable station is busy." },
        { name: "Single-arm cable row", equipment: "One D-handle", note: "Lets you pull further back and squeeze harder." },
      ],
      swap: "Chest-Supported Row",
    },
    {
      name: "Chest-Supported Row",
      equipment: "Chest-supported row machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "T-bar row", equipment: "T-bar row machine", note: "Heavier, and the chest pad still stops you cheating." },
        { name: "Incline dumbbell row", equipment: "Incline bench + dumbbells", note: "Lie face down on an incline bench and row. Same idea, no machine needed." },
      ],
      swap: "One-Arm Dumbbell Row",
    },
    {
      name: "One-Arm Dumbbell Row",
      equipment: "Flat bench + one dumbbell",
      dose: "3 × 10 each side", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Kettlebell row", equipment: "Kettlebell + bench", note: "Same movement, slightly different grip." },
        { name: "Meadows row", equipment: "Landmine / barbell in a corner", note: "Angled bar path, big stretch at the bottom." },
        { name: "Cable one-arm row", equipment: "Low cable + D-handle", note: "Tension stays on at the stretch, where a dumbbell goes light." },
      ],
      swap: "Seated Cable Row",
    },
    {
      name: "Face Pull",
      equipment: "Cable tower + rope attachment",
      dose: "3 × 15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
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
      variations: [
        { name: "Band pull-apart", equipment: "Resistance band", note: "Do it anywhere, including as a warm-up before pressing." },
        { name: "Rear delt cable fly", equipment: "Two cables crossed at face height", note: "Straighter arms, more rear delt, less trap." },
      ],
      swap: "Rear Delt Fly",
    },
    {
      name: "Assisted Pull-Up",
      equipment: "Assisted pull-up machine, or bar + band",
      dose: "3 × 6–10", rest: "2 min", restSec: 120, tempo: "2-0-2", starter: false,
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
      variations: [
        { name: "Band-assisted pull-up", equipment: "Pull-up bar + long band", note: "Loop it under your knee. Cheaper than the machine and travels." },
        { name: "Negative pull-up", equipment: "Pull-up bar + a box", note: "Jump to the top and lower for five seconds. The fastest way to your first rep." },
        { name: "Chin-up", equipment: "Pull-up bar, palms towards you", note: "Easier than a pull-up because the biceps help more." },
      ],
      swap: "Lat Pulldown",
    },
    {
      name: "T-Bar Row",
      equipment: "T-bar row machine or landmine",
      dose: "4 × 8–10", rest: "2 min", restSec: 120, tempo: "2-1-2", starter: false,
      summary:
        "Heavy middle-back thickness. The chest pad means your lower back does not have to hold you up.",
      setup:
        "Either the dedicated machine with a chest pad, or one end of a barbell wedged in a corner with a handle over it.",
      cues: [
        "Stand on the platform with your chest against the pad and your knees slightly bent.",
        "Take the handles with your arms hanging straight down.",
        "Pull the weight to your stomach, elbows close to your body.",
        "Squeeze your shoulder blades together, then lower to a full stretch.",
      ],
      mistakes: [
        "Heaving with your legs and back. If your torso bounces, drop a plate.",
        "Cutting the bottom short so the plates never fully hang.",
      ],
      variations: [
        { name: "Chest-supported row", equipment: "Chest-supported row machine", note: "Lighter, stricter, easier to feel." },
        { name: "Barbell bent-over row", equipment: "Barbell", note: "No pad, so your lower back works too. Learn the hinge first." },
      ],
      swap: "Chest-Supported Row",
    },
    {
      name: "Straight-Arm Pulldown",
      equipment: "High cable + straight bar or rope",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
      summary:
        "Isolates the lats without the biceps joining in, which nothing else on this list does.",
      setup:
        "Straight bar on a high pulley. Stand about two steps back so the cable is under tension before you start.",
      cues: [
        "Hold the bar with straight arms at about eye height, hinge forward slightly.",
        "Keep your elbows almost locked — this is the part people get wrong.",
        "Pull the bar down in an arc until it reaches your thighs.",
        "Let it rise back to eye height slowly, feeling the stretch along your sides.",
      ],
      mistakes: [
        "Bending your elbows, which quietly turns it into a triceps pushdown.",
        "Standing too upright so the bar hits your body halfway down.",
      ],
      variations: [
        { name: "Rope straight-arm pulldown", equipment: "High cable + rope", note: "Lets your hands separate at the bottom for a harder squeeze." },
        { name: "Dumbbell pullover", equipment: "One dumbbell + bench", note: "Free-weight version, bigger stretch overhead." },
      ],
      swap: "Lat Pulldown",
    },
    {
      name: "Barbell Bent-Over Row",
      equipment: "Barbell",
      dose: "4 × 6–10", rest: "2 min", restSec: 120, tempo: "2-1-1", starter: false,
      summary:
        "The heaviest back builder there is, and the one that punishes a sloppy hinge. Learn light.",
      setup:
        "A barbell on the floor or in a rack at knee height. Start with the empty bar and film yourself once from the side.",
      cues: [
        "Feet hip-width, grip the bar just outside your knees.",
        "Hinge at the hips until your torso is about 45 degrees, back flat, chest up.",
        "Row the bar to your belly button, elbows close to your body.",
        "Lower under control without letting your back round.",
      ],
      mistakes: [
        "Standing up as you row, which turns it into a shrug.",
        "Rounding your lower back. If it rounds, stop the set — this is the main way people hurt themselves rowing.",
      ],
      variations: [
        { name: "Dumbbell bent-over row", equipment: "Dumbbells", note: "Both arms, more freedom of movement." },
        { name: "Pendlay row", equipment: "Barbell", note: "Bar resets on the floor each rep. Stricter, more explosive." },
        { name: "Chest-supported row", equipment: "Machine with a pad", note: "All the pull, none of the lower-back risk." },
      ],
      swap: "Chest-Supported Row",
    },
    {
      name: "Shrug",
      equipment: "Dumbbells or barbell",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-2-2", starter: false,
      summary:
        "Direct trap work. The pause at the top matters far more than the weight.",
      setup:
        "A pair of heavy dumbbells or a loaded barbell. Straps help once the weight outgrows your grip.",
      cues: [
        "Stand tall holding the weight at your sides, arms straight.",
        "Lift your shoulders straight up towards your ears — no rolling.",
        "Hold at the top for two full seconds.",
        "Lower slowly until your traps stretch at the bottom.",
      ],
      mistakes: [
        "Rolling your shoulders backwards, which does nothing useful and grinds the joint.",
        "Bending your arms. The elbows stay straight throughout.",
      ],
      variations: [
        { name: "Cable shrug", equipment: "Low cable + straight bar", note: "Tension stays on at the bottom." },
        { name: "Trap bar shrug", equipment: "Trap bar", note: "Weight sits beside you rather than in front, which feels better for most people." },
      ],
      swap: "Face Pull",
    },
  ]),

  group("shoulders", "Shoulders", "Push",
    "Presses build the front, raises build the side, and the rear delts are what almost everyone skips.",
    "~30 min", [
    {
      name: "Shoulder Press Machine",
      equipment: "Seated shoulder press machine",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Smith machine press", equipment: "Smith machine", note: "Fixed path, safeties, no balancing." },
        { name: "Landmine press", equipment: "Barbell in a landmine", note: "Angled press that is much kinder to a cranky shoulder." },
      ],
      swap: "Dumbbell Shoulder Press",
    },
    {
      name: "Dumbbell Lateral Raise",
      equipment: "Light dumbbells",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Cable lateral raise", equipment: "Low cable + D-handle", note: "Tension at the bottom where dumbbells give you a free ride." },
        { name: "Machine lateral raise", equipment: "Lateral raise machine", note: "Impossible to swing. Good when you are fried." },
        { name: "Leaning lateral raise", equipment: "Dumbbell + hold a rack", note: "Lean away from a post to extend the range." },
      ],
      swap: "Cable Lateral Raise",
    },
    {
      name: "Rear Delt Fly",
      equipment: "Pec deck set to reverse, or dumbbells",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Bent-over dumbbell fly", equipment: "Dumbbells", note: "Hinge forward and raise out to the sides. No machine required." },
        { name: "Cable rear delt fly", equipment: "Two cables crossed", note: "Constant tension, easiest to feel." },
        { name: "Band pull-apart", equipment: "Resistance band", note: "High reps, use it to warm up." },
      ],
      swap: "Face Pull",
    },
    {
      name: "Dumbbell Shoulder Press",
      equipment: "Upright bench + dumbbells",
      dose: "3 × 8–12", rest: "2 min", restSec: 120, tempo: "2-0-2", starter: true,
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
      variations: [
        { name: "Arnold press", equipment: "Dumbbells", note: "Rotate from palms-in to palms-out as you press. More front delt." },
        { name: "Seated barbell press", equipment: "Barbell + upright bench", note: "Heavier, both arms locked together." },
        { name: "Machine press", equipment: "Shoulder press machine", note: "No balancing at all." },
      ],
      swap: "Shoulder Press Machine",
    },
    {
      name: "Cable Lateral Raise",
      equipment: "Low cable + D-handle",
      dose: "3 × 12–15 each side", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: false,
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
      variations: [
        { name: "Dumbbell lateral raise", equipment: "Dumbbells", note: "Simpler and just as good if the cable station is busy." },
        { name: "Machine lateral raise", equipment: "Lateral raise machine", note: "Fixed path, no swinging." },
      ],
      swap: "Dumbbell Lateral Raise",
    },
    {
      name: "Barbell Overhead Press",
      equipment: "Barbell + squat rack",
      dose: "4 × 6–8", rest: "2–3 min", restSec: 150, tempo: "2-1-1", starter: false,
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
      variations: [
        { name: "Seated dumbbell press", equipment: "Dumbbells + upright bench", note: "Less lower-back demand, easier to learn." },
        { name: "Push press", equipment: "Barbell", note: "A small dip and drive from the legs to move heavier weight overhead." },
        { name: "Machine shoulder press", equipment: "Shoulder press machine", note: "All the load, none of the balance." },
      ],
      swap: "Dumbbell Shoulder Press",
    },
    {
      name: "Arnold Press",
      equipment: "Dumbbells + upright bench",
      dose: "3 × 10", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: false,
      summary:
        "A shoulder press with a rotation built in, so the front of the shoulder works through a longer range.",
      setup:
        "Upright bench, dumbbells lighter than your normal press — the rotation makes it harder than it looks.",
      cues: [
        "Sit with the dumbbells at chest height, palms facing you, elbows tucked in.",
        "As you press up, rotate your palms to face forward.",
        "Finish with your arms nearly straight overhead, palms out.",
        "Reverse the rotation on the way down so you finish palms-in at your chest.",
      ],
      mistakes: [
        "Rotating after you press instead of during. It is one continuous movement.",
        "Going heavy. The rotation under load is where shoulders get cranky.",
      ],
      variations: [
        { name: "Dumbbell shoulder press", equipment: "Dumbbells", note: "Simpler, heavier, no rotation." },
        { name: "Landmine press", equipment: "Barbell in a landmine", note: "Angled and much kinder if your shoulder objects." },
      ],
      swap: "Dumbbell Shoulder Press",
    },
    {
      name: "Upright Row",
      equipment: "EZ bar, cable or dumbbells",
      dose: "3 × 12", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: false,
      summary:
        "Side delts and traps together. Use a wider grip than feels natural and it stops bothering the shoulder.",
      setup:
        "An EZ bar or a low cable with a straight bar. Take a grip about shoulder width, not narrow.",
      cues: [
        "Hold the bar at arm's length in front of your thighs, hands shoulder-width apart.",
        "Pull it straight up the front of your body, leading with your elbows.",
        "Stop when your upper arms reach shoulder height — no higher.",
        "Lower slowly to straight arms.",
      ],
      mistakes: [
        "A narrow grip and pulling to the chin. That combination is what gives this exercise its bad reputation.",
        "Shrugging at the top instead of stopping at shoulder height.",
      ],
      variations: [
        { name: "Cable upright row", equipment: "Low cable + bar", note: "Smoother resistance, easier on the joint." },
        { name: "Wide-grip upright row", equipment: "Barbell", note: "The wider you grip, the more side delt and the less pinch." },
      ],
      swap: "Dumbbell Lateral Raise",
    },
    {
      name: "Landmine Press",
      equipment: "Barbell in a landmine attachment",
      dose: "3 × 10 each side", rest: "90 sec", restSec: 90, tempo: "2-1-2", starter: false,
      summary:
        "An overhead press at an angle. The single best pressing option if straight overhead hurts your shoulder.",
      setup:
        "One end of a barbell in a landmine socket or wedged in a corner. Load the far end.",
      cues: [
        "Stand facing the bar, holding the end at your shoulder with one hand.",
        "Brace your stomach, feet staggered for balance.",
        "Press the bar up and away at roughly 45 degrees until your arm is straight.",
        "Lower under control back to your shoulder.",
      ],
      mistakes: [
        "Leaning back to press. Keep your ribs down.",
        "Letting your elbow flare out wide as you press.",
      ],
      variations: [
        { name: "Two-hand landmine press", equipment: "Barbell in a landmine", note: "Both hands on the end. Heavier, more chest involvement." },
        { name: "Half-kneeling landmine press", equipment: "Barbell in a landmine", note: "Kneeling stops you using your legs at all." },
      ],
      swap: "Shoulder Press Machine",
    },
    {
      name: "Cable Rear Delt Fly",
      equipment: "Two cables crossed at face height",
      dose: "3 × 15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
      summary:
        "The rear delt version with tension all the way through. Easier to feel than any dumbbell version.",
      setup:
        "Two cable towers, both set at about shoulder height, handles crossed so you take the left handle in your right hand.",
      cues: [
        "Stand in the middle and take the handles crossed in front of you.",
        "Arms almost straight, soft elbows, chest up.",
        "Pull your arms out and back in a wide arc until they are level with your shoulders.",
        "Return slowly, letting the cables draw your hands together.",
      ],
      mistakes: [
        "Bending your elbows and turning it into a row.",
        "Going heavy enough that your torso rotates with each rep.",
      ],
      variations: [
        { name: "Rear delt machine", equipment: "Pec deck reversed", note: "Fixed path, no setup." },
        { name: "Bent-over dumbbell fly", equipment: "Dumbbells", note: "No cables needed, but tension drops at the bottom." },
      ],
      swap: "Rear Delt Fly",
    },
  ]),

  group("biceps", "Biceps", "Pull",
    "Curls with your palm up, curls with your palm in. That is genuinely the whole menu.",
    "~20 min", [
    {
      name: "Dumbbell Curl",
      equipment: "Dumbbells",
      dose: "3 × 10–12", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Incline dumbbell curl", equipment: "Dumbbells + bench at 45 degrees", note: "Arms behind your body stretches the biceps harder." },
        { name: "Concentration curl", equipment: "One dumbbell + bench", note: "Elbow braced on your thigh. Impossible to cheat." },
        { name: "Cable curl", equipment: "Low cable", note: "Even tension through the whole rep." },
      ],
      swap: "Cable Curl",
    },
    {
      name: "Hammer Curl",
      equipment: "Dumbbells",
      dose: "3 × 10–12", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Cross-body hammer curl", equipment: "Dumbbells", note: "Curl across to the opposite shoulder. More of the outer arm." },
        { name: "Rope hammer curl", equipment: "Low cable + rope", note: "Same grip, constant tension." },
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Preacher Curl Machine",
      equipment: "Preacher curl machine or bench",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Preacher bench curl", equipment: "Preacher bench + EZ bar", note: "Same angle with a bar instead of a machine." },
        { name: "Single-arm preacher curl", equipment: "Preacher bench + dumbbell", note: "One arm at a time to even out a difference." },
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Cable Curl",
      equipment: "Low cable + straight or EZ bar",
      dose: "3 × 12", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "EZ bar curl", equipment: "EZ barbell", note: "Kinder on the wrists than a straight bar." },
        { name: "Rope curl", equipment: "Low cable + rope", note: "Turn your palms out at the top for a harder squeeze." },
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Barbell Curl",
      equipment: "Straight or EZ barbell",
      dose: "3 × 8–12", rest: "75 sec", restSec: 75, tempo: "2-1-3", starter: false,
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
      variations: [
        { name: "EZ bar curl", equipment: "EZ barbell", note: "Angled grip if straight-bar curls bother your wrists." },
        { name: "Dumbbell curl", equipment: "Dumbbells", note: "One arm at a time so neither can hide." },
      ],
      swap: "Cable Curl",
    },
    {
      name: "Incline Dumbbell Curl",
      equipment: "Dumbbells + bench at 45 degrees",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75, tempo: "3-1-2", starter: false,
      summary:
        "Your arms hang behind your body, which stretches the biceps harder than any standing curl can.",
      setup:
        "Set an adjustable bench to about 45 degrees. Use lighter dumbbells than you would standing — the stretch position is weaker.",
      cues: [
        "Sit back on the incline with a dumbbell in each hand, arms hanging straight down.",
        "Let your shoulders stay back against the pad — do not let them roll forward.",
        "Curl both dumbbells up without moving your upper arms.",
        "Lower all the way until your arms are straight and you feel the stretch.",
      ],
      mistakes: [
        "Rolling your shoulders forward to shorten the range.",
        "Swinging the weights up from the bottom.",
      ],
      variations: [
        { name: "Single-arm incline curl", equipment: "One dumbbell", note: "One side at a time to even out a difference." },
        { name: "Incline hammer curl", equipment: "Dumbbells", note: "Palms facing in for the outer arm." },
      ],
      swap: "Dumbbell Curl",
    },
    {
      name: "Concentration Curl",
      equipment: "One dumbbell + bench",
      dose: "3 × 12 each side", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: false,
      summary:
        "Your elbow is braced on your thigh, so there is no way to cheat. The best feel-it-working curl there is.",
      setup:
        "Sit on the end of a bench with your feet wide. One dumbbell, lighter than you think.",
      cues: [
        "Sit and lean forward, resting your working elbow against the inside of the same-side thigh.",
        "Let the dumbbell hang straight down with your arm fully extended.",
        "Curl up towards your opposite shoulder, keeping the elbow planted on your leg.",
        "Squeeze at the top, then lower slowly to straight.",
      ],
      mistakes: [
        "Lifting your elbow off your thigh to finish a rep.",
        "Rocking your torso backwards to help it up.",
      ],
      variations: [
        { name: "Cable concentration curl", equipment: "Low cable + D-handle", note: "Tension stays on at the top." },
        { name: "Spider curl", equipment: "Incline bench, chest down", note: "Same braced idea, both arms at once." },
      ],
      swap: "Preacher Curl Machine",
    },
    {
      name: "Chin-Up",
      equipment: "Pull-up bar, palms facing you",
      dose: "3 × max reps", rest: "2 min", restSec: 120, tempo: "2-0-2", starter: false,
      summary:
        "The heaviest thing your biceps will ever do, because it moves your whole bodyweight.",
      setup:
        "Any pull-up bar. Palms facing towards you, hands about shoulder-width apart.",
      cues: [
        "Hang from the bar with your palms facing you and your arms straight.",
        "Pull your chest towards the bar, driving your elbows down.",
        "Get your chin clearly over the bar.",
        "Lower all the way to straight arms before the next rep.",
      ],
      mistakes: [
        "Kipping and swinging. If you cannot do it still, use the assisted machine.",
        "Stopping halfway down, which cuts out the part that builds the most.",
      ],
      variations: [
        { name: "Assisted chin-up", equipment: "Assisted pull-up machine", note: "Reduce the help as you get stronger." },
        { name: "Band chin-up", equipment: "Bar + long band", note: "Loop it under a knee." },
        { name: "Negative chin-up", equipment: "Bar + a box", note: "Jump up, lower for five seconds. Fastest route to your first rep." },
      ],
      swap: "Cable Curl",
    },
    {
      name: "Reverse Curl",
      equipment: "EZ bar or dumbbells",
      dose: "3 × 12", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
      summary:
        "Palms down. Builds the forearm and the muscle that sits under the biceps and pushes it up.",
      setup:
        "An EZ bar is kindest here. Expect to use about half what you curl palms-up.",
      cues: [
        "Hold the bar with your palms facing down, hands shoulder-width apart.",
        "Stand tall, elbows pinned at your sides.",
        "Curl up to chest height without letting your wrists bend back.",
        "Lower slowly to straight arms.",
      ],
      mistakes: [
        "Letting your wrists collapse backwards under the weight.",
        "Using your normal curl weight. It will not go.",
      ],
      variations: [
        { name: "Cable reverse curl", equipment: "Low cable + straight bar", note: "Constant tension, easier on the wrists." },
        { name: "Reverse dumbbell curl", equipment: "Dumbbells", note: "One arm at a time." },
      ],
      swap: "Hammer Curl",
    },
    {
      name: "Cable Rope Hammer Curl",
      equipment: "Low cable + rope",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
      summary:
        "Hammer grip with the cable's even tension. A good finisher when the dumbbells are all taken.",
      setup:
        "Rope on the lowest pulley. Stand one step back so there is tension before the first rep.",
      cues: [
        "Hold the rope ends with your palms facing each other.",
        "Elbows tucked at your sides, stand tall.",
        "Curl up to shoulder height, keeping the rope ends apart.",
        "Lower slowly, resisting the cable to straight arms.",
      ],
      mistakes: [
        "Letting your elbows travel forward at the top.",
        "Standing so close that the stack rests between reps.",
      ],
      variations: [
        { name: "Dumbbell hammer curl", equipment: "Dumbbells", note: "Simpler, and you can go heavier." },
        { name: "Cross-body hammer curl", equipment: "Dumbbells", note: "Curl across your body to the opposite shoulder." },
      ],
      swap: "Hammer Curl",
    },
  ]),

  group("triceps", "Triceps", "Push",
    "Two thirds of your arm is triceps. Push down for the outer head, press overhead for the long one.",
    "~20 min", [
    {
      name: "Rope Pushdown",
      equipment: "High cable + rope attachment",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Straight bar pushdown", equipment: "High cable + straight bar", note: "Slightly stronger position, so you can load it heavier." },
        { name: "Single-arm pushdown", equipment: "High cable + D-handle", note: "Turn your palm up at the bottom for a harder contraction." },
        { name: "Bar pushdown with a V-handle", equipment: "High cable + V-handle", note: "Neutral grip if your wrists complain." },
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Overhead Triceps Extension",
      equipment: "One dumbbell, or a rope on a low cable",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75, tempo: "3-1-2", starter: true,
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
      variations: [
        { name: "Rope overhead extension", equipment: "Low cable + rope", note: "Constant tension through the stretch, which the dumbbell loses." },
        { name: "Single-arm overhead extension", equipment: "One dumbbell", note: "One side at a time, easier to keep the elbow still." },
        { name: "Skull crusher", equipment: "EZ bar + flat bench", note: "Lying version. Same muscle, heavier loading." },
      ],
      swap: "Rope Pushdown",
    },
    {
      name: "Triceps Dip Machine",
      equipment: "Seated dip machine",
      dose: "3 × 10–12", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Parallel bar dip", equipment: "Dip bars", note: "The bodyweight version. Stay upright to keep it on the triceps." },
        { name: "Assisted dip", equipment: "Assisted dip machine", note: "Takes weight off until you can do them clean." },
      ],
      swap: "Bench Dip",
    },
    {
      name: "Bench Dip",
      equipment: "One flat bench",
      dose: "3 × 10–15", rest: "60 sec", restSec: 60, tempo: "2-0-2", starter: true,
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
      variations: [
        { name: "Parallel bar dip", equipment: "Dip bars", note: "Harder and better once you can do fifteen bench dips." },
        { name: "Feet-elevated bench dip", equipment: "Two benches", note: "Feet on a second bench to add load without plates." },
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Close-Grip Bench Press",
      equipment: "Flat bench + barbell",
      dose: "3 × 8–10", rest: "2 min", restSec: 120, tempo: "2-1-1", starter: false,
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
      variations: [
        { name: "Dumbbell close press", equipment: "Dumbbells held together", note: "Squeeze the dumbbells together the whole set." },
        { name: "Smith close-grip press", equipment: "Smith machine", note: "Fixed path, safeties, no spotter needed." },
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Skull Crusher",
      equipment: "EZ bar + flat bench",
      dose: "3 × 10", rest: "90 sec", restSec: 90, tempo: "3-1-2", starter: false,
      summary:
        "The heaviest way to load the long head lying down. Use the EZ bar, not a straight one.",
      setup:
        "Flat bench, EZ bar. Start light — the name is not entirely a joke.",
      cues: [
        "Lie flat holding the bar above your chest with straight arms.",
        "Keep your upper arms still and tilted slightly back towards your head.",
        "Bend at the elbows to lower the bar towards your forehead or just behind it.",
        "Press back up to straight without letting your upper arms drift.",
      ],
      mistakes: [
        "Letting your elbows flare wide, which shifts the load off the triceps.",
        "Going heavy before the movement is smooth. This one deserves a slow build.",
      ],
      variations: [
        { name: "Dumbbell skull crusher", equipment: "Dumbbells", note: "Each arm free, easier on the elbows." },
        { name: "Cable skull crusher", equipment: "Low cable + rope, lying", note: "Constant tension and no elbow pinch at the top." },
      ],
      swap: "Overhead Triceps Extension",
    },
    {
      name: "Parallel Bar Dip",
      equipment: "Dip bars",
      dose: "3 × 8–12", rest: "2 min", restSec: 120, tempo: "2-0-2", starter: false,
      summary:
        "Bodyweight triceps work, and the closest thing to a bench press you can do with no weights at all.",
      setup:
        "Two parallel bars at about hip height. Use the assisted machine or a band if a full rep is not there yet.",
      cues: [
        "Grip the bars and press up to straight arms, body hanging between them.",
        "Stay upright — leaning forward moves the work to your chest.",
        "Lower until your elbows reach about 90 degrees.",
        "Press back up to straight without locking hard.",
      ],
      mistakes: [
        "Dropping below 90 degrees, which strains the front of the shoulder.",
        "Letting your shoulders shrug up to your ears at the bottom.",
      ],
      variations: [
        { name: "Assisted dip", equipment: "Assisted dip machine", note: "Takes weight off until you can do clean reps." },
        { name: "Bench dip", equipment: "One bench", note: "Easier, and needs no dip station." },
        { name: "Weighted dip", equipment: "Dip belt + plate", note: "Once ten reps is easy." },
      ],
      swap: "Triceps Dip Machine",
    },
    {
      name: "Single-Arm Cable Pushdown",
      equipment: "High cable + D-handle",
      dose: "3 × 12 each side", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: false,
      summary:
        "One arm at a time, palm turned up at the bottom. The hardest contraction you can get on a triceps.",
      setup:
        "D-handle on a high pulley. Very light weight — much less than you use with the rope.",
      cues: [
        "Take the handle in one hand with your palm facing up.",
        "Tuck your elbow hard against your side and keep it there.",
        "Push down until your arm is completely straight.",
        "Squeeze for a second, then return only to 90 degrees.",
      ],
      mistakes: [
        "Letting your elbow drift back behind you as you push.",
        "Leaning over the handle to force out extra reps.",
      ],
      variations: [
        { name: "Rope pushdown", equipment: "High cable + rope", note: "Both arms, heavier." },
        { name: "Reverse-grip pushdown", equipment: "High cable + straight bar", note: "Palms up on a bar. Same idea, both arms." },
      ],
      swap: "Rope Pushdown",
    },
    {
      name: "Diamond Push-Up",
      equipment: "Bodyweight",
      dose: "3 × max reps", rest: "60 sec", restSec: 60, tempo: "2-0-1", starter: false,
      summary:
        "The bodyweight triceps exercise. Hands close together under your chest.",
      setup:
        "Nothing needed. Put your hands on a bench if the floor version is too hard to start.",
      cues: [
        "Hands together under your chest, index fingers and thumbs touching.",
        "Body in one straight line, glutes squeezed.",
        "Lower until your chest touches your hands, elbows brushing your ribs.",
        "Press back up without letting your hips sag.",
      ],
      mistakes: [
        "Letting your elbows flare out sideways, which makes it a chest exercise.",
        "Hips dropping towards the floor.",
      ],
      variations: [
        { name: "Incline diamond push-up", equipment: "Hands on a bench", note: "Easier. Lower the surface as you get stronger." },
        { name: "Close-grip push-up", equipment: "Bodyweight", note: "Hands shoulder-width rather than touching. Kinder on the wrists." },
      ],
      swap: "Bench Dip",
    },
    {
      name: "Machine Triceps Extension",
      equipment: "Triceps extension machine",
      dose: "3 × 12", rest: "75 sec", restSec: 75, tempo: "2-1-2", starter: false,
      summary:
        "Fixed path, back supported. The easiest way to go heavy on triceps without any setup.",
      setup:
        "Seated machine with handles near your shoulders. Set the seat so your elbows line up with the pivot.",
      cues: [
        "Sit with your back flat against the pad and your elbows on the rest.",
        "Take the handles with your arms bent.",
        "Push forward and down until your arms are straight.",
        "Return under control to a full stretch without banging the stack.",
      ],
      mistakes: [
        "Elbows sliding off the pad as you push.",
        "Using your bodyweight to lean into it.",
      ],
      variations: [
        { name: "Rope pushdown", equipment: "High cable + rope", note: "Standing version, more freedom." },
        { name: "Overhead extension", equipment: "Dumbbell or rope", note: "Hits the long head, which this machine mostly misses." },
      ],
      swap: "Rope Pushdown",
    },
  ]),

  group("abs", "Abs & Core", "Core",
    "Train the core to resist movement, not just to crunch. Bracing is what protects your back under a heavy bar.",
    "~15 min", [
    {
      name: "Plank",
      equipment: "Mat, bodyweight",
      dose: "3 × 30–60 sec", rest: "45 sec", restSec: 45, tempo: "Hold", starter: true,
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
      variations: [
        { name: "Side plank", equipment: "Bodyweight", note: "Same idea, loads the side of your torso." },
        { name: "Long-lever plank", equipment: "Bodyweight", note: "Walk your elbows further forward. Far harder, no weight needed." },
        { name: "Weighted plank", equipment: "Plate on your back", note: "How to progress once a minute is easy." },
      ],
      swap: "Dead Bug",
    },
    {
      name: "Dead Bug",
      equipment: "Mat, bodyweight",
      dose: "3 × 10 each side", rest: "45 sec", restSec: 45, tempo: "3-1-3", starter: true,
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
      variations: [
        { name: "Bird dog", equipment: "Bodyweight, on all fours", note: "Opposite arm and leg. Same anti-rotation idea, upright." },
        { name: "Dead bug with a band", equipment: "Band anchored behind you", note: "Hold the band overhead to add load." },
      ],
      swap: "Plank",
    },
    {
      name: "Hanging Knee Raise",
      equipment: "Pull-up bar or captain's chair",
      dose: "3 × 10–15", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Captain's chair knee raise", equipment: "Captain's chair", note: "Back supported, no swinging. Start here." },
        { name: "Hanging leg raise", equipment: "Pull-up bar", note: "Straight legs. Much harder." },
        { name: "Lying leg raise", equipment: "Floor or bench", note: "No equipment at all." },
      ],
      swap: "Cable Crunch",
    },
    {
      name: "Cable Crunch",
      equipment: "High cable + rope",
      dose: "3 × 15", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Machine crunch", equipment: "Ab crunch machine", note: "Same loaded crunch, seated." },
        { name: "Weighted sit-up", equipment: "Plate held at your chest", note: "No cable needed." },
      ],
      swap: "Bicycle Crunch",
    },
    {
      name: "Bicycle Crunch",
      equipment: "Mat, bodyweight",
      dose: "3 × 20 total", rest: "45 sec", restSec: 45, tempo: "2-0-2", starter: false,
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
      variations: [
        { name: "Russian twist", equipment: "Plate or medicine ball", note: "Seated rotation for the obliques." },
        { name: "Side plank with reach", equipment: "Bodyweight", note: "Less spine flexion if crunches bother your back." },
      ],
      swap: "Dead Bug",
    },
    {
      name: "Russian Twist",
      equipment: "Plate or medicine ball",
      dose: "3 × 20 total", rest: "45 sec", restSec: 45, tempo: "2-0-2", starter: false,
      summary:
        "Rotation for the obliques down the sides of your waist. Slow and controlled beats fast and floppy.",
      setup:
        "A light plate or a medicine ball. Sit on a mat with your knees bent.",
      cues: [
        "Sit with your knees bent and heels on the floor, leaning back to about 45 degrees.",
        "Hold the weight at your chest with both hands.",
        "Rotate your torso to touch the weight down beside one hip.",
        "Rotate through to the other side, moving from your ribs rather than your arms.",
      ],
      mistakes: [
        "Swinging your arms while your torso stays still.",
        "Rounding your lower back as you lean. Keep your chest up.",
      ],
      variations: [
        { name: "Bodyweight twist", equipment: "No weight", note: "Start here, hands together." },
        { name: "Feet-up twist", equipment: "Plate, heels off the floor", note: "Much harder. Only once the basic version is easy." },
      ],
      swap: "Bicycle Crunch",
    },
    {
      name: "Ab Wheel Rollout",
      equipment: "Ab wheel or a barbell",
      dose: "3 × 8–12", rest: "60 sec", restSec: 60, tempo: "3-1-2", starter: false,
      summary:
        "The hardest core exercise most gyms have. Start on your knees and only roll as far as you can hold a flat back.",
      setup:
        "An ab wheel, or a loaded barbell with round plates. Kneel on a mat or a folded towel.",
      cues: [
        "Kneel with the wheel under your shoulders, arms straight.",
        "Brace your stomach and squeeze your glutes before you move.",
        "Roll forward only as far as you can go without your lower back arching.",
        "Pull yourself back to the start using your stomach, not your arms.",
      ],
      mistakes: [
        "Rolling out until your back sags. That range is the exercise, not a target to beat.",
        "Pulling back with your arms and hip flexors.",
      ],
      variations: [
        { name: "Standing rollout", equipment: "Ab wheel", note: "Advanced. Do not attempt until kneeling reps are easy." },
        { name: "Barbell rollout", equipment: "Barbell with plates", note: "Same movement if there is no wheel." },
        { name: "Stability ball rollout", equipment: "Exercise ball", note: "Forearms on the ball. Much easier entry point." },
      ],
      swap: "Plank",
    },
    {
      name: "Side Plank",
      equipment: "Mat, bodyweight",
      dose: "3 × 30 sec each side", rest: "45 sec", restSec: 45, tempo: "Hold", starter: false,
      summary:
        "Loads the side of your torso, which the normal plank barely touches. Also good for a cranky lower back.",
      setup:
        "A mat. Nothing else.",
      cues: [
        "Lie on your side with your elbow under your shoulder and your legs stacked.",
        "Lift your hips until your body is a straight line from head to feet.",
        "Keep your top shoulder stacked over the bottom one — do not roll forward.",
        "Hold, breathing normally, then swap sides.",
      ],
      mistakes: [
        "Hips dropping towards the floor as the set goes on.",
        "Rolling your chest towards the floor.",
      ],
      variations: [
        { name: "Knee side plank", equipment: "Bodyweight", note: "Bend your knees to shorten the lever. Much easier." },
        { name: "Side plank with hip dip", equipment: "Bodyweight", note: "Lower and lift the hip for reps instead of a hold." },
      ],
      swap: "Plank",
    },
    {
      name: "Reverse Crunch",
      equipment: "Mat, bodyweight",
      dose: "3 × 15", rest: "45 sec", restSec: 45, tempo: "2-1-3", starter: false,
      summary:
        "The lower abs, and far kinder to your neck than a sit-up. The hips curling off the floor is the whole rep.",
      setup:
        "A mat. Hold the bench legs or the floor behind your head for stability.",
      cues: [
        "Lie on your back with your knees bent and lifted above your hips.",
        "Press your lower back into the floor.",
        "Curl your hips up off the floor, bringing your knees towards your chest.",
        "Lower slowly, one vertebra at a time, without letting your feet touch down.",
      ],
      mistakes: [
        "Swinging your legs to generate momentum.",
        "Only moving your knees. The hips must leave the floor or nothing is happening.",
      ],
      variations: [
        { name: "Decline reverse crunch", equipment: "Decline bench", note: "Hold the top of the bench. Much harder." },
        { name: "Hanging knee raise", equipment: "Pull-up bar or chair", note: "The standing version of the same curl." },
      ],
      swap: "Hanging Knee Raise",
    },
    {
      name: "Pallof Press",
      equipment: "Cable or band at chest height",
      dose: "3 × 12 each side", rest: "45 sec", restSec: 45, tempo: "2-2-2", starter: false,
      summary:
        "You resist a rotation rather than making one. The most direct training there is for bracing under a heavy bar.",
      setup:
        "A cable or band at chest height. Stand side-on, a step or two away so there is real tension.",
      cues: [
        "Stand side-on to the cable and hold the handle at your chest with both hands.",
        "Step out until the cable pulls hard on you sideways.",
        "Press your hands straight out in front of your chest without letting your torso rotate.",
        "Hold for two seconds, then bring your hands back in.",
      ],
      mistakes: [
        "Letting your shoulders turn towards the machine. Nothing should rotate.",
        "Standing too close, so there is no sideways pull to resist.",
      ],
      variations: [
        { name: "Band Pallof press", equipment: "Resistance band", note: "Same thing, and you can do it anywhere." },
        { name: "Half-kneeling Pallof press", equipment: "Cable, one knee down", note: "Takes your legs out of it." },
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
      dose: "3 × 10–12", rest: "2 min", restSec: 120, tempo: "2-1-2", starter: true,
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
      variations: [
        { name: "Hack squat", equipment: "Hack squat machine", note: "More upright, more quad, still back-supported." },
        { name: "Smith machine squat", equipment: "Smith machine", note: "A squat pattern with a fixed bar path." },
        { name: "Single-leg press", equipment: "Leg press machine", note: "One leg at a time to even out a difference." },
      ],
      swap: "Goblet Squat",
    },
    {
      name: "Goblet Squat",
      equipment: "One dumbbell or kettlebell",
      dose: "3 × 10–12", rest: "90 sec", restSec: 90, tempo: "3-1-2", starter: true,
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
      variations: [
        { name: "Barbell back squat", equipment: "Barbell + rack", note: "The heavy version once your form is solid." },
        { name: "Front squat", equipment: "Barbell + rack", note: "Bar on the front shoulders. More quad, more upright." },
        { name: "Hack squat machine", equipment: "Hack squat machine", note: "All the quad work with your back supported." },
      ],
      swap: "Leg Press",
    },
    {
      name: "Romanian Deadlift",
      equipment: "Dumbbells or a barbell",
      dose: "3 × 10–12", rest: "2 min", restSec: 120, tempo: "3-1-2", starter: true,
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
      variations: [
        { name: "Barbell RDL", equipment: "Barbell", note: "Heavier than dumbbells once the movement clicks." },
        { name: "Single-leg RDL", equipment: "One dumbbell", note: "Balance and glutes together. Go light." },
        { name: "Good morning", equipment: "Barbell on your back", note: "Same hinge, bar on your shoulders. Light weight only." },
      ],
      swap: "Seated Leg Curl",
    },
    {
      name: "Seated Leg Curl",
      equipment: "Seated or lying leg curl machine",
      dose: "3 × 12–15", rest: "75 sec", restSec: 75, tempo: "2-1-3", starter: true,
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
      variations: [
        { name: "Lying leg curl", equipment: "Lying leg curl machine", note: "Face down. Slightly different hamstring emphasis." },
        { name: "Nordic curl", equipment: "Bodyweight, anchor your feet", note: "Brutal and free. Lower as slowly as you can." },
        { name: "Stability ball curl", equipment: "Exercise ball", note: "Heels on the ball, hips up, roll it in." },
      ],
      swap: "Romanian Deadlift",
    },
    {
      name: "Walking Lunge",
      equipment: "Dumbbells, or bodyweight",
      dose: "3 × 10 each leg", rest: "90 sec", restSec: 90, tempo: "2-0-2", starter: false,
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
      variations: [
        { name: "Reverse lunge", equipment: "Dumbbells", note: "Step backwards instead. Much kinder on the knees." },
        { name: "Bulgarian split squat", equipment: "Bench + dumbbells", note: "Back foot elevated. The hardest single-leg exercise there is." },
        { name: "Static lunge", equipment: "Dumbbells or bodyweight", note: "Stay in one spot. Easier to balance." },
      ],
      swap: "Leg Press",
    },
    {
      name: "Standing Calf Raise",
      equipment: "Calf raise machine or a step",
      dose: "3 × 15–20", rest: "60 sec", restSec: 60, tempo: "2-2-3", starter: false,
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
      variations: [
        { name: "Seated calf raise", equipment: "Seated calf machine", note: "Bent knee hits the deeper calf muscle." },
        { name: "Leg press calf raise", equipment: "Leg press machine", note: "Push the platform with your toes only." },
        { name: "Single-leg step raise", equipment: "A step, bodyweight", note: "No machine at all. Do twenty a side." },
      ],
      swap: "Leg Press",
    },
    {
      name: "Bulgarian Split Squat",
      equipment: "Bench + dumbbells",
      dose: "3 × 8–10 each leg", rest: "90 sec", restSec: 90, tempo: "3-1-2", starter: false,
      summary:
        "The hardest single-leg exercise there is. Brutal, and it fixes side-to-side differences faster than anything.",
      setup:
        "One bench and a pair of dumbbells. Start with bodyweight only for the first session — the balance is the hard part.",
      cues: [
        "Stand about a stride in front of a bench and rest the top of your back foot on it.",
        "Chest up, front foot flat, weights hanging at your sides.",
        "Lower straight down until your front thigh is about parallel and your back knee nears the floor.",
        "Drive up through your front heel without letting your torso fall forward.",
      ],
      mistakes: [
        "Standing too close to the bench, which forces your front knee far past your toes.",
        "Pushing off your back foot. It is there for balance only.",
      ],
      variations: [
        { name: "Bodyweight split squat", equipment: "No weight", note: "Learn the balance first." },
        { name: "Smith machine split squat", equipment: "Smith machine", note: "The bar holds the balance for you so you can just push." },
        { name: "Front-foot-elevated split squat", equipment: "A plate under the front foot", note: "More range, more stretch through the glute." },
      ],
      swap: "Walking Lunge",
    },
    {
      name: "Hack Squat",
      equipment: "Hack squat machine",
      dose: "3 × 10–12", rest: "2 min", restSec: 120, tempo: "3-1-2", starter: false,
      summary:
        "All the quad work of a squat with your back supported by the pad. If your gym has one, use it.",
      setup:
        "The angled sled machine you stand in, shoulders under the pads. Release the handles to start, twist them back to rack it.",
      cues: [
        "Set your shoulders under the pads and your feet shoulder-width on the platform.",
        "Release the safety handles and take the weight.",
        "Lower until your thighs are about parallel, knees tracking over your toes.",
        "Drive back up through your whole foot without locking your knees hard.",
      ],
      mistakes: [
        "Letting your lower back peel off the pad at the bottom.",
        "Setting your feet too low on the platform, which forces the knees forward.",
      ],
      variations: [
        { name: "Leg press", equipment: "Leg press machine", note: "Similar loading, seated rather than standing." },
        { name: "Smith machine squat", equipment: "Smith machine", note: "A fixed bar path with safeties." },
        { name: "Barbell front squat", equipment: "Barbell + rack", note: "The free-weight equivalent. Much harder to balance." },
      ],
      swap: "Leg Press",
    },
    {
      name: "Hip Thrust",
      equipment: "Bench + barbell with a pad",
      dose: "3 × 10–12", rest: "2 min", restSec: 120, tempo: "2-2-2", starter: false,
      summary:
        "The most direct glute exercise there is. The squeeze at the top matters more than the number on the bar.",
      setup:
        "A bench against a wall so it cannot slide, a barbell, and a thick pad for your hips. Roll the bar over your legs while sitting on the floor.",
      cues: [
        "Sit on the floor with your upper back against the bench and the padded bar over your hips.",
        "Feet flat, shin vertical at the top, chin tucked to your chest.",
        "Drive through your heels until your hips are level with your knees.",
        "Squeeze your glutes hard for two seconds, then lower under control.",
      ],
      mistakes: [
        "Arching your lower back at the top instead of squeezing the glutes. Tuck the chin and it fixes itself.",
        "Feet too far away, which turns it into a hamstring exercise.",
      ],
      variations: [
        { name: "Glute bridge", equipment: "Bodyweight, on the floor", note: "No bench or bar. Start here." },
        { name: "Single-leg hip thrust", equipment: "Bench, bodyweight", note: "One leg at a time. Far harder than it looks." },
        { name: "Machine hip thrust", equipment: "Hip thrust machine", note: "No bar to roll into place." },
      ],
      swap: "Glute Bridge",
    },
    {
      name: "Leg Extension",
      equipment: "Leg extension machine",
      dose: "3 × 12–15", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: false,
      summary:
        "Pure quad. Useful as a finisher, or as a warm-up to get blood into the knee before you squat.",
      setup:
        "Seated machine with a pad across your ankles. Set the backrest so your knee lines up with the machine's pivot.",
      cues: [
        "Sit with your back against the pad and the roller just above your ankles.",
        "Hold the handles at your sides.",
        "Straighten your legs fully and squeeze at the top for a second.",
        "Lower slowly — count three — without letting the stack touch down.",
      ],
      mistakes: [
        "Kicking the weight up with a swing and letting it crash back.",
        "Setting the seat so your knee sits in front of the pivot, which grinds the joint.",
      ],
      variations: [
        { name: "Single-leg extension", equipment: "Same machine", note: "One leg at a time to even out a difference." },
        { name: "Sissy squat", equipment: "Bodyweight, hold a rack", note: "No machine. Lean back as you bend the knees." },
      ],
      swap: "Leg Press",
    },
    {
      name: "Seated Calf Raise",
      equipment: "Seated calf machine",
      dose: "3 × 15–20", rest: "60 sec", restSec: 60, tempo: "2-2-3", starter: false,
      summary:
        "Bent knee, which shifts the work to the deeper calf muscle the standing version misses.",
      setup:
        "Seated machine with a pad across your thighs. Balls of your feet on the platform, heels hanging.",
      cues: [
        "Sit with the pad low on your thighs, just above the knees.",
        "Balls of your feet on the platform with your heels hanging off.",
        "Press up onto your toes as high as you can and hold for two seconds.",
        "Lower slowly until you feel a deep stretch, then pause before the next rep.",
      ],
      mistakes: [
        "Bouncing through the reps using the tendon instead of the muscle.",
        "Cutting the stretch short at the bottom.",
      ],
      variations: [
        { name: "Standing calf raise", equipment: "Standing machine or a step", note: "Straight leg, hits the bigger outer calf." },
        { name: "Leg press calf raise", equipment: "Leg press machine", note: "Push the platform with your toes only." },
      ],
      swap: "Standing Calf Raise",
    },
  ]),
  group("cardio", "Cardio", "Conditioning",
    "Lift first, then cardio. Walking burns nearly as much as running and leaves your legs alone.",
    "~25 min", [
    {
      name: "Incline Treadmill Walk",
      equipment: "Treadmill",
      dose: "20–30 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "The best fat-loss cardio for someone who lifts: a high burn that leaves your legs fresh for the next leg day.",
      setup:
        "Any treadmill. Incline 8–12%, speed 4.5–5.5 km/h. Adjust the speed until you can talk but not sing.",
      cues: [
        "Set the incline first, then find a walking speed you could hold for half an hour.",
        "Let go of the handrails — holding on is what makes it feel easy and burn almost nothing.",
        "Stand tall, short steps, let your heel land first.",
        "If you have to hold on to keep up, lower the speed rather than the incline.",
      ],
      mistakes: [
        "Gripping the rails. It cuts the work by roughly a third.",
        "Running instead. Running interferes with leg training far more than walking does.",
      ],
      variations: [
        { name: "Stair climber", equipment: "Stairmaster", note: "Same idea, harder, and no rails to cheat on." },
        { name: "Outdoor hill walk", equipment: "A hill", note: "Free, and easier on the mind than a screen." },
        { name: "Weighted vest walk", equipment: "Vest + flat treadmill", note: "Adds load without adding impact." },
      ],
      swap: "Stair Climber",
    },
    {
      name: "Stationary Bike",
      equipment: "Upright or recumbent bike",
      dose: "20–30 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "Zero impact, so you can do it the day after legs without making anything worse.",
      setup:
        "Set the seat so your leg is almost straight at the bottom of the pedal stroke — a slight bend, never locked.",
      cues: [
        "Adjust the seat height before you start. Too low is what wrecks knees over time.",
        "Set a resistance where your breathing is up but you can still speak in sentences.",
        "Hold a steady cadence of about 80 revolutions a minute.",
        "Stay seated and upright rather than hunching over the bars.",
      ],
      mistakes: [
        "Seat far too low, which grinds the front of the knee.",
        "Resistance so light that your legs spin without effort.",
      ],
      variations: [
        { name: "Recumbent bike", equipment: "Recumbent bike", note: "Back supported. Best if your lower back complains." },
        { name: "Assault bike", equipment: "Air bike", note: "Arms and legs together. Far harder, good for intervals." },
        { name: "Spin bike", equipment: "Spin bike", note: "Standing climbs and sprints if a steady sit bores you." },
      ],
      swap: "Elliptical",
    },
    {
      name: "Stair Climber",
      equipment: "Stairmaster",
      dose: "15–20 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "One of the highest-burn machines in the gym, and it hits the glutes hard while it does it.",
      setup:
        "The rotating staircase. Start at a low level — level 5 is plenty for a first session.",
      cues: [
        "Stand upright with only a light fingertip touch on the rails for balance.",
        "Take full steps onto each stair rather than short shuffles.",
        "Let your whole foot land, not just the toes.",
        "Pick a level you can hold for the full block rather than one you have to quit.",
      ],
      mistakes: [
        "Leaning your bodyweight onto the rails, which halves the work.",
        "Tiny fast steps on a high level. Slower and taller burns more.",
      ],
      variations: [
        { name: "Incline treadmill walk", equipment: "Treadmill", note: "Similar burn, easier on the knees." },
        { name: "Real stairs", equipment: "Any stairwell", note: "Free. Walk down slowly rather than running." },
      ],
      swap: "Incline Treadmill Walk",
    },
    {
      name: "Rowing Machine",
      equipment: "Rower (erg)",
      dose: "15–20 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "The only cardio machine that trains your back as well as your legs. The order of the stroke is everything.",
      setup:
        "Strap your feet in with the strap across the widest part of your foot. Damper setting 4–6, not 10.",
      cues: [
        "Start compressed: shins vertical, arms straight, shoulders in front of your hips.",
        "Drive with your legs first until they are almost straight.",
        "Then lean your torso back, and only then pull the handle to your lower ribs.",
        "Reverse it exactly: arms away, lean forward, then bend the knees.",
      ],
      mistakes: [
        "Pulling with your arms first. It is legs, body, arms — in that order, every stroke.",
        "Setting the damper to 10 because it feels serious. It just makes it slow and heavy.",
      ],
      variations: [
        { name: "Ski erg", equipment: "Ski machine", note: "Same idea, more upper body." },
        { name: "Assault bike", equipment: "Air bike", note: "Similar full-body burn without the technique." },
      ],
      swap: "Elliptical",
    },
    {
      name: "Elliptical",
      equipment: "Elliptical trainer",
      dose: "20–30 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "The gentlest machine on your joints. Worth knowing about if your knees or ankles object to everything else.",
      setup:
        "Any elliptical. Use the moving handles so it is not purely a leg exercise.",
      cues: [
        "Stand tall, feet flat on the pedals, and take the moving handles.",
        "Push and pull with your arms as well as driving with your legs.",
        "Set a resistance that makes your breathing noticeably heavier.",
        "Hold a steady pace rather than coasting through the easy part of the stroke.",
      ],
      mistakes: [
        "Leaning on the fixed rails and letting the machine carry you.",
        "Setting resistance so low that momentum does the work.",
      ],
      variations: [
        { name: "Cross-trainer intervals", equipment: "Elliptical", note: "30 seconds hard, 90 easy, twelve rounds." },
        { name: "Stationary bike", equipment: "Bike", note: "Similar impact-free option." },
      ],
      swap: "Stationary Bike",
    },
    {
      name: "Treadmill Intervals",
      equipment: "Treadmill",
      dose: "8 × 1 min hard", rest: "90 sec walk", restSec: 90, tempo: "Intervals", starter: false,
      summary:
        "Twenty minutes that does what forty of steady walking would. Hard, and not for the day before legs.",
      setup:
        "Any treadmill. Find your hard pace first at a walk-up, then start the clock.",
      cues: [
        "Warm up for five minutes at an easy walk.",
        "Run one minute at a pace you could hold for about three minutes, no faster.",
        "Step to the side rails and walk or stand for ninety seconds.",
        "Repeat eight times, then walk five minutes to cool down.",
      ],
      mistakes: [
        "Going all-out on the first interval and fading by the fourth. Even pace across all eight.",
        "Doing these the day before or after a heavy leg session.",
      ],
      variations: [
        { name: "Bike intervals", equipment: "Stationary bike", note: "No impact, same effect. Best option if your knees complain." },
        { name: "Assault bike intervals", equipment: "Air bike", note: "The hardest version. 30 seconds is plenty." },
        { name: "Hill sprints", equipment: "Outdoor hill", note: "Free, and the hill limits your speed so you cannot overdo it." },
      ],
      swap: "Incline Treadmill Walk",
    },
    {
      name: "Jump Rope",
      equipment: "Skipping rope",
      dose: "10 × 1 min", rest: "30 sec", restSec: 30, tempo: "Intervals", starter: false,
      summary:
        "Cheap, portable, and a real conditioning tool. Also the fastest way to warm up a whole body.",
      setup:
        "A rope that reaches your armpits when you stand on the middle. Skip on a hard flat surface, not carpet.",
      cues: [
        "Hold the handles at hip height with your elbows tucked in.",
        "Turn the rope with your wrists, not your arms.",
        "Take small low hops, landing on the balls of your feet.",
        "Keep your knees soft — you are absorbing, not bouncing.",
      ],
      mistakes: [
        "Jumping far too high. An inch is enough.",
        "Turning the rope with big arm circles, which tires your shoulders before your legs.",
      ],
      variations: [
        { name: "Single-unders", equipment: "Rope", note: "The standard skip. Master this before anything fancier." },
        { name: "High knees, no rope", equipment: "Bodyweight", note: "Same rhythm with no rope to trip over." },
      ],
      swap: "Treadmill Intervals",
    },
    {
      name: "Assault Bike",
      equipment: "Air bike (fan bike)",
      dose: "10 × 20 sec hard", rest: "40 sec", restSec: 40, tempo: "Intervals", starter: false,
      summary:
        "Arms and legs at once against a fan that pushes back harder the faster you go. There is no coasting on it.",
      setup:
        "The bike with the big fan wheel and moving handles. It does not need a resistance setting — your effort is the resistance.",
      cues: [
        "Set the seat so your leg is almost straight at the bottom of the stroke.",
        "Push and pull the handles as hard as you drive the pedals.",
        "Go hard for twenty seconds, then keep the legs turning slowly for forty.",
        "Ten rounds is roughly ten minutes and will be enough.",
      ],
      mistakes: [
        "Treating it like a normal bike and using only your legs.",
        "Starting at full effort. Build across the first three rounds.",
      ],
      variations: [
        { name: "Rowing intervals", equipment: "Rower", note: "Similar full-body demand, more technique." },
        { name: "Bike sprints", equipment: "Spin bike", note: "Legs only, easier to pace." },
      ],
      media: { poster: "media/exercises/assault-bike.svg" },
      swap: "Rowing Machine",
    },
    {
      name: "Incline Walk Finisher",
      equipment: "Treadmill",
      dose: "10 min after lifting", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "Ten minutes at the end of a session. Short enough that you will actually do it, long enough to matter over a month.",
      setup:
        "Any treadmill, straight after your last set. Incline 10%, an easy walking pace.",
      cues: [
        "Set the incline to 10% and walk at a comfortable pace.",
        "Hands off the rails, stand tall.",
        "Breathe through your nose if you can — that is about the right intensity.",
        "Ten minutes, every lifting day, is about an extra hour of walking a week.",
      ],
      mistakes: [
        "Skipping it because ten minutes feels pointless. It is the consistency that counts.",
        "Making it hard. This is meant to be easy enough to do after every session.",
      ],
      variations: [
        { name: "Outdoor walk home", equipment: "Nothing", note: "Same effect and no machine." },
        { name: "Bike cooldown", equipment: "Stationary bike", note: "Zero impact after a heavy leg day." },
      ],
      swap: "Incline Treadmill Walk",
    },
    {
      name: "Brisk Outdoor Walk",
      equipment: "Nothing",
      dose: "30–45 min", rest: "—", restSec: 60, tempo: "Steady", starter: true,
      summary:
        "The most underrated cardio there is. No machine, no gym, and it is the one people actually keep doing.",
      setup:
        "Shoes. That is it. Aim for a pace where you are breathing a bit harder but could still hold a conversation.",
      cues: [
        "Walk at a pace that makes talking slightly harder than usual.",
        "Take a route with some hills if you can find one.",
        "Aim for 30–45 minutes, or about 4,000 steps.",
        "After a meal is ideal — it blunts the blood sugar spike.",
      ],
      mistakes: [
        "Strolling. If your breathing does not change, it is not cardio.",
        "Waiting for a free hour. Three ten-minute walks add up the same.",
      ],
      variations: [
        { name: "Post-meal walk", equipment: "Nothing", note: "Ten minutes after lunch and dinner. Easiest habit to keep." },
        { name: "Rucking", equipment: "Backpack with weight", note: "Add 8–10 kg and the same walk becomes real work." },
      ],
      swap: "Incline Treadmill Walk",
    },
  ]),

  group("bodyweight", "Bodyweight", "Anywhere",
    "No machines, no excuses. Enough here for a full session in a hotel room or a park.",
    "~30 min", [
    {
      name: "Bodyweight Squat",
      equipment: "Nothing",
      dose: "3 × 15–20", rest: "60 sec", restSec: 60, tempo: "3-1-2", starter: true,
      summary:
        "The foundation. Get this right and every loaded squat afterwards is just the same thing with weight on it.",
      setup:
        "A clear patch of floor. Face a wall a foot away if you tend to fall forward — it forces you upright.",
      cues: [
        "Feet shoulder-width, toes turned slightly out, arms straight in front for balance.",
        "Push your hips back and down as if sitting into a low chair.",
        "Go down until your thighs are at least parallel, chest staying up.",
        "Drive up through the middle of your feet and squeeze your glutes at the top.",
      ],
      mistakes: [
        "Knees caving inwards on the way up. Push them out towards your little toes.",
        "Heels lifting off the floor. If they do, widen your stance slightly.",
      ],
      variations: [
        { name: "Box squat", equipment: "A chair or bench", note: "Sit back to a surface. Perfect for learning the depth." },
        { name: "Goblet squat", equipment: "One dumbbell", note: "Add weight once twenty reps is easy." },
        { name: "Jump squat", equipment: "Nothing", note: "Explode off the floor at the top. Conditioning, not strength." },
      ],
      swap: "Goblet Squat",
    },
    {
      name: "Burpee",
      equipment: "Nothing",
      dose: "4 × 10", rest: "60 sec", restSec: 60, tempo: "Explosive", starter: true,
      summary:
        "Strength and conditioning in one movement. Ten of them honestly is harder than most cardio machines.",
      setup:
        "Any clear floor. Start with six reps, not twenty — everyone overestimates this one.",
      cues: [
        "Stand tall, then squat down and place your hands on the floor in front of your feet.",
        "Jump or step your feet back into a push-up position.",
        "Do a push-up, chest to the floor, then jump or step your feet back to your hands.",
        "Stand and jump, reaching overhead, then straight into the next rep.",
      ],
      mistakes: [
        "Letting your hips sag in the push-up because you are tired.",
        "Going out too fast. Pace it so the last rep looks like the first.",
      ],
      variations: [
        { name: "Step-back burpee", equipment: "Nothing", note: "Step instead of jumping. Much easier on the knees and just as effective." },
        { name: "No push-up burpee", equipment: "Nothing", note: "Drop the push-up while you build up." },
        { name: "Burpee to box jump", equipment: "A box", note: "The hardest version. Only with good knees." },
      ],
      swap: "Mountain Climber",
    },
    {
      name: "Bodyweight Lunge",
      equipment: "Nothing",
      dose: "3 × 12 each leg", rest: "60 sec", restSec: 60, tempo: "2-1-2", starter: true,
      summary:
        "One leg at a time, no equipment. Exposes a side-to-side difference immediately.",
      setup:
        "A clear space. Hold a wall lightly if balance is the limiting factor at first.",
      cues: [
        "Stand tall with your feet hip-width apart, hands on your hips.",
        "Step forward far enough that your front shin stays vertical when you drop.",
        "Lower until both knees are at about 90 degrees, back knee just off the floor.",
        "Push through the front heel to return to standing.",
      ],
      mistakes: [
        "Steps too short, which drives the front knee well past the toes.",
        "Leaning your torso forward over the front leg.",
      ],
      variations: [
        { name: "Reverse lunge", equipment: "Nothing", note: "Step backwards instead. Far kinder on the knees." },
        { name: "Walking lunge", equipment: "Dumbbells optional", note: "Travel forward rather than returning to the start." },
        { name: "Split squat", equipment: "Nothing", note: "Stay in one position for all reps. Easiest to balance." },
      ],
      swap: "Walking Lunge",
    },
    {
      name: "Mountain Climber",
      equipment: "Nothing",
      dose: "4 × 30 sec", rest: "30 sec", restSec: 30, tempo: "Fast", starter: true,
      summary:
        "Core and conditioning at once. Thirty seconds is longer than it sounds.",
      setup:
        "A clear floor. Hands on a bench instead if the floor version is too much on the shoulders.",
      cues: [
        "Start in a push-up position, hands under your shoulders, body in one line.",
        "Drive one knee towards your chest without letting your hips rise.",
        "Switch legs quickly, as if running in place.",
        "Keep your shoulders stacked over your hands the whole time.",
      ],
      mistakes: [
        "Hips bouncing up and down. The torso should stay level.",
        "Hands creeping forward until your shoulders are behind your wrists.",
      ],
      variations: [
        { name: "Slow mountain climber", equipment: "Nothing", note: "One knee at a time with a pause. More core, less cardio." },
        { name: "Incline mountain climber", equipment: "Hands on a bench", note: "Easier on the shoulders and wrists." },
      ],
      swap: "Burpee",
    },
    {
      name: "Glute Bridge",
      equipment: "Nothing, or a mat",
      dose: "3 × 15", rest: "45 sec", restSec: 45, tempo: "2-2-2", starter: true,
      summary:
        "Wakes the glutes up. Do it before any leg session and the squats feel different.",
      setup:
        "A mat or carpet. No equipment at all.",
      cues: [
        "Lie on your back with your knees bent and your feet flat, heels close to your backside.",
        "Press your lower back into the floor before you start.",
        "Drive through your heels and lift your hips until your body is a straight line from knees to shoulders.",
        "Squeeze your glutes hard for two seconds, then lower slowly.",
      ],
      mistakes: [
        "Arching your lower back at the top rather than squeezing the glutes.",
        "Feet too far away, which makes it a hamstring exercise.",
      ],
      variations: [
        { name: "Single-leg glute bridge", equipment: "Nothing", note: "One leg at a time. Considerably harder." },
        { name: "Hip thrust", equipment: "Bench + barbell", note: "The loaded version once bodyweight is easy." },
        { name: "Banded glute bridge", equipment: "Band around the knees", note: "Push the knees out against the band." },
      ],
      swap: "Hip Thrust",
    },
    {
      name: "Wall Sit",
      equipment: "A wall",
      dose: "3 × 45 sec", rest: "60 sec", restSec: 60, tempo: "Hold", starter: false,
      summary:
        "Nothing to learn and nowhere to hide. Good for building the will to stay in a hard position.",
      setup:
        "Any flat wall. Wear shoes with some grip.",
      cues: [
        "Stand with your back flat against the wall and walk your feet out about two steps.",
        "Slide down until your thighs are parallel to the floor and your knees are at 90 degrees.",
        "Keep your whole back against the wall and your weight in your heels.",
        "Hold. Arms folded or hanging — not resting on your thighs.",
      ],
      mistakes: [
        "Resting your hands on your thighs, which takes a lot of the load off.",
        "Sitting higher than parallel to make the time pass.",
      ],
      variations: [
        { name: "Single-leg wall sit", equipment: "A wall", note: "Lift one foot. Far harder." },
        { name: "Weighted wall sit", equipment: "Plate on your thighs", note: "Add load once 60 seconds is easy." },
      ],
      media: { poster: "media/exercises/wall-sit.svg" },
      swap: "Bodyweight Squat",
    },
    {
      name: "Step-Up",
      equipment: "A bench or sturdy box",
      dose: "3 × 10 each leg", rest: "60 sec", restSec: 60, tempo: "2-1-3", starter: false,
      summary:
        "One leg doing all the work, with a simple way to make it harder: use a higher step.",
      setup:
        "A flat bench or box at about knee height. Test it takes your weight before you load it.",
      cues: [
        "Stand facing the bench with your whole foot on it.",
        "Drive through that heel to stand all the way up on the bench.",
        "Do not push off the back foot — it should feel like the front leg does everything.",
        "Lower slowly back down under control rather than dropping.",
      ],
      mistakes: [
        "Pushing off the trailing foot, which halves the work.",
        "Dropping down instead of lowering. The way down is half the exercise.",
      ],
      variations: [
        { name: "Weighted step-up", equipment: "Dumbbells", note: "Add load once bodyweight is easy." },
        { name: "Lateral step-up", equipment: "A box", note: "Step up sideways. Hits the outer glute." },
        { name: "Higher box", equipment: "A taller box", note: "More range, more glute, no extra weight." },
      ],
      swap: "Bulgarian Split Squat",
    },
    {
      name: "Superman",
      equipment: "A mat",
      dose: "3 × 12", rest: "45 sec", restSec: 45, tempo: "2-2-2", starter: false,
      summary:
        "The other side of the core. Trains the lower back, which every ab exercise ignores.",
      setup:
        "A mat on the floor. Nothing else.",
      cues: [
        "Lie face down with your arms stretched out in front of you.",
        "Lift your arms, chest and legs off the floor at the same time.",
        "Hold at the top for two seconds, squeezing your backside.",
        "Lower everything slowly back to the floor.",
      ],
      mistakes: [
        "Yanking your head back to get higher. Keep your neck in line with your spine.",
        "Bouncing the reps rather than holding at the top.",
      ],
      variations: [
        { name: "Bird dog", equipment: "On all fours", note: "Opposite arm and leg. Gentler on the lower back." },
        { name: "Back extension", equipment: "Back extension bench", note: "The loaded version if your gym has the bench." },
      ],
      swap: "Plank",
    },
    {
      name: "Jumping Jack",
      equipment: "Nothing",
      dose: "4 × 45 sec", rest: "30 sec", restSec: 30, tempo: "Fast", starter: false,
      summary:
        "The simplest warm-up there is. Three minutes of these and you are ready to lift.",
      setup:
        "Any clear floor with headroom.",
      cues: [
        "Stand with your feet together and your arms at your sides.",
        "Jump your feet out wide while raising your arms overhead.",
        "Jump back to the start in one motion.",
        "Land softly on the balls of your feet with soft knees.",
      ],
      mistakes: [
        "Landing flat-footed and heavy. Stay springy.",
        "Half-raising the arms. All the way overhead each rep.",
      ],
      variations: [
        { name: "Step jack", equipment: "Nothing", note: "Step out instead of jumping. No impact." },
        { name: "Seal jack", equipment: "Nothing", note: "Arms clap in front instead of overhead. More chest and back." },
      ],
      swap: "Mountain Climber",
    },
    {
      name: "Push-Up",
      equipment: "Nothing, or hands on a bench",
      dose: "3 × max reps", rest: "60 sec", restSec: 60, tempo: "2-0-1", starter: true,
      summary:
        "The bodyweight standard for the upper body. Ten clean floor reps is the mark to aim for.",
      setup:
        "A clear floor. If ten is not there yet, put your hands on a bench — the higher the surface, the easier.",
      cues: [
        "Hands slightly wider than your shoulders and directly under them.",
        "Body in one straight line from head to heels, glutes squeezed.",
        "Lower until your chest is a fist's height from the floor, elbows tucked back.",
        "Press up without letting your hips sag or pike.",
      ],
      mistakes: [
        "Hips sagging, which loads your lower back instead of your chest.",
        "Half reps. Chest to fist height or it does not count.",
      ],
      variations: [
        { name: "Incline push-up", equipment: "Hands on a bench or bar", note: "Where to start. Lower the surface as you get stronger." },
        { name: "Knee push-up", equipment: "Nothing", note: "Knees down. Keep the straight line from knees to head." },
        { name: "Decline push-up", equipment: "Feet on a bench", note: "Harder, and shifts the work to the upper chest." },
      ],
      swap: "Chest Press Machine",
    },
    {
      name: "Plank",
      equipment: "A mat",
      dose: "3 × 30–60 sec", rest: "45 sec", restSec: 45, tempo: "Hold", starter: true,
      summary:
        "Teaches you to brace, which is what keeps your lower back safe under a squat or a deadlift.",
      setup:
        "A mat, or any patch of floor. No equipment and no excuse.",
      cues: [
        "Forearms flat on the floor directly under your shoulders.",
        "Legs straight back, weight on your toes, body in one line from head to heels.",
        "Squeeze your glutes and pull your belly button up towards your spine.",
        "Breathe normally and hold. When the form breaks, the set is over.",
      ],
      mistakes: [
        "Hips sagging towards the floor, which loads the lower back.",
        "Holding your breath for the whole set.",
      ],
      variations: [
        { name: "Knee plank", equipment: "Nothing", note: "Knees down to start." },
        { name: "Long-lever plank", equipment: "Nothing", note: "Elbows further forward. Far harder, no weight needed." },
        { name: "Side plank", equipment: "Nothing", note: "Loads the side of your torso instead." },
      ],
      swap: "Dead Bug",
    },
    {
      name: "Bear Crawl",
      equipment: "A clear floor",
      dose: "3 × 30 sec", rest: "45 sec", restSec: 45, tempo: "Slow", starter: false,
      summary:
        "Core, shoulders and conditioning at once, and it is quietly brutal for something that looks silly.",
      setup:
        "About five metres of clear floor. Crawl up and back.",
      cues: [
        "Start on all fours with your knees an inch off the floor, directly under your hips.",
        "Move the opposite hand and foot together, keeping your knees low.",
        "Keep your hips level — a cup of water on your back should not spill.",
        "Crawl forward the length of the space, then backwards to the start.",
      ],
      mistakes: [
        "Hips swinging side to side. Slow down until they stop.",
        "Letting the knees drift up towards a downward dog position.",
      ],
      variations: [
        { name: "Bear hold", equipment: "Nothing", note: "Hold the position still for 30 seconds. Start here." },
        { name: "Bear crawl shoulder tap", equipment: "Nothing", note: "Tap the opposite shoulder from the hold." },
      ],
      swap: "Mountain Climber",
    },
  ]),
];

/* ---------------------------------------------------------------------------
   The link from the food log. NutriTrack knows what you train today; this
   turns that into the exercises for it.
--------------------------------------------------------------------------- */

export const SPLIT_GROUPS: Record<string, string[]> = {
  chest_back: ["chest", "back"],
  arms: ["biceps", "triceps"],
  legs: ["legs", "abs"],
  shoulders: ["shoulders", "back"],
  push: ["chest", "shoulders", "triceps"],
  pull: ["back", "biceps"],
  full_body: ["legs", "chest", "back"],
  cardio: ["cardio", "abs"],
  core: ["abs", "bodyweight"],
  rest: ["cardio", "bodyweight"],
};

export const SPLIT_LABEL: Record<string, string> = {
  chest_back: "Chest + Back",
  arms: "Biceps + Triceps",
  legs: "Legs + Abs",
  shoulders: "Shoulders + Back",
  push: "Push",
  pull: "Pull",
  full_body: "Full body",
  cardio: "Cardio only",
  core: "Core + mobility",
  rest: "Rest day",
};

/** A session for the day: the starters from each muscle the split covers. */
export function sessionFor(split: string) {
  const keys = SPLIT_GROUPS[split] ?? [];
  const perGroup = keys.length <= 2 ? 3 : 2;
  return keys
    .map((k) => DATA.find((g) => g.key === k))
    .filter((g): g is MuscleGroup => !!g)
    .map((g) => ({ group: g, picks: g.exercises.filter((e) => e.starter).slice(0, perGroup) }));
}

export const GROUPS = DATA;
export const groupByKey = (key: string) => DATA.find((g) => g.key === key);
export const findExercise = (group: MuscleGroup, slug: string) =>
  group.exercises.find((e) => e.slug === slug);
