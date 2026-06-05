import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Image as ImageIcon,
  Layers3,
  Mic,
  PlayCircle,
  Sparkles,
  Trophy,
  UserCircle,
  WandSparkles,
  type LucideIcon
} from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, IconButton, colors, fonts, textStyles } from "@/components/app-shell";
import { getMechanic, inputMechanics, type AiTiming, type InputMechanic } from "@/lib/input-mechanics";
import {
  buildMechanicMultiOptions,
  buildMechanicOptions,
  buildMechanicSampleValue,
  getMechanicPreviewMode
} from "@/lib/mechanic-preview";

const navItems = [
  { href: "/", icon: Home, label: "Home", size: 23 },
  { href: "/session", icon: PlayCircle, label: "Session", size: 27 },
  { href: "/analytics", icon: BrainCircuit, label: "AI Report", size: 23 },
  { href: "/bookmarks", icon: Trophy, label: "Leaderboard", size: 23 },
  { href: "/profile", icon: UserCircle, label: "Profile", size: 23 }
] as const;

const timingCopy: Record<AiTiming, { title: string; body: string }> = {
  "instant-rule": {
    title: "Instant local feedback",
    body: "Use rules for format, completion, locked pairs, safety gates, or game scoring. Avoid AI latency."
  },
  "after-run": {
    title: "Analyze after the run",
    body: "Capture the signal first, keep play moving, then summarize patterns in AI Report."
  },
  hybrid: {
    title: "Hybrid response",
    body: "Use quick local validation now, then let AI interpret the deeper meaning after the session."
  },
  "no-ai": {
    title: "No AI needed",
    body: "The interaction itself is the value: logging, progress, streaks, and charts can update immediately."
  }
};

