import {
  Brain,
  Crown,
  Flame,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Zap,
  type LucideIcon
} from "lucide-react-native";

export type DomainKey = "focus" | "logic" | "creative" | "social" | "boss";

export type TemplateDomain = {
  key: DomainKey;
  title: string;
  shortTitle: string;
  category: string;
  accent: string;
  softAccent: string;
  imageUrl: string;
  icon: LucideIcon;
  promise: string;
  sessionInput: string;
  sessionOutput: string;
  metricLabel: string;
};

export type SessionResult = {
  id: string;
  title: string;
  score: number;
  minutes: number;
  status: "completed" | "saved" | "resumable";
  insight: string;
  nextAction: string;
};

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  action: string;
  domain: DomainKey;
};

export const userProgress = {
  name: "Murat",
  location: "Level 12 - Neon League",
  level: "Lv. 12",
  points: 1840,
  streak: 9,
  weeklySessions: 18,
  completionRate: 86,
  confidence: 74
};

export const domains: TemplateDomain[] = [
  {
    key: "focus",
    title: "Focus Sprint",
    shortTitle: "Focus",
    category: "Daily",
    accent: "#FF6F3D",
    softAccent: "#FFE2D4",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    icon: Zap,
    promise: "Beat a short timer, keep the combo alive, and bank quick XP.",
    sessionInput: "quest timer",
    sessionOutput: "focus reward",
    metricLabel: "XP earned"
  },
  {
    key: "logic",
    title: "Puzzle Gate",
    shortTitle: "Logic",
    category: "Skill",
    accent: "#247BFF",
    softAccent: "#E0EDFF",
    imageUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80",
    icon: Brain,
    promise: "Solve tiny choices, unlock streak shields, and grow mastery.",
    sessionInput: "answer choice",
    sessionOutput: "logic score",
    metricLabel: "combo score"
  },
  {
    key: "creative",
    title: "Spark Lab",
    shortTitle: "Create",
    category: "Bonus",
    accent: "#FF4D8D",
    softAccent: "#FFE4F0",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    icon: Sparkles,
    promise: "Turn a prompt into a fast artifact and earn cosmetic shards.",
    sessionInput: "creative prompt",
    sessionOutput: "reward card",
    metricLabel: "shards"
  },
  {
    key: "social",
    title: "Duo Challenge",
    shortTitle: "Duo",
    category: "Social",
    accent: "#00C985",
    softAccent: "#DDFCED",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    icon: Trophy,
    promise: "Join a quick co-op challenge and climb the weekly league.",
    sessionInput: "team goal",
    sessionOutput: "league boost",
    metricLabel: "rank boost"
  },
  {
    key: "boss",
    title: "Boss Round",
    shortTitle: "Boss",
    category: "Event",
    accent: "#875CFF",
    softAccent: "#EEE7FF",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    icon: Crown,
    promise: "A higher-stakes round with multiplier XP and rare badge progress.",
    sessionInput: "boss attempt",
    sessionOutput: "badge progress",
    metricLabel: "boss wins"
  }
];

export const onboardingSteps = [
  {
    id: "quest-style",
    eyebrow: "Player setup",
    title: "Choose your quest rhythm",
    body: "SkillQuest turns app onboarding into a tiny game loop: goal, challenge, reward, repeat.",
    options: ["Fast XP", "Calm streak", "Boss mode"]
  },
  {
    id: "reward-loop",
    eyebrow: "Reward loop",
    title: "Make every tap pay back",
    body: "Each action can show progress, unlock a badge, protect a streak, or push the player toward the next level.",
    options: ["XP", "Coins", "Badges"]
  },
  {
    id: "collection",
    eyebrow: "Collection",
    title: "Give players something to keep",
    body: "Saved results, power-ups, cards, and achievements become the reason to return tomorrow.",
    options: ["Cards", "Power-ups", "Shields"]
  }
];

export const sessions: SessionResult[] = [
  {
    id: "launch-plan",
    title: "Focus Sprint cleared",
    score: 92,
    minutes: 5,
    status: "completed",
    insight: "Perfect streak through 8 micro tasks. Combo multiplier reached x3.",
    nextAction: "Claim the neon focus badge."
  },
  {
    id: "health-reset",
    title: "Puzzle Gate saved",
    score: 81,
    minutes: 4,
    status: "saved",
    insight: "Two answer paths are still open, with one streak shield available.",
    nextAction: "Use shield before the boss round."
  },
  {
    id: "learning-sprint",
    title: "Boss Round resumable",
    score: 76,
    minutes: 5,
    status: "resumable",
    insight: "Rare badge is 70% complete. One clean run unlocks the crown card.",
    nextAction: "Start the final 90-second attempt."
  }
];

export const recommendations: Recommendation[] = [
  {
    id: "onboarding-lab",
    title: "Protect the 9-day streak",
    reason: "One light quest today keeps the streak alive and adds 120 XP.",
    action: "Start light quest",
    domain: "focus"
  },
  {
    id: "carousel-lab",
    title: "Open the Spark Lab chest",
    reason: "Creative shard chest is ready after two saved quest cards.",
    action: "Claim chest",
    domain: "creative"
  },
  {
    id: "cloudflare-ready",
    title: "Enter Neon League push",
    reason: "A duo challenge can move the player from rank 18 to rank 12.",
    action: "Join challenge",
    domain: "social"
  }
];

export const analyticsMetrics = [
  { label: "XP this week", value: "1.8k", delta: "+420", tone: "coral" as const },
  { label: "streak", value: "9d", delta: "safe", tone: "gold" as const },
  { label: "league rank", value: "#18", delta: "+4", tone: "purple" as const },
  { label: "quests done", value: "24", delta: "+6", tone: "green" as const }
];

export const quickActions = [
  { label: "Daily", tone: "coral" as const },
  { label: "Chest", tone: "gold" as const },
  { label: "Duo", tone: "green" as const },
  { label: "Boss", tone: "purple" as const }
];

export const rewardTrack = [
  { label: "120 XP", unlocked: true },
  { label: "coin x40", unlocked: true },
  { label: "shield", unlocked: false },
  { label: "badge", unlocked: false }
];

export const activeLessons = [
  { title: "Combo Basics", progress: 78, meta: "5 tasks left", tone: "blue" as const },
  { title: "Memory Dash", progress: 54, meta: "2 shields ready", tone: "green" as const },
  { title: "Boss Prep", progress: 70, meta: "rare badge", tone: "purple" as const }
];

export function getDomain(key: DomainKey) {
  return domains.find((domain) => domain.key === key) ?? domains[0];
}

export function getSession(id: string) {
  return sessions.find((session) => session.id === id) ?? sessions[0];
}
