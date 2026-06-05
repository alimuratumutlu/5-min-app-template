import { useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Check, ChevronLeft, Crown, Flame, Gift, ShieldCheck, Sparkles, Star, Zap, type LucideIcon } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, colors, fonts, ProgressStatus, RewardStrip, SegmentedProgress } from "@/components/app-shell";

type GoalKey = "streak" | "xp" | "boss";
type PaceKey = "casual" | "focused" | "intense";
type PlanKey = "yearly" | "monthly";

type Option<T extends string> = {
  key: T;
  title: string;
  body: string;
  icon: LucideIcon;
  tone: string;
};

const goals: Option<GoalKey>[] = [
  { key: "streak", title: "Protect streak", body: "Keep momentum with tiny daily wins.", icon: Flame, tone: colors.coral },
  { key: "xp", title: "Earn fast XP", body: "Chase rewards, boosts, and level-ups.", icon: Zap, tone: colors.blue },
  { key: "boss", title: "Beat boss rounds", body: "Train for harder challenges and badges.", icon: Crown, tone: colors.purple }
];

const paces: Option<PaceKey>[] = [
  { key: "casual", title: "3 min/day", body: "Low pressure, high consistency.", icon: ShieldCheck, tone: colors.green },
  { key: "focused", title: "7 min/day", body: "Best balance for weekly progress.", icon: Star, tone: colors.gold },
  { key: "intense", title: "12 min/day", body: "Faster unlocks and league climb.", icon: Sparkles, tone: colors.purple }
];

const planCopy = {
  yearly: { price: "$39.99", cadence: "per year", badge: "Best value", saving: "Save 58%" },
  monthly: { price: "$7.99", cadence: "per month", badge: "Flexible", saving: "Cancel anytime" }
};

