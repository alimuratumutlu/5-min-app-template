import {
  Compass,
  Hotel,
  Map,
  Mountain,
  Palmtree,
  type LucideIcon
} from "lucide-react-native";

export type DomainKey = "brazil" | "japan" | "morocco" | "iceland" | "peru";

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
  name: "Vanessa",
  location: "Paris, France",
  level: "Explorer",
  points: 12480,
  streak: 7,
  weeklySessions: 4,
  completionRate: 82,
  confidence: 91
};

export const domains: TemplateDomain[] = [
  {
    key: "brazil",
    title: "Iconic Brazil",
    shortTitle: "Brazil",
    category: "South America",
    accent: "#FF8A5B",
    softAccent: "#FFE6D8",
    imageUrl: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=900&q=80",
    icon: Palmtree,
    promise: "Rio, waterfalls, coastal roads, and late dinners with local guides.",
    sessionInput: "Trip preference",
    sessionOutput: "Tour schedule",
    metricLabel: "Booked tours"
  },
  {
    key: "japan",
    title: "Kyoto Slow Days",
    shortTitle: "Japan",
    category: "Asia",
    accent: "#E9576B",
    softAccent: "#FFE4EA",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    icon: Compass,
    promise: "Temples, train windows, tea rooms, and quiet side streets.",
    sessionInput: "Travel style",
    sessionOutput: "Day plan",
    metricLabel: "Saved routes"
  },
  {
    key: "morocco",
    title: "Marrakesh Glow",
    shortTitle: "Morocco",
    category: "Africa",
    accent: "#D88B35",
    softAccent: "#FFF0D8",
    imageUrl: "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=900&q=80",
    icon: Hotel,
    promise: "Riads, desert light, craft markets, and rooftop breakfasts.",
    sessionInput: "Hotel mood",
    sessionOutput: "Stay shortlist",
    metricLabel: "Hotel picks"
  },
  {
    key: "iceland",
    title: "Northern Lights",
    shortTitle: "Iceland",
    category: "Europe",
    accent: "#45A6B8",
    softAccent: "#DFF5F8",
    imageUrl: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=900&q=80",
    icon: Mountain,
    promise: "Glacier lagoons, black sand, thermal pools, and aurora nights.",
    sessionInput: "Adventure level",
    sessionOutput: "Route map",
    metricLabel: "Route days"
  },
  {
    key: "peru",
    title: "Andes Passage",
    shortTitle: "Peru",
    category: "South America",
    accent: "#7B8C4A",
    softAccent: "#EEF4D9",
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",
    icon: Map,
    promise: "Sacred Valley mornings, train rides, and high-altitude viewpoints.",
    sessionInput: "Route priority",
    sessionOutput: "Guide match",
    metricLabel: "Guide matches"
  }
];

export const onboardingSteps = [
  {
    id: "job",
    eyebrow: "Trip style",
    title: "Choose a travel mood",
    body: "Solara matches destination, pace, hotel feel, and guide style into one clean itinerary.",
    options: ["Slow culture", "Adventure", "Food route"]
  },
  {
    id: "loop",
    eyebrow: "Booking",
    title: "Hold the best tour",
    body: "Select a schedule, compare accommodation, and keep a flexible hold before checkout.",
    options: ["Tour", "Hotel", "Guide"]
  },
  {
    id: "stack",
    eyebrow: "Travel kit",
    title: "Save the trip card",
    body: "Favorite tours, vouchers, boarding notes, and local contacts stay in one itinerary.",
    options: ["Voucher", "Map", "Contacts"]
  }
];

export const sessions: SessionResult[] = [
  {
    id: "launch-plan",
    title: "Rio arrival plan",
    score: 92,
    minutes: 5,
    status: "completed",
    insight: "Airport transfer, hotel check-in, and evening restaurant are reserved.",
    nextAction: "Confirm sunset dinner table."
  },
  {
    id: "health-reset",
    title: "Ipanema coast day",
    score: 81,
    minutes: 4,
    status: "saved",
    insight: "Beach walk, bike rental, and seafood lunch are grouped by distance.",
    nextAction: "Choose morning or golden-hour start."
  },
  {
    id: "learning-sprint",
    title: "Christ the Redeemer slot",
    score: 76,
    minutes: 5,
    status: "resumable",
    insight: "Early access guide slot is available with hotel pickup.",
    nextAction: "Save the 07:30 pickup window."
  }
];

export const recommendations: Recommendation[] = [
  {
    id: "onboarding-lab",
    title: "Book Rio with a private guide",
    reason: "Best match for cultural pace, hotel pickup, and flexible dinner plans.",
    action: "Open tour detail",
    domain: "brazil"
  },
  {
    id: "carousel-lab",
    title: "Save Kyoto for spring",
    reason: "Lower crowd days are available after the first cherry blossom weekend.",
    action: "Save route",
    domain: "japan"
  },
  {
    id: "cloudflare-ready",
    title: "Compare riads in Marrakesh",
    reason: "Three quiet properties match rooftop breakfast and walkable souk access.",
    action: "Compare stays",
    domain: "morocco"
  }
];

export const analyticsMetrics = [
  { label: "trips planned", value: "12", delta: "+3", tone: "blue" as const },
  { label: "saved tours", value: "8", delta: "+2", tone: "green" as const },
  { label: "match score", value: "91%", delta: "+6%", tone: "purple" as const },
  { label: "price alerts", value: "4", delta: "live", tone: "gold" as const }
];

export const quickActions = [
  { label: "Flights", tone: "coral" as const },
  { label: "Hotels", tone: "green" as const },
  { label: "Guides", tone: "blue" as const },
  { label: "Insurance", tone: "gold" as const }
];

export function getDomain(key: DomainKey) {
  return domains.find((domain) => domain.key === key) ?? domains[0];
}

export function getSession(id: string) {
  return sessions.find((session) => session.id === id) ?? sessions[0];
}
