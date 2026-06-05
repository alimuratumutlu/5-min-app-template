import { useMemo, useState, type ReactNode } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BadgeCheck,
  BrainCircuit,
  Check,
  CircleDot,
  Grip,
  Hand,
  Heart,
  Home,
  Keyboard,
  Link2,
  ListOrdered,
  Mic,
  MousePointerClick,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  UserCircle,
  Volume2,
  X,
  Zap,
  type LucideIcon
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, Button, IconButton, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";

type Feedback = { kind: "correct" | "wrong"; title: string; body: string } | null;
type StepType = "choice" | "match" | "order" | "drop" | "text" | "audio" | "checkin";

type LessonStep = {
  id: string;
  type: StepType;
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const navItems = [
  { href: "/", icon: Home, label: "Home", size: 23 },
  { href: "/session", icon: PlayCircle, label: "Session", size: 27 },
  { href: "/analytics", icon: BrainCircuit, label: "AI Report", size: 23 },
  { href: "/bookmarks", icon: Trophy, label: "Leaderboard", size: 23 },
  { href: "/profile", icon: UserCircle, label: "Profile", size: 23 }
] as const;

const lessonSteps: LessonStep[] = [
  {
    id: "next-action",
    type: "choice",
    eyebrow: "Question 1",
    title: "Pick the best 5-minute move",
    body: "The player opens the app tired but wants to protect the streak. What should the game ask first?",
    icon: MousePointerClick
  },
  {
    id: "match-loop",
    type: "match",
    eyebrow: "Question 2",
    title: "Match the game loop",
    body: "Pair each gameplay concept with the right outcome. Correct pairs lock in place.",
    icon: Link2
  },
  {
    id: "sentence",
    type: "order",
    eyebrow: "Question 3",
    title: "Build the update sentence",
    body: "Tap the tokens in order. Tokens behave like Duolingo word tiles.",
    icon: ListOrdered
  },
  {
    id: "drop-signals",
    type: "drop",
    eyebrow: "Question 4",
    title: "Sort the daily signals",
    body: "Select a token, then drop it into the right zone. This models drag/drop categorization.",
    icon: Grip
  },
  {
    id: "short-answer",
    type: "text",
    eyebrow: "Question 5",
    title: "Write the daily update",
    body: "Capture a short user input. This can later be validated by AI or stored as habit data.",
    icon: Keyboard
  },
  {
    id: "audio-choice",
    type: "audio",
    eyebrow: "Question 6",
    title: "Choose the heard instruction",
    body: "A listening/speech pattern for language learning, coaching, or voice-guided check-ins.",
    icon: Volume2
  },
  {
    id: "checkin",
    type: "checkin",
    eyebrow: "Question 7",
    title: "Complete the habit check-in",
    body: "A daily tracking mechanic: tap today's energy, choose the shield rule, then submit.",
    icon: ShieldCheck
  }
];

const choiceOptions = [
  "Open a long planning screen",
  "Ask for one tiny next action",
  "Send the player to settings"
];

const pairMap: Record<string, string> = {
  Timer: "5 min",
  Combo: "x3 reward",
  Shield: "Protect streak"
};

const pairRights = ["Protect streak", "5 min", "x3 reward"];
const orderWords = ["Write", "one", "tiny", "next", "action"];
const correctOrder = orderWords.join(" ");
const dropTokens = ["Mood", "Sleep", "XP"];
const dropZones = ["Input", "Risk", "Output"];
const dropAnswer: Record<string, string> = {
  Input: "Mood",
  Risk: "Sleep",
  Output: "XP"
};
const audioOptions = ["Start the timer now", "Skip today's run", "Open profile settings"];

export default function GameDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const gameId = params.id ?? "focus-sprint";
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [choice, setChoice] = useState("");
  const [leftPick, setLeftPick] = useState("");
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [activeToken, setActiveToken] = useState("");
  const [dropState, setDropState] = useState<Record<string, string>>({});
  const [typedAnswer, setTypedAnswer] = useState("");
  const [audioChoice, setAudioChoice] = useState("");
  const [energy, setEnergy] = useState(0);
  const [shieldRule, setShieldRule] = useState("");

  const step = lessonSteps[stepIndex];
  const completedCount = useMemo(
    () =>
      [
        choice === choiceOptions[1],
        Object.keys(matchedPairs).length === 3,
        order.join(" ") === correctOrder,
        dropZones.every((zone) => dropState[zone] === dropAnswer[zone]),
        isTextAnswerCorrect(typedAnswer),
        audioChoice === audioOptions[0],
        energy >= 3 && shieldRule === "Spend shield only if combo breaks"
      ].filter(Boolean).length,
    [audioChoice, choice, dropState, energy, matchedPairs, order, shieldRule, typedAnswer]
  );
  const progress = Math.round((completedCount / lessonSteps.length) * 100);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/session");
  };

  const pairLeft = (left: string) => {
    if (matchedPairs[left]) return;
    setLeftPick(left);
  };

  const pairRight = (right: string) => {
    if (!leftPick) return;
    if (pairMap[leftPick] === right) {
      setMatchedPairs({ ...matchedPairs, [leftPick]: right });
      setFeedback({ kind: "correct", title: "Match locked", body: `${leftPick} pairs with ${right}.` });
    } else {
      setFeedback({ kind: "wrong", title: "Not that pair", body: "Try another outcome. The selected concept stays active." });
    }
    setLeftPick("");
  };

  const chooseWord = (word: string) => {
    if (order.includes(word)) {
      setOrder(order.filter((item) => item !== word));
      return;
    }
    setOrder([...order, word]);
  };

  const dropIntoZone = (zone: string) => {
    if (!activeToken) return;
    const nextDrop = Object.fromEntries(Object.entries(dropState).filter(([, token]) => token !== activeToken));
    setDropState({ ...nextDrop, [zone]: activeToken });
    setActiveToken("");
  };

  const submit = () => {
    const result = evaluateStep(step.type, {
      choice,
      matchedPairs,
      order,
      dropState,
      typedAnswer,
      audioChoice,
      energy,
      shieldRule
    });
    setFeedback(result);
  };

  const continueLesson = () => {
    if (feedback?.kind !== "correct") {
      setFeedback(null);
      return;
    }
    if (stepIndex < lessonSteps.length - 1) {
      setStepIndex(stepIndex + 1);
      setFeedback(null);
      return;
    }
    router.push("/analytics");
  };

  return (
    <AppScreen
      title="Focus Sprint"
      subtitle="Daily update test"
      activeDomain="SkillQuest"
      footer={<GameFooter feedback={feedback} onCheck={submit} onContinue={continueLesson} isFinalStep={stepIndex === lessonSteps.length - 1} />}
    >
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
              Daily 5-min run
            </Text>
            <Text selectable style={styles.heroBody}>
              One question at a time. Each daily input becomes habit data, XP, streak protection, and a saved result.
            </Text>
          </View>
        </View>
        <View style={styles.stepDots}>
          {lessonSteps.map((item, index) => (
            <View key={item.id} style={[styles.stepDot, index <= stepIndex ? styles.stepDotActive : null]} />
          ))}
        </View>
        <ProgressStatus label={`question ${stepIndex + 1} of ${lessonSteps.length}`} value={progress} tone={progress > 70 ? "green" : "coral"} />
      </LinearGradient>

      <QuestionCard step={step}>
        {step.type === "choice" ? (
          <ChoiceQuestion selected={choice} onSelect={setChoice} />
        ) : step.type === "match" ? (
          <MatchQuestion leftPick={leftPick} matchedPairs={matchedPairs} onLeft={pairLeft} onRight={pairRight} />
        ) : step.type === "order" ? (
          <OrderQuestion order={order} onWord={chooseWord} />
        ) : step.type === "drop" ? (
          <DropQuestion activeToken={activeToken} dropState={dropState} onToken={setActiveToken} onDrop={dropIntoZone} />
        ) : step.type === "text" ? (
          <TextQuestion value={typedAnswer} onChange={setTypedAnswer} />
        ) : step.type === "audio" ? (
          <AudioQuestion selected={audioChoice} onSelect={setAudioChoice} />
        ) : (
          <CheckinQuestion energy={energy} shieldRule={shieldRule} onEnergy={setEnergy} onShieldRule={setShieldRule} />
        )}
      </QuestionCard>
    </AppScreen>
  );
}

