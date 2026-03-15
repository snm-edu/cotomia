import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { evaluateRuleCase } from "../../lib/caseboardUtils";
import type { RuleForgeCase } from "../../lib/caseboardTypes";
import { palette, radii } from "../../lib/theme";

type RuleForgeBoardProps = {
  puzzle: RuleForgeCase;
  resetToken: number;
  solved: boolean;
  onSolved: () => void;
};

export function RuleForgeBoard({
  puzzle,
  resetToken,
  solved,
  onSolved,
}: RuleForgeBoardProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setSelectedValue(null);
    setAssignments({});
    setAttempted(false);
  }, [resetToken]);

  const evaluation = useMemo(() => evaluateRuleCase(puzzle, assignments), [puzzle, assignments]);

  function assignValue(symbolId: string) {
    if (solved || !selectedValue) {
      return;
    }

    setAssignments((current) => ({
      ...current,
      [symbolId]: current[symbolId] === selectedValue ? "" : selectedValue,
    }));
  }

  function submit() {
    setAttempted(true);
    if (evaluation.solved) {
      onSolved();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.valuesRow}>
        {puzzle.board.values.map((value) => (
          <Pressable
            key={value}
            style={[styles.valueChip, selectedValue === value && styles.valueChipActive]}
            onPress={() => setSelectedValue((current) => (current === value ? null : value))}
          >
            <Text style={styles.valueChipText}>{value}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.assignmentRow}>
        {puzzle.board.symbols.map((symbol) => (
          <Pressable
            key={symbol.id}
            style={styles.symbolCard}
            onPress={() => assignValue(symbol.id)}
          >
            <Text style={styles.symbolLabel}>{symbol.label}</Text>
            <Text style={styles.symbolAssignment}>{assignments[symbol.id] || "?"}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.exampleBlock}>
        {evaluation.exampleResults.map((result) => {
          const example = puzzle.board.examples.find((item) => item.id === result.id);
          if (!example) {
            return null;
          }
          return (
            <View key={result.id} style={styles.exampleCard}>
              <Text style={styles.exampleInput}>
                {example.input.map((token) =>
                  puzzle.board.symbols.find((symbol) => symbol.id === token)?.label ?? token).join("")}
              </Text>
              <Text style={styles.exampleArrow}>→</Text>
              <Text style={styles.exampleOutput}>
                {result.output} / {example.output}
              </Text>
              <Text style={[styles.exampleStatus, result.passed && styles.exampleStatusPass]}>
                {result.passed ? "PASS" : "CHECK"}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>最終コード</Text>
        <Text style={styles.challengeText}>
          {puzzle.board.challengeInput.map((token) =>
            puzzle.board.symbols.find((symbol) => symbol.id === token)?.label ?? token).join("")}
          {"  →  "}
          {evaluation.challengeOutput}
        </Text>
      </View>

      <Pressable style={styles.submitButton} onPress={submit}>
        <Text style={styles.submitButtonText}>ルールを確定する</Text>
      </Pressable>

      <View style={styles.feedbackCard}>
        <Text style={styles.feedbackTitle}>
          {solved
            ? "Rule solved"
            : attempted && evaluation.duplicateValues.length
              ? "重複があります"
              : attempted && !evaluation.exampleResults.every((example) => example.passed)
                ? "まだ例題が通りません"
                : attempted
                  ? "最後のコードが違います"
                  : "操作ガイド"}
        </Text>
        <Text style={styles.feedbackText}>
          {solved
            ? "対応表が完成し、最終コードも正しく復号できました。"
            : attempted && evaluation.duplicateValues.length
              ? `${evaluation.duplicateValues.join(", ")} が重複しています。`
              : attempted && !evaluation.exampleResults.every((example) => example.passed)
                ? "例題の出力を満たしていない組み合わせがあります。"
                : attempted
                  ? "例題は通っていますが、最後のコードの読み取りがまだ一致していません。"
                  : "値を選び、記号カードへ割り当てていきます。"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 10,
  },
  valuesRow: {
    flexDirection: "row",
    gap: 8,
  },
  valueChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  valueChipActive: {
    backgroundColor: "rgba(143,169,255,0.18)",
    borderColor: "rgba(143,169,255,0.42)",
  },
  valueChipText: {
    color: palette.text,
    fontWeight: "700",
  },
  assignmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  symbolCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    gap: 6,
  },
  symbolLabel: {
    color: palette.gold,
    fontSize: 24,
    fontWeight: "800",
  },
  symbolAssignment: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  exampleBlock: {
    gap: 8,
  },
  exampleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  exampleInput: {
    color: palette.text,
    fontWeight: "700",
    minWidth: 44,
  },
  exampleArrow: {
    color: palette.muted,
  },
  exampleOutput: {
    color: palette.text,
    flex: 1,
  },
  exampleStatus: {
    color: palette.warning,
    fontSize: 11,
    fontWeight: "700",
  },
  exampleStatusPass: {
    color: palette.mint,
  },
  challengeCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 4,
  },
  challengeTitle: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  challengeText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "800",
  },
  submitButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  submitButtonText: {
    color: palette.night,
    fontWeight: "800",
  },
  feedbackCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  feedbackTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  feedbackText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});
