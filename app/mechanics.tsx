import { BlurView } from "expo-blur";
import { Link, useRouter } from "expo-router";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  Layers3,
  PlayCircle,
  Sparkles,
  Trophy,
  UserCircle,
  WandSparkles,
  type LucideIcon
} from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen, IconButton, colors, fonts, textStyles } from "@/components/app-shell";
import {
  getMechanicsForStage,
  type AiTiming,
  type InputMechanic
} from "@/lib/input-mechanics";

const navItems = [
  { href: "/", icon: Home, label: "Home", size: 23 },
  { href: "/session", icon: PlayCircle, label: "Session", size: 27 },
  { href: "/analytics", icon: BrainCircuit, label: "AI Report", size: 23 },
  { href: "/bookmarks", icon: Trophy, label: "Leaderboard", size: 23 },
  { href: "/profile", icon: UserCircle, label: "Profile", size: 23 }
] as const;

const timingCopy: Record<AiTiming, string> = {
  "instant-rule": "Instant rule",
  "after-run": "After-run AI",
  hybrid: "Hybrid",
  "no-ai": "No AI needed"
};

export default function MechanicsScreen() {
  const router = useRouter();
  const mechanics = useMemo(() => getMechanicsForStage("all"), []);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/session");
  };

  return (
    <AppScreen title="Mechanic lab" subtitle="100 playful input patterns" activeDomain="SkillQuest" footer={<MechanicsBottomNav />}>
      <View style={styles.topBar}>
        <IconButton icon={ArrowLeft} label="Go back" tone="dark" onPress={goBack} />
      </View>

      <View style={styles.heroPanel}>
        <View style={styles.heroIcon}>
          <WandSparkles color="#FFFFFF" size={26} strokeWidth={3} />
        </View>
        <Text selectable style={styles.heroTitle}>
          Agent guide for choosing playful daily input mechanics
        </Text>
        <Text selectable style={styles.heroBody}>
          Use this library as a product-generation reference: decide what data the app needs, then pick the mechanic that makes sharing it feel like play.
        </Text>
      </View>

      <View style={styles.agentGuide}>
        <View style={styles.guideRow}>
          <Text selectable style={styles.guideStep}>
            1
          </Text>
          <Text selectable style={styles.guideText}>
            Identify the data type: signal, preference, evidence, ranking, free text, media, or routine state.
          </Text>
        </View>
        <View style={styles.guideRow}>
          <Text selectable style={styles.guideStep}>
            2
          </Text>
          <Text selectable style={styles.guideText}>
            Choose the lowest-friction mechanic that captures enough context without making the user feel tested.
          </Text>
        </View>
        <View style={styles.guideRow}>
          <Text selectable style={styles.guideStep}>
            3
          </Text>
          <Text selectable style={styles.guideText}>
            Use instant rules only for completion, safety, and fixed quizzes; send personal interpretation to after-run AI.
          </Text>
        </View>
      </View>

      <View style={styles.libraryHeader}>
        <Text selectable style={textStyles.sectionTitle}>
          Input mechanic library
        </Text>
        <Text selectable style={textStyles.small}>
          {mechanics.length} patterns visible
        </Text>
      </View>

      <View style={styles.mechanicList}>
        {mechanics.map((mechanic) => (
          <MechanicCard key={mechanic.id} mechanic={mechanic} />
        ))}
      </View>
    </AppScreen>
  );
}

function MechanicCard({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <Link href={`/mechanics/${mechanic.id}`} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${mechanic.title}`} style={({ pressed }) => [styles.mechanicCard, pressed ? styles.pressed : null]}>
        <View style={styles.mechanicTop}>
          <View style={styles.numberBadge}>
            <Text selectable style={styles.numberText}>
              {mechanic.number}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text selectable style={styles.mechanicTitle}>
              {mechanic.title}
            </Text>
            <Text selectable style={styles.mechanicPattern}>
              {mechanic.pattern}
            </Text>
          </View>
          <TimingBadge timing={mechanic.aiTiming} />
          <View style={styles.openBadge}>
            <ChevronRight color={colors.textMuted} size={17} strokeWidth={3} />
          </View>
        </View>

        <View style={styles.captureBox}>
          <Layers3 color={colors.blue} size={17} strokeWidth={3} />
          <Text selectable style={styles.captureText}>
            Captures: {mechanic.captures}
          </Text>
        </View>

        <Text selectable style={styles.feedbackText}>
          {mechanic.feedback}
        </Text>

        <View style={styles.fitRail}>
          {mechanic.projectFits.slice(0, 3).map((fit) => (
            <View key={fit} style={styles.fitChip}>
              <Text selectable style={styles.fitText}>
                {fit}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

function TimingBadge({ timing }: { timing: AiTiming }) {
  const Icon = timing === "after-run" ? Clock3 : timing === "no-ai" ? CheckCircle2 : Sparkles;
  return (
    <View style={[styles.timingBadge, timing === "after-run" ? styles.timingAi : timing === "no-ai" ? styles.timingNoAi : styles.timingHybrid]}>
      <Icon color={timing === "after-run" ? colors.purple : timing === "no-ai" ? colors.green : colors.coral} size={13} strokeWidth={3} />
      <Text selectable style={[styles.timingText, timing === "after-run" ? styles.timingTextAi : timing === "no-ai" ? styles.timingTextNoAi : styles.timingTextHybrid]}>
        {timingCopy[timing]}
      </Text>
    </View>
  );
}

function MechanicsBottomNav() {
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
  topBar: {
    alignItems: "flex-start"
  },
  heroPanel: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DAE9FF",
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 18,
    boxShadow: "0 22px 48px rgba(36, 123, 255, 0.13)"
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 26,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 31
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 21
  },
  agentGuide: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(232, 237, 244, 0.92)",
    borderCurve: "continuous",
    borderRadius: 30,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    boxShadow: "0 18px 38px rgba(16,17,22,0.08)"
  },
  guideRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 11
  },
  guideStep: {
    backgroundColor: colors.coral,
    borderRadius: 16,
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    height: 32,
    lineHeight: 32,
    overflow: "hidden",
    textAlign: "center",
    width: 32
  },
  guideText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19
  },
  libraryHeader: {
    gap: 2
  },
  mechanicList: {
    gap: 18
  },
  mechanicCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(232, 237, 244, 0.92)",
    borderRadius: 32,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: 12,
    overflow: "hidden",
    padding: 17,
    boxShadow: "0 22px 46px rgba(16,17,22,0.13)"
  },
  mechanicTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10
  },
  numberBadge: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  numberText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  mechanicTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 22
  },
  mechanicPattern: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17
  },
  timingBadge: {
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  timingAi: {
    backgroundColor: colors.purpleSoft
  },
  timingNoAi: {
    backgroundColor: colors.greenSoft
  },
  timingHybrid: {
    backgroundColor: colors.coralSoft
  },
  timingText: {
    fontFamily: fonts.black,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12
  },
  timingTextAi: {
    color: colors.purple
  },
  timingTextNoAi: {
    color: colors.green
  },
  timingTextHybrid: {
    color: colors.coral
  },
  openBadge: {
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  captureBox: {
    alignItems: "center",
    backgroundColor: "#F3F7FF",
    borderColor: "#E3EEFF",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  captureText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  feedbackText: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  fitRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  fitChip: {
    backgroundColor: "#FFF3EC",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  fitText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13
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
