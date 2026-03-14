import { StyleSheet, Text, View } from "react-native";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { characterData } from "../lib/content";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function CharactersScreen() {
  const characterAffection = useGameStore((state) => state.characterAffection);

  return (
    <ScreenFrame
      title="キャラクター"
      subtitle="教材のナビ役として会話し、報酬で好感度が上がる 4 人。"
    >
      {characterData.map((character) => (
        <SectionCard
          key={character.id}
          title={character.name}
          subtitle={`${character.role} / モチーフ: ${character.motif}`}
        >
          <View style={styles.headerRow}>
            <View style={[styles.swatch, { backgroundColor: character.accent }]} />
            <Text style={styles.affection}>好感度 {characterAffection[character.id] ?? 0}</Text>
          </View>
          <Text style={styles.body}>{character.bio}</Text>
          <Text style={styles.source}>{character.sourceRef}</Text>
        </SectionCard>
      ))}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  affection: {
    color: palette.gold,
    fontWeight: "700",
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
