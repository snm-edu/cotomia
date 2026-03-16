import { PropsWithChildren } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { palette, radii } from "../lib/theme";

type SectionCardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  tone?: "default" | "highlight" | "warning";
}>;

export function SectionCard({
  children,
  title,
  subtitle,
  style,
  tone = "default",
}: SectionCardProps) {
  return (
    <View style={[styles.card, toneStyles[tone], style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: 18,
    gap: 12,
    borderWidth: 1,
  },
  title: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: palette.panel,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  highlight: {
    backgroundColor: palette.panelRose,
    borderColor: "rgba(255, 199, 168, 0.24)",
  },
  warning: {
    backgroundColor: "#352517",
    borderColor: "rgba(255, 217, 163, 0.35)",
  },
});
