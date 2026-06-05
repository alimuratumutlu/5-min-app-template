import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { Text, View } from "react-native";
import { AppScreen, Button, Card, HeroPoster, ListRow, textStyles } from "@/components/app-shell";
import { domains, recommendations, sessions } from "@/lib/template-data";

export default function BookmarksScreen() {
  const router = useRouter();
  const savedOutputs = [...sessions, ...recommendations.map((item) => ({
    id: item.id,
    title: item.title,
    insight: item.reason,
    status: "saved",
    minutes: 5
  }))];

  return (
    <AppScreen title="Collection" subtitle="Badges, boosts, cards, and saved runs" activeDomain="SkillQuest">
      <HeroPoster
        title="Reward shelf"
        subtitle="Resume saved quests, inspect badge cards, and spend power-ups."
        imageUrl={domains[2].imageUrl}
        accent={domains[2].accent}
        meta={`${savedOutputs.length} saved`}
        onPress={() => router.push("/details/learning-sprint")}
      />

      <Card tone="gold">
        <Text selectable style={textStyles.cardTitle}>
          Your game shelf
        </Text>
        <Text selectable style={textStyles.body}>
          Saved runs, badge cards, and power-ups stay ready to continue or review.
        </Text>
        <Button label="Start new quest" icon={Plus} onPress={() => router.push("/session")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Saved rewards
        </Text>
        {savedOutputs.map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            body={item.insight}
            meta={`${item.status} quest card - continue or review`}
            onPress={() => router.push(`/details/${item.id}`)}
          />
        ))}
      </View>
    </AppScreen>
  );
}
