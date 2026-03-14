import { StyleSheet, Text, View } from "react-native";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { glossaryData } from "../lib/content";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function GlossaryScreen() {
  const unlockedGlossaryIds = useGameStore((state) => state.unlockedGlossaryIds);

  return (
    <ScreenFrame
      title="用語集"
      subtitle="読了やクイズ達成で順番に開く、神話と医療のことば。"
    >
      {glossaryData.map((entry) => {
        const unlocked = unlockedGlossaryIds.includes(entry.id);
        return (
          <SectionCard
            key={entry.id}
            title={unlocked ? entry.term : "？？？"}
            subtitle={unlocked ? entry.reading : "未解放"}
          >
            <View style={[styles.badge, unlocked && styles.badgeUnlocked]}>
              <Text style={styles.badgeText}>{unlocked ? "OPEN" : "LOCKED"}</Text>
            </View>
            <Text style={styles.body}>
              {unlocked ? entry.description : "この用語は関連エピソードの読了で解放されます。"}
            </Text>
            <Text style={styles.source}>{unlocked ? entry.sourceRef : ""}</Text>
          </SectionCard>
        );
      })}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  badgeUnlocked: {
    backgroundColor: "rgba(129,214,197,0.12)",
  },
  badgeText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  body: {
    color: palette.text,
    lineHeight: 22,
  },
  source: {
    color: palette.muted,
    fontSize: 12,
  },
});
