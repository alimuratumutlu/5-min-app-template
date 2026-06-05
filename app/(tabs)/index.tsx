import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Bell, BookmarkPlus, LayoutGrid, PlayCircle, Sparkles } from "lucide-react-native";
import { Text, View } from "react-native";
import {
  AppScreen,
  Button,
  Card,
  CompactTile,
  DomainCarousel,
  HeroPoster,
  IconButton,
  Metric,
  OnboardingFlow,
  PillSelector,
  ProgressStatus,
  SearchPill,
  textStyles
} from "@/components/app-shell";
import { domains, onboardingSteps, quickActions, recommendations, sessions, userProgress, type DomainKey } from "@/lib/template-data";

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
        imageUrl: domain.imageUrl,
        category: domain.category,
        icon: domain.icon
      })),
    []
  );

  return (
    <AppScreen title={`Hello, ${userProgress.name}`} subtitle="Welcome to the 5-min shell lab" activeDomain={activeDomain.shortTitle}>
      <SearchPill placeholder="Search onboarding, carousel, header" />

      <PillSelector
        items={domains.map((domain) => domain.shortTitle)}
        selected={activeDomain.shortTitle}
        onSelect={(item) => setSelectedDomain((domains.find((domain) => domain.shortTitle === item) ?? domains[0]).key)}
      />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Text selectable style={textStyles.sectionTitle}>
            Select your next 5-min app
          </Text>
          <IconButton icon={Bell} label="View alerts" tone="dark" onPress={() => router.push("/details/onboarding-lab")} />
        </View>
        <HeroPoster
          title={activeDomain.title}
          subtitle={activeDomain.promise}
          imageUrl={activeDomain.imageUrl}
          accent={activeDomain.accent}
          meta={`${userProgress.points} points`}
          onPress={() => router.push("/session")}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Experience modules
        </Text>
        <DomainCarousel items={carouselItems} selectedId={selectedDomain} onSelect={(id) => setSelectedDomain(id as DomainKey)} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        {quickActions.map((item, index) => (
          <CompactTile
            key={item.label}
            title={item.label}
            body={index === 0 ? onboardingStep.title : index === 1 ? "Poster cards and horizontal flows" : index === 2 ? "Floating glass identity" : "Clerk, D1, R2 adapters"}
            tone={item.tone}
            icon={index === 0 ? Sparkles : index === 1 ? LayoutGrid : index === 2 ? BookmarkPlus : PlayCircle}
            onPress={() => router.push(index === 3 ? "/details/cloudflare-ready" : "/details/carousel-lab")}
          />
        ))}
      </View>

      <OnboardingFlow
        current={onboardingStep}
        onNext={() => setOnboardingIndex((value) => (value + 1) % onboardingSteps.length)}
        onSkip={() => setOnboardingIndex(0)}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Metric label="score level" value={`${userProgress.confidence}%`} delta="+9%" tone="purple" />
        <Metric label="session result" value={`${sessions[0].score}`} delta="best" tone="green" />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Recommended next actions
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
