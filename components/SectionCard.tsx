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
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },
  title: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: palette.panel,
    borderColor: "rgba(223, 233, 255, 0.08)",
  },
  highlight: {
    backgroundColor: "#152c4f",
    borderColor: "rgba(201, 215, 255, 0.25)",
  },
  warning: {
    backgroundColor: "#30241d",
    borderColor: "rgba(255, 207, 145, 0.28)",
  },
});
