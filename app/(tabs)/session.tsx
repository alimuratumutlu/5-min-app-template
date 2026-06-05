import { useState } from "react";
import { useRouter } from "expo-router";
import { Clock3, Save, WandSparkles } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { AppScreen, Button, Card, HeroPoster, ProgressStatus, textStyles } from "@/components/app-shell";
import { domains, sessions } from "@/lib/template-data";

export default function SessionScreen() {
  const router = useRouter();
  const [input, setInput] = useState("90 seconds, keep combo, spend shield only if needed");
  const [step, setStep] = useState(2);
  const activeDomain = domains[0];

  return (
    <AppScreen title="Start quest" subtitle="Timer, combo, shield, reward" activeDomain="SkillQuest">
      <HeroPoster
        title="Focus Sprint"
        subtitle="Beat the short timer, keep the combo alive, and claim the next reward."
        imageUrl={activeDomain.imageUrl}
        accent={activeDomain.accent}
        meta={`${step}/4 quest steps`}
        onPress={() => setStep((value) => Math.min(4, value + 1))}
      />

      <Card tone="blue">
        <Text selectable style={textStyles.cardTitle}>
          Run the challenge
        </Text>
        <Text selectable style={textStyles.body}>
          Choose a timer rule, power-up, or challenge mode. SkillQuest turns the attempt into XP, streak, and badge progress.
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
            placeholder="Describe the quest timer, combo rule, power-up, or challenge..."
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
        <ProgressStatus label={`step ${step} of 4 challenge loop`} value={Math.round((step / 4) * 100)} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button label="Start XP run" icon={WandSparkles} onPress={() => setStep((value) => Math.min(4, value + 1))} />
          <Button label="Save" icon={Save} variant="secondary" onPress={() => router.push("/details/launch-plan")} />
        </View>
      </Card>

      <Card tone="green">
        <Text selectable style={textStyles.cardTitle}>
          Reward preview
        </Text>
        <Text selectable style={textStyles.body}>
          Clean run result: +120 XP, combo x3, one shield fragment, and rare badge progress.
        </Text>
        <Button label="Open saved result" icon={Clock3} variant="secondary" onPress={() => router.push(`/details/${sessions[0].id}`)} />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Challenge steps
        </Text>
        {["Pick quest", "Choose power-up", "Beat timer", "Claim reward"].map((title, index) => (
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
