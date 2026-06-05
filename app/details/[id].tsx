import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { AppScreen, Button, Card, ListRow, ProgressStatus, textStyles } from "@/components/app-shell";
import { futureIntegrationNotes } from "@/lib/platform-adapters";
import { getSession, recommendations, sessions } from "@/lib/template-data";

export default function DetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "launch-plan";
  const session = getSession(id);
  const recommendation = recommendations.find((item) => item.id === id);
  const isSession = sessions.some((item) => item.id === id);

  return (
    <AppScreen title="Quest detail" subtitle="Reward, boost, and progress drilldown" activeDomain="SkillQuest">
      <Card tone={isSession ? "green" : "blue"}>
        <Text selectable style={textStyles.cardTitle}>
          {recommendation?.title ?? session.title}
        </Text>
        <Text selectable style={textStyles.body}>
          {recommendation?.reason ?? session.insight}
        </Text>
        <ProgressStatus label="detail score" value={isSession ? session.score : 78} tone={isSession ? "green" : "blue"} />
        <Button label="Use this in quest" onPress={() => router.push("/session")} />
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

      <Button label="Back to Home" variant="secondary" onPress={() => router.push("/")} />
    </AppScreen>
  );
}