function evaluateStep(
  type: StepType,
  state: {
    choice: string;
    matchedPairs: Record<string, string>;
    order: string[];
    dropState: Record<string, string>;
    typedAnswer: string;
    audioChoice: string;
    energy: number;
    shieldRule: string;
  }
): Exclude<Feedback, null> {
  if (type === "choice") {
    return state.choice === choiceOptions[1]
      ? { kind: "correct", title: "Correct", body: "Small next action first. That keeps the daily run playable." }
      : { kind: "wrong", title: "Try again", body: "The app should avoid heavy setup before the 5-minute session starts." };
  }
  if (type === "match") {
    return Object.keys(state.matchedPairs).length === 3
      ? { kind: "correct", title: "All pairs locked", body: "Timer, combo, and shield now map to clear outcomes." }
      : { kind: "wrong", title: "More pairs needed", body: "Match every concept before continuing." };
  }
  if (type === "order") {
    return state.order.join(" ") === correctOrder
      ? { kind: "correct", title: "Sentence complete", body: "This is the exact daily update prompt." }
      : { kind: "wrong", title: "Order needs work", body: "Build: Write one tiny next action." };
  }
  if (type === "drop") {
    return dropZones.every((zone) => state.dropState[zone] === dropAnswer[zone])
      ? { kind: "correct", title: "Signals sorted", body: "Input, risk, and output are ready for tracking." }
      : { kind: "wrong", title: "Check the zones", body: "Mood is input, sleep is risk, XP is output." };
  }
  if (type === "text") {
    return isTextAnswerCorrect(state.typedAnswer)
      ? { kind: "correct", title: "Accepted", body: "The answer contains a clear start/focus action." }
      : { kind: "wrong", title: "Make it actionable", body: "Include a concrete start or focus action." };
  }
  if (type === "audio") {
    return state.audioChoice === audioOptions[0]
      ? { kind: "correct", title: "Heard correctly", body: "Voice instruction can drive the same game loop." }
      : { kind: "wrong", title: "Listen again", body: "The spoken instruction is: Start the timer now." };
  }
  return state.energy >= 3 && state.shieldRule === "Spend shield only if combo breaks"
    ? { kind: "correct", title: "Daily check-in saved", body: "Habit data and shield rule are ready for today." }
    : { kind: "wrong", title: "Incomplete check-in", body: "Pick energy and the correct shield rule." };
}

