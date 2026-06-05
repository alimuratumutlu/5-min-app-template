import type { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText
} from "react-native-svg";
import { colors, fonts } from "@/components/app-shell";

type Tone = "blue" | "green" | "purple" | "coral" | "gold";

type ChartCardProps = {
  title: string;
  subtitle: string;
  tone?: Tone;
  children: ReactNode;
};

const accentByTone: Record<Tone, string> = {
  blue: colors.blue,
  green: colors.green,
  purple: colors.purple,
  coral: colors.coral,
  gold: colors.gold
};

const gradientByTone: Record<Tone, [string, string, string]> = {
  blue: ["#FFFFFF", "#EFF6FF", "#E2EEFF"],
  green: ["#FFFFFF", "#ECFFF7", "#DDFBEC"],
  purple: ["#FFFFFF", "#F6F1FF", "#EDE4FF"],
  coral: ["#FFFFFF", "#FFF0E8", "#FFE2D5"],
  gold: ["#FFFFFF", "#FFF8E2", "#FFF0BD"]
};

export function ChartCard({ title, subtitle, tone = "blue", children }: ChartCardProps) {
  return (
    <View style={[styles.chartCard, { borderColor: withAlpha(accentByTone[tone], 0.22) }]}>
      <LinearGradient colors={gradientByTone[tone]} style={styles.cardFill} />
      <View style={[styles.cardGlow, { backgroundColor: accentByTone[tone] }]} />
      <View style={styles.cardHeader}>
        <View style={[styles.cardDot, { backgroundColor: accentByTone[tone] }]} />
        <View style={styles.cardCopy}>
          <Text selectable style={styles.cardTitle}>
            {title}
          </Text>
          <Text selectable style={styles.cardSubtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
}

export function RadarChart({
  data,
  tone = "purple"
}: {
  data: Array<{ label: string; value: number }>;
  tone?: Tone;
}) {
  const size = 226;
  const center = size / 2;
  const maxRadius = 76;
  const accent = accentByTone[tone];
  const polygon = data
    .map((item, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
      const radius = (Math.max(0, Math.min(100, item.value)) / 100) * maxRadius;
      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    })
    .join(" ");

  const gridRings = [0.33, 0.66, 1];

  return (
    <Svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridRings.map((scale) => (
        <Polygon key={scale} points={radarGridPoints(data.length, center, maxRadius * scale)} fill="none" stroke="#DCE2EA" strokeWidth={1} />
      ))}
      {data.map((item, index) => {
        const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
        const lineX = center + Math.cos(angle) * maxRadius;
        const lineY = center + Math.sin(angle) * maxRadius;
        const labelX = center + Math.cos(angle) * (maxRadius + 24);
        const labelY = center + Math.sin(angle) * (maxRadius + 22);

        return (
          <G key={item.label}>
            <Line x1={center} y1={center} x2={lineX} y2={lineY} stroke="#E6EAF0" strokeWidth={1} />
            <SvgText x={labelX} y={labelY} textAnchor="middle" fontSize={10} fontWeight="700" fill={colors.textMuted}>
              {item.label}
            </SvgText>
          </G>
        );
      })}
      <Polygon points={polygon} fill={withAlpha(accent, 0.22)} stroke={accent} strokeWidth={3} />
      {data.map((item, index) => {
        const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
        const radius = (Math.max(0, Math.min(100, item.value)) / 100) * maxRadius;
        return <Circle key={item.label} cx={center + Math.cos(angle) * radius} cy={center + Math.sin(angle) * radius} r={5} fill="#FFFFFF" stroke={accent} strokeWidth={3} />;
      })}
    </Svg>
  );
}

export function LineChart({
  data,
  tone = "coral"
}: {
  data: number[];
  tone?: Tone;
}) {
  const width = 330;
  const height = 180;
  const padding = 18;
  const accent = accentByTone[tone];
  const points = normalizePoints(data, width, height, padding);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <SvgLinearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.28" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.02" />
        </SvgLinearGradient>
      </Defs>
      {[0, 1, 2, 3].map((item) => (
        <Line key={item} x1={padding} y1={padding + item * 38} x2={width - padding} y2={padding + item * 38} stroke="#E7EBF1" strokeWidth={1} />
      ))}
      <Path d={area} fill="url(#lineFill)" />
      <Path d={path} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => (
        <Circle key={index} cx={point.x} cy={point.y} r={5} fill="#FFFFFF" stroke={accent} strokeWidth={3} />
      ))}
    </Svg>
  );
}

