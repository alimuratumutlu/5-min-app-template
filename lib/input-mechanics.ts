export type MechanicStage = "research-25" | "original-40" | "hassar-100";
export type AiTiming = "instant-rule" | "after-run" | "hybrid" | "no-ai";
export type MechanicEffort = "tap" | "short" | "rich";

export type InputMechanic = {
  id: string;
  number: number;
  stage: MechanicStage;
  title: string;
  pattern: string;
  captures: string;
  aiTiming: AiTiming;
  feedback: string;
  projectFits: string[];
  effort: MechanicEffort;
};

type RawMechanic = [
  MechanicStage,
  string,
  string,
  string,
  AiTiming,
  string,
  MechanicEffort,
  string
];

export const mechanicStageMeta = {
  "research-25": {
    label: "Research 25",
    count: 25,
    body: "Known mobile, learning, survey, and habit check-in mechanics adapted for daily data capture."
  },
  "original-40": {
    label: "Original 40",
    count: 40,
    body: "Fifteen extra HASSAR-native mechanics built around streaks, shields, quests, and playful friction."
  },
  "hassar-100": {
    label: "HASSAR 100",
    count: 100,
    body: "Sixty domain-specific mechanisms mapped to app-projects daily-life products."
  }
} as const;

const rawMechanics: RawMechanic[] = [
  ["research-25", "Choice Snap", "One-tap answer cards", "preference, intent, status", "instant-rule", "all apps", "tap", "Selected cards save instantly; only impossible choices ask for detail."],
  ["research-25", "Multi Pick Tray", "Selectable chip tray", "activities, symptoms, constraints", "instant-rule", "mood, health, food", "tap", "Confirm only when the set matters."],
  ["research-25", "Word Tile Builder", "Tap words into an ordered sentence", "structured intention or summary", "hybrid", "learning, focus", "short", "AI can score clarity after the run."],
  ["research-25", "Pair Match", "Match concepts to outcomes", "knowledge map, preference link", "instant-rule", "learning, coaching", "tap", "Correct pairs lock; wrong pairs stay editable."],
  ["research-25", "Missing Slot", "Fill one blank in a sentence", "specific word, dose, place, time", "hybrid", "learning, medicine", "short", "Local validation checks format; AI can interpret meaning later."],
  ["research-25", "Listen And Choose", "Hear a prompt, pick the matching answer", "audio comprehension, instruction recall", "instant-rule", "language, coaching", "tap", "Instant answer for fixed prompts."],
  ["research-25", "Speak Back", "Repeat or answer by voice", "spoken confidence, pronunciation, note", "hybrid", "language, therapy-adjacent coaching", "rich", "Capture immediately; analyze voice after run."],
  ["research-25", "Picture Flashcard", "Pick the image that matches", "visual preference, recognition", "instant-rule", "food, skin, travel", "tap", "Fast visual data without typing."],
  ["research-25", "Drag Sort", "Move tokens into buckets", "classification, priorities, risks", "instant-rule", "health, work, home", "short", "Buckets can be edited before submit."],
  ["research-25", "Rating Slider", "Slide along a playful scale", "intensity, confidence, pain, energy", "instant-rule", "health, sleep, mood", "tap", "Use labels, not vague numbers only."],
  ["research-25", "Mood Faces", "Choose an expressive mood face", "mood, stress, readiness", "no-ai", "reflection, parenting", "tap", "No right/wrong; it is a saved signal."],
  ["research-25", "Activity Stamp", "Tap activity icons to log what happened", "context around mood or habit", "no-ai", "Daylio-like check-ins", "tap", "Immediate positive reinforcement."],
  ["research-25", "Streak Toggle", "Flip today's done/not done state", "habit completion", "no-ai", "habit apps", "tap", "Avoid shame on missed days."],
  ["research-25", "Goal Progress Ring", "Adjust progress toward target", "completion percent", "instant-rule", "fitness, learning, work", "tap", "Show progress, not judgement."],
  ["research-25", "Timer Pledge", "Start a tiny timed commitment", "time spent, start state", "no-ai", "focus, movement", "tap", "Completion unlocks the next input."],
  ["research-25", "Micro Journal", "Write one short note", "free-text context", "after-run", "reflection, sleep, emotion", "short", "AI summarizes after the run."],
  ["research-25", "Photo Check-In", "Take or upload one photo", "visual evidence, object, meal, skin, room", "after-run", "food, skin, home", "rich", "AI should not block the flow."],
  ["research-25", "Body Map Tap", "Tap a body area", "location of sensation or concern", "hybrid", "health, movement", "tap", "Safety copy must avoid diagnosis."],
  ["research-25", "Calendar Heat Tap", "Tap day cells on a mini calendar", "frequency, missed days, pattern", "no-ai", "sleep, habit, medicine", "tap", "Pattern becomes chart data."],
  ["research-25", "Rank Stack", "Drag cards into priority order", "preference order, tradeoff", "hybrid", "decision, career, travel", "short", "AI can explain tradeoffs later."],
  ["research-25", "Swipe Cards", "Swipe yes/no/maybe cards", "preference, discard, save", "no-ai", "ideas, travel, food", "tap", "Good for rapid filtering."],
  ["research-25", "Branch Prompt", "Answer triggers the next question", "conditional context", "hybrid", "health, onboarding", "short", "Only ask follow-ups when needed."],
  ["research-25", "Location Nudge", "Choose current place/context", "environment, commute, home/work state", "no-ai", "movement, home, travel", "tap", "Keep privacy explicit."],
  ["research-25", "Partner Trigger", "One answer opens a paired follow-up", "relationship, caregiver, family context", "after-run", "caregiver, parenting", "rich", "Do not force social sharing."],
  ["research-25", "Anonymous Pulse", "Tiny private survey response", "sensitive mood or risk signal", "after-run", "health, alcohol, emotion", "tap", "Privacy-first copy matters."],
  ["original-40", "Shield Rule", "Choose when a streak shield should be spent", "risk tolerance, fallback preference", "instant-rule", "all gamified apps", "tap", "This replaces correct/wrong with saved strategy."],
  ["original-40", "Combo Builder", "Build a combo from three small actions", "habit stack, order, intent", "hybrid", "focus, movement, learning", "short", "AI checks whether the combo is realistic."],
  ["original-40", "Energy Orb", "Tap and hold an orb until it matches energy", "energy level, readiness", "no-ai", "sleep, ADHD, work", "tap", "Tactile input beats a dull scale."],
  ["original-40", "Friction Meter", "Pull a sticky slider through resistance", "difficulty, blocker weight", "hybrid", "work, focus, health", "tap", "High friction can trigger a smaller quest."],
  ["original-40", "Excuse Boss", "Pick the boss blocking today's action", "avoidance reason", "after-run", "ADHD, focus, fitness", "tap", "AI turns blocker into a counter-move."],
  ["original-40", "Mini Map Route", "Choose a path across three nodes", "plan sequence", "hybrid", "travel, career, habit", "short", "Path becomes next-action plan."],
  ["original-40", "Chest Choice", "Pick one reward chest", "motivation preference", "no-ai", "all gamified apps", "tap", "Reward type becomes personalization."],
  ["original-40", "Streak Rescue", "Choose a low-energy rescue task", "fallback capacity", "no-ai", "sleep, illness, work", "tap", "A compassionate alternative to failure."],
  ["original-40", "Avatar Signal", "Dress avatar with today's state", "mood, confidence, identity", "after-run", "emotion, kids, self-care", "tap", "The avatar is the data UI."],
  ["original-40", "Promise Stamp", "Stamp one commitment card", "commitment, time, target", "hybrid", "focus, parenting, money", "short", "AI later checks if promise was concrete."],
  ["original-40", "Commitment Duel", "Pick which of two tiny actions wins", "priority under constraint", "no-ai", "decision, work", "tap", "Useful when users are overwhelmed."],
  ["original-40", "Habit Stack Puzzle", "Place new habit onto an existing routine tile", "cue, routine, reward", "after-run", "habit, ADHD", "short", "AI evaluates cue quality later."],
  ["original-40", "Token Budget", "Spend limited tokens across needs", "resource allocation", "hybrid", "money, time, caregiver", "short", "Great for tradeoff data."],
  ["original-40", "Risk Radar", "Tap hotspots on a radar chart", "risk dimensions", "after-run", "health, work, alcohol", "tap", "Report page explains patterns."],
  ["original-40", "Tomorrow Seed", "Plant one tiny tomorrow action", "next-day intention", "after-run", "all daily apps", "short", "AI carries it into tomorrow's run."],
  ["hassar-100", "Feed Sleep Wheel", "Spin/tap wheel segments for baby feed and sleep", "baby care timing", "no-ai", "5-min-baby-care", "tap", "Data should be fast and parent-safe."],
  ["hassar-100", "Diaper Tile Flip", "Flip diaper tiles by type", "baby output log", "no-ai", "5-min-baby-care", "tap", "No judgement, just pattern capture."],
  ["hassar-100", "Tiny Next Action", "Tap or type one next action", "focus target", "after-run", "5-min-focus-coach", "short", "AI turns vague tasks into playable actions."],
  ["hassar-100", "Prompt Dice", "Roll and lock a writing prompt", "creative direction", "after-run", "5-min-writing", "tap", "The roll creates momentum."],
  ["hassar-100", "Tone Ladder", "Move conversation tone from soft to direct", "communication intent", "hybrid", "5-min-difficult-conversations", "tap", "AI drafts a matching sentence later."],
  ["hassar-100", "Receipt Scan Quest", "Snap a receipt into a slot", "life admin document", "after-run", "5-min-life-admin", "rich", "AI extracts fields after flow."],
  ["hassar-100", "Wind-Down Stack", "Stack sleep routine cards", "evening routine", "hybrid", "5-min-sleep-coach", "short", "AI can find missing wind-down cues."],
  ["hassar-100", "Cycle Constellation", "Tap symptom stars around a cycle orbit", "cycle symptoms", "after-run", "5-min-women-health", "tap", "Sensitive data needs privacy-first copy."],
  ["hassar-100", "Safe Range Slider", "Set movement comfort range", "mobility comfort", "hybrid", "5-min-movement-coach", "tap", "Never diagnose; suggest safer intensity."],
  ["hassar-100", "Care Load Meter", "Allocate load tokens across care tasks", "caregiver burden", "after-run", "5-min-caregiver", "short", "AI can suggest delegation scripts."],
  ["hassar-100", "Kick Count Tapper", "Tap counted movement events", "pregnancy movement log", "no-ai", "5-min-pregnancy-care", "tap", "Add medical escalation disclaimers when relevant."],
  ["hassar-100", "Money Leak Hunt", "Tap leaks in a cartoon budget map", "spending triggers", "after-run", "5-min-money-coach", "tap", "AI explains one practical repair."],
  ["hassar-100", "Launch Ramp", "Choose the smallest start ramp", "ADHD start difficulty", "hybrid", "5-min-adhd-start", "tap", "Avoid moralizing; reduce task size."],
  ["hassar-100", "Memory Grid", "Repeat a revealed grid pattern", "working memory performance", "instant-rule", "5-min-brain-games", "tap", "Score can be immediate."],
  ["hassar-100", "Brush Timeline", "Drag morning/night brush tiles", "dental routine", "no-ai", "5-min-dental-care", "tap", "Visual habit log over text."],
  ["hassar-100", "Plate Builder", "Build a plate from food tiles", "meal components", "after-run", "5-min-food-coach", "short", "AI scores balance after run."],
  ["hassar-100", "Record Slotter", "Drop document types into record slots", "health record organization", "after-run", "5-min-health-records", "rich", "AI extracts and labels later."],
  ["hassar-100", "Craving Wave", "Ride a wave slider for two minutes", "alcohol craving intensity", "hybrid", "5-min-alcohol-check", "tap", "Feedback should be supportive, not punitive."],
  ["hassar-100", "Dose Confirm Tap", "Confirm medicine with time and dose chips", "medication adherence", "instant-rule", "5-min-medicine-manager", "tap", "Use confirmations and warnings carefully."],
  ["hassar-100", "Routine Board", "Move visual routine cards into today order", "autism routine plan", "no-ai", "5-min-autism-routine", "short", "Predictability is the feature."],
  ["hassar-100", "Decision Coin", "Flip, then rate gut reaction", "decision preference", "after-run", "5-min-decision", "tap", "The reaction is more useful than the coin."],
  ["hassar-100", "Coin Photo Loop", "Capture front/back/detail photos", "coin identification data", "after-run", "5-min-coin-identifier", "rich", "AI vision runs after capture."],
  ["hassar-100", "Emotion Weather", "Choose weather for inner state", "emotion metaphor", "after-run", "5-min-emotion-reset", "tap", "Metaphor lowers friction."],
  ["hassar-100", "Voice Meter", "Speak and watch pace/confidence meter", "speaking practice", "after-run", "5-min-speaking-coach", "rich", "AI feedback after recording."],
  ["hassar-100", "Mirror Prompt", "Pick a reflection card and answer one line", "self-reflection context", "after-run", "5-min-reflection", "short", "No wrong answers."],
  ["hassar-100", "Parenting Rehearsal", "Choose a response in a child scenario", "parenting style, situation", "hybrid", "5-min-parenting", "short", "AI can offer softer alternatives."],
  ["hassar-100", "Quiz Duel", "Beat a rival card with an answer", "knowledge check", "instant-rule", "5-min-quiz-game", "tap", "This can keep correct/wrong."],
  ["hassar-100", "Recall Ladder", "Climb by recalling spaced cards", "learning retention", "instant-rule", "5-min-learning-coach", "tap", "Immediate scoring is appropriate."],
  ["hassar-100", "If-Then Simulator", "Pick condition and response cards", "strategy plan", "after-run", "5-min-strategy-game", "short", "AI can stress-test the plan."],
  ["hassar-100", "Pet Symptom Tiles", "Tap pet behavior/symptom tiles", "pet care context", "after-run", "5-min-pet-care", "tap", "Use vet escalation guardrails."],
  ["hassar-100", "Red Flag Triage", "Sort health signals into normal/watch/urgent", "health concern context", "hybrid", "5-min-health-assistant", "short", "This must avoid diagnosis and prioritize safety."],
  ["hassar-100", "Spark Capture", "Catch falling idea sparks", "idea fragments", "after-run", "5-min-idea-capture", "tap", "AI clusters ideas later."],
  ["hassar-100", "Room Sweep", "Tap zones in a room map", "home task area", "no-ai", "5-min-home-coach", "tap", "Turns chores into map progress."],
  ["hassar-100", "Skin Diary Shot", "Photo plus routine chips", "skin state and routine", "after-run", "5-min-skin-care", "rich", "Avoid diagnosis; track visible changes."],
  ["hassar-100", "Message Tone Picker", "Choose tone before drafting", "social intent", "after-run", "5-min-social-coach", "tap", "AI drafts after tone capture."],
  ["hassar-100", "Safety Scenario Cards", "Pick what the child should do next", "online safety knowledge", "instant-rule", "5-min-kid-online-safety", "tap", "Correct/wrong can be used here."],
  ["hassar-100", "Work Energy Calendar", "Paint workday blocks by energy", "work capacity pattern", "after-run", "5-min-work-coach", "short", "AI suggests task placement."],
  ["hassar-100", "Pronunciation Shadow", "Listen, speak, compare", "English pronunciation", "after-run", "5-min-learn-english", "rich", "AI feedback comes after recording."],
  ["hassar-100", "Travel Constraint Map", "Drag budget/time/comfort pins", "travel constraints", "after-run", "5-min-travel-planner", "short", "AI builds itinerary later."],
  ["hassar-100", "Health Habit Pulse", "Tap quick male health habit checks", "preventive habit status", "after-run", "5-min-men-health", "tap", "Sensitive but low-friction."],
  ["hassar-100", "Leftovers Combinator", "Combine pantry tiles into meal rescue", "available ingredients", "after-run", "5-min-kitchen-manager", "short", "AI proposes safe recipe options."],
  ["hassar-100", "Career Matrix", "Place options on impact/effort grid", "career tradeoff", "after-run", "5-min-career-coach", "short", "AI explains the quadrant."],
  ["hassar-100", "Snack Swap", "Swipe snack alternatives", "craving, preference, restriction", "after-run", "5-min-nutrition-score", "tap", "AI suggests one realistic swap."],
  ["hassar-100", "Story Path", "Choose next scene cards", "child story preference", "after-run", "5-min-kids-story", "tap", "AI writes the next beat."],
  ["hassar-100", "Soothing Ladder", "Order calming attempts", "baby soothing history", "after-run", "5-min-baby-care", "short", "AI finds what tends to work."],
  ["hassar-100", "Dream Tag Cloud", "Tap dream symbols and mood tags", "dream recall context", "after-run", "5-min-sleep-coach", "tap", "AI summarizes themes later."],
  ["hassar-100", "Bill Due Drag", "Drag bills onto a week strip", "payment timing", "no-ai", "5-min-money-coach", "short", "Useful as structured calendar data."],
  ["hassar-100", "Side Effect Chips", "Select medicine side-effect chips", "side-effect context", "hybrid", "5-min-medicine-manager", "tap", "Escalate concerning combinations safely."],
  ["hassar-100", "Form Selfie Check", "Capture movement pose checkpoint", "form snapshot", "after-run", "5-min-movement-coach", "rich", "AI feedback should stay coaching-level."],
  ["hassar-100", "Sensitivity Scale", "Tap tooth sensitivity faces", "dental discomfort", "after-run", "5-min-dental-care", "tap", "Track trend, do not diagnose."],
  ["hassar-100", "Emergency Card Builder", "Fill contact/medication cards as tiles", "care emergency readiness", "hybrid", "5-min-caregiver", "short", "Missing critical fields can be instant."],
  ["hassar-100", "Appointment Prep", "Collect three question cards for a visit", "pregnancy appointment questions", "after-run", "5-min-pregnancy-care", "short", "AI can organize questions."],
  ["hassar-100", "Social Trigger Map", "Tap where cravings usually happen", "alcohol trigger context", "after-run", "5-min-alcohol-check", "tap", "Pattern report should be nonjudgmental."],
  ["hassar-100", "Body Double Timer", "Pick a co-start mode and timer", "ADHD support preference", "no-ai", "5-min-adhd-start", "tap", "The mechanic itself creates action."],
  ["hassar-100", "Pantry Expiry Sort", "Sort pantry items by urgency", "food safety and pantry data", "hybrid", "5-min-kitchen-manager", "short", "Use conservative food-safety language."],
  ["hassar-100", "OCR Checklist", "Tick extracted record fields after scan", "health record metadata", "hybrid", "5-min-health-records", "short", "AI extracts; user confirms."],
  ["hassar-100", "Pet Spot Change", "Compare two pet photos and tap changes", "pet visual change", "after-run", "5-min-pet-care", "rich", "Escalate to vet when needed."],
  ["hassar-100", "AM PM Routine Toggle", "Toggle skin routine steps by time", "routine adherence", "no-ai", "5-min-skin-care", "tap", "Pattern matters more than judgement."],
  ["hassar-100", "Boundary Script Builder", "Build a boundary sentence from tiles", "social boundary need", "after-run", "5-min-social-coach", "short", "AI polishes tone later."],
  ["hassar-100", "Interview Flashcards", "Practice answer cards with confidence meter", "career interview readiness", "after-run", "5-min-career-coach", "rich", "AI feedback after practice."]
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const inputMechanics: InputMechanic[] = rawMechanics.map((item, index) => ({
  id: `${String(index + 1).padStart(3, "0")}-${slugify(item[1])}`,
  number: index + 1,
  stage: item[0],
  title: item[1],
  pattern: item[2],
  captures: item[3],
  aiTiming: item[4],
  projectFits: item[5].split(",").map((fit) => fit.trim()),
  effort: item[6],
  feedback: item[7]
}));

export const inputMechanicStats = {
  total: inputMechanics.length,
  research: 25,
  original: 40,
  hassar: 100
};

export function getMechanicsForStage(stage: "all" | MechanicStage) {
  if (stage === "all") return inputMechanics;
  if (stage === "research-25") return inputMechanics.slice(0, 25);
  if (stage === "original-40") return inputMechanics.slice(0, 40);
  return inputMechanics.slice(0, 100);
}

export function getMechanic(id: string) {
  return inputMechanics.find((mechanic) => mechanic.id === id) ?? inputMechanics[0];
}
