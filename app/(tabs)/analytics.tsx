import { useRouter } from "expo-router";
import { Activity, Medal, TrendingUp, Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, ListRow, Metric, ProgressStatus, textStyles } from "@/components/app-shell";
import { BarChart, ChartCard, ComparisonBars, DonutChart, HeatmapChart, LineChart, RadarChart } from "@/components/charts";
import { analyticsMetrics, recommendations, sessions, userProgress } from "@/lib/template-data";

export default function AnalyticsScreen() {
  const router = useRouter();
  const radarData = [
    { label: "Focus", value: 88 },
    { label: "Logic", value: 72 },
    { label: "Speed", value: 64 },
    { label: "Memory", value: 81 },
    { label: "Social", value: 58 },
    { label: "Boss", value: 76 }
  ];
  const lineData = [120, 180, 140, 260, 300, 420, 390, 520, 610, 740];
  const barData = [
    { label: "Mon", value: 6 },
    { label: "Tue", value: 9 },
    { label: "Wed", value: 5 },
    { label: "Thu", value: 11 },
    { label: "Fri", value: 8 }
  ];
  const heatmapValues = [12, 30, 54, 72, 20, 86, 44, 68, 10, 34, 90, 76, 48, 18, 64, 82, 26, 52, 78, 92, 40, 16, 70, 58, 36, 84, 98, 46, 24, 62, 88, 56, 32, 74, 66];
  const comparisonData = [
    { label: "Neon League", value: 86, meta: "#18" },
    { label: "Daily quests", value: 74, meta: "24 done" },
    { label: "Badge vault", value: 58, meta: "7 cards" },
    { label: "Boss prep", value: 70, meta: "ready" }
  ];

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
        <CompactTile title="League" body="Ruby League rank, promotion, and weekly rivals." tone="blue" icon={Medal} onPress={() => router.push("/bookmarks")} />
        <CompactTile title="Trend" body="XP velocity and mastery movement." tone="purple" icon={TrendingUp} onPress={() => router.push("/details/onboarding-lab")} />
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Chart library
        </Text>
        <ChartCard title="Radar chart" subtitle="Skill mastery across six quest dimensions." tone="purple">
          <RadarChart data={radarData} tone="purple" />
        </ChartCard>
        <ChartCard title="Line chart" subtitle="XP velocity over the latest ten sessions." tone="coral">
          <LineChart data={lineData} tone="coral" />
        </ChartCard>
        <ChartCard title="Bar chart" subtitle="Completed quest volume by weekday." tone="green">
          <BarChart data={barData} tone="green" />
        </ChartCard>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          <View style={{ flex: 1, minWidth: 160 }}>
            <ChartCard title="Donut" subtitle="Level progress." tone="gold">
              <DonutChart value={userProgress.confidence} label="to Lv. 13" tone="gold" />
            </ChartCard>
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <ChartCard title="Bars" subtitle="League state." tone="blue">
              <ComparisonBars data={comparisonData.slice(0, 3)} tone="blue" />
            </ChartCard>
          </View>
        </View>
        <ChartCard title="Heatmap chart" subtitle="Daily streak intensity and activity density." tone="blue">
          <HeatmapChart values={heatmapValues} tone="blue" />
        </ChartCard>
        <ChartCard title="Comparison bars" subtitle="Reference layout for ranked progress and account health." tone="purple">
          <ComparisonBars data={comparisonData} tone="purple" />
        </ChartCard>
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
