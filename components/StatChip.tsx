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
    minWidth: 88,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 122, 0.14)",
    gap: 4,
  },
  label: {
    color: palette.muted,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  value: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
