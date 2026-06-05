import { useState } from "react";
import { useRouter } from "expo-router";
import { Activity, Bell, CreditCard, Medal, Palette, ShieldCheck, TrendingUp, Trophy, UserRoundCheck } from "lucide-react-native";
import { Switch, Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, IconButton, ListRow, Metric, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";
import { BarChart, ChartCard, ComparisonBars, DonutChart, HeatmapChart, LineChart, RadarChart } from "@/components/charts";
import { analyticsMetrics, domains, recommendations, sessions, userProgress } from "@/lib/template-data";

export default function ProfileScreen() {
  const router = useRouter();
  const [personalized, setPersonalized] = useState(true);
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
    <AppScreen title="Player profile" subtitle="Avatar, rewards, and account" activeDomain="SkillQuest">
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 28,
              backgroundColor: colors.blueSoft,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#BFC8FF"
            }}
          >
            <Text selectable style={{ color: colors.blue, fontFamily: fonts.black, fontWeight: "900", fontSize: 22 }}>
              MU
            </Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text selectable style={textStyles.cardTitle}>
              Vanessa Moreau
            </Text>
            <Text selectable style={textStyles.body}>
              Avatar active. {userProgress.level}, {userProgress.points.toLocaleString()} XP, {userProgress.streak} day streak.
            </Text>
          </View>
          <IconButton icon={Palette} label="Edit personalization" onPress={() => router.push("/details/cloudflare-ready")} />
        </View>
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
        <CompactTile title="2k" body="Player signals and saved preferences." tone="blue" icon={UserRoundCheck} onPress={() => router.push("/details/onboarding-lab")} />
        <CompactTile title="7 cards" body="Rewards unlocked this season." tone="coral" icon={Palette} onPress={() => router.push("/details/carousel-lab")} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
        {analyticsMetrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} tone={metric.tone} />
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 18 }}>
        <CompactTile title="Quest flow" body="Daily cadence and completed reward windows." tone="green" icon={Activity} onPress={() => router.push("/details/launch-plan")} />
        <CompactTile title="Rewards" body={`${userProgress.points} points with ${userProgress.streak} day streak.`} tone="gold" icon={Trophy} onPress={() => router.push("/details/carousel-lab")} />
        <CompactTile title="League" body="Ruby League rank, promotion, and weekly rivals." tone="blue" icon={Medal} onPress={() => router.push("/bookmarks")} />
        <CompactTile title="Trend" body="XP velocity and mastery movement." tone="purple" icon={TrendingUp} onPress={() => router.push("/details/onboarding-lab")} />
      </View>

      <Card tone="green">
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={textStyles.cardTitle}>
              Game preferences
            </Text>
            <Text selectable style={textStyles.body}>
              Adapt recommendations by quest pace, reward style, challenge difficulty, and saved behavior.
            </Text>
          </View>
          <Switch value={personalized} onValueChange={setPersonalized} />
        </View>
        <ProgressStatus label="account setup score" value={82} tone="green" />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Profile analytics library
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

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Settings and rewards
        </Text>
        <ListRow title="Preferred quest worlds" body={domains.map((domain) => domain.shortTitle).join(", ")} meta="personalization" onPress={() => router.push("/details/onboarding-lab")} />
        <ListRow title="Privacy and saved cards" body="Keep profile state, reward cards, and session output protected." meta="settings" onPress={() => router.push("/details/cloudflare-ready")} />
        <ListRow title="Rewards membership" body="Upgrade, cosmetics, streak shields, and account limits live here." meta="account subscription" onPress={() => router.push("/details/carousel-lab")} />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button label="Notifications" icon={Bell} variant="secondary" onPress={() => router.push("/details/onboarding-lab")} />
        <Button label="Billing" icon={CreditCard} variant="secondary" onPress={() => router.push("/details/carousel-lab")} />
      </View>
      <Button label="Reward vault security" icon={ShieldCheck} variant="quiet" onPress={() => router.push("/details/cloudflare-ready")} />
    </AppScreen>
  );
}
