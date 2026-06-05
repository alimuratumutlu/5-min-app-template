import { useRouter } from "expo-router";
import {
  BookmarkCheck,
  ChevronUp,
  Crown,
  Flame,
  Gem,
  LockKeyhole,
  Medal,
  Play,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon
} from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen, Button, colors, fonts, ProgressStatus, textStyles } from "@/components/app-shell";
import { userProgress } from "@/lib/template-data";

type Tone = "gold" | "blue" | "ruby" | "locked" | "green" | "purple";

const leagues: Array<{ label: string; tone: Tone; icon: LucideIcon; active?: boolean; locked?: boolean }> = [
  { label: "Gold", tone: "gold", icon: Shield },
  { label: "Sapphire", tone: "blue", icon: Gem },
  { label: "Ruby", tone: "ruby", icon: Zap, active: true },
  { label: "Pearl", tone: "locked", icon: LockKeyhole, locked: true },
  { label: "Elite", tone: "locked", icon: Crown, locked: true }
];

const leaders = [
  { rank: 1, name: "Nora K.", xp: 4860, streak: 21, tone: "gold" as const, avatar: "NK", movement: "+2" },
  { rank: 2, name: "Kenji A.", xp: 4310, streak: 18, tone: "blue" as const, avatar: "KA", movement: "+1" },
  { rank: 3, name: "Lena V.", xp: 3890, streak: 14, tone: "ruby" as const, avatar: "LV", movement: "new" },
  { rank: 4, name: "Omar S.", xp: 3410, streak: 12, tone: "green" as const, avatar: "OS", movement: "+5" },
  { rank: 5, name: "Mina P.", xp: 2980, streak: 11, tone: "purple" as const, avatar: "MP", movement: "-1" },
  { rank: 18, name: "Ali Murat Umutlu", xp: userProgress.points, streak: userProgress.streak, tone: "ruby" as const, avatar: "AM", movement: "+4", current: true }
];

const savedLeagueOutputs = [
  {
    id: "launch-plan",
    title: "Favorite focus replay",
    body: "Saved result output from a clean Focus Sprint. Open it to review the combo path.",
    meta: "recent saved item"
  },
  {
    id: "learning-sprint",
    title: "Boss round brief",
    body: "Bookmarked league content with the exact power-up order to continue later.",
    meta: "favorite review"
  }
];

export default function LeaderboardScreen() {
  const router = useRouter();

  return (
    <AppScreen title="Ruby League" subtitle="Weekly leaderboard" activeDomain="SkillQuest">
      <View style={styles.leagueHero}>
        <View style={styles.badgeTrack}>
          {leagues.map((league) => (
            <LeagueBadge key={league.label} league={league} />
          ))}
        </View>

        <View style={styles.heroCopy}>
          <Text selectable style={styles.heroTitle}>
            Ruby League
          </Text>
          <Text selectable style={styles.heroBody}>
            Complete one playable quest to lock your place in this week's leaderboard.
          </Text>
        </View>

        <Button label="Start a lesson" icon={Play} variant="secondary" onPress={() => router.push("/session")} fullWidth />

        <View style={styles.statGrid}>
          <LeagueStat label="rank" value="#18" icon={Trophy} tone="ruby" />
          <LeagueStat label="weekly XP" value={userProgress.points.toLocaleString()} icon={Zap} tone="gold" />
          <LeagueStat label="streak" value={`${userProgress.streak}d`} icon={Flame} tone="green" />
        </View>
      </View>

      <View style={styles.promoCard}>
        <View style={styles.promoIcon}>
          <Sparkles color="#FFFFFF" size={20} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Text selectable style={textStyles.cardTitle}>
            Promotion zone
          </Text>
          <Text selectable style={textStyles.body}>
            Reach top 10 before Sunday night to advance into Pearl League.
          </Text>
          <ProgressStatus label="promotion progress" value={62} tone="coral" />
        </View>
      </View>

      <View style={styles.board}>
        <View style={styles.boardHeader}>
          <View>
            <Text selectable style={textStyles.sectionTitle}>
              This week
            </Text>
            <Text selectable style={textStyles.small}>
              Top players by earned XP
            </Text>
          </View>
          <View style={styles.timePill}>
            <Star color={colors.gold} size={14} fill={colors.gold} />
            <Text selectable style={styles.timePillText}>
              2d left
            </Text>
          </View>
        </View>

        <View style={styles.leaderList}>
          {leaders.slice(0, 5).map((player) => (
            <LeaderRow key={player.rank} player={player} />
          ))}
        </View>
      </View>

      <View style={styles.savedPanel}>
        <View style={styles.boardHeader}>
          <View>
            <Text selectable style={textStyles.sectionTitle}>
              Saved league outputs
            </Text>
            <Text selectable style={textStyles.small}>
              Favorite result items to continue, review, or open.
            </Text>
          </View>
          <View style={styles.savedIcon}>
            <BookmarkCheck color={colors.blue} size={18} strokeWidth={3} />
          </View>
        </View>
        <View style={styles.savedList}>
          {savedLeagueOutputs.map((item) => (
            <SavedOutputRow key={item.id} item={item} onPress={() => router.push(`/details/${item.id}`)} />
          ))}
        </View>
      </View>

      <View style={styles.currentPlayer}>
        <Text selectable style={styles.currentDash}>
          -
        </Text>
        <View style={styles.currentAvatar}>
          <Text selectable style={styles.currentAvatarText}>
            AM
          </Text>
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text selectable style={styles.currentName}>
            Ali Murat Umutlu
          </Text>
          <Text selectable style={styles.currentMeta}>
            One quest away from entering the visible board
          </Text>
        </View>
        <Text selectable style={styles.currentXp}>
          {userProgress.points.toLocaleString()} XP
        </Text>
      </View>
    </AppScreen>
  );
}

