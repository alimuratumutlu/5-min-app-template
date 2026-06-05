import { useMemo, useState, type ComponentType } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Brain, Clock3, Crown, Flame, Gamepad2, Layers3, Play, Sparkles, Star, Trophy, WandSparkles, Zap } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppScreen, Button, ProgressStatus, colors, fonts, textStyles } from "@/components/app-shell";
import { inputMechanicStats } from "@/lib/input-mechanics";
import { domains, userProgress } from "@/lib/template-data";

type Tone = "coral" | "gold" | "green" | "purple" | "blue";

type GamePoster = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  accent: string;
  tone: Tone;
  progress: number;
  xp: number;
  duration: string;
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
};

const gameRows: Array<{ title: string; kicker: string; items: GamePoster[] }> = [
  {
    title: "Continue playing",
    kicker: "Pick up your run",
    items: [
      {
        id: "focus-sprint",
        title: "Focus Sprint",
        subtitle: "90-second timer, combo x3, shield ready.",
        category: "Daily run",
        imageUrl: domains[0].imageUrl,
        accent: "#FF6F3D",
        tone: "coral",
        progress: 72,
        xp: 120,
        duration: "5 min",
        icon: Zap
      },
      {
        id: "puzzle-gate",
        title: "Puzzle Gate",
        subtitle: "Tiny choices with streak protection.",
        category: "Skill path",
        imageUrl: domains[1].imageUrl,
        accent: "#247BFF",
        tone: "blue",
        progress: 54,
        xp: 180,
        duration: "4 min",
        icon: Brain
      },
      {
        id: "boss-round",
        title: "Boss Round",
        subtitle: "Multiplier mode with one rare badge.",
        category: "Event",
        imageUrl: domains[4].imageUrl,
        accent: "#875CFF",
        tone: "purple",
        progress: 38,
        xp: 300,
        duration: "7 min",
        icon: Crown
      }
    ]
  },
  {
    title: "Five-minute arcades",
    kicker: "Fast skill games",
    items: [
      {
        id: "memory-dash",
        title: "Memory Dash",
        subtitle: "Remember the pattern before the timer burns out.",
        category: "Brain",
        imageUrl: "https://images.unsplash.com/photo-1606326608690-4e0281b1e588?auto=format&fit=crop&w=900&q=80",
        accent: "#00C985",
        tone: "green",
        progress: 22,
        xp: 140,
        duration: "5 min",
        icon: Gamepad2
      },
      {
        id: "spark-lab",
        title: "Spark Lab",
        subtitle: "Make a tiny artifact and bank creative shards.",
        category: "Creative",
        imageUrl: domains[2].imageUrl,
        accent: "#FF4D8D",
        tone: "purple",
        progress: 66,
        xp: 160,
        duration: "6 min",
        icon: Sparkles
      },
      {
        id: "streak-flame",
        title: "Streak Flame",
        subtitle: "Save the day streak with one clean action.",
        category: "Habit",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        accent: "#FFB800",
        tone: "gold",
        progress: 82,
        xp: 90,
        duration: "3 min",
        icon: Flame
      }
    ]
  },
  {
    title: "League challenges",
    kicker: "Win, climb, repeat",
    items: [
      {
        id: "duo-rally",
        title: "Duo Rally",
        subtitle: "Co-op run for league rank and shared rewards.",
        category: "Social",
        imageUrl: domains[3].imageUrl,
        accent: "#00C985",
        tone: "green",
        progress: 46,
        xp: 210,
        duration: "8 min",
        icon: Trophy
      },
      {
        id: "neon-cup",
        title: "Neon Cup",
        subtitle: "Three short rounds, one leaderboard jump.",
        category: "League",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
        accent: "#247BFF",
        tone: "blue",
        progress: 18,
        xp: 260,
        duration: "9 min",
        icon: Star
      },
      {
        id: "crown-trial",
        title: "Crown Trial",
        subtitle: "Hard mode for players protecting a streak.",
        category: "Boss",
        imageUrl: domains[4].imageUrl,
        accent: "#875CFF",
        tone: "purple",
        progress: 12,
        xp: 420,
        duration: "10 min",
        icon: Crown
      }
    ]
  }
];