export function BarChart({
  data,
  tone = "green"
}: {
  data: Array<{ label: string; value: number }>;
  tone?: Tone;
}) {
  const width = 330;
  const height = 178;
  const accent = accentByTone[tone];
  const max = Math.max(...data.map((item) => item.value), 1);
  const gap = 13;
  const barWidth = (width - 40 - gap * (data.length - 1)) / data.length;

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((item, index) => {
        const barHeight = (item.value / max) * 110 + 16;
        const x = 20 + index * (barWidth + gap);
        const y = 132 - barHeight;
        return (
          <G key={item.label}>
            <Rect x={x} y={y} width={barWidth} height={barHeight} rx={16} fill={withAlpha(accent, 0.2 + index * 0.08)} />
            <Rect x={x} y={y + barHeight - 18} width={barWidth} height={18} rx={9} fill={accent} />
            <SvgText x={x + barWidth / 2} y={158} textAnchor="middle" fontSize={11} fontWeight="800" fill={colors.textMuted}>
              {item.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

export function DonutChart({
  value,
  label,
  tone = "gold"
}: {
  value: number;
  label: string;
  tone?: Tone;
}) {
  const size = 190;
  const center = size / 2;
  const radius = 68;
  const strokeWidth = 18;
  const normalized = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;
  const accent = accentByTone[tone];

  return (
    <Svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={center} cy={center} r={radius} stroke="#EEF1F5" strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={accent}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      <SvgText x={center} y={center - 5} textAnchor="middle" fontSize={34} fontWeight="900" fill={colors.text}>
        {normalized}%
      </SvgText>
      <SvgText x={center} y={center + 24} textAnchor="middle" fontSize={12} fontWeight="800" fill={colors.textMuted}>
        {label}
      </SvgText>
    </Svg>
  );
}

export function HeatmapChart({
  values,
  tone = "blue"
}: {
  values: number[];
  tone?: Tone;
}) {
  const accent = accentByTone[tone];

  return (
    <View style={styles.heatmapGrid}>
      {values.slice(0, 35).map((value, index) => (
        <View
          key={index}
          style={[
            styles.heatmapCell,
            {
              backgroundColor: withAlpha(accent, 0.12 + Math.max(0, Math.min(100, value)) / 140),
              borderColor: withAlpha(accent, 0.18)
            }
          ]}
        />
      ))}
    </View>
  );
}

export function ComparisonBars({
  data,
  tone = "purple"
}: {
  data: Array<{ label: string; value: number; meta: string }>;
  tone?: Tone;
}) {
  const accent = accentByTone[tone];

  return (
    <View style={styles.comparisonList}>
      {data.map((item) => (
        <View key={item.label} style={styles.comparisonRow}>
          <View style={styles.comparisonLabelRow}>
            <Text selectable style={styles.comparisonLabel}>
              {item.label}
            </Text>
            <Text selectable style={[styles.comparisonMeta, { color: accent }]}>
              {item.meta}
            </Text>
          </View>
          <View style={styles.comparisonTrack}>
            <View style={[styles.comparisonFill, { backgroundColor: accent, width: `${Math.max(8, Math.min(100, item.value))}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function radarGridPoints(count: number, center: number, radius: number) {
  return Array.from({ length: count })
    .map((_, index) => {
      const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
      return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    })
    .join(" ");
}

function normalizePoints(data: number[], width: number, height: number, padding: number) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = Math.max(max - min, 1);
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);

  return data.map((value, index) => ({
    x: padding + index * step,
    y: height - padding - ((value - min) / span) * (height - padding * 2)
  }));
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const styles = StyleSheet.create({
  chartCard: {
    borderCurve: "continuous",
    borderRadius: 34,
    borderWidth: 1,
    gap: 14,
    overflow: "hidden",
    padding: 16,
    boxShadow: "0 18px 36px rgba(30, 34, 42, 0.08)"
  },
  cardFill: {
    ...StyleSheet.absoluteFillObject
  },
  cardGlow: {
    borderRadius: 100,
    height: 160,
    opacity: 0.1,
    position: "absolute",
    right: -62,
    top: -72,
    width: 160
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10
  },
  cardDot: {
    borderRadius: 8,
    height: 16,
    marginTop: 3,
    width: 16
  },
  cardCopy: {
    flex: 1,
    gap: 3
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18
  },
  heatmapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  heatmapCell: {
    borderCurve: "continuous",
    borderRadius: 9,
    borderWidth: 1,
    height: 32,
    width: "12.1%"
  },
  comparisonList: {
    gap: 13
  },
  comparisonRow: {
    gap: 7
  },
  comparisonLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  comparisonLabel: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  comparisonMeta: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  comparisonTrack: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 12,
    height: 12,
    overflow: "hidden"
  },
  comparisonFill: {
    borderRadius: 12,
    height: "100%"
  }
});
