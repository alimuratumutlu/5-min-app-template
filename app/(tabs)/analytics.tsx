import { useRouter } from "expo-router";
import { BrainCircuit, ClipboardCheck, FileChartLine, Goal, Lightbulb, ListChecks, ScanSearch, Sparkles, Target, WandSparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, ListRow, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";
import { BarChart, ChartCard, ComparisonBars, DonutChart, LineChart } from "@/components/charts";
import { sessions, userProgress } from "@/lib/template-data";

const insightCards = [
  {
    title: "Objective fit",
    body: "The current objective is clear enough for a playable session, but the reward result should be shown earlier.",
    score: 84,
    tone: "green" as const
  },
  {
    title: "AI confidence",
    body: "High confidence because session completion, saved output, and level progress all point to the same behavior.",
    score: userProgress.confidence,
    tone: "purple" as const
  },
  {
    title: "Validation trend",
    body: "Trend is improving: completed session score, favorite saved review, and leaderboard progress are aligned.",
    score: 78,
    tone: "blue" as const
  }
];

const dailyReports = [
  {
    day: "Today",
    objective: "Focus Sprint",
    summary: "User should complete one tiny next-action test. Habit input is ready, risk is low, reward confidence is high.",
    score: 84,
    tone: "coral" as const
  },
  {
    day: "Yesterday",
    objective: "Puzzle Gate",
    summary: "Completion was slower, but the saved result shows better decision accuracy after one retry.",
    score: 76,
    tone: "blue" as const
  },
  {
    day: "May 30",
    objective: "Duo Rally",
    summary: "Social challenge improved consistency. AI recommends keeping co-op prompts for low-energy days.",
    score: 81,
    tone: "green" as const
  }
];

const objectiveTrend = [62, 68, 64, 73, 76, 84, 81, 88];
const objectiveBars = [
  { label: "Focus", value: 9 },
  { label: "Habit", value: 7 },
  { label: "Learn", value: 5 },
  { label: "Duo", value: 4 }
];
const reportComparison = [
  { label: "Objective clarity", value: 84, meta: "today" },
  { label: "Habit signal", value: 78, meta: "ready" },
  { label: "Risk level", value: 36, meta: "low" },
  { label: "Reward pull", value: 88, meta: "strong" }
];

export default function AnalyticsScreen() {
  const router = useRouter();

  return (
    <AppScreen title="AI report" subtitle="Objective, insight, validation" activeDomain="SkillQuest">
      <View style={styles.heroReport}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <BrainCircuit color="#FFFFFF" size={26} strokeWidth={3} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text selectable style={styles.eyebrow}>
              Objective intelligence
            </Text>
            <Text selectable style={styles.heroTitle}>
              Make the next quest obvious
            </Text>
          </View>
        </View>
        <Text selectable style={styles.heroBody}>
          AI insight report reads daily tests, completed session results, habit inputs, saved favorites, level score, confidence, analytics stats, and performance trend to recommend tomorrow's objective.
        </Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBadge}>
            <Text selectable style={styles.scoreValue}>
              84
            </Text>
            <Text selectable style={styles.scoreLabel}>
              objective score
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text selectable style={styles.scoreValue}>
              {userProgress.confidence}%
            </Text>
            <Text selectable style={styles.scoreLabel}>
              confidence
            </Text>
          </View>
        </View>
        <Button label="Run today's test" icon={WandSparkles} onPress={() => router.push("/game/focus-sprint")} fullWidth />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 14 }}>
        <CompactTile title="Objective" body="Primary target, next action, and completion rule." tone="coral" icon={Goal} onPress={() => router.push("/game/focus-sprint")} />
        <CompactTile title="Insight" body="AI pattern read from recent quest results." tone="purple" icon={Lightbulb} onPress={() => router.push("/details/launch-plan")} />
        <CompactTile title="Validation" body="Saved evidence, favorite output, and trend checks." tone="blue" icon={ClipboardCheck} onPress={() => router.push("/bookmarks")} />
        <CompactTile title="Report" body="Brief summary for product iteration decisions." tone="green" icon={FileChartLine} onPress={() => router.push("/details/cloudflare-ready")} />
      </View>

      <View style={{ gap: 12 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Reports by day
        </Text>
        {dailyReports.map((report) => (
          <Card key={`${report.day}-${report.objective}`} tone={report.tone}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={styles.reportDayBadge}>
                <BrainCircuit color={colors.purple} size={20} strokeWidth={3} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text selectable style={styles.reportDay}>
                  {report.day} - {report.objective}
                </Text>
                <Text selectable style={textStyles.body}>
                  {report.summary}
                </Text>
              </View>
            </View>
            <ProgressStatus label="AI objective score" value={report.score} tone={report.tone} />
          </Card>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Report charts
        </Text>
        <ChartCard title="Objective trend" subtitle="AI score by daily completion." tone="purple">
          <LineChart data={objectiveTrend} tone="purple" />
        </ChartCard>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          <View style={{ flex: 1, minWidth: 160 }}>
            <ChartCard title="Goal mix" subtitle="Tests by objective." tone="coral">
              <BarChart data={objectiveBars} tone="coral" />
            </ChartCard>
          </View>
          <View style={{ flex: 1, minWidth: 160 }}>
            <ChartCard title="Confidence" subtitle="Analysis readiness." tone="gold">
              <DonutChart value={userProgress.confidence} label="AI confidence" tone="gold" />
            </ChartCard>
          </View>
        </View>
        <ChartCard title="Target signals" subtitle="Objective, habit, risk, and reward report." tone="blue">
          <ComparisonBars data={reportComparison} tone="blue" />
        </ChartCard>
      </View>

      <View style={{ gap: 12 }}>
        <Text selectable style={textStyles.sectionTitle}>
          AI insight report
        </Text>
        {insightCards.map((card) => (
          <Card key={card.title} tone={card.tone}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={styles.reportBullet}>
                <ScanSearch color={colors.blue} size={20} strokeWidth={3} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text selectable style={textStyles.cardTitle}>
                  {card.title}
                </Text>
                <Text selectable style={textStyles.body}>
                  {card.body}
                </Text>
              </View>
            </View>
            <ProgressStatus label={`${card.title.toLowerCase()} progress`} value={card.score} tone={card.tone} />
          </Card>
        ))}
      </View>

      <Card tone="gold">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.nextIcon}>
            <Target color={colors.gold} size={22} strokeWidth={3} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text selectable style={textStyles.cardTitle}>
              Recommended objective
            </Text>
            <Text selectable style={textStyles.body}>
              Start today's Focus Sprint test, collect habit input, then let AI file the completed report under today's objective.
            </Text>
          </View>
        </View>
        <Button label="Start objective" icon={Sparkles} onPress={() => router.push("/game/focus-sprint")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Evidence log
        </Text>
        {sessions.map((session) => (
          <ListRow
            key={session.id}
            title={`${session.title} - score ${session.score}`}
            body={`${session.insight} AI report uses this completed session result as performance evidence.`}
            meta={`${session.minutes} min validation output`}
            onPress={() => router.push(`/details/${session.id}`)}
          />
        ))}
      </View>

      <Card>
        <Text selectable style={textStyles.cardTitle}>
          Report checklist
        </Text>
        <Text selectable style={textStyles.body}>
          Objective, analytics stats, completed session result, saved bookmark evidence, favorite review, confidence score, level progress, validation signal, and trend are all represented.
        </Text>
        <Button label="Open checklist" icon={ListChecks} variant="secondary" onPress={() => router.push("/details/learning-sprint")} />
      </Card>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroReport: {
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    borderCurve: "continuous",
    gap: 15,
    padding: 17,
    boxShadow: "0 22px 48px rgba(135, 92, 255, 0.13)"
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 26,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  eyebrow: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 31
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20
  },
  scoreRow: {
    flexDirection: "row",
    gap: 10
  },
  scoreBadge: {
    backgroundColor: "#F7F3FF",
    borderRadius: 24,
    flex: 1,
    padding: 13
  },
  scoreValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 28,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 32
  },
  scoreLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  reportBullet: {
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderRadius: 22,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  reportDayBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  reportDay: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20
  },
  nextIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    height: 50,
    justifyContent: "center",
    width: 50
  }
});
