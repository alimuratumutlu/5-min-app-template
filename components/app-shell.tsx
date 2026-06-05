import { useRef, type ComponentType, type ReactNode } from "react";
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
  Target,
  type LucideIcon
} from "lucide-react-native";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userProgress } from "@/lib/template-data";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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

export const fonts = {
  regular: "Urbanist_400Regular",
  medium: "Urbanist_500Medium",
  semibold: "Urbanist_600SemiBold",
  bold: "Urbanist_700Bold",
  extraBold: "Urbanist_800ExtraBold",
  black: "Urbanist_900Black"
};

type AppScreenProps = {
  title: string;
  subtitle?: string;
  activeDomain?: string;
  children: ReactNode;
  footer?: ReactNode;
  headerOverlay?: boolean;
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

type Tone = "blue" | "green" | "purple" | "coral" | "gold";

export function AppScreen({ title, subtitle, activeDomain = "Template", children, footer, headerOverlay = false }: AppScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <AppHeader title={title} subtitle={subtitle} activeDomain={activeDomain} scrollY={scrollY} overlay={headerOverlay} />
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, headerOverlay ? styles.scrollContentHeaderOverlay : null, footer ? styles.scrollWithFooter : null]}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {children}
      </Animated.ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function ScreenScaffold(props: AppScreenProps) {
  return <AppScreen {...props} />;
}

export function AppHeader({
  title,
  subtitle,
  activeDomain,
  scrollY,
  overlay = false
}: {
  title: string;
  subtitle?: string;
  activeDomain: string;
  scrollY?: Animated.Value;
  overlay?: boolean;
}) {
  const animatedFrameStyle = scrollY
    ? {
        paddingHorizontal: scrollY.interpolate({
          inputRange: [0, 52, 124],
          outputRange: [12, 5, 0],
          extrapolate: "clamp"
        }),
        paddingTop: scrollY.interpolate({
          inputRange: [0, 52, 124],
          outputRange: [8, 7, 6],
          extrapolate: "clamp"
        })
      }
    : null;
  const animatedBlurStyle = scrollY
    ? {
        borderRadius: scrollY.interpolate({
          inputRange: [0, 40, 116],
          outputRange: [36, 24, 0],
          extrapolate: "clamp"
        }),
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, 48, 120],
              outputRange: [0, -1, 0],
              extrapolate: "clamp"
            })
          },
          {
            scaleX: scrollY.interpolate({
              inputRange: [0, 36, 84, 124],
              outputRange: [0.968, 0.995, 1.018, 1],
              extrapolate: "clamp"
            })
          },
          {
            scaleY: scrollY.interpolate({
              inputRange: [0, 72, 124],
              outputRange: [1, 1.025, 1],
              extrapolate: "clamp"
            })
          }
        ]
      }
    : null;

  return (
    <Animated.View style={[styles.headerFrame, overlay ? styles.headerFrameOverlay : null, animatedFrameStyle]}>
      <AnimatedBlurView intensity={62} tint="light" style={[styles.headerBlur, animatedBlurStyle]}>
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
      </AnimatedBlurView>
    </Animated.View>
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
        styles.buttonShell,
        buttonShellStyles[variant],
        fullWidth ? styles.fullWidth : null,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.buttonShellPressed : null
      ]}
    >
      {({ pressed }) => (
        <View style={[styles.buttonFace, buttonStyles[variant], pressed && !disabled ? styles.buttonFacePressed : null]}>
          <Text selectable style={[styles.buttonText, isPrimary ? styles.buttonTextLight : styles.buttonTextDark]}>
            {label}
          </Text>
          <Icon color={iconColor} size={17} strokeWidth={2.8} />
        </View>
      )}
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
    <View style={[styles.metricCard, shadowByTone[tone]]}>
      <LinearGradient colors={gradientByTone[tone]} style={styles.cardGradientFill} />
      <View style={[styles.metricGlow, { backgroundColor: accentByTone[tone] }]} />
      <View style={styles.metricTopRow}>
        <Text selectable style={styles.metricValue}>
          {value}
        </Text>
        <View style={[styles.metricBadge, { backgroundColor: accentByTone[tone] }]}>
          <Sparkles color="#FFFFFF" size={15} strokeWidth={2.8} />
        </View>
      </View>
      <Text selectable style={styles.metricLabel}>
        {label}
      </Text>
      {delta ? (
        <Text selectable style={[styles.metricDelta, { color: accentByTone[tone] }]}>
          {delta}
        </Text>
      ) : null}
    </View>
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

