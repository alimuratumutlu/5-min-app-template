import { useState } from "react";
import { useRouter } from "expo-router";
import { Bell, CreditCard, Palette, ShieldCheck } from "lucide-react-native";
import { Switch, Text, View } from "react-native";
import { AppScreen, Button, Card, IconButton, ListRow, ProgressStatus, colors, textStyles } from "@/components/app-shell";
import { domains, userProgress } from "@/lib/template-data";

export default function ProfileScreen() {
  const router = useRouter();
  const [personalized, setPersonalized] = useState(true);

  return (
    <AppScreen title="Profile" subtitle="Avatar, settings, personalization, account" activeDomain="Account">
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              backgroundColor: colors.blueSoft,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#BFC8FF"
            }}
          >
            <Text selectable style={{ color: colors.blue, fontWeight: "900", fontSize: 22 }}>
              MU
            </Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text selectable style={textStyles.cardTitle}>
              Murat Umutlu
            </Text>
            <Text selectable style={textStyles.body}>
              Profile image/avatar active. {userProgress.level}, {userProgress.points} points, {userProgress.streak} day streak.
            </Text>
          </View>
          <IconButton icon={Palette} label="Edit personalization" onPress={() => router.push("/details/cloudflare-ready")} />
        </View>
      </Card>

      <Card tone="green">
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text selectable style={textStyles.cardTitle}>
              Personalization preferences
            </Text>
            <Text selectable style={textStyles.body}>
              Adapt recommendations by business model, interests, domain, and saved session behavior.
            </Text>
          </View>
          <Switch value={personalized} onValueChange={setPersonalized} />
        </View>
        <ProgressStatus label="account setup score" value={82} tone="green" />
      </Card>

      <View style={{ gap: 10 }}>
        <Text selectable style={textStyles.sectionTitle}>
          Settings and subscription
        </Text>
        <ListRow title="Preferred business model" body={domains.map((domain) => domain.shortTitle).join(", ")} meta="personalization" onPress={() => router.push("/details/onboarding-lab")} />
        <ListRow title="Privacy and local-first mode" body="Keep sensitive session output local until Clerk and Cloudflare storage are attached." meta="settings" onPress={() => router.push("/details/cloudflare-ready")} />
        <ListRow title="Subscription surface" body="Upgrade, trial, and account limits can live here after the core UX matures." meta="account subscription" onPress={() => router.push("/details/carousel-lab")} />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button label="Notifications" icon={Bell} variant="secondary" onPress={() => router.push("/details/onboarding-lab")} />
        <Button label="Billing" icon={CreditCard} variant="secondary" onPress={() => router.push("/details/carousel-lab")} />
      </View>
      <Button label="Security review" icon={ShieldCheck} variant="quiet" onPress={() => router.push("/details/cloudflare-ready")} />
    </AppScreen>
  );
}
