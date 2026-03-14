import { StyleSheet, Text, View } from "react-native";
import { palette, radii } from "../lib/theme";

type StatChipProps = {
  label: string;
  value: string | number;
};

export function StatChip({ label, value }: StatChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 78,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 3,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  value: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
