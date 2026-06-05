import type { InputMechanic } from "./input-mechanics";

export type MechanicPreviewMode =
  | "anonymous"
  | "avatar"
  | "body-map"
  | "branch"
  | "bucket"
  | "builder"
  | "calendar"
  | "choice"
  | "journal"
  | "listen"
  | "location"
  | "match"
  | "media"
  | "multi"
  | "partner"
  | "picture"
  | "rank"
  | "radar"
  | "route"
  | "scale"
  | "stamp"
  | "swipe"
  | "timer"
  | "toggle"
  | "voice"
  | "word-builder"
  | "slot-builder"
  | "stack-builder"
  | "plate-builder"
  | "scenario"
  | "question-cards"
  | "script-builder"
  | "next-action";

export function getMechanicPreviewMode(mechanic: InputMechanic): MechanicPreviewMode {
  const text = `${mechanic.title} ${mechanic.pattern} ${mechanic.captures}`.toLowerCase();
  if (hasAny(text, ["anonymous", "private survey", "sensitive"])) return "anonymous";
  if (hasAny(text, ["avatar", "dress avatar"])) return "avatar";
  if (hasAny(text, ["body map", "body area"])) return "body-map";
  if (hasAny(text, ["partner", "caregiver", "relationship"])) return "partner";
  if (hasAny(text, ["voice", "speak", "pronunciation", "recording"])) return "voice";
  if (hasAny(text, ["listen", "hear a prompt", "audio comprehension"])) return "listen";
  if (hasAny(text, ["picture flashcard", "image that matches", "visual preference"])) return "picture";
  if (hasAny(text, ["photo", "scan", "visual", "image", "selfie", "shot", "record slotter", "ocr"])) return "media";
  if (hasAny(text, ["radar", "hotspots"])) return "radar";
  if (hasAny(text, ["slider", "scale", "meter", "pulse", "orb", "wave", "comfort range", "rating", "ring", "progress toward target", "wheel"])) return "scale";
  if (hasAny(text, ["calendar", "day cells", "week strip", "workday blocks"])) return "calendar";
  if (hasAny(text, ["branch", "triggers the next", "paired follow-up", "if-then"])) return "branch";
  if (hasAny(text, ["match", "pair", "concepts to outcomes"])) return "match";
  if (hasAny(text, ["word tile", "ordered sentence"])) return "word-builder";
  if (hasAny(text, ["missing slot", "blank", "fill one blank"])) return "slot-builder";
  if (hasAny(text, ["combo builder", "habit stack", "wind-down stack", "routine tile", "sleep routine cards"])) return "stack-builder";
  if (hasAny(text, ["plate builder", "plate from food tiles"])) return "plate-builder";
  if (hasAny(text, ["parenting rehearsal", "child scenario", "choose a response"])) return "scenario";
  if (hasAny(text, ["appointment prep", "question cards"])) return "question-cards";
  if (hasAny(text, ["boundary script", "build a boundary"])) return "script-builder";
  if (hasAny(text, ["tiny next action", "tomorrow seed", "one tiny tomorrow", "next action"])) return "next-action";
  if (hasAny(text, ["emergency card builder"])) return "question-cards";
  if (hasAny(text, ["builder"])) return "builder";
  if (hasAny(text, ["drag sort", "move tokens into buckets", "bucket", "triage"])) return "bucket";
  if (hasAny(text, ["timeline", "sort", "slot", "drop", "drag", "move tokens", "tokens across", "budget", "impact/effort grid", "place options"])) return "rank";
  if (hasAny(text, ["stamp", "tap activity icons", "activity stamp", "dose confirm", "kick count", "confirm medicine", "tile flip", "spark capture"])) return "stamp";
  if (hasAny(text, ["multi pick", "chip tray", "chips", "selectable", "tiles", "tag cloud", "symptom tiles", "side-effect chips"])) return "multi";
  if (hasAny(text, ["location", "environment", "commute", "room map", "trigger map", "budget map"])) return "location";
  if (hasAny(text, ["rank", "priority order", "order calming", "order cards"])) return "rank";
  if (hasAny(text, ["route", "path", "nodes", "ramp"])) return "route";
  if (hasAny(text, ["mood faces", "face", "weather", "emotion"])) return "avatar";
  if (hasAny(text, ["toggle", "done/not done", "am pm"])) return "toggle";
  if (hasAny(text, ["timer", "timed commitment", "body double"])) return "timer";
  if (hasAny(text, ["journal", "one short note", "reflection", "answer one line", "micro journal"])) return "journal";
  if (hasAny(text, ["swipe", "yes/no/maybe", "snack alternatives"])) return "swipe";
  if (mechanic.effort === "short") return "builder";
  return "choice";
}

export function buildMechanicOptions(mechanic: Partial<InputMechanic>) {
  const source = mechanic.captures ?? "energy, focus, next action";
  const parts = source.split(",").map((part) => part.trim()).filter(Boolean);
  const options = parts.length >= 3 ? parts.slice(0, 3) : [...parts, "Energy", "Next action", "Context"];
  return Array.from(new Set(options)).slice(0, 3).map((item) => compactLabel(titleCase(item)));
}

export function buildMechanicMultiOptions(mechanic: InputMechanic) {
  const base = buildMechanicOptions(mechanic);
  const extras = ["Mood", "Energy", "Sleep", "Food", "Pain", "Context"];
  return Array.from(new Set([...base, ...extras])).slice(0, 8);
}

export function buildMechanicSampleValue(mechanic: InputMechanic) {
  const mode = getMechanicPreviewMode(mechanic);
  if (mode === "multi") return buildMechanicOptions(mechanic).slice(0, 2);
  if (mode === "bucket") {
    const options = buildMechanicOptions(mechanic);
    return {
      [options[0] ?? "Signal"]: "Input",
      [options[1] ?? "Context"]: "Risk"
    };
  }
  if (mode === "radar") return { high: "Risk", medium: "Priority", low: "Classification" };
  if (mechanic.effort === "rich") return "media-or-voice-capture-ready";
  if (mechanic.effort === "short") return buildMechanicOptions(mechanic).join(" + ");
  return buildMechanicOptions(mechanic)[0];
}

function hasAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function compactLabel(value: string) {
  if (value.length <= 18) return value;
  const words = value.split(/\s+/).filter(Boolean);
  if (words[0] && words[0].length >= 10) return words[0];
  if (words.length <= 2) return value;
  return words.slice(0, 2).join(" ");
}
