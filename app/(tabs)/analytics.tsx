import { useRouter } from "expo-router";
import { Activity, BookmarkCheck, TrendingUp, Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, ListRow, Metric, ProgressStatus, textStyles } from "@/components/app-shell";
import { analyticsMetrics, recommendations, sessions, userProgress } from "@/lib/template-data";

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <AppScreen title="Travel stats" subtitle="Trip performance and saved results" activeDomain="Solara Trips">
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {analyticsMetrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.tone} />
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        <CompactTile title="Tour schedule" body="Booking cadence and completed result windows." tone="green" icon={Activity} onPress={() => router.push("/details/launch-plan")} />
        <CompactTile title="Rewards" body={`${userProgress.points} points with ${userProgress.streak} day streak.`} tone="gold" icon={Trophy} onPress={() => router.push("/details/carousel-lab")} />
        <CompactTile title="Saved" body="Favorite trips, hotels, and guide outputs." tone="blue" icon={BookmarkCheck} onPress={() => router.push("/bookmarks")} />
        <CompactTile title="Trend" body="Price alerts and route confidence movement." tone="purple" icon={TrendingUp} onPress={() => router.push("/details/onboarding-lab")} />
      </View>

      <Card tone="purple">
        <Text selectable style={textStyles.cardTitle}>
          Weekly trip confidence trend
        </Text>
        <Text selectable style={textStyles.body}>
          Trip result quality is improving because saved hotels, guide notes, and route outputs are reused instead of recreated.
        </Text>
        <ProgressStatus label="confidence score" value={userProgress.confidence} tone="purple" />
        <ProgressStatus label="completion rate" value={userProgress.completionRate} tone="green" />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Trip results
        </Text>
        {sessions.map((session) => (
          <ListRow
            key={session.id}
            title={`${session.title} - match ${session.score}`}
            body={session.insight}
            meta={`${session.minutes} day completed result`}
            onPress={() => router.push(`/details/${session.id}`)}
          />
        ))}
      </View>

      <Card>
        <Text selectable style={textStyles.cardTitle}>
          Booking trend
        </Text>
        <Text selectable style={textStyles.body}>
          {recommendations.length} travel recommendation cards are connected to detail routes, saved output review, and the next booking path.
        </Text>
        <Button label="Review saved route" variant="secondary" onPress={() => router.push("/details/onboarding-lab")} />
      </Card>
    </AppScreen>
  );
}
