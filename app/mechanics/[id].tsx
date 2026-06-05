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
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScreen, IconButton, colors, fonts, textStyles } from "@/components/app-shell";
import { getMechanic, inputMechanics, type AiTiming, type InputMechanic } from "@/lib/input-mechanics";

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
  const [chips, setChips] = useState<string[]>(["Energy"]);
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

      {mode === "sort" ? (
        <SortPreview mechanic={mechanic} />
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

function ScalePreview({ mechanic }: { mechanic: InputMechanic }) {
  return (
    <View style={styles.scaleCard}>
      <View style={styles.scaleTrack}>
        <View style={styles.scaleFill} />
        <View style={styles.scaleKnob} />
      </View>
      <View style={styles.scaleLabels}>
        <Text selectable style={styles.scaleText}>
          Low
        </Text>
        <Text selectable style={styles.scaleValue}>
          {mechanic.number % 5 + 3}/7
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
  const text = `${mechanic.title} ${mechanic.pattern} ${mechanic.captures}`.toLowerCase();
  if (text.includes("photo") || text.includes("scan") || text.includes("visual") || text.includes("image")) return "media";
  if (text.includes("voice") || text.includes("speak") || text.includes("pronunciation") || text.includes("audio")) return "voice";
  if (text.includes("sort") || text.includes("bucket") || text.includes("triage") || text.includes("slot")) return "sort";
  if (text.includes("slider") || text.includes("scale") || text.includes("meter") || text.includes("pulse")) return "scale";
  return "choice";
}

function buildPrompt(mechanic: InputMechanic) {
  const fit = mechanic.projectFits[0] ?? "this app";
  return `Example for ${fit}: collect ${mechanic.captures} with ${mechanic.pattern.toLowerCase()}.`;
}

function buildOptions(mechanic: Partial<InputMechanic>) {
  const source = mechanic.captures ?? "energy, focus, next action";
  const parts = source.split(",").map((part) => part.trim()).filter(Boolean);
  const options = parts.length >= 3 ? parts.slice(0, 3) : [...parts, "Energy", "Next action", "Context"];
  return Array.from(new Set(options)).slice(0, 3).map((item) => titleCase(item));
}

function buildSampleValue(mechanic: InputMechanic) {
  if (mechanic.effort === "rich") return "media-or-voice-capture-ready";
  if (mechanic.effort === "short") return buildOptions(mechanic).join(" + ");
  return buildOptions(mechanic)[0];
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
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
    overflow: "visible"
  },
  scaleFill: {
    backgroundColor: colors.coral,
    borderRadius: 18,
    height: 18,
    width: "68%"
  },
  scaleKnob: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.coral,
    borderRadius: 18,
    borderWidth: 4,
    height: 34,
    left: "63%",
    position: "absolute",
    width: 34
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