function isTextAnswerCorrect(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.includes("start") || normalized.includes("focus") || normalized.includes("next action");
}

function QuestionCard({ step, children }: { step: LessonStep; children: ReactNode }) {
  const Icon = step.icon;
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionIcon}>
          <Icon color="#FFFFFF" size={20} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text selectable style={styles.questionEyebrow}>
            {step.eyebrow}
          </Text>
          <Text selectable style={styles.questionTitle}>
            {step.title}
          </Text>
          <Text selectable style={styles.questionBody}>
            {step.body}
          </Text>
        </View>
      </View>
      <View style={styles.questionSurface}>{children}</View>
    </View>
  );
}

function ChoiceQuestion({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.stack}>
      {choiceOptions.map((item) => (
        <ChoiceButton key={item} label={item} selected={selected === item} onPress={() => onSelect(item)} />
      ))}
    </View>
  );
}

function MatchQuestion({
  leftPick,
  matchedPairs,
  onLeft,
  onRight
}: {
  leftPick: string;
  matchedPairs: Record<string, string>;
  onLeft: (value: string) => void;
  onRight: (value: string) => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.matchGrid}>
        <View style={styles.matchColumn}>
          {Object.keys(pairMap).map((item) => (
            <MatchButton key={item} label={item} active={leftPick === item} done={Boolean(matchedPairs[item])} onPress={() => onLeft(item)} />
          ))}
        </View>
        <View style={styles.matchColumn}>
          {pairRights.map((item) => (
            <MatchButton key={item} label={item} active={false} done={Object.values(matchedPairs).includes(item)} onPress={() => onRight(item)} />
          ))}
        </View>
      </View>
      <Text selectable style={styles.helperText}>
        {leftPick ? `Selected: ${leftPick}. Now tap the matching outcome.` : "Tap a left concept first."}
      </Text>
    </View>
  );
}

