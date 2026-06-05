import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { BookmarkPlus, PlayCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import {
  AppScreen,
  Button,
  Card,
  DomainCarousel,
  IconButton,
  Metric,
  OnboardingFlow,
  ProgressStatus,
  textStyles
} from "@/components/app-shell";
import { domains, onboardingSteps, recommendations, sessions, userProgress, type DomainKey } from "@/lib/template-data";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("focus");
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const activeDomain = domains.find((domain) => domain.key === selectedDomain) ?? domains[0];
  const onboardingStep = onboardingSteps[onboardingIndex];
  const carouselItems = useMemo(
    () =>
      domains.map((domain) => ({
        id: domain.key,
        title: domain.title,
        body: domain.promise,
        accent: domain.accent,
        softAccent: domain.softAccent,
        icon: domain.icon
      })),
    []
  );

  return (
    <AppScreen title="Product Shell Lab" subtitle="What should I do now?" activeDomain={activeDomain.shortTitle}>
      <OnboardingFlow
        current={onboardingStep}
        onNext={() => setOnboardingIndex((value) => (value + 1) % onboardingSteps.length)}
        onSkip={() => setOnboardingIndex(0)}
      />

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Current state and next action
        </Text>
        <Card tone="blue">
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Text selectable style={textStyles.cardTitle}>
                {activeDomain.promise}
              </Text>
              <Text selectable style={textStyles.body}>
                Progress is strong this week: {userProgress.weeklySessions} session completed, {userProgress.streak} day streak, and a clear recommendation queued.
              </Text>
            </View>
            <IconButton icon={BookmarkPlus} label="Save recommendation" onPress={() => router.push("/details/carousel-lab")} />
          </View>
          <ProgressStatus label="weekly activity progress" value={userProgress.completionRate} />
          <Button label="Start session" icon={PlayCircle} onPress={() => router.push("/session")} />
        </Card>
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Carousel concept preview
        </Text>
        <DomainCarousel items={carouselItems} selectedId={selectedDomain} onSelect={(id) => setSelectedDomain(id as DomainKey)} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Metric label="score level" value={`${userProgress.confidence}%`} delta="+9%" tone="purple" />
        <Metric label="session result" value={`${sessions[0].score}`} delta="best" tone="green" />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Domain-specific recommendations
        </Text>
        {recommendations.map((item) => (
          <Card key={item.id} tone={item.domain === selectedDomain ? "green" : "default"} onPress={() => router.push(`/details/${item.id}`)}>
            <Text selectable style={textStyles.cardTitle}>
              {item.title}
            </Text>
            <Text selectable style={textStyles.body}>
              {item.reason}
            </Text>
            <Button label={item.action} variant="secondary" onPress={() => router.push(`/details/${item.id}`)} />
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}