const allGames = gameRows.flatMap((row) => row.items);

export default function SessionScreen() {
  const router = useRouter();
  const editorPick = allGames[0];
  const [selectedGame, setSelectedGame] = useState<GamePoster>(editorPick);
  const continueGames = useMemo(() => allGames.filter((game) => game.progress > 35).slice(0, 3), []);

  return (
    <AppScreen title="Play quest" subtitle="Games, runs, rewards" activeDomain="SkillQuest">
      <EditorHero game={selectedGame} onPlay={() => router.push(`/game/${selectedGame.id}`)} />

      <Pressable onPress={() => router.push("/mechanics")} style={({ pressed }) => [styles.mechanicLabCard, pressed ? styles.pressed : null]}>
        <View style={styles.mechanicLabIcon}>
          <WandSparkles color="#FFFFFF" size={24} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text selectable style={styles.mechanicLabTitle}>
            100 input mechanics lab
          </Text>
          <Text selectable style={styles.mechanicLabBody}>
            Browse playful ways to collect daily-life data across HASSAR apps.
          </Text>
        </View>
        <View style={styles.mechanicLabCount}>
          <Layers3 color={colors.blue} size={16} strokeWidth={3} />
          <Text selectable style={styles.mechanicLabCountText}>
            {inputMechanicStats.total}
          </Text>
        </View>
      </Pressable>

      <View style={styles.continuePanel}>
        <View style={styles.sectionHeader}>
          <View>
            <Text selectable style={textStyles.sectionTitle}>
              Keep going
            </Text>
            <Text selectable style={textStyles.small}>
              Your active runs are ready under the hero shelf.
            </Text>
          </View>
          <View style={styles.levelChip}>
            <Flame color={colors.coral} size={14} strokeWidth={2.8} />
            <Text selectable style={styles.levelChipText}>
              {userProgress.streak}d
            </Text>
          </View>
        </View>

        {continueGames.map((game) => (
          <Pressable key={game.id} onPress={() => setSelectedGame(game)} style={({ pressed }) => [styles.continueRun, pressed ? styles.pressed : null]}>
            <Image source={{ uri: game.imageUrl }} style={styles.continueThumb} contentFit="cover" />
            <View style={styles.continueCopy}>
              <Text selectable style={styles.continueTitle}>
                {game.title}
              </Text>
              <Text selectable numberOfLines={1} style={styles.continueBody}>
                {game.subtitle}
              </Text>
              <ProgressStatus label={`${game.duration} left`} value={game.progress} tone={game.tone === "coral" ? "coral" : game.tone} />
            </View>
            <View style={[styles.playDot, { backgroundColor: game.accent }]}>
              <Play color="#FFFFFF" size={15} fill="#FFFFFF" strokeWidth={2.8} />
            </View>
          </Pressable>
        ))}
      </View>

      {gameRows.map((row) => (
        <GameShelf key={row.title} title={row.title} kicker={row.kicker} games={row.items} selectedId={selectedGame.id} onSelect={setSelectedGame} />
      ))}

      <View style={styles.rewardBand}>
        <View style={styles.rewardIcon}>
          <Trophy color={colors.gold} size={24} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text selectable style={styles.rewardTitle}>
            Editor rule for this template
          </Text>
          <Text selectable style={styles.rewardBody}>
            Every poster can become a playable habit, learning, fitness, or productivity loop without changing the shell.
          </Text>
        </View>
        <Button label="Play" icon={Play} onPress={() => router.push("/game/focus-sprint")} />
      </View>
    </AppScreen>
  );
}

