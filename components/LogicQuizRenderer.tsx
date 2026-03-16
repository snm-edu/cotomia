import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getCaseboardModeMeta } from "../lib/caseboard";
import { palette, radii } from "../lib/theme";
import type { LogicQuiz } from "../lib/types";
import { SectionCard } from "./SectionCard";

type LogicQuizRendererProps = {
  quiz: LogicQuiz;
  completed: boolean;
  onSolved: () => void;
};

export function LogicQuizRenderer({
  quiz,
  completed,
  onSolved,
}: LogicQuizRendererProps) {
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    completed ? "correct" : "idle",
  );

  const solved = completed || feedback === "correct";
  const mode = getCaseboardModeMeta(quiz);

  const itemsById = useMemo(() => {
    if (quiz.type !== "order_sort") {
      return {};
    }
    return Object.fromEntries(quiz.items.map((item) => [item.id, item]));
  }, [quiz]);

  function markSolved() {
    if (!solved) {
      onSolved();
    }
    setFeedback("correct");
  }

  function checkAnswer() {
    if (quiz.type === "order_sort") {
      const isCorrect =
        order.length === quiz.answerOrder.length &&
        order.every((itemId, index) => itemId === quiz.answerOrder[index]);
      setFeedback(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        onSolved();
      }
      return;
    }

    if (choiceIndex === quiz.answerIndex) {
      markSolved();
    } else {
      setFeedback("wrong");
    }
  }

  return (
    <SectionCard
      title={quiz.title}
      subtitle={`${mode.label} / ${quiz.sourceRef}`}
      tone="highlight"
    >
      <Text style={styles.prompt}>{quiz.prompt}</Text>

      <View style={styles.clueBlock}>
        <Text style={styles.blockTitle}>条件カード</Text>
        {quiz.clues.map((clue, index) => (
          <View key={clue} style={styles.clueCard}>
            <Text style={styles.clueIndex}>{index + 1}</Text>
            <Text style={styles.clueText}>{clue}</Text>
          </View>
        ))}
      </View>

      {quiz.type === "order_sort"
        ? (
          <View style={styles.stack}>
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>いまの並び</Text>
              <Text style={styles.previewText}>
                {order.length
                  ? order.map((itemId) => itemsById[itemId]?.label).join(" → ")
                  : "まだ選ばれていません"}
              </Text>
            </View>
            <Text style={styles.blockTitle}>並べるカード</Text>
            {quiz.items.map((item) => {
              const used = order.includes(item.id);
              return (
                <Pressable
                  key={item.id}
                  style={[styles.orderCard, used && styles.orderCardUsed]}
                  disabled={used}
                  onPress={() => setOrder((current) => [...current, item.id])}
                >
                  <Text style={styles.orderLabel}>{item.label}</Text>
                  <Text style={styles.orderText}>{item.text}</Text>
                </Pressable>
              );
            })}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.ghostButton}
                onPress={() => setOrder((current) => current.slice(0, -1))}
              >
                <Text style={styles.ghostText}>ひとつ戻す</Text>
              </Pressable>
              <Pressable style={styles.ghostButton} onPress={() => setOrder([])}>
                <Text style={styles.ghostText}>リセット</Text>
              </Pressable>
            </View>
          </View>
        )
        : (
          <View style={styles.stack}>
            <Text style={styles.blockTitle}>候補をひとつ選ぶ</Text>
            {quiz.choices.map((choice, index) => {
              const active = choiceIndex === index;
              return (
                <Pressable
                  key={choice}
                  style={[styles.choiceCard, active && styles.choiceCardActive]}
                  onPress={() => setChoiceIndex(index)}
                >
                  <View style={[styles.choiceBadge, active && styles.choiceBadgeActive]}>
                    <Text style={[styles.choiceBadgeText, active && styles.choiceBadgeTextActive]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <View style={styles.choiceContent}>
                    <Text style={styles.choiceText}>{choice}</Text>
                    <Text style={styles.choiceMeta}>{active ? "選択中" : "タップで選ぶ"}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

      <Pressable style={styles.actionButton} onPress={checkAnswer}>
        <Text style={styles.actionText}>ケースを確定</Text>
      </Pressable>

      <View style={feedback === "correct" ? styles.resultSuccess : styles.resultNeutral}>
        <Text style={styles.resultLabel}>
          {feedback === "correct"
            ? "CASE SOLVED"
            : feedback === "wrong"
              ? "矛盾を見直す"
              : "捜査ヒント"}
        </Text>
        <Text style={styles.resultText}>
          {feedback === "correct" ? quiz.explanation : quiz.hint}
        </Text>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  prompt: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 26,
  },
  clueBlock: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 10,
  },
  blockTitle: {
    color: palette.peach,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  clueCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(17, 23, 38, 0.22)",
  },
  clueIndex: {
    width: 26,
    height: 26,
    borderRadius: 999,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    color: palette.night,
    backgroundColor: palette.peach,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 26,
  },
  clueText: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  stack: {
    gap: 10,
  },
  preview: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(146, 228, 210, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(146, 228, 210, 0.24)",
    gap: 6,
  },
  previewLabel: {
    color: palette.muted,
    fontSize: 12,
    letterSpacing: 0.6,
  },
  previewText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  orderCard: {
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  orderCardUsed: {
    opacity: 0.45,
  },
  orderLabel: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  orderText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
  },
  choiceCard: {
    flexDirection: "row",
    gap: 12,
    padding: 15,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  choiceCardActive: {
    backgroundColor: "rgba(255, 180, 207, 0.12)",
    borderColor: "rgba(255, 180, 207, 0.44)",
  },
  choiceBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 210, 122, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 122, 0.26)",
  },
  choiceBadgeActive: {
    backgroundColor: "rgba(255, 180, 207, 0.2)",
    borderColor: "rgba(255, 180, 207, 0.4)",
  },
  choiceBadgeText: {
    color: palette.gold,
    fontSize: 13,
    fontWeight: "800",
  },
  choiceBadgeTextActive: {
    color: palette.rose,
  },
  choiceContent: {
    flex: 1,
    gap: 4,
  },
  choiceText: {
    flex: 1,
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
  },
  choiceMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  ghostText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
    backgroundColor: palette.peach,
  },
  actionText: {
    color: palette.night,
    fontSize: 15,
    fontWeight: "800",
  },
  resultNeutral: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 8,
  },
  resultSuccess: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(146, 228, 210, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(146, 228, 210, 0.5)",
    gap: 8,
  },
  resultLabel: {
    color: palette.peach,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  resultText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
});