function OrderQuestion({ order, onWord }: { order: string[]; onWord: (word: string) => void }) {
  return (
    <View style={styles.stack}>
      <View style={styles.orderTarget}>
        {order.length ? (
          order.map((word) => (
            <Pressable key={word} onPress={() => onWord(word)} style={({ pressed }) => [styles.selectedWord, pressed ? styles.pressed : null]}>
              <Text selectable style={styles.selectedWordText}>
                {word}
              </Text>
            </Pressable>
          ))
        ) : (
          <Text selectable style={styles.orderPlaceholder}>
            Tap tiles below
          </Text>
        )}
      </View>
      <View style={styles.wordBank}>
        {orderWords.map((word) => {
          const used = order.includes(word);
          return (
            <Pressable key={word} disabled={used} onPress={() => onWord(word)} style={({ pressed }) => [styles.duoWordShell, used ? styles.duoWordShellUsed : null, pressed ? styles.duoPressed : null]}>
              <View style={[styles.duoWordFace, used ? styles.duoWordFaceUsed : null]}>
                <Text selectable style={[styles.duoWordText, used ? styles.duoWordTextUsed : null]}>
                  {word}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function DropQuestion({
  activeToken,
  dropState,
  onToken,
  onDrop
}: {
  activeToken: string;
  dropState: Record<string, string>;
  onToken: (value: string) => void;
  onDrop: (zone: string) => void;
}) {
  const placedTokens = Object.values(dropState);
  return (
    <View style={styles.stack}>
      <View style={styles.dragTokens}>
        {dropTokens.map((token) => {
          const placed = placedTokens.includes(token);
          return (
            <Pressable key={token} disabled={placed} onPress={() => onToken(token)} style={({ pressed }) => [styles.dragToken, activeToken === token ? styles.dragTokenActive : null, placed ? styles.dragTokenPlaced : null, pressed ? styles.pressed : null]}>
              <Hand color={activeToken === token ? "#FFFFFF" : colors.purple} size={15} strokeWidth={3} />
              <Text selectable style={[styles.dragTokenText, activeToken === token ? styles.dragTokenTextActive : null]}>
                {token}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.dropGrid}>
        {dropZones.map((zone) => (
          <Pressable key={zone} onPress={() => onDrop(zone)} style={({ pressed }) => [styles.dropZone, dropState[zone] ? styles.dropZoneFilled : null, pressed ? styles.pressed : null]}>
            <Text selectable style={styles.dropZoneLabel}>
              {zone}
            </Text>
            <Text selectable style={styles.dropZoneValue}>
              {dropState[zone] ?? "Drop here"}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text selectable style={styles.helperText}>
        {activeToken ? `Dragging: ${activeToken}. Tap a zone to drop it.` : "Tap a token to pick it up."}
      </Text>
    </View>
  );
}

function TextQuestion({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <View style={styles.stack}>
      <TextInput
        accessibilityLabel="Daily update input"
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="Example: I will start the timer and write one next action."
        placeholderTextColor="#9397A0"
        style={styles.answerInput}
      />
      <View style={styles.inputMeta}>
        <Keyboard color={colors.blue} size={16} strokeWidth={3} />
        <Text selectable style={styles.helperText}>
          This simulates structured daily data entry.
        </Text>
      </View>
    </View>
  );
}

function AudioQuestion({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.stack}>
      <View style={styles.audioCard}>
        <Volume2 color="#FFFFFF" size={25} strokeWidth={3} />
        <Text selectable style={styles.audioText}>
          "Start the timer now"
        </Text>
        <Mic color="#FFFFFF" size={20} strokeWidth={3} />
      </View>
      {audioOptions.map((item) => (
        <ChoiceButton key={item} label={item} selected={selected === item} onPress={() => onSelect(item)} />
      ))}
    </View>
  );
}

function CheckinQuestion({
  energy,
  shieldRule,
  onEnergy,
  onShieldRule
}: {
  energy: number;
  shieldRule: string;
  onEnergy: (value: number) => void;
  onShieldRule: (value: string) => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.energyRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable key={value} onPress={() => onEnergy(value)} style={({ pressed }) => [styles.energyButton, energy === value ? styles.energyButtonActive : null, pressed ? styles.pressed : null]}>
            <CircleDot color={energy === value ? "#FFFFFF" : colors.coral} size={18} strokeWidth={3} />
            <Text selectable style={[styles.energyText, energy === value ? styles.energyTextActive : null]}>
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
      {["Spend shield immediately", "Spend shield only if combo breaks", "Skip reward claim"].map((item) => (
        <ChoiceButton key={item} label={item} selected={shieldRule === item} onPress={() => onShieldRule(item)} />
      ))}
    </View>
  );
}

function ChoiceButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.choiceShell, selected ? styles.choiceShellActive : null, pressed ? styles.duoPressed : null]}>
      <View style={[styles.choiceFace, selected ? styles.choiceFaceActive : null]}>
        <Text selectable style={[styles.choiceText, selected ? styles.choiceTextActive : null]}>
          {label}
        </Text>
        {selected ? <Check color={colors.blue} size={18} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

function MatchButton({ label, active, done, onPress }: { label: string; active: boolean; done: boolean; onPress: () => void }) {
  return (
    <Pressable disabled={done} onPress={onPress} style={({ pressed }) => [styles.matchShell, active ? styles.matchShellActive : null, done ? styles.matchShellDone : null, pressed ? styles.duoPressed : null]}>
      <View style={[styles.matchFace, active ? styles.matchFaceActive : null, done ? styles.matchFaceDone : null]}>
        <Text selectable style={[styles.matchText, active || done ? styles.matchTextActive : null]}>
          {label}
        </Text>
        {done ? <BadgeCheck color="#FFFFFF" size={16} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

function GameFooter({
  feedback,
  onCheck,
  onContinue,
  isFinalStep
}: {
  feedback: Feedback;
  onCheck: () => void;
  onContinue: () => void;
  isFinalStep: boolean;
}) {
  return (
    <View style={styles.footerStack}>
      <View style={[styles.feedbackPanel, feedback?.kind === "correct" ? styles.feedbackCorrect : feedback?.kind === "wrong" ? styles.feedbackWrong : null]}>
        {feedback ? (
          <View style={styles.feedbackCopy}>
            <View style={[styles.feedbackIcon, feedback.kind === "correct" ? styles.feedbackIconGood : styles.feedbackIconBad]}>
              {feedback.kind === "correct" ? <Check color="#FFFFFF" size={18} strokeWidth={3} /> : <X color="#FFFFFF" size={18} strokeWidth={3} />}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text selectable style={styles.feedbackTitle}>
                {feedback.title}
              </Text>
              <Text selectable style={styles.feedbackBody}>
                {feedback.body}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.feedbackCopy}>
            <View style={styles.feedbackIconIdle}>
              <Sparkles color={colors.purple} size={18} strokeWidth={3} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text selectable style={styles.feedbackTitle}>
                Ready to check
              </Text>
              <Text selectable style={styles.feedbackBody}>
                Answer the current question, then check it here.
              </Text>
            </View>
          </View>
        )}
        <Button
          label={feedback ? (feedback.kind === "correct" ? (isFinalStep ? "Finish run" : "Continue") : "Try again") : "Check answer"}
          icon={feedback?.kind === "correct" ? Check : Sparkles}
          onPress={feedback ? onContinue : onCheck}
          variant={feedback?.kind === "wrong" ? "secondary" : "primary"}
          fullWidth
        />
      </View>
      <GameBottomNav />
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
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 33
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  stepDots: {
    flexDirection: "row",
    gap: 6
  },
  stepDot: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    flex: 1,
    height: 9
  },
  stepDotActive: {
    backgroundColor: colors.coral
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    borderCurve: "continuous",
    gap: 17,
    minHeight: 460,
    padding: 17,
    boxShadow: "0 22px 46px rgba(16,17,22,0.09)"
  },
  questionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  questionIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 24,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  questionEyebrow: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  questionTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 27
  },
  questionBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  questionSurface: {
    flex: 1,
    justifyContent: "center"
  },
  stack: {
    gap: 12
  },
  choiceShell: {
    backgroundColor: "#D8DFE8",
    borderRadius: 28,
    minHeight: 66,
    paddingBottom: 6
  },
  choiceShellActive: {
    backgroundColor: "#B8D2FF"
  },
  choiceFace: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EDF4",
    borderRadius: 28,
    borderWidth: 2,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    minHeight: 60,
    paddingHorizontal: 16
  },
  choiceFaceActive: {
    backgroundColor: "#F6FAFF",
    borderColor: colors.blue
  },
  choiceText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19
  },
  choiceTextActive: {
    color: colors.blue
  },
  matchGrid: {
    flexDirection: "row",
    gap: 12
  },
  matchColumn: {
    flex: 1,
    gap: 10
  },
  matchShell: {
    backgroundColor: "#D8DFE8",
    borderRadius: 24,
    minHeight: 56,
    paddingBottom: 5
  },
  matchShellActive: {
    backgroundColor: "#6540D8"
  },
  matchShellDone: {
    backgroundColor: "#00A971"
  },
  matchFace: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E6EAF0",
    borderRadius: 24,
    borderWidth: 2,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 51,
    paddingHorizontal: 8
  },
  matchFaceActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple
  },
  matchFaceDone: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  matchText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    textAlign: "center"
  },
  matchTextActive: {
    color: "#FFFFFF"
  },
  helperText: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16
  },
  orderTarget: {
    alignItems: "center",
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 28,
    borderWidth: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 94,
    padding: 12
  },
  orderPlaceholder: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900"
  },
  selectedWord: {
    backgroundColor: colors.blue,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  selectedWordText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 15
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  duoWordShell: {
    backgroundColor: "#D8DFE8",
    borderRadius: 20,
    paddingBottom: 5
  },
  duoWordShellUsed: {
    backgroundColor: "#E8EDF4"
  },
  duoWordFace: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6EAF0",
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  duoWordFaceUsed: {
    backgroundColor: "#F1F4F8"
  },
  duoWordText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 16
  },
  duoWordTextUsed: {
    color: "#B9C0C9"
  },
  dragTokens: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  dragToken: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E6EAF0",
    borderRadius: 22,
    borderWidth: 2,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  dragTokenActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple
  },
  dragTokenPlaced: {
    opacity: 0.32
  },
  dragTokenText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  dragTokenTextActive: {
    color: "#FFFFFF"
  },
  dropGrid: {
    gap: 10
  },
  dropZone: {
    backgroundColor: "#F6FAFF",
    borderColor: "#C9DCFF",
    borderRadius: 24,
    borderStyle: "dashed",
    borderWidth: 2,
    minHeight: 72,
    padding: 13
  },
  dropZoneFilled: {
    backgroundColor: "#ECFFF7",
    borderColor: colors.green,
    borderStyle: "solid"
  },
  dropZoneLabel: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  dropZoneValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    marginTop: 5
  },
  answerInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8DFE8",
    borderRadius: 26,
    borderWidth: 2,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    minHeight: 132,
    padding: 15,
    textAlignVertical: "top"
  },
  inputMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  audioCard: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 30,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 86,
    padding: 16
  },
  audioText: {
    color: "#FFFFFF",
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center"
  },
  energyRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between"
  },
  energyButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFE2D4",
    borderRadius: 21,
    borderWidth: 2,
    flex: 1,
    gap: 4,
    minHeight: 62,
    justifyContent: "center"
  },
  energyButtonActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  energyText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  energyTextActive: {
    color: "#FFFFFF"
  },
  footerStack: {
    gap: 10
  },
  feedbackPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderCurve: "continuous",
    gap: 12,
    padding: 13,
    boxShadow: "0 18px 42px rgba(16,17,22,0.12)"
  },
  feedbackCorrect: {
    backgroundColor: "#ECFFF7"
  },
  feedbackWrong: {
    backgroundColor: "#FFF0E8"
  },
  feedbackCopy: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  feedbackIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  feedbackIconGood: {
    backgroundColor: colors.green
  },
  feedbackIconBad: {
    backgroundColor: colors.coral
  },
  feedbackIconIdle: {
    alignItems: "center",
    backgroundColor: colors.purpleSoft,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  feedbackTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18
  },
  feedbackBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16
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
  duoPressed: {
    paddingBottom: 1,
    paddingTop: 4
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  }
});
