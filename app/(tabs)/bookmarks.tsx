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
    <AppScreen title="Bookmarks" subtitle="Saved, favorite, and resumable outputs" activeDomain="Saved">
      <HeroPoster
        title="Saved outputs"
        subtitle="Resume the strongest brief, schedule, recommendation, or generated item."
        imageUrl={domains[2].imageUrl}
        accent={domains[2].accent}
        meta={`${savedOutputs.length} saved`}
        onPress={() => router.push("/details/learning-sprint")}
      />

      <Card tone="gold">
        <Text selectable style={textStyles.cardTitle}>
          Empty state is handled, but this demo has saved outputs
        </Text>
        <Text selectable style={textStyles.body}>
          A new product should show a helpful empty saved list first, then recent bookmark and favorite result rows as soon as one session completes.
        </Text>
        <Button label="Create new saved output" icon={Plus} onPress={() => router.push("/session")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Favorite saved items
        </Text>
        {savedOutputs.map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            body={item.insight}
            meta={`${item.status} output - continue or review`}
            onPress={() => router.push(`/details/${item.id}`)}
          />
        ))}
      </View>
    </AppScreen>
  );
}
