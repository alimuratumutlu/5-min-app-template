import { useRouter } from "expo-router";
import { Activity, BookmarkCheck, TrendingUp, Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, ListRow, Metric, ProgressStatus, textStyles } from "@/components/app-shell";
import { analyticsMetrics, recommendations, sessions, userProgress } from "@/lib/template-data";

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <AppScreen title="Quest stats" subtitle="XP, streak, league, and rewards" activeDomain="SkillQuest">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {analyticsMetrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.tone} />
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        <CompactTile title="Quest flow" body="Daily cadence and completed reward windows." tone="green" icon={Activity} onPress={() => router.push("/details/launch-plan")} />
        <CompactTile title="Rewards" body={`${userProgress.points} points with ${userProgress.streak} day streak.`} tone="gold" icon={Trophy} onPress={() => router.push("/details/carousel-lab")} />
        <CompactTile title="Saved" body="Favorite badges, cards, and power-ups." tone="blue" icon={BookmarkCheck} onPress={() => router.push("/bookmarks")} />
        <CompactTile title="Trend" body="XP velocity and mastery movement." tone="purple" icon={TrendingUp} onPress={() => router.push("/details/onboarding-lab")} />
      </View>

      <Card tone="purple">
        <Text selectable style={textStyles.cardTitle}>
          Weekly XP momentum
        </Text>
        <Text selectable style={textStyles.body}>
          Quest quality is improving because short sessions, saved boosts, and streak protection are reused instead of restarting cold.
        </Text>
        <ProgressStatus label="confidence score" value={userProgress.confidence} tone="purple" />
        <ProgressStatus label="completion rate" value={userProgress.completionRate} tone="green" />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Quest results
        </Text>
        {sessions.map((session) => (
          <ListRow
            key={session.id}
            title={`${session.title} - match ${session.score}`}
            body={session.insight}
            meta={`${session.minutes} min game result`}
            onPress={() => router.push(`/details/${session.id}`)}
          />
        ))}
      </View>

      <Card>
        <Text selectable style={textStyles.cardTitle}>
          Reward loop
        </Text>
        <Text selectable style={textStyles.body}>
          {recommendations.length} boost cards are connected to detail routes, saved review, and the next quest path.
        </Text>
        <Button label="Review saved boost" variant="secondary" onPress={() => router.push("/details/onboarding-lab")} />
      </Card>
    </AppScreen>
  );
}