export function SegmentedProgress({ value, segments = 16, tone = "blue" }: { value: number; segments?: number; tone?: Tone }) {
  const activeCount = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);

  return (
    <View style={styles.segmentedTrack}>
      {Array.from({ length: segments }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.segmentDot,
            index < activeCount
              ? {
                  backgroundColor: accentByTone[tone],
                  borderColor: accentByTone[tone]
                }
              : null
          ]}
        />
      ))}
    </View>
  );
}

export function StatPill({ label, value, tone = "blue" }: { label: string; value: string; tone?: Tone }) {
  return (
    <View style={[styles.statPill, toneStyles[tone]]}>
      <Text selectable style={[styles.statPillValue, { color: accentByTone[tone] }]}>
        {value}
      </Text>
      <Text selectable style={styles.statPillLabel}>
        {label}
      </Text>
    </View>
  );
}

export function RewardStrip({ items, tone = "gold" }: { items: Array<{ label: string; unlocked: boolean }>; tone?: Tone }) {
  return (
    <View style={styles.rewardStrip}>
      {items.map((item) => (
        <View key={item.label} style={[styles.rewardChip, item.unlocked ? { backgroundColor: accentByTone[tone], borderColor: accentByTone[tone] } : null]}>
          <Text selectable style={[styles.rewardChipText, item.unlocked ? styles.rewardChipTextActive : null]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function QuestWidget({
  title,
  body,
  meta,
  progress,
  tone = "blue",
  icon: Icon = Target,
  onPress
}: {
  title: string;
  body: string;
  meta: string;
  progress: number;
  tone?: Tone;
  icon?: LucideIcon;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.questWidget, toneStyles[tone], pressed ? styles.pressed : null]}>
      <View style={styles.questWidgetTop}>
        <View style={[styles.questIcon, { backgroundColor: accentByTone[tone] }]}>
          <Icon color="#FFFFFF" size={18} strokeWidth={2.8} />
        </View>
        <Text selectable style={[styles.questMeta, { color: accentByTone[tone] }]}>
          {meta}
        </Text>
      </View>
      <Text selectable style={styles.questTitle}>
        {title}
      </Text>
      <Text selectable numberOfLines={2} style={styles.questBody}>
        {body}
      </Text>
      <SegmentedProgress value={progress} tone={tone} />
    </Pressable>
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
    <Pressable onPress={onPress} style={({ pressed }) => [styles.compactTile, shadowByTone[tone], pressed ? styles.pressed : null]}>
      <LinearGradient colors={gradientByTone[tone]} style={styles.cardGradientFill} />
      <View style={[styles.compactTileGlow, { backgroundColor: accentByTone[tone] }]} />
      <View style={styles.compactTileTop}>
        <View style={[styles.compactTileIcon, { backgroundColor: accentByTone[tone] }]}>
          <Icon color="#FFFFFF" size={19} strokeWidth={2.8} />
        </View>
        <View style={[styles.compactTileMiniPill, { borderColor: translucentAccentByTone[tone] }]}>
          <Text selectable style={[styles.compactTileMiniText, { color: accentByTone[tone] }]}>
            +XP
          </Text>
        </View>
      </View>
      <Text selectable style={styles.compactTileTitle}>
        {title}
      </Text>
      <Text selectable numberOfLines={2} style={styles.compactTileBody}>
        {body}
      </Text>
      <View style={styles.compactTileTrack}>
        <View style={[styles.compactTileFill, { backgroundColor: accentByTone[tone], width: title.length % 2 === 0 ? "72%" : "54%" }]} />
      </View>
    </Pressable>
  );
}

export function BoostCard({
  title,
  body,
  action,
  tone = "green",
  icon: Icon = Sparkles,
  onPress
}: {
  title: string;
  body: string;
  action: string;
  tone?: Tone;
  icon?: LucideIcon;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.boostCard, shadowByTone[tone], pressed ? styles.pressed : null]}>
      <LinearGradient colors={gradientByTone[tone]} style={styles.cardGradientFill} />
      <View style={[styles.boostGlow, { backgroundColor: accentByTone[tone] }]} />
      <View style={styles.boostTopRow}>
        <View style={[styles.boostIcon, { backgroundColor: accentByTone[tone] }]}>
          <Icon color="#FFFFFF" size={20} strokeWidth={2.8} />
        </View>
        <View style={styles.boostCopy}>
          <Text selectable style={styles.boostTitle}>
            {title}
          </Text>
          <Text selectable numberOfLines={2} style={styles.boostBody}>
            {body}
          </Text>
        </View>
      </View>
      <View style={[styles.boostAction, { borderColor: translucentAccentByTone[tone] }]}>
        <Text selectable style={[styles.boostActionText, { color: accentByTone[tone] }]}>
          {action}
        </Text>
        <ArrowRight color={accentByTone[tone]} size={17} strokeWidth={2.8} />
      </View>
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
    fontFamily: fonts.extraBold,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 25
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23
  },
  body: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20
  },
  small: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
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

const translucentAccentByTone = {
  blue: "rgba(36, 123, 255, 0.28)",
  green: "rgba(0, 201, 133, 0.28)",
  purple: "rgba(135, 92, 255, 0.28)",
  coral: "rgba(255, 111, 61, 0.3)",
  gold: "rgba(255, 184, 0, 0.32)"
};

const gradientByTone: Record<Tone, [string, string, string]> = {
  blue: ["#FFFFFF", "#EEF5FF", "#DDEBFF"],
  green: ["#FFFFFF", "#E9FFF5", "#D9FBEA"],
  purple: ["#FFFFFF", "#F5F0FF", "#E9DFFF"],
  coral: ["#FFFFFF", "#FFF0E8", "#FFE0D2"],
  gold: ["#FFFFFF", "#FFF7DC", "#FFEFC0"]
};

const shadowByTone = StyleSheet.create({
  blue: {
    boxShadow: "0 18px 34px rgba(36, 123, 255, 0.16), 0 3px 0 rgba(36, 123, 255, 0.08)"
  },
  green: {
    boxShadow: "0 18px 34px rgba(0, 201, 133, 0.16), 0 3px 0 rgba(0, 201, 133, 0.08)"
  },
  purple: {
    boxShadow: "0 18px 34px rgba(135, 92, 255, 0.16), 0 3px 0 rgba(135, 92, 255, 0.08)"
  },
  coral: {
    boxShadow: "0 18px 34px rgba(255, 111, 61, 0.17), 0 3px 0 rgba(255, 111, 61, 0.09)"
  },
  gold: {
    boxShadow: "0 18px 34px rgba(255, 184, 0, 0.18), 0 3px 0 rgba(255, 184, 0, 0.09)"
  }
});

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

const buttonShellStyles = StyleSheet.create({
  primary: {
    backgroundColor: "#D94E25"
  },
  secondary: {
    backgroundColor: "#D8DFE8"
  },
  quiet: {
    backgroundColor: "#CBDCF7"
  },
  danger: {
    backgroundColor: "#A82318"
  }
});

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.coral,
    borderColor: "#FF8C66"
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: "#E7ECF2"
  },
  quiet: {
    backgroundColor: "#F6FAFF",
    borderColor: "#DDEBFF"
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: "#F04438"
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
    gap: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 112
  },
  scrollContentHeaderOverlay: {
    paddingTop: 0
  },
  scrollWithFooter: {
    paddingBottom: 242
  },
  headerFrame: {
    paddingHorizontal: 12,
    paddingTop: 8
  },
  headerFrameOverlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 20
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
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  headerTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
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
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 13
  },
  points: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 10,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
    lineHeight: 12
  },
  footer: {
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
  cardGradientFill: {
    ...StyleSheet.absoluteFillObject
  },
  metricCard: {
    borderCurve: "continuous",
    borderRadius: 32,
    borderColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 132,
    minWidth: 142,
    overflow: "hidden",
    padding: 15
  },
  metricTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  metricGlow: {
    borderRadius: 60,
    height: 92,
    opacity: 0.12,
    position: "absolute",
    right: -30,
    top: -28,
    width: 92
  },
  metricBadge: {
    alignItems: "center",
    borderRadius: 18,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  metricValue: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 34,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 38
  },
  metricLabel: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    textTransform: "uppercase"
  },
  metricDelta: {
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: "700"
  },
  body: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20
  },
  buttonShell: {
    borderRadius: 30,
    borderCurve: "continuous",
    minHeight: 58,
    paddingBottom: 6
  },
  buttonShellPressed: {
    paddingBottom: 1,
    paddingTop: 5
  },
  buttonFace: {
    alignItems: "center",
    borderRadius: 30,
    borderCurve: "continuous",
    borderWidth: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 19,
    boxShadow: "0 6px 0 rgba(0, 0, 0, 0.06)"
  },
  buttonFacePressed: {
    transform: [{ translateY: 3 }],
    boxShadow: "0 1px 0 rgba(0, 0, 0, 0.04)"
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "700",
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
    fontFamily: fonts.semibold,
    fontSize: 13,
    fontWeight: "600"
  },
  progressValue: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    fontWeight: "600"
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
  segmentedTrack: {
    flexDirection: "row",
    gap: 4,
    minHeight: 14
  },
  segmentDot: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7EAF0",
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    height: 12
  },
  statPill: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 2,
    minWidth: 84,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  statPillValue: {
    fontFamily: fonts.black,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    lineHeight: 21
  },
  statPillLabel: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  rewardStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  rewardChip: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  rewardChipText: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  rewardChipTextActive: {
    color: "#FFFFFF"
  },
  questWidget: {
    borderRadius: 32,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: 10,
    minHeight: 168,
    padding: 15,
    width: "48%"
  },
  questWidgetTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  questIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  questMeta: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    textAlign: "right",
    textTransform: "uppercase"
  },
  questTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21
  },
  questBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17
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
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    textTransform: "uppercase"
  },
  carouselTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.extraBold,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  carouselBody: {
    color: "rgba(255,255,255,0.86)",
    fontFamily: fonts.medium,
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
    fontFamily: fonts.semibold,
    fontSize: 14,
    fontWeight: "600"
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
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: "700"
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
    fontFamily: fonts.extraBold,
    fontSize: 12,
    fontWeight: "800"
  },
  heroCopy: {
    gap: 7,
    maxWidth: "78%"
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.black,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.84)",
    fontFamily: fonts.medium,
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
    borderCurve: "continuous",
    borderRadius: 34,
    borderColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    gap: 10,
    minHeight: 148,
    overflow: "hidden",
    padding: 15,
    width: "47%"
  },
  compactTileGlow: {
    borderRadius: 70,
    bottom: -46,
    height: 110,
    opacity: 0.13,
    position: "absolute",
    right: -34,
    width: 110
  },
  compactTileTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  compactTileIcon: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  compactTileMiniPill: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  compactTileMiniText: {
    fontFamily: fonts.black,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12
  },
  compactTileTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21
  },
  compactTileBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 17
  },
  compactTileTrack: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 12,
    height: 9,
    marginTop: "auto",
    overflow: "hidden"
  },
  compactTileFill: {
    borderRadius: 12,
    height: "100%"
  },
  boostCard: {
    borderCurve: "continuous",
    borderRadius: 34,
    borderColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    gap: 13,
    overflow: "hidden",
    padding: 15
  },
  boostGlow: {
    borderRadius: 80,
    height: 126,
    opacity: 0.12,
    position: "absolute",
    right: -42,
    top: -52,
    width: 126
  },
  boostTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  boostIcon: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  boostCopy: {
    flex: 1,
    gap: 5
  },
  boostTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22
  },
  boostBody: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  boostAction: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 14
  },
  boostActionText: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18
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
    fontFamily: fonts.extraBold,
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 28
  },
  skipText: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 13,
    fontWeight: "600"
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
    fontFamily: fonts.semibold,
    fontSize: 12,
    fontWeight: "600"
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
    fontFamily: fonts.bold,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19
  },
  listBody: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18
  },
  listMeta: {
    color: colors.blue,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: "700",
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
