import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PagerControls } from "../components/PagerControls";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { characterData } from "../lib/content";
import { palette } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function CharactersScreen() {
  const [characterIndex, setCharacterIndex] = useState(0);
  const characterAffection = useGameStore((state) => state.characterAffection);
  const character = characterData[characterIndex];

  return (
    <ScreenFrame
      title="キャラクター"
      subtitle="教材のナビ役として会話し、報酬で好感度が上がる 4 人。"
    >
      <SectionCard
        title={character.name}
        subtitle={`${character.role} / モチーフ: ${character.motif}`}
        style={styles.card}
      >
        <PagerControls
          items={characterData.map((item) => ({
            id: item.id,
            label: item.name,
            meta: item.role,
            stateLabel: `${characterAffection[item.id] ?? 0}`,
          }))}
          index={characterIndex}
          onChange={setCharacterIndex}
        />

        <View style={styles.bodyWrap}>
          <View style={styles.headerRow}>
            <View style={[styles.swatch, { backgroundColor: character.accent }]} />
            <Text style={styles.affection}>好感度 {characterAffection[character.id] ?? 0}</Text>
          </View>
          <Text style={styles.body}>{character.bio}</Text>
          <Text style={styles.source}>{character.sourceRef}</Text>
        </View>
      </SectionCard>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
  },
  bodyWrap: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
    gap: 14,
  },
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
