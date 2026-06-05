import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BrainCircuit, Home, PlayCircle, Trophy, UserCircle, type LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen, Button, Card, IconButton, ListRow, ProgressStatus, colors, textStyles } from "@/components/app-shell";
import { futureIntegrationNotes } from "@/lib/platform-adapters";
import { getSession, recommendations, sessions } from "@/lib/template-data";

const navItems = [
  { href: "/", icon: Home, label: "Home", size: 23 },
  { href: "/analytics", icon: BrainCircuit, label: "AI Report", size: 23 },
  { href: "/session", icon: PlayCircle, label: "Session", size: 27 },
  { href: "/bookmarks", icon: Trophy, label: "Leaderboard", size: 23 },
  { href: "/profile", icon: UserCircle, label: "Profile", size: 23 }
] as const;

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "launch-plan";
  const session = getSession(id);
  const recommendation = recommendations.find((item) => item.id === id);
  const isSession = sessions.some((item) => item.id === id);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  };

  return (
    <AppScreen title="Quest detail" subtitle="Reward, boost, and progress drilldown" activeDomain="SkillQuest" footer={<DetailBottomNav />}>
      <View style={{ alignItems: "flex-start" }}>
        <IconButton icon={ArrowLeft} label="Go back" tone="dark" onPress={goBack} />
      </View>

      <Card tone={isSession ? "green" : "blue"}>
        <Text selectable style={textStyles.cardTitle}>
          {recommendation?.title ?? session.title}
        </Text>
        <Text selectable style={textStyles.body}>
          {recommendation?.reason ?? session.insight}
        </Text>
        <ProgressStatus label="detail score" value={isSession ? session.score : 78} tone={isSession ? "green" : "blue"} />
        <Button label="Use this in quest" onPress={() => router.push("/game/focus-sprint")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Next action and fallback state
        </Text>
        <ListRow
          title={recommendation?.action ?? session.nextAction}
          body="This route keeps saved outputs, recommendations, generated items, metrics, and profile entries actionable instead of inert."
          meta="implemented internal detail"
          onPress={() => router.push("/bookmarks")}
        />
      </View>

      <Card>
        <Text selectable style={textStyles.cardTitle}>
          Platform integration notes
        </Text>
        <Text selectable style={textStyles.body}>
          Clerk: {futureIntegrationNotes.clerk}
        </Text>
        <Text selectable style={textStyles.body}>
          Cloudflare D1: {futureIntegrationNotes.cloudflareD1}
        </Text>
        <Text selectable style={textStyles.body}>
          Cloudflare R2: {futureIntegrationNotes.cloudflareR2}
        </Text>
      </Card>
    </AppScreen>
  );
}

function DetailBottomNav() {
  const router = useRouter();

  return (
    <View style={styles.navOuter}>
      <BlurView intensity={64} tint="light" style={styles.navBlur}>
        {navItems.map((item) => (
          <NavButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            size={item.size}
            onPress={() => router.push(item.href)}
          />
        ))}
      </BlurView>
    </View>
  );
}

function NavButton({
  icon: Icon,
  label,
  size = 23,
  onPress
}: {
  icon: LucideIcon;
  label: string;
  size?: number;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : null]}>
      <Icon color="rgba(112,115,122,0.78)" size={size} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
