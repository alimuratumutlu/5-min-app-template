import { useState } from "react";
import { useRouter } from "expo-router";
import { Clock3, Save, WandSparkles } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { AppScreen, Button, Card, HeroPoster, ProgressStatus, textStyles } from "@/components/app-shell";
import { domains, sessions } from "@/lib/template-data";

export default function SessionScreen() {
  const router = useRouter();
  const [input, setInput] = useState("Rio coast, private guide, quiet hotel, late dinner");
  const [step, setStep] = useState(2);
  const activeDomain = domains[0];

  return (
    <AppScreen title="Book a tour" subtitle="Build one flexible itinerary" activeDomain="Solara Trips">
      <HeroPoster
        title="Iconic Brazil Adventure"
        subtitle="Tour schedule, accommodation, and guide notes in one booking flow."
        imageUrl={activeDomain.imageUrl}
        accent={activeDomain.accent}
        meta={`${step}/4 booking steps`}
        onPress={() => setStep((value) => Math.min(4, value + 1))}
      />

      <Card tone="blue">
        <Text selectable style={textStyles.cardTitle}>
          Generate a tour schedule
        </Text>
        <Text selectable style={textStyles.body}>
          Enter the travel task, pace, hotel preference, or booking problem and Solara creates a clear trip brief with a saved output path.
        </Text>
        <View style={{ gap: 8 }}>
          <Text selectable style={textStyles.small}>
            Input field: {activeDomain.sessionInput}
          </Text>
          <TextInput
            accessibilityLabel="Session input field"
            value={input}
            onChangeText={setInput}
            multiline
            placeholder="Describe the destination, dates, pace, hotel mood, customer problem, or task..."
            style={{
              minHeight: 94,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#BFC8FF",
              backgroundColor: "#FFFFFF",
              color: "#111827",
              padding: 12,
              textAlignVertical: "top"
            }}
          />
        </View>
        <ProgressStatus label={`step ${step} of 4 action workflow`} value={Math.round((step / 4) * 100)} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button label="Generate trip brief" icon={WandSparkles} onPress={() => setStep((value) => Math.min(4, value + 1))} />
          <Button label="Save" icon={Save} variant="secondary" onPress={() => router.push("/details/launch-plan")} />
        </View>
      </Card>

      <Card tone="green">
        <Text selectable style={textStyles.cardTitle}>
          Completed booking output
        </Text>
        <Text selectable style={textStyles.body}>
          Result brief: airport transfer, Rio hotel, coast day, and early guide pickup are grouped into one reviewable itinerary.
        </Text>
        <Button label="Open saved result" icon={Clock3} variant="secondary" onPress={() => router.push(`/details/${sessions[0].id}`)} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Booking steps
        </Text>
        {["Choose destination", "Match accommodation", "Generate schedule", "Save booking result"].map((title, index) => (
          <Card key={title} tone={index + 1 <= step ? "gold" : "default"} onPress={() => setStep(index + 1)}>
            <Text selectable style={textStyles.cardTitle}>
              {index + 1}. {title}
            </Text>
            <Text selectable style={textStyles.body}>
              Tap to move the current task step and verify action feedback.
            </Text>
          </Card>
        ))}
      </View>
    </AppScreen>
  );
}
