import { useState } from "react";
import { useRouter } from "expo-router";
import { Save, WandSparkles } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { AppScreen, Button, Card, ProgressStatus, textStyles } from "@/components/app-shell";
import { domains, sessions } from "@/lib/template-data";

export default function SessionScreen() {
  const router = useRouter();
  const [input, setInput] = useState("Build the reusable 5-min app shell");
  const [step, setStep] = useState(2);
  const activeDomain = domains[0];

  return (
    <AppScreen title="5-Min Session" subtitle="Primary action workflow" activeDomain="Main Action">
      <Card tone="blue">
        <Text selectable style={textStyles.cardTitle}>
          Generate the first useful output
        </Text>
        <Text selectable style={textStyles.body}>
          This interaction surface models the user's main reason to open the app: enter one problem, get one brief, save one result.
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
            placeholder="Describe the task, signal, topic, customer problem, or decision..."
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
          <Button label="Generate brief" icon={WandSparkles} onPress={() => setStep((value) => Math.min(4, value + 1))} />
          <Button label="Save" icon={Save} variant="secondary" onPress={() => router.push("/details/launch-plan")} />
        </View>
      </Card>

      <Card tone="green">
        <Text selectable style={textStyles.cardTitle}>
          Completed output path
        </Text>
        <Text selectable style={textStyles.body}>
          Result brief: split the product shell from backend services, mature the UX first, then attach Clerk, D1, R2, analytics, and payments through adapters.
        </Text>
        <Button label="Open saved result" variant="secondary" onPress={() => router.push(`/details/${sessions[0].id}`)} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Session steps
        </Text>
        {["Clarify problem", "Choose template domain", "Generate output", "Save and score"].map((title, index) => (
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