export function OnboardingLab({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<GoalKey>("streak");
  const [pace, setPace] = useState<PaceKey>("focused");
  const [plan, setPlan] = useState<PlanKey>("yearly");
  const progress = Math.round(((step + 1) / 5) * 100);
  const selectedGoal = goals.find((item) => item.key === goal) ?? goals[0];
  const selectedPace = paces.find((item) => item.key === pace) ?? paces[1];
  const currentPlan = planCopy[plan];

  const resultScore = useMemo(() => {
    const goalBonus = goal === "xp" ? 8 : goal === "boss" ? 12 : 5;
    const paceBonus = pace === "intense" ? 10 : pace === "focused" ? 7 : 3;
    return 70 + goalBonus + paceBonus;
  }, [goal, pace]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={step === 0 ? onDone : () => setStep((value) => Math.max(0, value - 1))} style={styles.backButton}>
          <ChevronLeft color={colors.text} size={22} strokeWidth={2.8} />
        </Pressable>
        <View style={styles.progressShell}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Pressable accessibilityRole="button" onPress={onDone}>
          <Text selectable style={styles.skipText}>
            Skip
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 ? <WelcomeStep onNext={() => setStep(1)} /> : null}
        {step === 1 ? <ChoiceStep title="What should SkillQuest optimize for?" subtitle="This is the first micro-commitment. The paywall will reuse this goal later." options={goals} selected={goal} onSelect={setGoal} onNext={() => setStep(2)} /> : null}
        {step === 2 ? <ChoiceStep title="Pick your daily quest rhythm" subtitle="Small commitment first, premium offer later. This makes the paywall feel earned." options={paces} selected={pace} onSelect={setPace} onNext={() => setStep(3)} /> : null}
        {step === 3 ? <ResultStep goal={selectedGoal} pace={selectedPace} score={resultScore} onNext={() => setStep(4)} /> : null}
        {step === 4 ? <PaywallStep goal={selectedGoal} score={resultScore} plan={plan} setPlan={setPlan} currentPlan={currentPlan} onDone={onDone} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <View style={styles.step}>
      <LinearGradient colors={["#FFFFFF", "#FFF0E7", "#E9F2FF"]} style={styles.heroPanel}>
        <View style={styles.sparkBadge}>
          <Sparkles color="#FFFFFF" size={24} strokeWidth={3} />
        </View>
        <Text selectable style={styles.heroTitle}>
          Build a quest loop players want to finish
        </Text>
        <Text selectable style={styles.heroBody}>
          Goal pick, tiny commitment, personalized result, then a paywall that explains what unlocks next.
        </Text>
        <View style={styles.heroWidgets}>
          <MiniStat label="Trial intent" value="+32%" tone={colors.coral} />
          <MiniStat label="Streak setup" value="9d" tone={colors.gold} />
        </View>
      </LinearGradient>
      <Button label="Start setup" icon={Zap} onPress={onNext} fullWidth />
    </View>
  );
}

function ChoiceStep<T extends string>({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  onNext
}: {
  title: string;
  subtitle: string;
  options: Option<T>[];
  selected: T;
  onSelect: (key: T) => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.step}>
      <Text selectable style={styles.stepTitle}>
        {title}
      </Text>
      <Text selectable style={styles.stepSubtitle}>
        {subtitle}
      </Text>
      <View style={styles.optionList}>
        {options.map((item) => {
          const Icon = item.icon;
          const active = item.key === selected;
          return (
            <Pressable key={item.key} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => onSelect(item.key)} style={[styles.optionCard, active ? { boxShadow: `0 18px 34px ${withAlpha(item.tone, 0.2)}` } : null]}>
              <View style={[styles.optionIcon, { backgroundColor: item.tone }]}>
                <Icon color="#FFFFFF" size={22} strokeWidth={2.8} />
              </View>
              <View style={styles.optionCopy}>
                <Text selectable style={styles.optionTitle}>
                  {item.title}
                </Text>
                <Text selectable style={styles.optionBody}>
                  {item.body}
                </Text>
              </View>
              <View style={[styles.radio, active ? { backgroundColor: item.tone, borderColor: item.tone } : null]}>
                {active ? <Check color="#FFFFFF" size={16} strokeWidth={3} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <Button label="Continue" onPress={onNext} fullWidth />
    </View>
  );
}

function ResultStep({ goal, pace, score, onNext }: { goal: Option<GoalKey>; pace: Option<PaceKey>; score: number; onNext: () => void }) {
  return (
    <View style={styles.step}>
      <Text selectable style={styles.stepTitle}>
        Your player loop is ready
      </Text>
      <Text selectable style={styles.stepSubtitle}>
        This screen creates the “personal result” moment before the paywall.
      </Text>
      <View style={styles.resultPanel}>
        <Text selectable style={styles.resultNumber}>
          {score}
        </Text>
        <Text selectable style={styles.resultLabel}>
          activation score
        </Text>
        <SegmentedProgress value={score} tone="purple" />
        <ProgressStatus label={goal.title} value={score} tone="purple" />
      </View>
      <View style={styles.summaryGrid}>
        <MiniStat label="Goal" value={goal.title} tone={goal.tone} />
        <MiniStat label="Pace" value={pace.title} tone={pace.tone} />
      </View>
      <RewardStrip
        items={[
          { label: "XP boost", unlocked: true },
          { label: "shield", unlocked: true },
          { label: "badge", unlocked: false }
        ]}
      />
      <Button label="Unlock my plan" icon={Gift} onPress={onNext} fullWidth />
    </View>
  );
}

function PaywallStep({
  goal,
  score,
  plan,
  setPlan,
  currentPlan,
  onDone
}: {
  goal: Option<GoalKey>;
  score: number;
  plan: PlanKey;
  setPlan: (plan: PlanKey) => void;
  currentPlan: { price: string; cadence: string; badge: string; saving: string };
  onDone: () => void;
}) {
  return (
    <View style={styles.step}>
      <LinearGradient colors={["#FFFFFF", "#F3ECFF", "#FFEDE4"]} style={styles.paywallHero}>
        <View style={styles.paywallCrown}>
          <Crown color="#FFFFFF" size={26} strokeWidth={2.8} />
        </View>
        <Text selectable style={styles.paywallTitle}>
          Unlock {goal.title.toLowerCase()} mode
        </Text>
        <Text selectable style={styles.paywallBody}>
          Your activation score is {score}. Premium keeps streak shields, boss rounds, reward chests, and personalized quests open.
        </Text>
      </LinearGradient>

      <View style={styles.planSwitch}>
        {(["yearly", "monthly"] as PlanKey[]).map((item) => (
          <Pressable key={item} accessibilityRole="button" onPress={() => setPlan(item)} style={[styles.planTab, plan === item ? styles.planTabActive : null]}>
            <Text selectable style={[styles.planTabText, plan === item ? styles.planTabTextActive : null]}>
              {item === "yearly" ? "Yearly" : "Monthly"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.priceCard}>
        <View style={styles.priceTop}>
          <Text selectable style={styles.planBadge}>
            {currentPlan.badge}
          </Text>
          <Text selectable style={styles.savingText}>
            {currentPlan.saving}
          </Text>
        </View>
        <Text selectable style={styles.price}>
          {currentPlan.price}
        </Text>
        <Text selectable style={styles.priceCadence}>
          {currentPlan.cadence} after 3-day free trial
        </Text>
      </View>

      <View style={styles.benefits}>
        {["Unlimited quest worlds", "Streak shields and recovery", "Boss rounds and rare badges", "Personalized weekly plan"].map((item) => (
          <View key={item} style={styles.benefitRow}>
            <Check color={colors.green} size={18} strokeWidth={3} />
            <Text selectable style={styles.benefitText}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <Button label="Try free for 3 days" icon={Crown} onPress={onDone} fullWidth />
      <Text selectable style={styles.terms}>
        Clear terms, restore purchases, and cancellation copy belong here before production.
      </Text>
    </View>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <View style={[styles.miniStat, { boxShadow: `0 12px 22px ${withAlpha(tone, 0.16)}` }]}>
      <Text selectable style={[styles.miniValue, { color: tone }]}>
        {value}
      </Text>
      <Text selectable style={styles.miniLabel}>
        {label}
      </Text>
    </View>
  );
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
    boxShadow: "0 12px 22px rgba(30, 34, 42, 0.08)"
  },
  progressShell: {
    backgroundColor: "#EEF2F7",
    borderRadius: 12,
    flex: 1,
    height: 12,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.coral,
    borderRadius: 12,
    height: "100%"
  },
  skipText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700"
  },
  content: {
    gap: 18,
    padding: 16,
    paddingBottom: 36
  },
  step: {
    gap: 18
  },
  heroPanel: {
    borderCurve: "continuous",
    borderRadius: 38,
    gap: 16,
    minHeight: 430,
    overflow: "hidden",
    padding: 20,
    justifyContent: "flex-end",
    boxShadow: "0 24px 46px rgba(255, 111, 61, 0.16)"
  },
  sparkBadge: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 39
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 23
  },
  heroWidgets: {
    flexDirection: "row",
    gap: 10
  },
  stepTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34
  },
  stepSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22
  },
  optionList: {
    gap: 12
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(255,255,255,0.84)",
    borderCurve: "continuous",
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 92,
    padding: 14
  },
  optionIcon: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  optionCopy: {
    flex: 1,
    gap: 4
  },
  optionTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  optionBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  radio: {
    alignItems: "center",
    borderColor: "#DDE3EA",
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  resultPanel: {
    backgroundColor: "#F2ECFF",
    borderCurve: "continuous",
    borderRadius: 36,
    gap: 12,
    overflow: "hidden",
    padding: 18,
    boxShadow: "0 22px 40px rgba(135, 92, 255, 0.16)"
  },
  resultNumber: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 58,
    fontWeight: "900",
    lineHeight: 62
  },
  resultLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10
  },
  miniStat: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    flex: 1,
    gap: 3,
    padding: 14
  },
  miniValue: {
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  miniLabel: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
    textTransform: "uppercase"
  },
  paywallHero: {
    borderCurve: "continuous",
    borderRadius: 38,
    gap: 13,
    overflow: "hidden",
    padding: 20,
    boxShadow: "0 24px 44px rgba(135, 92, 255, 0.16)"
  },
  paywallCrown: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  },
  paywallTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36
  },
  paywallBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22
  },
  planSwitch: {
    backgroundColor: "#EEF2F7",
    borderRadius: 28,
    flexDirection: "row",
    padding: 5
  },
  planTab: {
    alignItems: "center",
    borderRadius: 24,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  planTabActive: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 10px 18px rgba(30, 34, 42, 0.08)"
  },
  planTabText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700"
  },
  planTabTextActive: {
    color: colors.text
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    gap: 8,
    padding: 16,
    boxShadow: "0 20px 36px rgba(255, 111, 61, 0.14)"
  },
  priceTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  planBadge: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  savingText: {
    color: colors.green,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  price: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 46,
    fontWeight: "900",
    lineHeight: 50
  },
  priceCadence: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  benefits: {
    gap: 10
  },
  benefitRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  benefitText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  terms: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center"
  }
});