export default function MechanicDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const mechanic = getMechanic(params.id ?? "");
  const nextMechanic = inputMechanics[mechanic.number % inputMechanics.length];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/mechanics");
  };

  return (
    <AppScreen title="Mechanic detail" subtitle={mechanic.title} activeDomain="SkillQuest" footer={<MechanicsBottomNav />}>
      <View style={styles.topBar}>
        <IconButton icon={ArrowLeft} label="Go back" tone="dark" onPress={goBack} />
      </View>

      <View style={styles.heroPanel}>
        <View style={styles.heroTop}>
          <View style={styles.numberBadge}>
            <Text selectable style={styles.numberText}>
              {mechanic.number}
            </Text>
          </View>
          <TimingPill timing={mechanic.aiTiming} />
        </View>
        <Text selectable style={styles.heroTitle}>
          {mechanic.title}
        </Text>
        <Text selectable style={styles.heroBody}>
          {mechanic.pattern}
        </Text>
        <View style={styles.captureStrip}>
          <Layers3 color={colors.blue} size={17} strokeWidth={3} />
          <Text selectable style={styles.captureStripText}>
            Captures: {mechanic.captures}
          </Text>
        </View>
      </View>

      <ExampleSurface mechanic={mechanic} />

      <View style={styles.infoGrid}>
        <InfoCard title={timingCopy[mechanic.aiTiming].title} body={timingCopy[mechanic.aiTiming].body} icon={Clock3} tone="purple" />
        <InfoCard title="Feedback copy" body={mechanic.feedback} icon={Sparkles} tone="coral" />
      </View>

      <View style={styles.payloadCard}>
        <Text selectable style={styles.payloadTitle}>
          Example payload
        </Text>
        <Text selectable style={styles.payloadText}>
          {JSON.stringify(
            {
              mechanicId: mechanic.id,
              captures: mechanic.captures,
              aiTiming: mechanic.aiTiming,
              sampleValue: buildSampleValue(mechanic)
            },
            null,
            2
          )}
        </Text>
      </View>

      <View style={styles.fitCard}>
        <Text selectable style={textStyles.sectionTitle}>
          Best fits
        </Text>
        <View style={styles.fitRail}>
          {mechanic.projectFits.map((fit) => (
            <View key={fit} style={styles.fitChip}>
              <Text selectable style={styles.fitText}>
                {fit}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable onPress={() => router.push(`/mechanics/${nextMechanic.id}`)} style={({ pressed }) => [styles.nextCard, pressed ? styles.pressed : null]}>
        <View style={styles.nextIcon}>
          <WandSparkles color="#FFFFFF" size={20} strokeWidth={3} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text selectable style={styles.nextLabel}>
            Next mechanic
          </Text>
          <Text selectable style={styles.nextTitle}>
            {nextMechanic.number}. {nextMechanic.title}
          </Text>
        </View>
        <ChevronRight color={colors.textMuted} size={20} strokeWidth={3} />
      </Pressable>
    </AppScreen>
  );
}

function ExampleSurface({ mechanic }: { mechanic: InputMechanic }) {
  const mode = useMemo(() => getExampleMode(mechanic), [mechanic]);
  const [selected, setSelected] = useState("Today");
  const [chips, setChips] = useState<string[]>(() => buildOptions(mechanic).slice(0, 2));
  const [note, setNote] = useState("");

  const toggleChip = (chip: string) => {
    setChips((current) => (current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip]));
  };

  return (
    <View style={styles.exampleCard}>
      <View style={styles.exampleHeader}>
        <View style={styles.exampleIcon}>
          {mode === "media" ? <ImageIcon color="#FFFFFF" size={22} strokeWidth={3} /> : mode === "voice" ? <Mic color="#FFFFFF" size={22} strokeWidth={3} /> : <Sparkles color="#FFFFFF" size={22} strokeWidth={3} />}
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Text selectable style={styles.exampleTitle}>
            Sample screen
          </Text>
          <Text selectable style={styles.exampleBody}>
            {buildPrompt(mechanic)}
          </Text>
        </View>
      </View>

      {mode === "multi" ? (
        <MultiPickPreview mechanic={mechanic} chips={chips} onChip={toggleChip} />
      ) : mode === "match" ? (
        <MatchPreview mechanic={mechanic} />
      ) : mode === "listen" ? (
        <ListenPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "picture" ? (
        <PicturePreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "calendar" ? (
        <CalendarPreview mechanic={mechanic} />
      ) : mode === "body-map" ? (
        <BodyMapPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "rank" ? (
        <RankPreview mechanic={mechanic} />
      ) : mode === "swipe" ? (
        <SwipePreview mechanic={mechanic} />
      ) : mode === "branch" ? (
        <BranchPreview mechanic={mechanic} />
      ) : mode === "bucket" ? (
        <BucketSortPreview mechanic={mechanic} />
      ) : mode === "location" ? (
        <LocationPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "partner" ? (
        <PartnerPreview mechanic={mechanic} />
      ) : mode === "anonymous" ? (
        <AnonymousPreview mechanic={mechanic} />
      ) : mode === "avatar" ? (
        <AvatarPreview mechanic={mechanic} />
      ) : mode === "stamp" ? (
        <StampPreview mechanic={mechanic} />
      ) : mode === "toggle" ? (
        <TogglePreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "timer" ? (
        <TimerPreview mechanic={mechanic} />
      ) : mode === "route" ? (
        <RoutePreview mechanic={mechanic} />
      ) : mode === "radar" ? (
        <RadarPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "journal" ? (
        <JournalPreview note={note} onNote={setNote} />
      ) : mode === "word-builder" ? (
        <WordBuilderPreview mechanic={mechanic} chips={chips} onChip={toggleChip} />
      ) : mode === "slot-builder" ? (
        <SlotBuilderPreview mechanic={mechanic} note={note} onNote={setNote} />
      ) : mode === "stack-builder" ? (
        <StackBuilderPreview mechanic={mechanic} />
      ) : mode === "plate-builder" ? (
        <PlateBuilderPreview mechanic={mechanic} />
      ) : mode === "scenario" ? (
        <ScenarioPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "question-cards" ? (
        <QuestionCardsPreview mechanic={mechanic} chips={chips} onChip={toggleChip} />
      ) : mode === "script-builder" ? (
        <ScriptBuilderPreview mechanic={mechanic} chips={chips} onChip={toggleChip} />
      ) : mode === "next-action" ? (
        <NextActionPreview mechanic={mechanic} note={note} onNote={setNote} />
      ) : mode === "scale" ? (
        <ScalePreview mechanic={mechanic} />
      ) : mode === "media" ? (
        <MediaPreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mode === "voice" ? (
        <VoicePreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      ) : mechanic.effort === "short" ? (
        <BuilderPreview mechanic={mechanic} chips={chips} onChip={toggleChip} note={note} onNote={setNote} />
      ) : (
        <ChoicePreview mechanic={mechanic} selected={selected} onSelect={setSelected} />
      )}

      <View style={styles.savedBar}>
        <Check color="#FFFFFF" size={16} strokeWidth={3} />
        <Text selectable style={styles.savedText}>
          Captured signal, not marked right or wrong.
        </Text>
      </View>
    </View>
  );
}

function MultiPickPreview({ mechanic, chips, onChip }: { mechanic: InputMechanic; chips: string[]; onChip: (value: string) => void }) {
  const options = buildMultiOptions(mechanic);
  return (
    <View style={styles.multiPickCard}>
      <View style={styles.multiPickHeader}>
        <Text selectable style={styles.multiPickTitle}>
          Pick all that apply
        </Text>
        <View style={styles.multiPickCount}>
          <Text selectable style={styles.multiPickCountText}>
            {chips.length} selected
          </Text>
        </View>
      </View>
      <View style={styles.multiChipGrid}>
        {options.map((option) => {
          const active = chips.includes(option);
          return (
            <Pressable key={option} onPress={() => onChip(option)} style={({ pressed }) => [styles.multiChip, active ? styles.multiChipActive : null, pressed ? styles.pressed : null]}>
              <Text selectable style={[styles.multiChipText, active ? styles.multiChipTextActive : null]}>
                {option}
              </Text>
              {active ? <Check color="#FFFFFF" size={15} strokeWidth={3} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ChoicePreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  const options = buildOptions(mechanic);
  return (
    <View style={styles.optionStack}>
      {options.map((option) => (
        <Pressable key={option} onPress={() => onSelect(option)} style={({ pressed }) => [styles.duoShell, selected === option ? styles.duoShellActive : null, pressed ? styles.pressed : null]}>
          <View style={[styles.duoFace, selected === option ? styles.duoFaceActive : null]}>
            <Text selectable style={[styles.duoText, selected === option ? styles.duoTextActive : null]}>
              {option}
            </Text>
            {selected === option ? <Check color={colors.blue} size={18} strokeWidth={3} /> : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

function MatchPreview({ mechanic }: { mechanic: InputMechanic }) {
  const options = buildOptions(mechanic);
  const outcomes = ["Signal", "Action", "Reward"];
  return (
    <View style={styles.matchGrid}>
      <View style={styles.matchColumn}>
        {options.map((option) => (
          <View key={option} style={styles.matchTile}>
            <Text selectable style={styles.matchText}>
              {option}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.matchColumn}>
        {outcomes.map((outcome, index) => (
          <View key={outcome} style={[styles.matchTile, index === 0 ? styles.matchTileActive : null]}>
            <Text selectable style={[styles.matchText, index === 0 ? styles.matchTextActive : null]}>
              {outcome}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ListenPreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.optionStack}>
      <View style={styles.listenCard}>
        {[12, 26, 18, 36, 22, 30, 15].map((height, index) => (
          <View key={index} style={[styles.listenBar, { height }]} />
        ))}
      </View>
      <ChoicePreview mechanic={mechanic} selected={selected} onSelect={onSelect} />
    </View>
  );
}

function PicturePreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  const options = buildOptions(mechanic);
  return (
    <View style={styles.pictureGrid}>
      {options.map((option, index) => (
        <Pressable key={option} onPress={() => onSelect(option)} style={({ pressed }) => [styles.pictureTile, selected === option || index === 0 ? styles.pictureTileActive : null, pressed ? styles.pressed : null]}>
          <View style={[styles.pictureBlob, { backgroundColor: index === 0 ? colors.coral : index === 1 ? colors.green : colors.purple }]} />
          <Text selectable style={styles.pictureText}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function CalendarPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.calendarGrid}>
      {Array.from({ length: 21 }).map((_, index) => (
        <View key={index} style={[styles.calendarCell, index % 4 === 0 ? styles.calendarCellHot : index % 5 === 0 ? styles.calendarCellWarm : null]} />
      ))}
    </View>
  );
}

function BodyMapPreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.bodyMapCard}>
      {["Head", "Chest", "Core", "Legs"].map((part) => (
        <Pressable key={part} onPress={() => onSelect(part)} style={({ pressed }) => [styles.bodyPart, selected === part ? styles.bodyPartActive : null, pressed ? styles.pressed : null]}>
          <Text selectable style={[styles.bodyPartText, selected === part ? styles.bodyPartTextActive : null]}>
            {part}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function RankPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.optionStack}>
      {buildOptions(mechanic).map((option, index) => (
        <View key={option} style={styles.rankRow}>
          <View style={styles.rankNumber}>
            <Text selectable style={styles.rankNumberText}>
              {index + 1}
            </Text>
          </View>
          <Text selectable style={styles.rankText}>
            {option}
          </Text>
        </View>
      ))}
    </View>
  );
}

function BucketSortPreview({ mechanic }: { mechanic: InputMechanic }) {
  const tokens = buildOptions(mechanic);
  const zones = buildBucketZones(mechanic);
  const [selectedToken, setSelectedToken] = useState(tokens[0] ?? "Signal");
  const [placements, setPlacements] = useState<Record<string, string>>(() => ({
    [tokens[1] ?? "Context"]: zones[1] ?? zones[0]
  }));

  const placeToken = (zone: string) => {
    setPlacements((current) => ({ ...current, [selectedToken]: zone }));
  };

  return (
    <View style={styles.bucketBoard}>
      <View style={styles.bucketTokenTray}>
        {tokens.map((token) => {
          const active = selectedToken === token;
          return (
            <Pressable key={token} onPress={() => setSelectedToken(token)} style={({ pressed }) => [styles.bucketToken, active ? styles.bucketTokenActive : null, pressed ? styles.pressed : null]}>
              <Text selectable style={[styles.bucketTokenText, active ? styles.bucketTokenTextActive : null]}>
                {token}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text selectable style={styles.bucketHint}>
        Tap a token, then tap a bucket.
      </Text>

      <View style={styles.bucketZoneStack}>
        {zones.map((zone) => {
          const assigned = tokens.filter((token) => placements[token] === zone);
          const target = placements[selectedToken] === zone;
          return (
            <Pressable key={zone} onPress={() => placeToken(zone)} style={({ pressed }) => [styles.bucketZone, target ? styles.bucketZoneActive : null, pressed ? styles.pressed : null]}>
              <View style={styles.bucketZoneHeader}>
                <Text selectable style={[styles.bucketZoneTitle, target ? styles.bucketZoneTitleActive : null]}>
                  {zone}
                </Text>
                <Text selectable style={[styles.bucketZoneCount, target ? styles.bucketZoneCountActive : null]}>
                  {assigned.length}
                </Text>
              </View>
              <View style={styles.bucketAssignedRail}>
                {assigned.length ? (
                  assigned.map((token) => (
                    <View key={token} style={styles.bucketAssignedChip}>
                      <Text selectable style={styles.bucketAssignedText}>
                        {token}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text selectable style={styles.bucketEmptyText}>
                    Drop here
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SwipePreview({ mechanic }: { mechanic: InputMechanic }) {
  const option = buildOptions(mechanic)[0] ?? "Today";
  return (
    <View style={styles.swipeDeck}>
      <View style={styles.swipeBackCard} />
      <View style={styles.swipeCard}>
        <Text selectable style={styles.swipeTitle}>
          {option}
        </Text>
        <View style={styles.swipeActions}>
          <Text selectable style={styles.swipeNo}>
            No
          </Text>
          <Text selectable style={styles.swipeYes}>
            Save
          </Text>
        </View>
      </View>
    </View>
  );
}

function BranchPreview({ mechanic }: { mechanic: InputMechanic }) {
  const options = buildOptions(mechanic);
  return (
    <View style={styles.branchCard}>
      <View style={styles.branchNode}>
        <Text selectable style={styles.branchText}>
          {options[0]}
        </Text>
      </View>
      <View style={styles.branchSplit}>
        <View style={styles.branchLine} />
        <View style={styles.branchLine} />
      </View>
      <View style={styles.branchBottom}>
        <View style={styles.branchLeaf}>
          <Text selectable style={styles.branchLeafText}>
            {options[1]}
          </Text>
        </View>
        <View style={styles.branchLeaf}>
          <Text selectable style={styles.branchLeafText}>
            {options[2]}
          </Text>
        </View>
      </View>
    </View>
  );
}

function LocationPreview({ selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.locationGrid}>
      {["Home", "Work", "Outside", "Commute"].map((place) => (
        <Pressable key={place} onPress={() => onSelect(place)} style={({ pressed }) => [styles.locationChip, selected === place ? styles.locationChipActive : null, pressed ? styles.pressed : null]}>
          <Text selectable style={[styles.locationText, selected === place ? styles.locationTextActive : null]}>
            {place}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function PartnerPreview({ mechanic }: { mechanic: InputMechanic }) {
  const options = buildOptions(mechanic);
  return (
    <View style={styles.partnerRow}>
      <View style={styles.partnerCard}>
        <Text selectable style={styles.partnerLabel}>
          Me
        </Text>
        <Text selectable style={styles.partnerText}>
          {options[0]}
        </Text>
      </View>
      <View style={styles.partnerCard}>
        <Text selectable style={styles.partnerLabel}>
          Other
        </Text>
        <Text selectable style={styles.partnerText}>
          {options[1]}
        </Text>
      </View>
    </View>
  );
}

function AnonymousPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.anonymousCard}>
      <View style={styles.anonymousMask}>
        <Text selectable style={styles.anonymousMaskText}>
          --
        </Text>
      </View>
      <Text selectable style={styles.anonymousText}>
        Private pulse saved without profile labels.
      </Text>
    </View>
  );
}

function AvatarPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.avatarCard}>
      <View style={styles.avatarHead}>
        <View style={styles.avatarEye} />
        <View style={styles.avatarEye} />
      </View>
      <View style={styles.avatarTags}>
        {buildOptions(mechanic).map((option) => (
          <View key={option} style={styles.avatarTag}>
            <Text selectable style={styles.avatarTagText}>
              {option}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function StampPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.stampGrid}>
      {buildOptions(mechanic).map((option, index) => (
        <View key={option} style={[styles.stampCard, index === 0 ? styles.stampCardActive : null]}>
          <Check color={index === 0 ? "#FFFFFF" : colors.coral} size={17} strokeWidth={3} />
          <Text selectable style={[styles.stampText, index === 0 ? styles.stampTextActive : null]}>
            {option}
          </Text>
        </View>
      ))}
    </View>
  );
}

function TogglePreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  const on = selected !== "Off";
  return (
    <Pressable onPress={() => onSelect(on ? "Off" : "On")} style={({ pressed }) => [styles.toggleCard, pressed ? styles.pressed : null]}>
      <Text selectable style={styles.toggleLabel}>
        Today state
      </Text>
      <View style={[styles.toggleTrack, on ? styles.toggleTrackOn : null]}>
        <View style={[styles.toggleKnob, on ? styles.toggleKnobOn : null]} />
      </View>
    </Pressable>
  );
}

function TimerPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.timerCard}>
      <View style={styles.timerRing}>
        <Text selectable style={styles.timerText}>
          5:00
        </Text>
      </View>
      <Text selectable style={styles.timerLabel}>
        Tiny run armed
      </Text>
    </View>
  );
}

function RoutePreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.routeCard}>
      {buildOptions(mechanic).map((option, index) => (
        <View key={option} style={styles.routeNodeWrap}>
          <View style={[styles.routeNode, index === 1 ? styles.routeNodeActive : null]}>
            <Text selectable style={[styles.routeNodeText, index === 1 ? styles.routeNodeTextActive : null]}>
              {index + 1}
            </Text>
          </View>
          <Text selectable style={styles.routeText}>
            {option}
          </Text>
        </View>
      ))}
    </View>
  );
}

function buildBucketZones(mechanic: InputMechanic) {
  const text = `${mechanic.title} ${mechanic.pattern} ${mechanic.captures}`.toLowerCase();
  if (text.includes("triage") || text.includes("red flag")) return ["Normal", "Watch", "Urgent"];
  if (text.includes("pantry") || text.includes("expiry")) return ["Use today", "Soon", "Safe"];
  if (text.includes("risk")) return ["Input", "Risk", "Output"];
  return ["Now", "Watch", "Later"];
}

function JournalPreview({ note, onNote }: { note: string; onNote: (value: string) => void }) {
  return (
    <TextInput
      value={note}
      onChangeText={onNote}
      multiline
      placeholder="Write one honest line..."
      placeholderTextColor="#9397A0"
      style={styles.noteInput}
    />
  );
}

function BuilderPreview({ mechanic, chips, onChip, note, onNote }: { mechanic: InputMechanic; chips: string[]; onChip: (value: string) => void; note: string; onNote: (value: string) => void }) {
  return (
    <View style={styles.optionStack}>
      <View style={styles.wordBank}>
        {buildOptions(mechanic).map((chip) => {
          const active = chips.includes(chip);
          return (
            <Pressable key={chip} onPress={() => onChip(chip)} style={({ pressed }) => [styles.wordChip, active ? styles.wordChipActive : null, pressed ? styles.pressed : null]}>
              <Text selectable style={[styles.wordText, active ? styles.wordTextActive : null]}>
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        value={note}
        onChangeText={onNote}
        multiline
        placeholder="Add one short detail..."
        placeholderTextColor="#9397A0"
        style={styles.noteInput}
      />
    </View>
  );
}

function WordBuilderPreview({ mechanic, chips, onChip }: { mechanic: InputMechanic; chips: string[]; onChip: (value: string) => void }) {
  const words = buildOptions(mechanic);
  const active = chips.length ? chips : words.slice(0, 2);
  return (
    <View style={styles.wordBuilderCard}>
      <View style={styles.sentenceTray}>
        {active.map((word, index) => (
          <View key={`${word}-${index}`} style={styles.sentenceTile}>
            <Text selectable style={styles.sentenceText}>
              {word}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.wordBank}>
        {words.map((word) => {
          const selected = chips.includes(word);
          return (
            <Pressable key={word} onPress={() => onChip(word)} style={({ pressed }) => [styles.wordChip, selected ? styles.wordChipActive : null, pressed ? styles.pressed : null]}>
              <Text selectable style={[styles.wordText, selected ? styles.wordTextActive : null]}>
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SlotBuilderPreview({ mechanic, note, onNote }: { mechanic: InputMechanic; note: string; onNote: (value: string) => void }) {
  return (
    <View style={styles.slotCard}>
      <Text selectable style={styles.slotSentence}>
        Today I will protect my streak by{" "}
        <Text selectable style={styles.slotBlank}>
          {note || "_____"}
        </Text>
        .
      </Text>
      <TextInput value={note} onChangeText={onNote} placeholder="Fill the missing action..." placeholderTextColor="#9397A0" style={styles.slotInput} />
    </View>
  );
}

function StackBuilderPreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.stackBoard}>
      {buildOptions(mechanic).map((item, index) => (
        <View key={item} style={[styles.stackCard, { transform: [{ translateY: index * -2 }] }]}>
          <View style={styles.stackNumber}>
            <Text selectable style={styles.stackNumberText}>
              {index + 1}
            </Text>
          </View>
          <Text selectable style={styles.stackText}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function PlateBuilderPreview({ mechanic }: { mechanic: InputMechanic }) {
  const parts = buildOptions(mechanic);
  return (
    <View style={styles.plateCard}>
      <View style={styles.plateCircle}>
        {parts.map((part, index) => (
          <View key={part} style={[styles.plateSlice, index === 0 ? styles.plateSliceA : index === 1 ? styles.plateSliceB : styles.plateSliceC]}>
            <Text selectable style={styles.plateSliceText}>
              {part}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ScenarioPreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  const responses = ["Soft redirect", "Clear boundary", "Ask one question"];
  return (
    <View style={styles.scenarioCard}>
      <Text selectable style={styles.scenarioPrompt}>
        A tense moment starts. Choose the next response.
      </Text>
      {responses.map((response) => (
        <Pressable key={response} onPress={() => onSelect(response)} style={({ pressed }) => [styles.scenarioOption, selected === response ? styles.scenarioOptionActive : null, pressed ? styles.pressed : null]}>
          <Text selectable style={[styles.scenarioText, selected === response ? styles.scenarioTextActive : null]}>
            {response}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function QuestionCardsPreview({ mechanic, chips, onChip }: { mechanic: InputMechanic; chips: string[]; onChip: (value: string) => void }) {
  const questions = ["What matters?", "What changed?", "What should I ask?"];
  return (
    <View style={styles.questionGrid}>
      {questions.map((question) => {
        const active = chips.includes(question);
        return (
          <Pressable key={question} onPress={() => onChip(question)} style={({ pressed }) => [styles.questionCard, active ? styles.questionCardActive : null, pressed ? styles.pressed : null]}>
            <Text selectable style={[styles.questionText, active ? styles.questionTextActive : null]}>
              {question}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ScriptBuilderPreview({ mechanic, chips, onChip }: { mechanic: InputMechanic; chips: string[]; onChip: (value: string) => void }) {
  const tiles = ["I need", "more time", "without pressure"];
  return (
    <View style={styles.scriptCard}>
      <View style={styles.scriptLine}>
        {tiles.map((tile) => (
          <Pressable key={tile} onPress={() => onChip(tile)} style={({ pressed }) => [styles.scriptTile, chips.includes(tile) ? styles.scriptTileActive : null, pressed ? styles.pressed : null]}>
            <Text selectable style={[styles.scriptTileText, chips.includes(tile) ? styles.scriptTileTextActive : null]}>
              {tile}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text selectable style={styles.scriptPreviewText}>
        I need more time without pressure.
      </Text>
    </View>
  );
}

function NextActionPreview({ note, onNote }: { mechanic: InputMechanic; note: string; onNote: (value: string) => void }) {
  return (
    <View style={styles.nextActionCard}>
      <Text selectable style={styles.nextActionLabel}>
        One tiny action
      </Text>
      <TextInput value={note} onChangeText={onNote} placeholder="Open the doc for 2 minutes" placeholderTextColor="#9397A0" style={styles.nextActionInput} />
      <View style={styles.nextActionMeta}>
        <Text selectable style={styles.nextActionMetaText}>
          5 min
        </Text>
        <Text selectable style={styles.nextActionMetaText}>
          shield ready
        </Text>
      </View>
    </View>
  );
}

function SortPreview({ mechanic }: { mechanic: InputMechanic }) {
  const zones = ["Input", "Risk", "Output"];
  const options = buildOptions(mechanic);
  return (
    <View style={styles.optionStack}>
      {zones.map((zone, index) => (
        <View key={zone} style={styles.zoneCard}>
          <Text selectable style={styles.zoneLabel}>
            {zone}
          </Text>
          <Text selectable style={styles.zoneValue}>
            {options[index] ?? mechanic.title}
          </Text>
        </View>
      ))}
    </View>
  );
}

function RadarPreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  const axes = buildOptions(mechanic);
  const active = selected === "Today" ? axes[1] ?? axes[0] : selected;
  return (
    <View style={styles.radarCard}>
      <View style={styles.radarWeb}>
        <View style={styles.radarRingOuter} />
        <View style={styles.radarRingMid} />
        <View style={styles.radarRingInner} />
        <View style={styles.radarAxisVertical} />
        <View style={styles.radarAxisHorizontal} />
        {axes.map((axis, index) => {
          const isActive = active === axis;
          return (
            <Pressable key={axis} onPress={() => onSelect(axis)} style={({ pressed }) => [styles.radarHotspot, radarHotspotPositions[index] ?? radarHotspotPositions[0], isActive ? styles.radarHotspotActive : null, pressed ? styles.pressed : null]}>
              <Text selectable style={[styles.radarHotspotText, isActive ? styles.radarHotspotTextActive : null]}>
                {index + 1}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.radarLegend}>
        {axes.map((axis) => (
          <Pressable key={axis} onPress={() => onSelect(axis)} style={({ pressed }) => [styles.radarLegendChip, active === axis ? styles.radarLegendChipActive : null, pressed ? styles.pressed : null]}>
            <Text selectable style={[styles.radarLegendText, active === axis ? styles.radarLegendTextActive : null]}>
              {axis}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const radarHotspotPositions = [
  { left: "47%", top: 12 },
  { right: 28, top: "48%" },
  { bottom: 18, left: "24%" }
] as const;

function ScalePreview({ mechanic }: { mechanic: InputMechanic }) {
  const initial = Math.max(1, Math.min(7, mechanic.number % 5 + 3));
  const [value, setValue] = useState(initial);
  const trackWidth = useRef(1);
  const updateFromX = (x: number) => {
    const clampedX = Math.max(0, Math.min(trackWidth.current, x));
    setValue(Math.max(1, Math.min(7, Math.round((clampedX / trackWidth.current) * 6) + 1)));
  };
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (event) => updateFromX(event.nativeEvent.locationX),
        onPanResponderMove: (event) => updateFromX(event.nativeEvent.locationX)
      }),
    []
  );
  return (
    <View style={styles.scaleCard}>
      <View
        style={styles.scaleTrack}
        onLayout={(event) => {
          trackWidth.current = Math.max(1, event.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.scaleFillRow}>
          <View style={[styles.scaleFill, { flex: value }]} />
          <View style={{ flex: Math.max(0, 7 - value) }} />
        </View>
        <View style={styles.scaleKnobRow}>
          <View style={{ flex: Math.max(0, value - 0.5) }} />
          <View style={styles.scaleKnob} />
          <View style={{ flex: Math.max(0, 7.5 - value) }} />
        </View>
        <View style={styles.scaleTapRow}>
          {Array.from({ length: 7 }).map((_, index) => (
            <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Set scale to ${index + 1}`} onPress={() => setValue(index + 1)} style={styles.scaleTapTarget} />
          ))}
        </View>
      </View>
      <View style={styles.scaleLabels}>
        <Text selectable style={styles.scaleText}>
          Low
        </Text>
        <Text selectable style={styles.scaleValue}>
          {value}/7
        </Text>
        <Text selectable style={styles.scaleText}>
          High
        </Text>
      </View>
    </View>
  );
}

function MediaPreview({ mechanic, selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.mediaGrid}>
      {["Photo", "Detail", "Context"].map((item) => (
        <Pressable key={item} onPress={() => onSelect(item)} style={({ pressed }) => [styles.mediaTile, selected === item ? styles.mediaTileActive : null, pressed ? styles.pressed : null]}>
          <ImageIcon color={selected === item ? "#FFFFFF" : colors.blue} size={23} strokeWidth={3} />
          <Text selectable style={[styles.mediaText, selected === item ? styles.mediaTextActive : null]}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function VoicePreview({ selected, onSelect }: { mechanic: InputMechanic; selected: string; onSelect: (value: string) => void }) {
  return (
    <View style={styles.optionStack}>
      <View style={styles.waveCard}>
        {[18, 34, 26, 46, 32, 54, 28, 40].map((height, index) => (
          <View key={index} style={[styles.waveBar, { height }]} />
        ))}
      </View>
      <ChoicePreview mechanic={{} as InputMechanic} selected={selected} onSelect={onSelect} />
    </View>
  );
}

function InfoCard({ title, body, icon: Icon, tone }: { title: string; body: string; icon: LucideIcon; tone: "purple" | "coral" }) {
  const accent = tone === "purple" ? colors.purple : colors.coral;
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: accent }]}>
        <Icon color="#FFFFFF" size={18} strokeWidth={3} />
      </View>
      <Text selectable style={styles.infoTitle}>
        {title}
      </Text>
      <Text selectable style={styles.infoBody}>
        {body}
      </Text>
    </View>
  );
}

function TimingPill({ timing }: { timing: AiTiming }) {
  return (
    <View style={styles.timingPill}>
      <Sparkles color={colors.purple} size={14} strokeWidth={3} />
      <Text selectable style={styles.timingPillText}>
        {timingCopy[timing].title}
      </Text>
    </View>
  );
}

function MechanicsBottomNav() {
  const router = useRouter();

  return (
    <View style={styles.navOuter}>
      <BlurView intensity={64} tint="light" style={styles.navBlur}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable key={item.label} accessibilityRole="button" accessibilityLabel={item.label} onPress={() => router.push(item.href)} style={({ pressed }) => [styles.navButton, pressed ? styles.pressed : null]}>
              <Icon color="rgba(112,115,122,0.78)" size={item.size} strokeWidth={2.4} />
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

function getExampleMode(mechanic: InputMechanic) {
  return getMechanicPreviewMode(mechanic);
}

function buildPrompt(mechanic: InputMechanic) {
  const fit = mechanic.projectFits[0] ?? "this app";
  return `Example for ${fit}: collect ${mechanic.captures} with ${mechanic.pattern.toLowerCase()}.`;
}

function buildOptions(mechanic: Partial<InputMechanic>) {
  return buildMechanicOptions(mechanic);
}

function buildMultiOptions(mechanic: InputMechanic) {
  return buildMechanicMultiOptions(mechanic);
}

function buildSampleValue(mechanic: InputMechanic) {
  return buildMechanicSampleValue(mechanic);
}

const styles = StyleSheet.create({
  topBar: {
    alignItems: "flex-start"
  },
  heroPanel: {
    backgroundColor: "#F6FAFF",
    borderColor: "#D7E7FF",
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    gap: 12,
    padding: 18,
    boxShadow: "0 22px 48px rgba(36, 123, 255, 0.13)"
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  numberBadge: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  numberText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900"
  },
  timingPill: {
    alignItems: "center",
    backgroundColor: colors.purpleSoft,
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  timingPillText: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13
  },
  heroTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 34
  },
  heroBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 21
  },
  captureStrip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    flexDirection: "row",
    gap: 8,
    padding: 12
  },
  captureStripText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  exampleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 34,
    borderCurve: "continuous",
    gap: 15,
    padding: 16,
    boxShadow: "0 20px 46px rgba(16,17,22,0.10)"
  },
  exampleHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  exampleIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 24,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  exampleTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 23
  },
  exampleBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  optionStack: {
    gap: 11
  },
  matchGrid: {
    flexDirection: "row",
    gap: 10
  },
  matchColumn: {
    flex: 1,
    gap: 9
  },
  matchTile: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 21,
    borderWidth: 2,
    minHeight: 49,
    justifyContent: "center",
    paddingHorizontal: 12,
    boxShadow: "0 5px 0 rgba(216,223,232,0.86)"
  },
  matchTileActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    boxShadow: "0 5px 0 rgba(24,93,205,0.85)"
  },
  matchText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 16
  },
  matchTextActive: {
    color: "#FFFFFF"
  },
  listenCard: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 28,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    minHeight: 92,
    padding: 14
  },
  listenBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 13
  },
  pictureGrid: {
    flexDirection: "row",
    gap: 9
  },
  pictureTile: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 24,
    borderWidth: 2,
    flex: 1,
    gap: 8,
    minHeight: 104,
    justifyContent: "center",
    padding: 10
  },
  pictureTileActive: {
    borderColor: colors.blue
  },
  pictureBlob: {
    borderRadius: 20,
    height: 40,
    width: 40
  },
  pictureText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    textAlign: "center"
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    padding: 4
  },
  calendarCell: {
    backgroundColor: "#EDF2F8",
    borderRadius: 10,
    height: 34,
    width: "12.7%"
  },
  calendarCellWarm: {
    backgroundColor: colors.goldSoft
  },
  calendarCellHot: {
    backgroundColor: colors.coral
  },
  bodyMapCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 30,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  bodyPart: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 24,
    borderWidth: 2,
    minHeight: 48,
    justifyContent: "center"
  },
  bodyPartActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  bodyPartText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900"
  },
  bodyPartTextActive: {
    color: "#FFFFFF"
  },
  rankRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 24,
    borderWidth: 2,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 13,
    boxShadow: "0 5px 0 rgba(216,223,232,0.86)"
  },
  rankNumber: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  rankNumberText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  rankText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 16,
    fontWeight: "900"
  },
  bucketBoard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderCurve: "continuous",
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  bucketTokenTray: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  bucketToken: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 22,
    borderWidth: 2,
    paddingHorizontal: 13,
    paddingVertical: 10,
    boxShadow: "0 5px 0 rgba(216,223,232,0.9)"
  },
  bucketTokenActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    boxShadow: "0 5px 0 rgba(24,93,205,0.9)"
  },
  bucketTokenText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 16
  },
  bucketTokenTextActive: {
    color: "#FFFFFF"
  },
  bucketHint: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15
  },
  bucketZoneStack: {
    gap: 10
  },
  bucketZone: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 25,
    borderWidth: 2,
    gap: 10,
    minHeight: 92,
    padding: 13
  },
  bucketZoneActive: {
    backgroundColor: "#ECFFF7",
    borderColor: colors.green
  },
  bucketZoneHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bucketZoneTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 19
  },
  bucketZoneTitleActive: {
    color: colors.green
  },
  bucketZoneCount: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  bucketZoneCountActive: {
    color: colors.green
  },
  bucketAssignedRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  bucketAssignedChip: {
    backgroundColor: colors.green,
    borderRadius: 17,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  bucketAssignedText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14
  },
  bucketEmptyText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16
  },
  swipeDeck: {
    minHeight: 158,
    position: "relative"
  },
  swipeBackCard: {
    backgroundColor: colors.purpleSoft,
    borderRadius: 30,
    height: 132,
    left: 20,
    position: "absolute",
    right: 20,
    top: 16,
    transform: [{ rotate: "5deg" }]
  },
  swipeCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 30,
    borderWidth: 2,
    gap: 24,
    minHeight: 132,
    padding: 18,
    transform: [{ rotate: "-3deg" }],
    boxShadow: "0 8px 0 rgba(216,223,232,0.86)"
  },
  swipeTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 29
  },
  swipeActions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  swipeNo: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900"
  },
  swipeYes: {
    color: colors.green,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900"
  },
  branchCard: {
    alignItems: "center",
    gap: 7
  },
  branchNode: {
    backgroundColor: colors.blue,
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  branchText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900"
  },
  branchSplit: {
    flexDirection: "row",
    gap: 42
  },
  branchLine: {
    backgroundColor: "#DDEBFF",
    borderRadius: 3,
    height: 26,
    width: 6
  },
  branchBottom: {
    flexDirection: "row",
    gap: 9
  },
  branchLeaf: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 22,
    borderWidth: 2,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  branchLeafText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  locationChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 23,
    borderWidth: 2,
    minWidth: "47%",
    paddingHorizontal: 14,
    paddingVertical: 13
  },
  locationChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green
  },
  locationText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center"
  },
  locationTextActive: {
    color: "#FFFFFF"
  },
  partnerRow: {
    flexDirection: "row",
    gap: 10
  },
  partnerCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 26,
    borderWidth: 2,
    flex: 1,
    gap: 8,
    minHeight: 108,
    padding: 13
  },
  partnerLabel: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  partnerText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18
  },
  anonymousCard: {
    alignItems: "center",
    backgroundColor: colors.purpleSoft,
    borderRadius: 28,
    flexDirection: "row",
    gap: 13,
    padding: 15
  },
  anonymousMask: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  anonymousMaskText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900"
  },
  anonymousText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  avatarCard: {
    alignItems: "center",
    backgroundColor: "#FFF4EC",
    borderRadius: 30,
    gap: 14,
    padding: 16
  },
  avatarHead: {
    alignItems: "center",
    backgroundColor: colors.coral,
    borderRadius: 34,
    flexDirection: "row",
    gap: 10,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  avatarEye: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    height: 12,
    width: 12
  },
  avatarTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  avatarTag: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  avatarTagText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900"
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  stampCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFE0D2",
    borderRadius: 24,
    borderWidth: 2,
    flexDirection: "row",
    gap: 7,
    minHeight: 52,
    paddingHorizontal: 13
  },
  stampCardActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  stampText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  stampTextActive: {
    color: "#FFFFFF"
  },
  toggleCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 28,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 78,
    padding: 15
  },
  toggleLabel: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900"
  },
  toggleTrack: {
    backgroundColor: "#D8DFE8",
    borderRadius: 22,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 4,
    width: 74
  },
  toggleTrackOn: {
    backgroundColor: colors.green
  },
  toggleKnob: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    height: 34,
    width: 34
  },
  toggleKnobOn: {
    alignSelf: "flex-end"
  },
  timerCard: {
    alignItems: "center",
    backgroundColor: "#F6FAFF",
    borderRadius: 30,
    gap: 10,
    padding: 18
  },
  timerRing: {
    alignItems: "center",
    borderColor: colors.blue,
    borderRadius: 50,
    borderWidth: 9,
    height: 100,
    justifyContent: "center",
    width: 100
  },
  timerText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 24,
    fontWeight: "900"
  },
  timerLabel: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900"
  },
  routeCard: {
    flexDirection: "row",
    gap: 9,
    justifyContent: "space-between"
  },
  routeNodeWrap: {
    alignItems: "center",
    flex: 1,
    gap: 8
  },
  routeNode: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  routeNodeActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  routeNodeText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17,
    fontWeight: "900"
  },
  routeNodeTextActive: {
    color: "#FFFFFF"
  },
  routeText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 13,
    textAlign: "center"
  },
  multiPickCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderCurve: "continuous",
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  multiPickHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  multiPickTitle: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20
  },
  multiPickCount: {
    backgroundColor: colors.purpleSoft,
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 7
  },
  multiPickCountText: {
    color: colors.purple,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13
  },
  multiChipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  multiChip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 22,
    borderWidth: 2,
    flexDirection: "row",
    gap: 7,
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 10,
    boxShadow: "0 6px 0 rgba(216,223,232,0.9)"
  },
  multiChipActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    boxShadow: "0 6px 0 rgba(24,93,205,0.9)"
  },
  multiChipText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17
  },
  multiChipTextActive: {
    color: "#FFFFFF"
  },
  duoShell: {
    backgroundColor: "#D8DFE8",
    borderRadius: 27,
    minHeight: 62,
    paddingBottom: 5
  },
  duoShellActive: {
    backgroundColor: "#B8D2FF"
  },
  duoFace: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EDF4",
    borderRadius: 27,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 57,
    paddingHorizontal: 17
  },
  duoFaceActive: {
    backgroundColor: "#F6FAFF",
    borderColor: colors.blue
  },
  duoText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20
  },
  duoTextActive: {
    color: colors.blue
  },
  wordBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  wordChip: {
    backgroundColor: "#F3F6FA",
    borderColor: "#E2E8F0",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  wordChipActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  wordText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900"
  },
  wordTextActive: {
    color: "#FFFFFF"
  },
  noteInput: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 24,
    borderWidth: 2,
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
    minHeight: 96,
    padding: 14,
    textAlignVertical: "top"
  },
  wordBuilderCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 14
  },
  sentenceTray: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 24,
    borderWidth: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 68,
    padding: 10
  },
  sentenceTile: {
    backgroundColor: colors.blue,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  sentenceText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  slotCard: {
    backgroundColor: "#FFF4EC",
    borderRadius: 28,
    gap: 12,
    padding: 15
  },
  slotSentence: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 27
  },
  slotBlank: {
    color: colors.coral
  },
  slotInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFE0D2",
    borderRadius: 22,
    borderWidth: 2,
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 15,
    minHeight: 54,
    paddingHorizontal: 13
  },
  stackBoard: {
    gap: 0,
    paddingTop: 4
  },
  stackCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 25,
    borderWidth: 2,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 13,
    boxShadow: "0 6px 0 rgba(216,223,232,0.88)"
  },
  stackNumber: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  stackNumberText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  stackText: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 16,
    fontWeight: "900"
  },
  plateCard: {
    alignItems: "center",
    backgroundColor: "#FFF4EC",
    borderRadius: 30,
    padding: 16
  },
  plateCircle: {
    borderColor: "#FFFFFF",
    borderRadius: 76,
    borderWidth: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 152,
    overflow: "hidden",
    width: 152
  },
  plateSlice: {
    alignItems: "center",
    height: 76,
    justifyContent: "center",
    padding: 5,
    width: 76
  },
  plateSliceA: {
    backgroundColor: colors.green
  },
  plateSliceB: {
    backgroundColor: colors.gold
  },
  plateSliceC: {
    backgroundColor: colors.coral,
    width: 152
  },
  plateSliceText: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center"
  },
  scenarioCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 28,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  scenarioPrompt: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
  },
  scenarioOption: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 22,
    borderWidth: 2,
    padding: 13
  },
  scenarioOptionActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  scenarioText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900"
  },
  scenarioTextActive: {
    color: "#FFFFFF"
  },
  questionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 24,
    borderWidth: 2,
    flexGrow: 1,
    minHeight: 74,
    minWidth: "47%",
    padding: 13,
    justifyContent: "center"
  },
  questionCardActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple
  },
  questionText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18
  },
  questionTextActive: {
    color: "#FFFFFF"
  },
  scriptCard: {
    backgroundColor: "#FFF4EC",
    borderRadius: 28,
    gap: 13,
    padding: 14
  },
  scriptLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  scriptTile: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFE0D2",
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 11,
    paddingVertical: 9
  },
  scriptTileActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  scriptTileText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  scriptTileTextActive: {
    color: "#FFFFFF"
  },
  scriptPreviewText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25
  },
  nextActionCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 28,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  nextActionLabel: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  nextActionInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DDEBFF",
    borderRadius: 24,
    borderWidth: 2,
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17,
    minHeight: 62,
    paddingHorizontal: 14
  },
  nextActionMeta: {
    flexDirection: "row",
    gap: 8
  },
  nextActionMetaText: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  zoneCard: {
    backgroundColor: "#ECFFF7",
    borderColor: colors.green,
    borderRadius: 24,
    borderWidth: 2,
    padding: 14
  },
  zoneLabel: {
    color: colors.textMuted,
    fontFamily: fonts.black,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13,
    textTransform: "uppercase"
  },
  zoneValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
    marginTop: 5
  },
  radarCard: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderCurve: "continuous",
    borderRadius: 30,
    borderWidth: 1,
    gap: 13,
    padding: 16
  },
  radarWeb: {
    alignSelf: "center",
    height: 184,
    position: "relative",
    width: 184
  },
  radarRingOuter: {
    borderColor: "rgba(36,123,255,0.22)",
    borderRadius: 92,
    borderWidth: 2,
    height: 184,
    position: "absolute",
    width: 184
  },
  radarRingMid: {
    borderColor: "rgba(36,123,255,0.24)",
    borderRadius: 62,
    borderWidth: 2,
    height: 124,
    left: 30,
    position: "absolute",
    top: 30,
    width: 124
  },
  radarRingInner: {
    backgroundColor: "rgba(36,123,255,0.08)",
    borderColor: "rgba(36,123,255,0.24)",
    borderRadius: 34,
    borderWidth: 2,
    height: 68,
    left: 58,
    position: "absolute",
    top: 58,
    width: 68
  },
  radarAxisVertical: {
    backgroundColor: "rgba(36,123,255,0.18)",
    height: 184,
    left: 91,
    position: "absolute",
    top: 0,
    width: 2
  },
  radarAxisHorizontal: {
    backgroundColor: "rgba(36,123,255,0.18)",
    height: 2,
    left: 0,
    position: "absolute",
    top: 91,
    width: 184
  },
  radarHotspot: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DDEBFF",
    borderRadius: 19,
    borderWidth: 3,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    width: 38,
    boxShadow: "0 6px 0 rgba(216,223,232,0.9)"
  },
  radarHotspotActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
    boxShadow: "0 6px 0 rgba(209,73,31,0.85)"
  },
  radarHotspotText: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  radarHotspotTextActive: {
    color: "#FFFFFF"
  },
  radarLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  radarLegendChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E8F2",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  radarLegendChipActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  radarLegendText: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 14
  },
  radarLegendTextActive: {
    color: "#FFFFFF"
  },
  scaleCard: {
    backgroundColor: "#FFF4EC",
    borderRadius: 28,
    gap: 12,
    padding: 16
  },
  scaleTrack: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    height: 18,
    justifyContent: "center",
    overflow: "visible",
    position: "relative"
  },
  scaleFillRow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    flexDirection: "row",
    overflow: "hidden"
  },
  scaleFill: {
    backgroundColor: colors.coral,
    borderRadius: 18,
    height: 18
  },
  scaleKnobRow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    flexDirection: "row"
  },
  scaleKnob: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.coral,
    borderRadius: 18,
    borderWidth: 4,
    height: 34,
    width: 34
  },
  scaleTapRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row"
  },
  scaleTapTarget: {
    flex: 1,
    minHeight: 44
  },
  scaleLabels: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  scaleText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700"
  },
  scaleValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 20,
    fontWeight: "900"
  },
  mediaGrid: {
    flexDirection: "row",
    gap: 9
  },
  mediaTile: {
    alignItems: "center",
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF",
    borderRadius: 24,
    borderWidth: 2,
    flex: 1,
    gap: 8,
    minHeight: 100,
    justifyContent: "center"
  },
  mediaTileActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  mediaText: {
    color: colors.blue,
    fontFamily: fonts.black,
    fontSize: 13,
    fontWeight: "900"
  },
  mediaTextActive: {
    color: "#FFFFFF"
  },
  waveCard: {
    alignItems: "center",
    backgroundColor: colors.purple,
    borderRadius: 28,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 118,
    padding: 16
  },
  waveBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 12
  },
  savedBar: {
    alignItems: "center",
    backgroundColor: colors.green,
    borderRadius: 22,
    flexDirection: "row",
    gap: 8,
    padding: 12
  },
  savedText: {
    color: "#FFFFFF",
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17
  },
  infoGrid: {
    gap: 12
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    gap: 8,
    padding: 15,
    boxShadow: "0 18px 38px rgba(16,17,22,0.08)"
  },
  infoIcon: {
    alignItems: "center",
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  infoTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 21
  },
  infoBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19
  },
  payloadCard: {
    backgroundColor: colors.ink,
    borderRadius: 28,
    gap: 10,
    padding: 16
  },
  payloadTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 25
  },
  payloadText: {
    color: "#FFFFFF",
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17
  },
  fitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    gap: 12,
    padding: 16,
    boxShadow: "0 18px 38px rgba(16,17,22,0.08)"
  },
  fitRail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  fitChip: {
    backgroundColor: "#FFF3EC",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  fitText: {
    color: colors.coral,
    fontFamily: fonts.black,
    fontSize: 12,
    fontWeight: "900"
  },
  nextCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    boxShadow: "0 18px 38px rgba(36,123,255,0.10)"
  },
  nextIcon: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 22,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  nextLabel: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  nextTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20
  },
  navOuter: {
    alignSelf: "center",
    maxWidth: 380,
    width: "100%"
  },
  navBlur: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "rgba(255,255,255,0.92)",
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    boxShadow: "0 18px 42px rgba(36, 123, 255, 0.14)",
    flexDirection: "row",
    height: 64,
    justifyContent: "space-around",
    overflow: "hidden"
  },
  navButton: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    width: 58
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  }
});