function EditorHero({ game, onPlay }: { game: GamePoster; onPlay: () => void }) {
  const Icon = game.icon;

  return (
    <View style={styles.heroBleed}>
      <Image source={{ uri: game.imageUrl }} style={styles.heroImage} contentFit="cover" />
      <LinearGradient colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.08)", "rgba(9,10,15,0.88)"]} style={styles.heroShade} />
      <View style={styles.heroContent}>
        <View style={[styles.editorBadge, { backgroundColor: game.accent }]}>
          <Sparkles color="#FFFFFF" size={14} strokeWidth={3} />
          <Text selectable style={styles.editorBadgeText}>
            Editor pick
          </Text>
        </View>
        <View style={styles.heroTitleRow}>
          <View style={[styles.heroIcon, { backgroundColor: game.accent }]}>
            <Icon color="#FFFFFF" size={22} strokeWidth={3} />
          </View>
          <View style={{ flex: 1 }}>
            <Text selectable style={styles.heroKicker}>
              {game.category} - {game.duration}
            </Text>
            <Text selectable style={styles.heroTitle}>
              {game.title}
            </Text>
          </View>
        </View>
        <Text selectable numberOfLines={2} style={styles.heroSubtitle}>
          {game.subtitle}
        </Text>
        <View style={styles.heroStats}>
          <View style={styles.statBubble}>
            <Text selectable style={styles.statBubbleValue}>
              +{game.xp}
            </Text>
            <Text selectable style={styles.statBubbleLabel}>
              XP
            </Text>
          </View>
          <View style={styles.statBubble}>
            <Text selectable style={styles.statBubbleValue}>
              {game.progress}%
            </Text>
            <Text selectable style={styles.statBubbleLabel}>
              run
            </Text>
          </View>
        </View>
        <View style={styles.heroActions}>
          <Pressable accessibilityRole="button" onPress={onPlay} style={({ pressed }) => [styles.playButtonShell, pressed ? styles.playButtonPressed : null]}>
            <View style={[styles.playButtonFace, { backgroundColor: game.accent }]}>
              <Play color="#FFFFFF" size={18} fill="#FFFFFF" strokeWidth={3} />
              <Text selectable style={styles.playButtonText}>
                Play now
              </Text>
            </View>
          </Pressable>
          <View style={styles.ghostButton}>
            <Clock3 color="#FFFFFF" size={17} strokeWidth={2.8} />
            <Text selectable style={styles.ghostButtonText}>
              {game.duration}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function GameShelf({
  title,
  kicker,
  games,
  selectedId,
  onSelect
}: {
  title: string;
  kicker: string;
  games: GamePoster[];
  selectedId: string;
  onSelect: (game: GamePoster) => void;
}) {
  return (
    <View style={styles.shelf}>
      <View style={styles.sectionHeader}>
        <View>
          <Text selectable style={textStyles.sectionTitle}>
            {title}
          </Text>
          <Text selectable style={textStyles.small}>
            {kicker}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.posterRail}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} selected={selectedId === game.id} onPress={() => onSelect(game)} />
        ))}
      </ScrollView>
    </View>
  );
}

