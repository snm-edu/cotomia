import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PagerControls } from "../PagerControls";
import { SectionCard } from "../SectionCard";
import { CaseGridBoard } from "./CaseGridBoard";
import { CaseLayoutBoard } from "./CaseLayoutBoard";
import { RuleForgeBoard } from "./RuleForgeBoard";
import type { CaseboardCase } from "../../lib/caseboardTypes";
import { palette, radii } from "../../lib/theme";

type CaseboardCaseRendererProps = {
  puzzle: CaseboardCase;
  completed: boolean;
  onSolved: () => void;
};

export function CaseboardCaseRenderer({
  puzzle,
  completed,
  onSolved,
}: CaseboardCaseRendererProps) {
  const [hintLevel, setHintLevel] = useState(0);
  const [panelIndex, setPanelIndex] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [solved, setSolved] = useState(completed);
  const [explanationIndex, setExplanationIndex] = useState(0);

  const panelItems = useMemo(
    () => [
      { id: "clues", label: "条件", meta: `${puzzle.clueCards.length} cards` },
      { id: "hints", label: "ヒント", meta: `${hintLevel}/3` },
      { id: "replay", label: "解説", meta: solved ? `${explanationIndex + 1}/${puzzle.explanation.length}` : "locked" },
    ],
    [explanationIndex, hintLevel, puzzle.clueCards.length, puzzle.explanation.length, solved],
  );

  function handleSolved() {
    if (!solved) {
      setSolved(true);
      setPanelIndex(2);
      onSolved();
    }
  }

  function resetBoard() {
    setSolved(false);
    setHintLevel(0);
    setExplanationIndex(0);
    setPanelIndex(0);
    setResetToken((current) => current + 1);
  }

  const unlockedHints = puzzle.hints.filter((hint) => hint.level <= hintLevel);
  const currentExplanation = puzzle.explanation[explanationIndex];

  return (
    <View style={styles.screen}>
      <SectionCard
        title={puzzle.title}
        subtitle={`${puzzle.sourceRef} / ${completed ? "CLEAR 済み" : `${puzzle.estimatedMinutes} 分想定`}`}
      >
        <Text style={styles.lead}>{puzzle.missionText}</Text>
        <Text style={styles.goal}>{puzzle.goalText}</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.secondaryButton} onPress={resetBoard}>
            <Text style={styles.secondaryButtonText}>盤面を初期化</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard style={styles.boardCard} tone="highlight">
        {puzzle.mode === "case_grid" ? (
          <CaseGridBoard
            puzzle={puzzle}
            resetToken={resetToken}
            solved={solved}
            onSolved={handleSolved}
          />
        ) : null}

        {puzzle.mode === "case_layout" ? (
          <CaseLayoutBoard
            puzzle={puzzle}
            resetToken={resetToken}
            solved={solved}
            onSolved={handleSolved}
          />
        ) : null}

        {puzzle.mode === "rule_forge" ? (
          <RuleForgeBoard
            puzzle={puzzle}
            resetToken={resetToken}
            solved={solved}
            onSolved={handleSolved}
          />
        ) : null}
      </SectionCard>

      <SectionCard style={styles.supportCard}>
        <PagerControls items={panelItems} index={panelIndex} onChange={setPanelIndex} />

        {panelIndex === 0 ? (
          <View style={styles.supportBody}>
            {puzzle.clueCards.map((clue) => (
              <View key={clue.id} style={styles.clueCard}>
                <Text style={styles.clueTitle}>{clue.title}</Text>
                <Text style={styles.clueText}>{clue.text}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {panelIndex === 1 ? (
          <View style={styles.supportBody}>
            {unlockedHints.length ? (
              unlockedHints.map((hint) => (
                <View key={hint.level} style={styles.clueCard}>
                  <Text style={styles.clueTitle}>Hint {hint.level}</Text>
                  <Text style={styles.clueText}>{hint.text}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.lockedText}>まだヒントは開いていません。</Text>
            )}
            {hintLevel < 3 ? (
              <Pressable
                style={styles.hintButton}
                onPress={() => setHintLevel((current) => Math.min(current + 1, 3))}
              >
                <Text style={styles.hintButtonText}>次の段階ヒントを開く</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {panelIndex === 2 ? (
          <View style={styles.supportBody}>
            {solved ? (
              <>
                <View style={styles.clueCard}>
                  <Text style={styles.clueTitle}>{currentExplanation.title}</Text>
                  <Text style={styles.clueText}>{currentExplanation.text}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => setExplanationIndex((current) => Math.max(current - 1, 0))}
                  >
                    <Text style={styles.secondaryButtonText}>前</Text>
                  </Pressable>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() =>
                      setExplanationIndex((current) =>
                        Math.min(current + 1, puzzle.explanation.length - 1))
                    }
                  >
                    <Text style={styles.secondaryButtonText}>次</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.lockedText}>解説はケースを解いたあとに表示されます。</Text>
            )}
          </View>
        ) : null}
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    gap: 12,
  },
  lead: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  goal: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  boardCard: {
    flex: 1,
    minHeight: 0,
  },
  supportCard: {
    minHeight: 0,
  },
  supportBody: {
    gap: 8,
  },
  clueCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  clueTitle: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  clueText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 19,
  },
  lockedText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    color: palette.text,
    fontWeight: "700",
  },
  hintButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.violet,
  },
  hintButtonText: {
    color: palette.text,
    fontWeight: "800",
  },
});
