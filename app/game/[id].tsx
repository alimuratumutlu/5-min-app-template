import { useState, type ReactNode } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  Heart,
  Home,
  Keyboard,
  Link2,
  ListOrdered,
  MousePointerClick,
  Play,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCircle,
  X,
  Zap,
  type LucideIcon
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, Button, IconButton, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";
import { userProgress } from "@/lib/template-data";

const navItems = [
  { href: "/", icon: Home, label: "Home", size: 23 },
  { href: "/analytics", icon: BrainCircuit, label: "AI Report", size: 23 },
  { href: "/session", icon: PlayCircle, label: "Session", size: 27 },
  { href: "/bookmarks", icon: Trophy, label: "Leaderboard", size: 23 },
  { href: "/profile", icon: UserCircle, label: "Profile", size: 23 }
] as const;

const choices = [
  "Open social feeds for inspiration",
  "Write one next action and start a 5-minute timer",
  "Plan the full project roadmap again"
];

const pairMap: Record<string, string> = {
  Timer: "5 min",
  Reward: "+120 XP",
  Shield: "Protect streak"
};

const orderWords = ["Write", "one", "tiny", "next", "action"];
const correctOrder = orderWords.join(" ");

export default function GameDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const gameId = params.id ?? "focus-sprint";
  const [choice, setChoice] = useState("");
  const [leftPick, setLeftPick] = useState("");
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [shieldDecision, setShieldDecision] = useState("");

  const choiceCorrect = choice === choices[1];
  const orderCorrect = order.join(" ") === correctOrder;
  const typedCorrect = typedAnswer.trim().toLowerCase().includes("start") || typedAnswer.trim().toLowerCase().includes("focus");
  const shieldCorrect = shieldDecision === "Spend shield only if combo breaks";
  const progress =
    (choiceCorrect ? 20 : 0) +
    (matchedPairs.length === 3 ? 20 : 0) +
    (orderCorrect ? 20 : 0) +
    (typedCorrect ? 20 : 0) +
    (shieldCorrect ? 20 : 0);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/session");
  };

  const chooseRight = (right: string) => {
    if (!leftPick) return;
    if (pairMap[leftPick] === right && !matchedPairs.includes(leftPick)) {
      setMatchedPairs([...matchedPairs, leftPick]);
    }
    setLeftPick("");
  };

  const resetRun = () => {
    setChoice("");
    setLeftPick("");
    setMatchedPairs([]);
    setOrder([]);
    setTypedAnswer("");
    setShieldDecision("");
  };

  return (
    <AppScreen title="Game detail" subtitle="Question mechanics lab" activeDomain="SkillQuest" footer={<GameBottomNav />}>
      <View style={{ alignItems: "flex-start" }}>
        <IconButton icon={ArrowLeft} label="Go back" tone="dark" onPress={goBack} />
      </View>

      <LinearGradient colors={["#FFFFFF", "#FFF0E8", "#EAF3FF"]} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.gameMark}>
            <Zap color="#FFFFFF" size={25} strokeWidth={3} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text selectable style={styles.eyebrow}>
              {gameId.replaceAll("-", " ")}
            </Text>
            <Text selectable style={styles.heroTitle}>
              Focus Sprint
            </Text>
            <Text selectable style={styles.heroBody}>
              A Duolingo-style 5-minute lesson template with multiple answer mechanics, streak protection, XP, and instant feedback states.
            </Text>
          </View>
        </View>
        <View style={styles.heroStats}>
          <StatBubble icon={Heart} label="lives" value="3" tone={colors.coral} />
          <StatBubble icon={Sparkles} label="combo" value="x3" tone={colors.purple} />
          <StatBubble icon={Trophy} label="reward" value="+120" tone={colors.gold} />
        </View>
        <ProgressStatus label="lesson completion" value={progress} tone={progress > 70 ? "green" : "coral"} />
        <Button label="Start live run" icon={Play} onPress={() => router.push("/session")} />
      </LinearGradient>

      <MechanicCard icon={MousePointerClick} label="Mechanic 1" title="Multiple choice" body="Pick the best next move for a 5-minute focus run.">
        {choices.map((item) => (
          <AnswerButton key={item} label={item} selected={choice === item} correct={choice === item && item === choices[1]} wrong={choice === item && item !== choices[1]} onPress={() => setChoice(item)} />
        ))}
      </MechanicCard>

      <MechanicCard icon={Link2} label="Mechanic 2" title="Match pairs" body="Tap a concept on the left, then match it with the correct reward or rule.">
        <View style={styles.matchGrid}>
          <View style={styles.matchColumn}>
            {Object.keys(pairMap).map((item) => (
              <MatchPill key={item} label={item} active={leftPick === item} done={matchedPairs.includes(item)} onPress={() => setLeftPick(item)} />
            ))}
          </View>
          <View style={styles.matchColumn}>
            {["Protect streak", "+120 XP", "5 min"].map((item) => (
              <MatchPill key={item} label={item} active={false} done={matchedPairs.some((left) => pairMap[left] === item)} onPress={() => chooseRight(item)} />
            ))}
          </View>
        </View>
      </MechanicCard>

      <MechanicCard icon={ListOrdered} label="Mechanic 3" title="Order builder" body="Tap words in the correct order. This becomes a reusable sentence/reorder question type.">
        <View style={styles.orderTarget}>
          <Text selectable style={styles.orderText}>
            {order.length ? order.join(" ") : "Tap words below"}
          </Text>
          {orderCorrect ? <Check color={colors.green} size={19} strokeWidth={3} /> : null}
        </View>
        <View style={styles.wordBank}>
          {orderWords.map((word) => {
            const used = order.includes(word);
            return (
              <Pressable key={word} disabled={used} onPress={() => setOrder([...order, word])} style={({ pressed }) => [styles.wordChip, used ? styles.wordChipUsed : null, pressed ? styles.pressed : null]}>
                <Text selectable style={[styles.wordText, used ? styles.wordTextUsed : null]}>
                  {word}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Button label="Reset order" icon={RefreshCw} variant="secondary" onPress={() => setOrder([])} />
      </MechanicCard>

      <MechanicCard icon={Keyboard} label="Mechanic 4" title="Short written answer" body="Use this for reflection, language practice, habit check-ins, or generated answer validation.">
        <TextInput
          accessibilityLabel="Short answer input"
          value={typedAnswer}
          onChangeText={setTypedAnswer}
          placeholder="Example: start the timer and write one action"
          placeholderTextColor="#9397A0"
          style={styles.answerInput}
        />
        <View style={[styles.feedbackLine, typedAnswer ? (typedCorrect ? styles.feedbackGood : styles.feedbackNeutral) : null]}>
          {typedAnswer ? typedCorrect ? <Check color={colors.green} size={17} strokeWidth={3} /> : <X color={colors.textMuted} size={17} strokeWidth={3} /> : null}
          <Text selectable style={styles.feedbackText}>
            {typedAnswer ? (typedCorrect ? "Accepted answer pattern" : "Waiting for a clearer action phrase") : "Type any short answer to test validation feedback"}
          </Text>
        </View>
      </MechanicCard>

      <MechanicCard icon={ShieldCheck} label="Mechanic 5" title="Decision card" body="A yes/no or rule-choice card for habit coaching, risk checks, and power-up decisions.">
        {["Spend shield immediately", "Spend shield only if combo breaks", "Skip reward claim"].map((item) => (
          <AnswerButton key={item} label={item} selected={shieldDecision === item} correct={shieldDecision === item && item === "Spend shield only if combo breaks"} wrong={shieldDecision === item && item !== "Spend shield only if combo breaks"} onPress={() => setShieldDecision(item)} />
        ))}
      </MechanicCard>

      <LinearGradient colors={["#FFFFFF", "#E9FFF5"]} style={styles.summary}>
        <Text selectable style={textStyles.cardTitle}>
          Run summary
        </Text>
        <Text selectable style={textStyles.body}>
          This single page covers selectable answers, pair matching, ordered sentence building, text validation, decision cards, progress, reset state, lives, combo, and XP.
        </Text>
        <Button label="Reset mechanics" icon={RefreshCw} variant="secondary" onPress={resetRun} />
      </LinearGradient>
    </AppScreen>
  );
}

function MechanicCard({
  icon: Icon,
  label,
  title,
  body,
  children
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.mechanicCard}>
      <View style={styles.mechanicHeader}>
        <View style={styles.mechanicIcon}>
          <Icon color="#FFFFFF" size={19} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text selectable style={styles.mechanicLabel}>
            {label}
          </Text>
          <Text selectable style={textStyles.cardTitle}>
            {title}
          </Text>
          <Text selectable style={textStyles.body}>
            {body}
          </Text>
        </View>
      </View>
      <View style={styles.mechanicBody}>{children}</View>
    </View>
  );
}

function AnswerButton({
  label,
  selected,
  correct,
  wrong,
  onPress
}: {
  label: string;
  selected: boolean;
  correct?: boolean;
  wrong?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.answerShell, correct ? styles.answerShellCorrect : wrong ? styles.answerShellWrong : null, pressed ? styles.answerPressed : null]}>
      <View style={[styles.answerFace, selected ? styles.answerFaceSelected : null, correct ? styles.answerFaceCorrect : wrong ? styles.answerFaceWrong : null]}>
        <Text selectable style={[styles.answerText, selected ? styles.answerTextSelected : null]}>
          {label}
        </Text>
        {correct ? <Check color={colors.green} size={18} strokeWidth={3} /> : wrong ? <X color={colors.coral} size={18} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

function MatchPill({ label, active, done, onPress }: { label: string; active: boolean; done: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.matchPill, active ? styles.matchPillActive : null, done ? styles.matchPillDone : null, pressed ? styles.pressed : null]}>
      <Text selectable style={[styles.matchText, active || done ? styles.matchTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function StatBubble({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return (
    <View style={styles.statBubble}>
      <Icon color={tone} size={17} strokeWidth={3} />
      <Text selectable style={styles.statValue}>
        {value}
      </Text>
      <Text selectable style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function GameBottomNav() {
  const router = useRouter();

  return (
    <View style={styles.navOuter}>
      <BlurView intensity={64} tint="light" style={styles.navBlur}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable key={item.label} accessibilityRole="button" accessibilityLabel={item.label} onPress={() => router.push(item.href)} style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : null]}>
              <Icon color="rgba(112,115,122,0.78)" size={item.size} strokeWidth={2.4} />
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 36,
    borderCurve: "continuous",
    gap: 15,
    overflow: "hidden",
    padding: 17,
    boxShadow: "0 24px 46px rgba(255, 111, 61, 0.14)"
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 13
  },
  gameMark: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 27,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  eyebrow: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  heroStats: {
    flexDirection: "row",
    gap: 10
  },
  statBubble: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    flex: 1,
    gap: 4,
    padding: 12
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 21
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    textTransform: "uppercase"
  },
  mechanicCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    borderCurve: "continuous",
    gap: 14,
    padding: 15,
    boxShadow: "0 18px 38px rgba(16,17,22,0.08)"
  },
  mechanicHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  mechanicIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 23,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  mechanicLabel: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  mechanicBody: {
    gap: 10
  },
  answerShell: {
    backgroundColor: "#D8DFE8",
    borderRadius: 26,
    minHeight: 62,
    paddingBottom: 5
  },
  answerShellCorrect: {
    backgroundColor: "#00A971"
  },
  answerShellWrong: {
    backgroundColor: "#D94E25"
  },
  answerPressed: {
    paddingBottom: 1,
    paddingTop: 4
  },
  answerFace: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EDF4",
    borderRadius: 26,
    borderWidth: 2,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 57,
    paddingHorizontal: 15
  },
  answerFaceSelected: {
    borderColor: colors.blue,
    backgroundColor: "#F6FAFF"
  },
  answerFaceCorrect: {
    borderColor: colors.green,
    backgroundColor: "#ECFFF7"
  },
  answerFaceWrong: {
    borderColor: colors.coral,
    backgroundColor: "#FFF0E8"
  },
  answerText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  answerTextSelected: {
    color: colors.text
  },
  matchGrid: {
    flexDirection: "row",
    gap: 10
  },
  matchColumn: {
    flex: 1,
    gap: 9
  },
  matchPill: {
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderColor: "#E2E8F0",
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  matchPillActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple
  },
  matchPillDone: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  matchText: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    textAlign: "center"
  },
  matchTextActive: {
    color: "#FFFFFF"
  },
  orderTarget: {
    alignItems: "center",
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    minHeight: 58,
    paddingHorizontal: 14
  },
  orderText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  wordChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8DFE8",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  wordChipUsed: {
    backgroundColor: "#EDF1F6"
  },
  wordText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 15
  },
  wordTextUsed: {
    color: colors.textMuted
  },
  answerInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8DFE8",
    borderRadius: 24,
    borderWidth: 2,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
    minHeight: 58,
    paddingHorizontal: 15
  },
  feedbackLine: {
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  feedbackGood: {
    backgroundColor: "#ECFFF7"
  },
  feedbackNeutral: {
    backgroundColor: "#FFF8E2"
  },
  feedbackText: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16
  },
  summary: {
    borderRadius: 34,
    borderCurve: "continuous",
    gap: 12,
    padding: 16
  },
  navOuter: {
    alignSelf: "center",
    maxWidth: 380,
    width: "100%"
  },
  navBlur: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "rgba(255,255,255,0.92)",
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    boxShadow: "0 18px 42px rgba(36, 123, 255, 0.14)",
    flexDirection: "row",
    height: 64,
    justifyContent: "space-around",
    overflow: "hidden"
  },
  navButton: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    width: 58
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  }
});
