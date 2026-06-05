import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BrainCircuit, Clock3, Crown, Flame, Gamepad2, Gift, PlayCircle, Route, ShieldCheck, Sparkles, Star, Zap } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import {
  AppScreen,
  BoostCard,
  Button,
  Card,
  CompactTile,
  DomainCarousel,
  HeroPoster,
  IconButton,
  Metric,
  ProgressStatus,
  RewardStrip,
  SegmentedProgress,
  colors,
  fonts,
  textStyles
} from "@/components/app-shell";
import { domains, quickActions, recommendations, rewardTrack, sessions, userProgress, type DomainKey } from "@/lib/template-data";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("focus");
  const activeDomain = domains.find((domain) => domain.key === selectedDomain) ?? domains[0];
  const carouselItems = useMemo(
    () =>
      domains.map((domain) => ({
        id: domain.key,
        title: domain.title,
        body: domain.promise,
        accent: domain.accent,
        softAccent: domain.softAccent,
        imageUrl: domain.imageUrl,
        category: domain.category,
        icon: domain.icon
      })),
    []
  );

  return (
    <AppScreen title={`Ready, ${userProgress.name}?`} subtitle={`${userProgress.streak} day streak alive`} activeDomain="SkillQuest">
      <View style={styles.dailyQuestCard}>
        <LinearGradient colors={["#FFF2C2", "#FFE1D8", "#F5E9FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dailyQuestGradient} />
        <View style={styles.dailyGridOverlay} />
        <View style={styles.dailyRibbonA} />
        <View style={styles.dailyRibbonB} />

        <View style={styles.dailyTopRow}>
          <View style={styles.dailyCopy}>
            <Text selectable style={styles.dailyEyebrow}>
              TODAY'S 5-MIN SESSION
            </Text>
            <Text selectable style={styles.dailyTitle}>
              Start Focus Sprint
            </Text>
            <Text selectable style={styles.dailyBody}>
              One short run protects the streak, adds XP, and gives the next clear action.
            </Text>
          </View>
          <View style={styles.dailyArtStack}>
            <IconButton icon={Route} label="Open onboarding test" tone="purple" onPress={() => router.push("/onboarding")} />
            <View style={styles.sprintBuddy} accessibilityLabel="Sprint buddy mascot">
              <View style={styles.buddyBolt}>
                <Zap color="#FFFFFF" size={18} strokeWidth={3.2} fill="#FFFFFF" />
              </View>
              <View style={styles.buddyFace}>
                <View style={styles.buddyEye} />
                <View style={styles.buddyEye} />
              </View>
              <View style={styles.buddyMouth} />
            </View>
          </View>
        </View>

        <View style={styles.sessionChipRow}>
          <SessionChip icon={Clock3} label="5 min" />
          <SessionChip icon={Zap} label="+120 XP" />
          <SessionChip icon={Flame} label={`${userProgress.streak}d streak`} />
        </View>

        <ProgressStatus label="daily run readiness" value={86} tone="coral" />
        <Button label="Start 5-min run" icon={PlayCircle} onPress={() => router.push("/game/focus-sprint")} />
      </View>

      <HeroPoster
        title={activeDomain.title}
        subtitle={activeDomain.promise}
        imageUrl={activeDomain.imageUrl}
        accent={activeDomain.accent}
        meta={`daily quest`}
        onPress={() => router.push("/game/focus-sprint")}
      />

      <Card tone="purple" onPress={() => router.push("/analytics")}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
          <View style={{ alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 24, height: 50, justifyContent: "center", width: 50 }}>
            <BrainCircuit color="#875CFF" size={23} strokeWidth={3} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={textStyles.cardTitle}>
              Today's AI summary
            </Text>
            <Text selectable style={textStyles.body}>
              Focus risk is low. Finish one test, then AI will file today's objective report.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Text selectable style={textStyles.small}>
              Objective 84
            </Text>
          </View>
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Text selectable style={textStyles.small}>
              Habit signal ready
            </Text>
          </View>
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Text selectable style={textStyles.small}>
              Report after test
            </Text>
          </View>
        </View>
      </Card>

      <Card tone="gold">
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={textStyles.cardTitle}>
              Reward track
            </Text>
            <Text selectable style={textStyles.body}>
              Two rewards claimed. Finish one more quest to unlock a shield.
            </Text>
          </View>
          <Gift color="#FFB800" size={30} strokeWidth={2.7} />
        </View>
        <RewardStrip items={rewardTrack} />
        <Button label="Open onboarding lab" icon={Route} variant="secondary" onPress={() => router.push("/onboarding")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Quest worlds
        </Text>
        <DomainCarousel items={carouselItems} selectedId={selectedDomain} onSelect={(id) => setSelectedDomain(id as DomainKey)} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 18 }}>
        {quickActions.map((item, index) => (
          <CompactTile
            key={item.label}
            title={item.label}
            body={index === 0 ? "Start a tiny XP run" : index === 1 ? "Open reward chest" : index === 2 ? "Join a co-op run" : "Try multiplier mode"}
            tone={item.tone}
            icon={index === 0 ? Zap : index === 1 ? Star : index === 2 ? Gamepad2 : Crown}
            onPress={() => router.push(index === 3 ? "/details/learning-sprint" : "/session")}
          />
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
        <Metric label="combo score" value={`${sessions[0].score}`} delta="x3 streak" tone="purple" />
        <Metric label="next level" value={`${100 - userProgress.confidence}%`} delta="to level 13" tone="green" />
      </View>

      <Card tone="blue">
        <Text selectable style={textStyles.cardTitle}>
          Active lesson strip
        </Text>
        <Text selectable style={textStyles.body}>
          Combo Basics is almost done. Keep the blue strip full to unlock the next challenge.
        </Text>
        <SegmentedProgress value={userProgress.confidence} tone="blue" />
        <ProgressStatus label="level progress" value={userProgress.confidence} tone="blue" />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Smart boosts
        </Text>
        {recommendations.map((item) => {
          const tone = item.domain === "focus" ? "coral" : item.domain === "creative" ? "purple" : item.domain === "social" ? "green" : "blue";
          return (
            <BoostCard
              key={item.id}
              title={item.title}
              body={item.reason}
              action={item.action}
              tone={tone}
              icon={item.domain === "focus" ? Flame : item.domain === "creative" ? Sparkles : ShieldCheck}
              onPress={() => router.push(`/details/${item.id}`)}
            />
          );
        })}
      </View>
    </AppScreen>
  );
}

function SessionChip({ icon: Icon, label }: { icon: typeof Clock3; label: string }) {
  return (
    <View style={styles.sessionChip}>
      <Icon color={colors.coral} size={15} strokeWidth={2.8} />
      <Text selectable style={styles.sessionChipText}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dailyQuestCard: {
    borderColor: "rgba(255, 133, 86, 0.32)",
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
    padding: 16,
    position: "relative",
    boxShadow: "0 24px 48px rgba(255, 111, 61, 0.18)"
  },
  dailyQuestGradient: {
    ...StyleSheet.absoluteFillObject
  },
  dailyGridOverlay: {
    backgroundColor: "rgba(255,255,255,0.52)",
    borderColor: "rgba(255,255,255,0.42)",
    borderRadius: 120,
    borderWidth: 16,
    height: 184,
    position: "absolute",
    right: -74,
    top: -72,
    transform: [{ rotate: "-17deg" }],
    width: 184
  },
  dailyRibbonA: {
    backgroundColor: "rgba(36, 123, 255, 0.16)",
    borderRadius: 18,
    height: 18,
    position: "absolute",
    right: 62,
    top: 24,
    transform: [{ rotate: "-18deg" }],
    width: 78
  },
  dailyRibbonB: {
    backgroundColor: "rgba(0, 201, 133, 0.18)",
    borderRadius: 16,
    bottom: 75,
    height: 15,
    opacity: 0.72,
    position: "absolute",
    right: 5,
    transform: [{ rotate: "13deg" }],
    width: 82
  },
  dailyTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  dailyCopy: {
    flex: 1,
    gap: 6,
    paddingTop: 2
  },
  dailyEyebrow: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  dailyTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 25
  },
  dailyBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 260
  },
  dailyArtStack: {
    alignItems: "center",
    gap: 8,
    minWidth: 64
  },
  sprintBuddy: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 24,
    borderWidth: 3,
    height: 58,
    justifyContent: "center",
    position: "relative",
    transform: [{ rotate: "6deg" }],
    width: 58,
    boxShadow: "0 8px 0 rgba(209, 73, 31, 0.24)"
  },
  buddyBolt: {
    left: -8,
    position: "absolute",
    top: -8
  },
  buddyFace: {
    flexDirection: "row",
    gap: 9,
    marginTop: 6
  },
  buddyEye: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    height: 10,
    width: 10
  },
  buddyMouth: {
    backgroundColor: "#7A2D18",
    borderRadius: 8,
    height: 5,
    marginTop: 9,
    width: 22
  },
  sessionChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  sessionChip: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.84)",
    borderColor: "rgba(255,255,255,0.72)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  sessionChipText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14
  }
});
