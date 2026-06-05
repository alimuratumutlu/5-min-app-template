import type { ComponentType, ReactNode } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Check,
  ChevronRight,
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
  canvas: "#F5F7FB",
  surface: "#FFFFFF",
  surfaceRaised: "#F9FBFF",
  text: "#111827",
  textMuted: "#5F6B7A",
  border: "#DCE3EE",
  blue: "#3657FF",
  blueSoft: "#E7EBFF",
  green: "#00A676",
  greenSoft: "#DEF8EF",
  purple: "#8B5CF6",
  purpleSoft: "#EFE7FF",
  coral: "#FF6B4A",
  coralSoft: "#FFE9E2",
  gold: "#E0A100",
  goldSoft: "#FFF4CD",
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
  tone?: "blue" | "green" | "purple" | "coral" | "gold";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, toneStyles[tone], pressed ? styles.pressed : null]}
    >
      <Icon color={accentByTone[tone]} size={19} strokeWidth={2.7} />
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
  items: Array<{ id: string; title: string; body: string; accent: string; softAccent: string; icon: LucideIcon }>;
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
              { backgroundColor: selected ? item.softAccent : colors.surface, borderColor: selected ? item.accent : colors.border },
              pressed ? styles.pressed : null
            ]}
          >
            <View style={[styles.carouselIcon, { backgroundColor: item.softAccent }]}>
              <Icon color={item.accent} size={22} strokeWidth={2.8} />
            </View>
            <Text selectable style={styles.carouselTitle}>
              {item.title}
            </Text>
            <Text selectable style={styles.carouselBody}>
              {item.body}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
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
    <LinearGradient colors={["#FFFFFF", "#EEF3FF"]} style={styles.onboardingPanel}>
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
      <Icon color={focused ? colors.blue : color} size={size} strokeWidth={focused ? 3 : 2.4} />
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
    borderColor: "#BFC8FF"
  },
  green: {
    backgroundColor: colors.greenSoft,
    borderColor: "#B5EAD8"
  },
  purple: {
    backgroundColor: colors.purpleSoft,
    borderColor: "#D4C2FF"
  },
  coral: {
    backgroundColor: colors.coralSoft,
    borderColor: "#FFC3B4"
  },
  gold: {
    backgroundColor: colors.goldSoft,
    borderColor: "#F6DB83"
  }
});

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.blue,
    borderColor: colors.blue
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  quiet: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border
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
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 112
  },
  scrollWithFooter: {
    paddingBottom: 150
  },
  headerFrame: {
    paddingHorizontal: 14,
    paddingTop: 8
  },
  headerBlur: {
    borderRadius: 8,
    borderCurve: "continuous",
    borderColor: "rgba(54, 87, 255, 0.14)",
    borderWidth: 1,
    overflow: "hidden"
  },
  headerContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 68,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    minWidth: 82,
    paddingHorizontal: 8,
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
    borderRadius: 8,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: 11,
    padding: 14
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
    borderRadius: 8,
    borderCurve: "continuous",
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16
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
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
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
    backgroundColor: "#E8EDF5",
    borderRadius: 8,
    height: 10,
    overflow: "hidden"
  },
  progressFill: {
    borderRadius: 8,
    height: "100%"
  },
  carouselContent: {
    gap: 12,
    paddingRight: 16
  },
  carouselCard: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    minHeight: 174,
    padding: 13,
    width: 206
  },
  carouselIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  carouselTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20
  },
  carouselBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  },
  onboardingPanel: {
    borderColor: "#C9D4FF",
    borderRadius: 8,
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 15
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
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  optionPillActive: {
    backgroundColor: colors.blueSoft,
    borderColor: "#BFC8FF"
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
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 13
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
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 44
  },
  tabIconWrapFocused: {
    backgroundColor: colors.blueSoft,
    borderColor: "#BFC8FF",
    borderWidth: 1
  }
});
