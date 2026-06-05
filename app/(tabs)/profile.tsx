import { useState } from "react";
import { useRouter } from "expo-router";
import { Bell, CreditCard, Palette, ShieldCheck, UserRoundCheck } from "lucide-react-native";
import { Switch, Text, View } from "react-native";
import { AppScreen, Button, Card, CompactTile, IconButton, ListRow, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";
import { domains, userProgress } from "@/lib/template-data";

export default function ProfileScreen() {
  const router = useRouter();
  const [personalized, setPersonalized] = useState(true);

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