function SavedOutputRow({
  item,
  onPress
}: {
  item: { title: string; body: string; meta: string };
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.savedRow, pressed ? styles.pressed : null]}>
      <View style={styles.savedRowIcon}>
        <BookmarkCheck color={colors.blue} size={18} strokeWidth={3} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text selectable style={styles.savedTitle}>
          {item.title}
        </Text>
        <Text selectable numberOfLines={2} style={styles.savedBody}>
          {item.body}
        </Text>
        <Text selectable style={styles.savedMeta}>
          {item.meta}
        </Text>
      </View>
      <Text selectable style={styles.openText}>
        Open
      </Text>
    </Pressable>
  );
}

function LeagueBadge({
  league
}: {
  league: { label: string; tone: Tone; icon: LucideIcon; active?: boolean; locked?: boolean };
}) {
  const Icon = league.icon;
  const toneStyle = badgeToneStyles[league.tone];

  return (
    <View style={styles.badgeShell}>
      <View style={[styles.badgeShadow, toneStyle.shadow]} />
      <View style={[styles.badgeFace, toneStyle.face, league.active ? styles.badgeFaceActive : null]}>
        <View style={[styles.badgeCut, toneStyle.cut]} />
        <Icon color={league.locked ? "#BFC3C9" : toneStyle.iconColor} size={26} strokeWidth={3} />
      </View>
      <Text selectable numberOfLines={1} style={[styles.badgeLabel, league.active ? styles.badgeLabelActive : null]}>
        {league.label}
      </Text>
    </View>
  );
}

