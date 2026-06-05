import fs from "node:fs";
import path from "node:path";

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
const adapters = read("lib/platform-adapters.ts");
const shell = read("components/app-shell.tsx");
const routes = [
  "app/(tabs)/index.tsx",
  "app/(tabs)/analytics.tsx",
  "app/(tabs)/session.tsx",
  "app/(tabs)/bookmarks.tsx",
  "app/(tabs)/profile.tsx",
  "app/details/[id].tsx"
].map(read).join("\n");

assert((templateData.match(/key: "/g) ?? []).length === 5, "template must expose five domain concepts");
assert((templateData.match(/eyebrow: "/g) ?? []).length >= 3, "player setup flow must have reviewable steps");
assert((templateData.match(/score:/g) ?? []).length >= 3, "template must include non-empty session results");
assert((templateData.match(/reason:/g) ?? []).length >= 3, "template must include domain-specific recommendations");
assert((templateData.match(/delta:/g) ?? []).length >= 4, "analytics must include meaningful metrics");
assert(adapters.includes("Clerk"), "Clerk adapter note missing");
assert(adapters.includes("D1"), "Cloudflare D1 adapter note missing");
assert(adapters.includes("R2"), "Cloudflare R2 adapter note missing");
assert(shell.includes("BlurView") && shell.includes("levelPill") && shell.includes("points"), "header shell signals missing");
assert(templateData.includes("SkillQuest") || routes.includes("SkillQuest"), "SkillQuest product identity missing");
assert(routes.includes("router.push"), "actionable route navigation missing");

console.log("SkillQuest smoke checks passed.");
