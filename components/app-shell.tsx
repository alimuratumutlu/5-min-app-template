import type { ComponentType, ReactNode } from "react";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  type LucideIcon
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userProgress } from "@/lib/template-data";

export const colors = {
  background: "#FFFFFF",
  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceRaised: "#FFF8F1",
  ink: "#18191C",
  text: "#17171B",
  textMuted: "#70737A",
  border: "#F0E8DF",
  blue: "#247BFF",
  blueSoft: "#E7F0FF",
  green: "#00C985",
  greenSoft: "#DDFCED",
  purple: "#875CFF",
  purpleSoft: "#F0EAFF",
  coral: "#FF6F3D",
  coralSoft: "#FFE6D8",
  gold: "#FFB800",
  goldSoft: "#FFF2C2",
  danger: "#D92D20"
};

type AppScreenProps = {
  title: string;
  subtitle?: string;
  activeDomain?: string;
  children: ReactNode;
  footer?: ReactNode;
};

type CardProps = {
  children: ReactNode;
  tone?: "default" | "blue" | "green" | "purple" | "coral" | "gold";
  style?: ViewStyle;
  onPress?: () => void;
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  icon?: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  disabled?: boolean;
  fullWidth?: boolean;
};

type MetricProps = {
  label: string;
  value: string;
  delta?: string;
  tone?: "blue" | "green" | "purple" | "coral" | "gold";
};

export function AppScreen({ title, subtitle, activeDomain = "Template", children, footer }: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <AppHeader title={title} subtitle={subtitle} activeDomain={activeDomain} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, footer ? styles.scrollWithFooter : null]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function ScreenScaffold(props: AppScreenProps) {
  return <AppScreen {...props} />;
}

export function AppHeader({ title, subtitle, activeDomain }: { title: string; subtitle?: string; activeDomain: string }) {
  return (
    <View style={styles.headerFrame}>
      <BlurView intensity={62} tint="light" style={styles.headerBlur}>
        <View style={styles.headerContent}>
          <View style={styles.logoMark}>
            <Sparkles color={colors.blue} size={18} strokeWidth={2.8} />
          </View>
          <View style={styles.headerCopy}>
            <Text selectable style={styles.eyebrow}>
              {activeDomain}
            </Text>
            <Text selectable numberOfLines={1} style={styles.headerTitle}>
              {title}
            </Text>
            {subtitle ? (
              <Text selectable numberOfLines={1} style={styles.headerSubtitle}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={styles.levelPill}>
            <Star color={colors.gold} size={13} fill={colors.gold} />
            <Text selectable style={styles.levelText}>
              {userProgress.level}
            </Text>
            <Text selectable style={styles.points}>
              {userProgress.points} pts
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

export function Card({ children, tone = "default", style, onPress }: CardProps) {
  const body = <View style={[styles.card, toneStyles[tone], style]}>{children}</View>;
  if (!onPress) return body;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed ? styles.pressed : null]}>
      {body}
    </Pressable>
  );
}

export function Button({ label, onPress, variant = "primary", icon: Icon = ArrowRight, disabled, fullWidth }: ButtonProps) {
  const isPrimary = variant === "primary" || variant === "danger";
  const iconColor = isPrimary ? "#FFFFFF" : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonStyles[variant],
        fullWidth ? styles.fullWidth : null,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null
      ]}
    >
      <Text selectable style={[styles.buttonText, isPrimary ? styles.buttonTextLight : styles.buttonTextDark]}>
        {label}
      </Text>
      <Icon color={iconColor} size={17} strokeWidth={2.6} />
    </Pressable>
  );
}

export function IconButton({
  icon: Icon,
  label,
  onPress,
  tone = "blue"
}: {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  tone?: "blue" | "green" | "purple" | "coral" | "gold" | "dark";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, tone === "dark" ? styles.darkIconButton : toneStyles[tone], pressed ? styles.pressed : null]}
    >
      <Icon color={tone === "dark" ? "#FFFFFF" : accentByTone[tone]} size={19} strokeWidth={2.7} />
    </Pressable>
  );
}

