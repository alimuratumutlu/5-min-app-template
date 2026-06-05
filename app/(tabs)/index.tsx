import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Bell, Bike, Plane, ShieldCheck, Soup, Star } from "lucide-react-native";
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
  PillSelector,
  ProgressStatus,
  SearchPill,
  textStyles
} from "@/components/app-shell";
import { domains, quickActions, recommendations, sessions, userProgress, type DomainKey } from "@/lib/template-data";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("brazil");
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
    <AppScreen title={`Hello, ${userProgress.name}`} subtitle={userProgress.location} activeDomain="Solara Trips">
      <SearchPill placeholder="Search destination, hotel, guide" />

      <PillSelector
        items={["Asia", "Europe", "South America", "Africa"]}
        selected={activeDomain.category}
        onSelect={(item) => setSelectedDomain((domains.find((domain) => domain.category === item) ?? domains[0]).key)}
      />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Text selectable style={textStyles.sectionTitle}>
            Select your next trip
          </Text>
          <IconButton icon={Bell} label="View travel alerts" tone="dark" onPress={() => router.push("/details/onboarding-lab")} />
        </View>
        <HeroPoster
          title={activeDomain.title}
          subtitle={activeDomain.promise}
          imageUrl={activeDomain.imageUrl}
          accent={activeDomain.accent}
          meta={`${userProgress.points.toLocaleString()} miles`}
          onPress={() => router.push("/session")}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Upcoming tours
        </Text>
        <DomainCarousel items={carouselItems} selectedId={selectedDomain} onSelect={(id) => setSelectedDomain(id as DomainKey)} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        {quickActions.map((item, index) => (
          <CompactTile
            key={item.label}
            title={item.label}
            body={index === 0 ? "Hold flexible fares" : index === 1 ? "Quiet stays nearby" : index === 2 ? "Local private tours" : "Covered travel plan"}
            tone={item.tone}
            icon={index === 0 ? Plane : index === 1 ? Star : index === 2 ? Bike : ShieldCheck}
            onPress={() => router.push(index === 3 ? "/details/cloudflare-ready" : "/details/carousel-lab")}
          />
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Metric label="match score" value={`${userProgress.confidence}%`} delta="+6%" tone="purple" />
        <Metric label="tour rating" value={`${(sessions[0].score / 20).toFixed(1)}`} delta="143 reviews" tone="green" />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Recommendations
        </Text>
        {recommendations.map((item) => (
          <Card key={item.id} tone={item.domain === selectedDomain ? "green" : "default"} onPress={() => router.push(`/details/${item.id}`)}>
            <Text selectable style={textStyles.cardTitle}>
              {item.title}
            </Text>
            <Text selectable style={textStyles.body}>
              {item.reason}
            </Text>
            <Button label={item.action} icon={Soup} variant="secondary" onPress={() => router.push(`/details/${item.id}`)} />
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}
