import fs from "node:fs";
import path from "node:path";
import { inputMechanics } from "../lib/input-mechanics";
import { getMechanicPreviewMode } from "../lib/mechanic-preview";

const root = process.cwd();

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const templateData = read("lib/template-data.ts");
const inputMechanicsSource = read("lib/input-mechanics.ts");
const adapters = read("lib/platform-adapters.ts");
const shell = read("components/app-shell.tsx");
const routes = [
  "app/(tabs)/index.tsx",
  "app/(tabs)/analytics.tsx",
  "app/(tabs)/session.tsx",
  "app/(tabs)/bookmarks.tsx",
  "app/(tabs)/profile.tsx",
  "app/details/[id].tsx",
  "app/mechanics.tsx",
  "app/mechanics/[id].tsx"
].map(read).join("\n");

assert((templateData.match(/key: "/g) ?? []).length === 5, "template must expose five domain concepts");
assert((templateData.match(/eyebrow: "/g) ?? []).length >= 3, "player setup flow must have reviewable steps");
assert((templateData.match(/score:/g) ?? []).length >= 3, "template must include non-empty session results");
assert((templateData.match(/reason:/g) ?? []).length >= 3, "template must include domain-specific recommendations");
assert((templateData.match(/delta:/g) ?? []).length >= 4, "analytics must include meaningful metrics");
assert((inputMechanicsSource.match(/^  \["/gm) ?? []).length === 100, "template must include exactly 100 input mechanics");
assert(inputMechanicsSource.includes("research-25") && inputMechanicsSource.includes("original-40") && inputMechanicsSource.includes("hassar-100"), "input mechanics must include all three growth layers");
assert(routes.includes("/mechanics/${mechanic.id}") && routes.includes("getMechanic"), "mechanics must link to generated example detail pages");
assert(adapters.includes("Clerk"), "Clerk adapter note missing");
assert(adapters.includes("D1"), "Cloudflare D1 adapter note missing");
assert(adapters.includes("R2"), "Cloudflare R2 adapter note missing");
assert(shell.includes("BlurView") && shell.includes("levelPill") && shell.includes("points"), "header shell signals missing");
assert(templateData.includes("SkillQuest") || routes.includes("SkillQuest"), "SkillQuest product identity missing");
assert(routes.includes("router.push"), "actionable route navigation missing");

const previewModes = inputMechanics.map((mechanic) => getMechanicPreviewMode(mechanic));
assert(previewModes.length === 100, "every input mechanic must have a preview mode");
assert(new Set(previewModes).size >= 20, "mechanics detail pages must not collapse into a few generic preview modes");

const expectedPreviewModes = new Map([
  ["Multi Pick Tray", "multi"],
  ["Word Tile Builder", "word-builder"],
  ["Missing Slot", "slot-builder"],
  ["Drag Sort", "bucket"],
  ["Pair Match", "match"],
  ["Listen And Choose", "listen"],
  ["Picture Flashcard", "picture"],
  ["Rating Slider", "scale"],
  ["Risk Radar", "radar"],
  ["Body Map Tap", "body-map"],
  ["Calendar Heat Tap", "calendar"],
  ["Swipe Cards", "swipe"],
  ["Partner Trigger", "partner"],
  ["Token Budget", "rank"],
  ["Tomorrow Seed", "next-action"],
  ["Skin Diary Shot", "media"],
  ["Side Effect Chips", "multi"],
  ["Red Flag Triage", "bucket"],
  ["Social Trigger Map", "location"],
  ["Boundary Script Builder", "script-builder"]
]);

for (const [title, expectedMode] of expectedPreviewModes) {
  const mechanic = inputMechanics.find((item) => item.title === title);
  assert(mechanic, `missing mechanic fixture: ${title}`);
  assert(getMechanicPreviewMode(mechanic!) === expectedMode, `${title} must render ${expectedMode} preview, got ${getMechanicPreviewMode(mechanic!)}`);
}

console.log("SkillQuest smoke checks passed.");
