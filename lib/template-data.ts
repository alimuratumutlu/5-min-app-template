import {
  BadgeCheck,
  BookOpenCheck,
  Brain,
  BriefcaseBusiness,
  HeartPulse,
  type LucideIcon
} from "lucide-react-native";

export type DomainKey = "focus" | "health" | "learning" | "family" | "work";

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
  level: "Level 7",
  points: 1840,
  streak: 12,
  weeklySessions: 18,
  completionRate: 86,
  confidence: 74
};

export const domains: TemplateDomain[] = [
  {
    key: "focus",
    title: "5-Min Focus Coach",
    shortTitle: "Focus",
    category: "Productivity",
    accent: "#FF8A5B",
    softAccent: "#FFE6D8",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    icon: Brain,
    promise: "Turn one vague task into a tiny next action.",
    sessionInput: "Avoided task",
    sessionOutput: "First action script",
    metricLabel: "Started tasks"
  },
  {
    key: "health",
    title: "5-Min Health Reset",
    shortTitle: "Health",
    category: "Health care",
    accent: "#2FBF8F",
    softAccent: "#DDF7EC",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    icon: HeartPulse,
    promise: "Check one signal and choose the safest next step.",
    sessionInput: "Body signal",
    sessionOutput: "Care checklist",
    metricLabel: "Reset plans"
  },
  {
    key: "learning",
    title: "5-Min Learning Sprint",
    shortTitle: "Learn",
    category: "Learning",
    accent: "#8B7CFF",
    softAccent: "#ECE9FF",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
    icon: BookOpenCheck,
    promise: "Practice one concept until it becomes usable.",
    sessionInput: "Topic",
    sessionOutput: "Recall drill",
    metricLabel: "Recall wins"
  },
  {
    key: "family",
    title: "5-Min Family Helper",
    shortTitle: "Family",
    category: "Family",
    accent: "#35B8C7",
    softAccent: "#DDF7FA",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
    icon: BadgeCheck,
    promise: "Convert a household friction point into one agreement.",
    sessionInput: "Family friction",
    sessionOutput: "Shared routine",
    metricLabel: "Agreements"
  },
  {
    key: "work",
    title: "5-Min Work Coach",
    shortTitle: "Work",
    category: "Work",
    accent: "#E4A62F",
    softAccent: "#FFF1CF",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    icon: BriefcaseBusiness,
    promise: "Clarify one decision, message, or meeting move.",
    sessionInput: "Work situation",
    sessionOutput: "Decision brief",
    metricLabel: "Resolved items"
  }
];

export const onboardingSteps = [
  {
    id: "job",
    eyebrow: "Step 1",
    title: "Pick the app job",
    body: "The same shell can become a coach, tracker, learning sprint, family helper, or work assistant.",
    options: ["Start a task", "Track a signal", "Learn a skill"]
  },
  {
    id: "loop",
    eyebrow: "Step 2",
    title: "Choose the five-minute loop",
    body: "Every app needs intake, guided action, saved result, progress, and a next recommendation.",
    options: ["Intake", "Session", "Saved output"]
  },
  {
    id: "stack",
    eyebrow: "Step 3",
    title: "Prepare the platform stack",
    body: "The design can mature first, then Clerk, Cloudflare D1, R2, analytics, and payments attach through adapters.",
    options: ["Local first", "Clerk auth", "Cloudflare data"]
  }
];

export const sessions: SessionResult[] = [
  {
    id: "launch-plan",
    title: "Avoided task launch",
    score: 92,
    minutes: 5,
    status: "completed",
    insight: "User moved from vague task to a concrete first action.",
    nextAction: "Repeat the first action script tomorrow."
  },
  {
    id: "health-reset",
    title: "Energy check reset",
    score: 81,
    minutes: 4,
    status: "saved",
    insight: "Hydration, movement, and sleep context were captured.",
    nextAction: "Review pattern if low energy repeats three days."
  },
  {
    id: "learning-sprint",
    title: "English recall sprint",
    score: 76,
    minutes: 5,
    status: "resumable",
    insight: "Recall was weaker on example generation than recognition.",
    nextAction: "Run one example-first practice session."
  }
];

export const recommendations: Recommendation[] = [
  {
    id: "onboarding-lab",
    title: "Test onboarding density",
    reason: "Three-step onboarding explains the product without delaying first value.",
    action: "Open onboarding preview",
    domain: "focus"
  },
  {
    id: "carousel-lab",
    title: "Compare domain cards",
    reason: "Carousel exposes how the shell adapts to multiple 5-min concepts.",
    action: "Review carousel",
    domain: "learning"
  },
  {
    id: "cloudflare-ready",
    title: "Keep backend behind adapters",
    reason: "D1, R2, and Clerk should not leak into screen components.",
    action: "Inspect integration points",
    domain: "work"
  }
];

export const analyticsMetrics = [
  { label: "session completed", value: "18", delta: "+5", tone: "blue" as const },
  { label: "saved result", value: "11", delta: "+3", tone: "green" as const },
  { label: "confidence trend", value: "74%", delta: "+9%", tone: "purple" as const },
  { label: "idea validation", value: "6", delta: "+2", tone: "gold" as const }
];

export const quickActions = [
  { label: "Onboarding", tone: "coral" as const },
  { label: "Carousel", tone: "green" as const },
  { label: "Header", tone: "blue" as const },
  { label: "Backend", tone: "gold" as const }
];

export function getDomain(key: DomainKey) {
  return domains.find((domain) => domain.key === key) ?? domains[0];
}

export function getSession(id: string) {
  return sessions.find((session) => session.id === id) ?? sessions[0];
}
