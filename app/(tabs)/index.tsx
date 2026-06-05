import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Clock3, Crown, Flame, Gamepad2, Gift, PlayCircle, Route, ShieldCheck, Sparkles, Star, Zap } from "lucide-react-native";
import { Text, View } from "react-native";
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
      <Card tone="coral">
        <View style={{ alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={textStyles.small}>
              TODAY'S 5-MIN SESSION
            </Text>
            <Text selectable style={textStyles.sectionTitle}>
              Start Focus Sprint
            </Text>
            <Text selectable style={textStyles.body}>
              One short run protects the streak, adds XP, and gives the next clear action.
            </Text>
          </View>
          <IconButton icon={Route} label="Open onboarding test" tone="purple" onPress={() => router.push("/onboarding")} />
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <View style={{ alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, flexDirection: "row", gap: 6, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Clock3 color="#FF6F3D" size={15} strokeWidth={2.8} />
            <Text selectable style={textStyles.small}>
              5 min
            </Text>
          </View>
          <View style={{ alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, flexDirection: "row", gap: 6, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Zap color="#FF6F3D" size={15} strokeWidth={2.8} />
            <Text selectable style={textStyles.small}>
              +120 XP
            </Text>
          </View>
          <View style={{ alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, flexDirection: "row", gap: 6, paddingHorizontal: 11, paddingVertical: 8 }}>
            <Flame color="#FF6F3D" size={15} strokeWidth={2.8} />
            <Text selectable style={textStyles.small}>
              {userProgress.streak}d streak
            </Text>
          </View>
        </View>

        <ProgressStatus label="daily run readiness" value={86} tone="coral" />
        <Button label="Start 5-min run" icon={PlayCircle} onPress={() => router.push("/game/focus-sprint")} />
      </Card>

      <HeroPoster
        title={activeDomain.title}
        subtitle={activeDomain.promise}
        imageUrl={activeDomain.imageUrl}
        accent={activeDomain.accent}
        meta={`daily quest`}
        onPress={() => router.push("/game/focus-sprint")}
      />

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
