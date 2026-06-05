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
    <AppScreen title="Saved trips" subtitle="Favorite tours, hotels, and routes" activeDomain="Solara Trips">
      <HeroPoster
        title="Saved journeys"
        subtitle="Resume the strongest tour brief, hotel shortlist, route map, or guide match."
        imageUrl={domains[2].imageUrl}
        accent={domains[2].accent}
        meta={`${savedOutputs.length} saved`}
        onPress={() => router.push("/details/learning-sprint")}
      />

      <Card tone="gold">
        <Text selectable style={textStyles.cardTitle}>
          Your travel shelf
        </Text>
        <Text selectable style={textStyles.body}>
          Saved tours stay ready to compare, continue, review, or open before booking.
        </Text>
        <Button label="Create new trip" icon={Plus} onPress={() => router.push("/session")} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Favorite routes
        </Text>
        {savedOutputs.map((item) => (
          <ListRow
            key={item.id}
            title={item.title}
            body={item.insight}
            meta={`${item.status} trip output - continue or review`}
            onPress={() => router.push(`/details/${item.id}`)}
          />
        ))}
      </View>
    </AppScreen>
  );
}