export function Metric({ label, value, delta, tone = "blue" }: MetricProps) {
  return (
    <Card tone={tone} style={styles.metricCard}>
      <Text selectable style={styles.metricValue}>
        {value}
      </Text>
      <Text selectable style={styles.metricLabel}>
        {label}
      </Text>
      {delta ? (
        <Text selectable style={[styles.metricDelta, { color: accentByTone[tone] }]}>
          {delta}
        </Text>
      ) : null}
    </Card>
  );
}

export function ProgressStatus({ value, label, tone = "blue" }: { value: number; label: string; tone?: keyof typeof accentByTone }) {
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressHeader}>
        <Text selectable style={styles.progressLabel}>
          {label}
        </Text>
        <Text selectable style={styles.progressValue}>
          {value}%
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(8, Math.min(100, value))}%`, backgroundColor: accentByTone[tone] }]} />
      </View>
    </View>
  );
}

export function DomainCarousel({
  items,
  selectedId,
  onSelect
}: {
  items: Array<{ id: string; title: string; body: string; accent: string; softAccent: string; imageUrl: string; category: string; icon: LucideIcon }>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContent}
      contentInsetAdjustmentBehavior="automatic"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const selected = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => [
              styles.carouselCard,
              { borderColor: selected ? item.accent : colors.border },
              pressed ? styles.pressed : null
            ]}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} contentFit="cover" />
            <View style={styles.carouselScrim} />
            <View style={[styles.carouselIcon, { backgroundColor: item.softAccent }]}>
              <Icon color={item.accent} size={18} strokeWidth={2.8} />
            </View>
            <Text selectable style={styles.carouselCategory}>
              {item.category}
            </Text>
            <Text selectable style={styles.carouselTitle}>
              {item.title}
            </Text>
            <Text selectable numberOfLines={2} style={styles.carouselBody}>
              {item.body}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function SearchPill({ placeholder = "Search templates" }: { placeholder?: string }) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchPill}>
        <Search color={colors.textMuted} size={18} strokeWidth={2.5} />
        <Text selectable style={styles.searchText}>
          {placeholder}
        </Text>
      </View>
      <IconButton icon={SlidersHorizontal} label="Filter template controls" tone="dark" />
    </View>
  );
}

export function PillSelector({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (item: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillSelector}>
      {items.map((item) => {
        const active = item === selected;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(item)}
            style={({ pressed }) => [styles.segmentPill, active ? styles.segmentPillActive : null, pressed ? styles.pressed : null]}
          >
            <Text selectable style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
              {item}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function HeroPoster({
  title,
  subtitle,
  imageUrl,
  accent,
  meta,
  onPress
}: {
  title: string;
  subtitle: string;
  imageUrl: string;
  accent: string;
  meta: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.heroPoster, pressed ? styles.pressed : null]}>
      <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="cover" />
      <LinearGradient colors={["rgba(255,255,255,0.02)", "rgba(14,12,18,0.66)"]} style={styles.heroOverlay} />
      <View style={[styles.heroBadge, { backgroundColor: accent }]}>
        <Sparkles color="#FFFFFF" size={14} strokeWidth={3} />
        <Text selectable style={styles.heroBadgeText}>
          {meta}
        </Text>
      </View>
      <View style={styles.heroCopy}>
        <Text selectable style={styles.heroTitle}>
          {title}
        </Text>
        <Text selectable numberOfLines={2} style={styles.heroSubtitle}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.heroAction}>
        <ArrowRight color={colors.ink} size={20} strokeWidth={3} />
      </View>
    </Pressable>
  );
}

export function CompactTile({
  title,
  body,
  tone = "blue",
  icon: Icon = Sparkles,
  onPress
}: {
  title: string;
  body: string;
  tone?: "blue" | "green" | "purple" | "coral" | "gold";
  icon?: LucideIcon;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.compactTile, toneStyles[tone], pressed ? styles.pressed : null]}>
      <Icon color={accentByTone[tone]} size={20} strokeWidth={2.8} />
      <Text selectable style={styles.compactTileTitle}>
        {title}
      </Text>
      <Text selectable numberOfLines={2} style={styles.compactTileBody}>
        {body}
      </Text>
    </Pressable>
  );
}

export function OnboardingFlow({
  current,
  onNext,
  onSkip
}: {
  current: { eyebrow: string; title: string; body: string; options: string[] };
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <LinearGradient colors={["#FFFFFF", "#FFF1E7", "#E9F2FF"]} style={styles.onboardingPanel}>
      <View style={styles.onboardingTop}>
        <Text selectable style={styles.eyebrow}>
          {current.eyebrow}
        </Text>
        <Pressable onPress={onSkip} accessibilityRole="button">
          <Text selectable style={styles.skipText}>
            Skip
          </Text>
        </Pressable>
      </View>
      <Text selectable style={styles.onboardingTitle}>
        {current.title}
      </Text>
      <Text selectable style={styles.body}>
        {current.body}
      </Text>
      <View style={styles.optionGrid}>
        {current.options.map((option, index) => (
          <View key={option} style={[styles.optionPill, index === 0 ? styles.optionPillActive : null]}>
            {index === 0 ? <Check color={colors.blue} size={14} strokeWidth={3} /> : null}
            <Text selectable style={styles.optionText}>
              {option}
            </Text>
          </View>
        ))}
      </View>
      <Button label="Continue" onPress={onNext} fullWidth />
    </LinearGradient>
  );
}

export function ListRow({
  title,
  body,
  meta,
  onPress
}: {
  title: string;
  body: string;
  meta?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.listRow, pressed ? styles.pressed : null]}>
      <View style={styles.listCopy}>
        <Text selectable style={styles.listTitle}>
          {title}
        </Text>
        <Text selectable numberOfLines={2} style={styles.listBody}>
          {body}
        </Text>
        {meta ? (
          <Text selectable style={styles.listMeta}>
            {meta}
          </Text>
        ) : null}
      </View>
      <ChevronRight color={colors.textMuted} size={18} />
    </Pressable>
  );
}

export function TabBarIcon({ icon: Icon, focused, color, size = 23 }: { icon: LucideIcon; focused: boolean; color: string; size?: number }) {
  return (
    <View style={[styles.tabIconWrap, focused ? styles.tabIconWrapFocused : null]}>
      <Icon color={focused ? colors.ink : color} size={size} strokeWidth={focused ? 3 : 2.4} />
    </View>
  );
}

export const textStyles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 23
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  small: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17
  }
});

const accentByTone = {
  blue: colors.blue,
  green: colors.green,
  purple: colors.purple,
  coral: colors.coral,
  gold: colors.gold
};

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  blue: {
    backgroundColor: colors.blueSoft,
    borderColor: "#BDD7FF"
  },
  green: {
    backgroundColor: colors.greenSoft,
    borderColor: "#A7F2D3"
  },
  purple: {
    backgroundColor: colors.purpleSoft,
    borderColor: "#D5C8FF"
  },
  coral: {
    backgroundColor: colors.coralSoft,
    borderColor: "#FFC2AA"
  },
  gold: {
    backgroundColor: colors.goldSoft,
    borderColor: "#FFE082"
  }
});

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.coral,
    borderColor: colors.coral
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  quiet: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF"
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger
  }
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 112
  },
  scrollWithFooter: {
    paddingBottom: 150
  },
  headerFrame: {
    paddingHorizontal: 12,
    paddingTop: 8
  },
  headerBlur: {
    borderRadius: 36,
    borderCurve: "continuous",
    borderColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.74)",
    overflow: "hidden",
    boxShadow: "0 18px 42px rgba(255, 111, 61, 0.13)"
  },
  headerContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 74,
    paddingHorizontal: 13,
    paddingVertical: 11
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: "#FFE1D3",
    borderRadius: 24,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  headerCopy: {
    flex: 1,
    gap: 2
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16
  },
  levelPill: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFE2B4",
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 6
  },
  levelText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 13
  },
  points: {
    color: colors.textMuted,
    fontSize: 10,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
    lineHeight: 12
  },
  footer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: 16,
    position: "absolute",
    right: 0
  },
  card: {
    borderRadius: 30,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: 12,
    padding: 15,
    boxShadow: "0 18px 36px rgba(36, 123, 255, 0.08)"
  },
  metricCard: {
    flex: 1,
    minWidth: 142
  },
  metricValue: {
    color: colors.text,
    fontSize: 28,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 33
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
    textTransform: "uppercase"
  },
  metricDelta: {
    fontSize: 12,
    fontWeight: "900"
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  button: {
    alignItems: "center",
    borderRadius: 28,
    borderCurve: "continuous",
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  buttonTextLight: {
    color: "#FFFFFF"
  },
  buttonTextDark: {
    color: colors.text
  },
  fullWidth: {
    width: "100%"
  },
  disabled: {
    opacity: 0.48
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }]
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  darkIconButton: {
    backgroundColor: colors.purple,
    borderColor: colors.purple
  },
  progressWrap: {
    gap: 8
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  progressLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  progressValue: {
    color: colors.textMuted,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    fontWeight: "800"
  },
  progressTrack: {
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
    height: 11,
    overflow: "hidden"
  },
  progressFill: {
    borderRadius: 12,
    height: "100%"
  },
  carouselContent: {
    gap: 12,
    paddingRight: 16
  },
  carouselCard: {
    borderRadius: 32,
    borderWidth: 1,
    gap: 9,
    height: 232,
    justifyContent: "flex-end",
    overflow: "hidden",
    padding: 14,
    width: 218
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject
  },
  carouselScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.22)"
  },
  carouselIcon: {
    alignItems: "center",
    borderRadius: 22,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 38
  },
  carouselCategory: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  carouselTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  },
  carouselBody: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 13,
    lineHeight: 18
  },
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  searchPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#F1E7DE",
    borderRadius: 30,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
    boxShadow: "0 16px 32px rgba(255, 111, 61, 0.09)"
  },
  searchText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  pillSelector: {
    gap: 8,
    paddingRight: 16
  },
  segmentPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 15
  },
  segmentPillActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: "#FFFFFF"
  },
  heroPoster: {
    backgroundColor: colors.ink,
    borderRadius: 38,
    borderCurve: "continuous",
    height: 312,
    overflow: "hidden",
    padding: 18,
    justifyContent: "space-between",
    boxShadow: "0 24px 48px rgba(255, 111, 61, 0.18)"
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject
  },
  heroBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 24,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  heroCopy: {
    gap: 7,
    maxWidth: "78%"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 20
  },
  heroAction: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    bottom: 18,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 18,
    width: 50
  },
  compactTile: {
    borderRadius: 30,
    borderWidth: 1,
    gap: 8,
    minHeight: 132,
    padding: 14,
    width: "48%"
  },
  compactTileTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  compactTileBody: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16
  },
  onboardingPanel: {
    borderColor: "#FFFFFF",
    borderRadius: 34,
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 16,
    boxShadow: "0 18px 38px rgba(135, 92, 255, 0.12)"
  },
  onboardingTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  onboardingTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 28
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800"
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  optionPill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  optionPillActive: {
    backgroundColor: colors.blueSoft,
    borderColor: "#BDD7FF"
  },
  optionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  listRow: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  listCopy: {
    flex: 1,
    gap: 3
  },
  listTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 19
  },
  listBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  },
  listMeta: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  tabIconWrap: {
    alignItems: "center",
    borderRadius: 26,
    height: 44,
    justifyContent: "center",
    width: 50
  },
  tabIconWrapFocused: {
    backgroundColor: "#FFE6D8",
    borderColor: "#FFC2AA",
    borderWidth: 1
  }
});