function GameCard({ game, selected, onPress }: { game: GamePoster; selected: boolean; onPress: () => void }) {
  const Icon = game.icon;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.posterCard, selected ? styles.posterCardSelected : null, pressed ? styles.pressed : null]}>
      <Image source={{ uri: game.imageUrl }} style={styles.posterImage} contentFit="cover" />
      <LinearGradient colors={["rgba(255,255,255,0.04)", "rgba(0,0,0,0.16)", "rgba(0,0,0,0.82)"]} style={styles.posterShade} />
      <View style={[styles.posterIcon, { backgroundColor: game.accent }]}>
        <Icon color="#FFFFFF" size={18} strokeWidth={3} />
      </View>
      <View style={styles.posterMeta}>
        <Text selectable style={styles.posterCategory}>
          {game.category}
        </Text>
        <Text selectable numberOfLines={2} style={styles.posterTitle}>
          {game.title}
        </Text>
        <Text selectable style={styles.posterInfo}>
          +{game.xp} XP - {game.duration}
        </Text>
        <View style={styles.posterTrack}>
          <View style={[styles.posterFill, { width: `${game.progress}%`, backgroundColor: game.accent }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroBleed: {
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    borderCurve: "continuous",
    height: 428,
    marginHorizontal: -16,
    marginTop: -16,
    overflow: "hidden"
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject
  },
  heroContent: {
    bottom: 24,
    gap: 12,
    left: 18,
    position: "absolute",
    right: 18
  },
  editorBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 18,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  editorBadgeText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  heroTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  heroIcon: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.46)",
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  heroKicker: {
    color: "rgba(255,255,255,0.76)",
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 42
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.86)",
    fontFamily: fonts.semibold,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    maxWidth: 330
  },
  heroStats: {
    flexDirection: "row",
    gap: 10
  },
  statBubble: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    minWidth: 78,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  statBubbleValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 20
  },
  statBubbleLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    textTransform: "uppercase"
  },
  heroActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  playButtonShell: {
    backgroundColor: "#101116",
    borderRadius: 30,
    minHeight: 58,
    paddingBottom: 6
  },
  playButtonPressed: {
    paddingBottom: 1,
    paddingTop: 5
  },
  playButtonFace: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.26)",
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 22
  },
  playButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18
  },
  ghostButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    minHeight: 52,
    paddingHorizontal: 16
  },
  ghostButtonText: {
    color: "#FFFFFF",
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700"
  },
  mechanicLabCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 12,
    padding: 14,
    boxShadow: "0 18px 38px rgba(36, 123, 255, 0.12)"
  },
  mechanicLabIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  mechanicLabTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 21
  },
  mechanicLabBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  mechanicLabCount: {
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  mechanicLabCountText: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 16
  },
  continuePanel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    borderCurve: "continuous",
    gap: 14,
    marginTop: -2,
    padding: 16,
    boxShadow: "0 20px 46px rgba(36, 123, 255, 0.10)"
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  levelChip: {
    alignItems: "center",
    backgroundColor: "#FFF0E8",
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  levelChipText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14
  },
  continueRun: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 12,
    minHeight: 104,
    padding: 10,
    boxShadow: "0 15px 30px rgba(16, 17, 22, 0.08)"
  },
  continueThumb: {
    borderRadius: 21,
    height: 84,
    width: 84
  },
  continueCopy: {
    flex: 1,
    gap: 4
  },
  continueTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 20
  },
  continueBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16
  },
  playDot: {
    alignItems: "center",
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  shelf: {
    gap: 12
  },
  posterRail: {
    gap: 14,
    paddingRight: 16
  },
  posterCard: {
    borderColor: "rgba(255,255,255,0.82)",
    borderRadius: 32,
    borderWidth: 1,
    height: 236,
    overflow: "hidden",
    width: 158,
    boxShadow: "0 18px 34px rgba(16, 17, 22, 0.12)"
  },
  posterCardSelected: {
    transform: [{ translateY: -4 }],
    boxShadow: "0 24px 42px rgba(255, 111, 61, 0.18)"
  },
  posterImage: {
    ...StyleSheet.absoluteFillObject
  },
  posterShade: {
    ...StyleSheet.absoluteFillObject
  },
  posterIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    left: 12,
    position: "absolute",
    top: 12,
    width: 40
  },
  posterMeta: {
    bottom: 12,
    gap: 5,
    left: 12,
    position: "absolute",
    right: 12
  },
  posterCategory: {
    color: "rgba(255,255,255,0.74)",
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    textTransform: "uppercase"
  },
  posterTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22
  },
  posterInfo: {
    color: "rgba(255,255,255,0.84)",
    fontFamily: fonts.semibold,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14
  },
  posterTrack: {
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 8,
    height: 7,
    overflow: "hidden"
  },
  posterFill: {
    borderRadius: 8,
    height: "100%"
  },
  rewardBand: {
    alignItems: "center",
    backgroundColor: "#FFF8E2",
    borderRadius: 32,
    borderCurve: "continuous",
    flexDirection: "row",
    gap: 12,
    padding: 15,
    boxShadow: "0 18px 34px rgba(255, 184, 0, 0.14)"
  },
  rewardIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  rewardTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 20
  },
  rewardBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17
  },
  pressed: {
    opacity: 0.74,
    transform: [{ scale: 0.99 }]
  }
});