function LeagueStat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: LucideIcon; tone: Tone }) {
  const accent = statAccent[tone];

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: accent.soft }]}>
        <Icon color={accent.strong} size={17} strokeWidth={3} />
      </View>
      <Text selectable style={styles.statValue}>
        {value}
      </Text>
      <Text selectable style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function LeaderRow({
  player
}: {
  player: { rank: number; name: string; xp: number; streak: number; tone: Exclude<Tone, "locked">; avatar: string; movement: string };
}) {
  const accent = statAccent[player.tone];

  return (
    <Pressable style={({ pressed }) => [styles.leaderRow, pressed ? styles.pressed : null]}>
      <View style={styles.rankWrap}>
        {player.rank <= 3 ? <Medal color={accent.strong} size={18} strokeWidth={3} /> : null}
        <Text selectable style={[styles.rankText, player.rank <= 3 ? { color: accent.strong } : null]}>
          {player.rank}
        </Text>
      </View>
      <View style={[styles.avatar, { backgroundColor: accent.soft }]}>
        <Text selectable style={[styles.avatarText, { color: accent.strong }]}>
          {player.avatar}
        </Text>
      </View>
      <View style={styles.playerCopy}>
        <Text selectable numberOfLines={1} style={styles.playerName}>
          {player.name}
        </Text>
        <Text selectable style={styles.playerMeta}>
          {player.streak} day streak
        </Text>
      </View>
      <View style={styles.xpColumn}>
        <Text selectable style={styles.playerXp}>
          {player.xp.toLocaleString()} XP
        </Text>
        <View style={styles.movePill}>
          <ChevronUp color={colors.green} size={12} strokeWidth={3} />
          <Text selectable style={styles.moveText}>
            {player.movement}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const statAccent = {
  gold: { strong: colors.gold, soft: "#FFF3C4" },
  blue: { strong: colors.blue, soft: "#E7F0FF" },
  ruby: { strong: "#FF4657", soft: "#FFE1E5" },
  green: { strong: colors.green, soft: "#DDFCED" },
  purple: { strong: colors.purple, soft: "#F0EAFF" },
  locked: { strong: "#AEB3BA", soft: "#F3F4F6" }
};

const badgeToneStyles = {
  gold: {
    face: { backgroundColor: "#FFD232" },
    shadow: { backgroundColor: "#E5AE00" },
    cut: { backgroundColor: "rgba(255,255,255,0.28)" },
    iconColor: "#FFFFFF"
  },
  blue: {
    face: { backgroundColor: "#2BB8F6" },
    shadow: { backgroundColor: "#1389C0" },
    cut: { backgroundColor: "rgba(255,255,255,0.24)" },
    iconColor: "#DDF5FF"
  },
  ruby: {
    face: { backgroundColor: "#FF6A73" },
    shadow: { backgroundColor: "#E7323F" },
    cut: { backgroundColor: "rgba(255,255,255,0.22)" },
    iconColor: "#9F1021"
  },
  locked: {
    face: { backgroundColor: "#F1F2F4" },
    shadow: { backgroundColor: "#D9DCE1" },
    cut: { backgroundColor: "rgba(255,255,255,0.55)" },
    iconColor: "#BFC3C9"
  },
  green: {
    face: { backgroundColor: colors.green },
    shadow: { backgroundColor: "#00A971" },
    cut: { backgroundColor: "rgba(255,255,255,0.22)" },
    iconColor: "#FFFFFF"
  },
  purple: {
    face: { backgroundColor: colors.purple },
    shadow: { backgroundColor: "#6540D8" },
    cut: { backgroundColor: "rgba(255,255,255,0.22)" },
    iconColor: "#FFFFFF"
  }
};

const styles = StyleSheet.create({
  leagueHero: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 36,
    borderCurve: "continuous",
    gap: 20,
    padding: 18,
    boxShadow: "0 22px 46px rgba(16, 17, 22, 0.08)"
  },
  badgeTrack: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  badgeShell: {
    alignItems: "center",
    gap: 7,
    width: 62
  },
  badgeShadow: {
    borderRadius: 16,
    height: 54,
    position: "absolute",
    top: 7,
    width: 54
  },
  badgeFace: {
    alignItems: "center",
    borderRadius: 16,
    borderCurve: "continuous",
    height: 58,
    justifyContent: "center",
    overflow: "hidden",
    transform: [{ rotate: "-18deg" }],
    width: 58
  },
  badgeFaceActive: {
    height: 72,
    width: 72,
    borderRadius: 20,
    transform: [{ rotate: "-18deg" }, { translateY: -5 }]
  },
  badgeCut: {
    height: 96,
    left: -14,
    position: "absolute",
    top: -20,
    transform: [{ rotate: "42deg" }],
    width: 22
  },
  badgeLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12
  },
  badgeLabelActive: {
    color: "#FF4657"
  },
  heroCopy: {
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 30,
    textAlign: "center"
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 298,
    textAlign: "center"
  },
  statGrid: {
    flexDirection: "row",
    gap: 12,
    width: "100%"
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderCurve: "continuous",
    flex: 1,
    gap: 5,
    padding: 12,
    boxShadow: "0 14px 28px rgba(16,17,22,0.07)"
  },
  statIcon: {
    alignItems: "center",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  statValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 21
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    textTransform: "uppercase"
  },
  promoCard: {
    alignItems: "center",
    backgroundColor: "#FFF0E8",
    borderRadius: 32,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 13,
    padding: 15,
    boxShadow: "0 18px 36px rgba(255,111,61,0.12)"
  },
  promoIcon: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 24,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  board: {
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    borderCurve: "continuous",
    gap: 16,
    padding: 16,
    boxShadow: "0 20px 42px rgba(36, 123, 255, 0.08)"
  },
  boardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  timePill: {
    alignItems: "center",
    backgroundColor: "#FFF8E2",
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  timePillText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14
  },
  leaderList: {
    gap: 10
  },
  leaderRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 10,
    minHeight: 76,
    padding: 10,
    boxShadow: "0 12px 26px rgba(16,17,22,0.07)"
  },
  rankWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    width: 35
  },
  rankText: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  avatar: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  avatarText: {
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900"
  },
  playerCopy: {
    flex: 1,
    gap: 2
  },
  playerName: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18
  },
  playerMeta: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15
  },
  xpColumn: {
    alignItems: "flex-end",
    gap: 5
  },
  playerXp: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 16
  },
  movePill: {
    alignItems: "center",
    backgroundColor: "#DDFCED",
    borderRadius: 12,
    flexDirection: "row",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  moveText: {
    color: colors.green,
    fontFamily: fonts.black,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12
  },
  currentPlayer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 11,
    padding: 13,
    boxShadow: "0 20px 46px rgba(255, 70, 87, 0.13)"
  },
  savedPanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    borderCurve: "continuous",
    gap: 14,
    padding: 16,
    boxShadow: "0 20px 42px rgba(36, 123, 255, 0.08)"
  },
  savedIcon: {
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  savedList: {
    gap: 10
  },
  savedRow: {
    alignItems: "center",
    backgroundColor: "#F9FBFF",
    borderRadius: 24,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 11,
    padding: 12
  },
  savedRowIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  savedTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18
  },
  savedBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16
  },
  savedMeta: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
    textTransform: "uppercase"
  },
  openText: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900"
  },
  currentDash: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    width: 22,
    textAlign: "center"
  },
  currentAvatar: {
    alignItems: "center",
    backgroundColor: "#E7F0FF",
    borderRadius: 26,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  currentAvatarText: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 16,
    fontWeight: "900"
  },
  onlineDot: {
    backgroundColor: colors.green,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 2,
    bottom: 2,
    height: 12,
    position: "absolute",
    right: 2,
    width: 12
  },
  currentName: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 18
  },
  currentMeta: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14
  },
  currentXp: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    fontWeight: "900"
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }]
  }
});
