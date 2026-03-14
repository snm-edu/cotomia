import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
      subtitle={`${quiz.sourceRef} / 型: ${quiz.type}`}
      tone="highlight"
    >
      <Text style={styles.prompt}>{quiz.prompt}</Text>

      <View style={styles.clueBlock}>
        {quiz.clues.map((clue) => (
          <Text key={clue} style={styles.clueText}>
            ・{clue}
          </Text>
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
            {quiz.choices.map((choice, index) => {
              const active = choiceIndex === index;
              return (
                <Pressable
                  key={choice}
                  style={[styles.choiceCard, active && styles.choiceCardActive]}
                  onPress={() => setChoiceIndex(index)}
                >
                  <Text style={styles.choiceBullet}>{String.fromCharCode(97 + index)}.</Text>
                  <Text style={styles.choiceText}>{choice}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

      <Pressable style={styles.actionButton} onPress={checkAnswer}>
        <Text style={styles.actionText}>判定する</Text>
      </Pressable>

      <View style={feedback === "correct" ? styles.resultSuccess : styles.resultNeutral}>
        <Text style={styles.resultLabel}>
          {feedback === "correct" ? "思考ミニゲーム達成" : feedback === "wrong" ? "ヒントを見直そう" : "ヒント"}
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
    fontSize: 15,
    lineHeight: 23,
  },
  clueBlock: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    gap: 6,
  },
  clueText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  stack: {
    gap: 10,
  },
  preview: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  previewLabel: {
    color: palette.muted,
    fontSize: 12,
  },
  previewText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  orderCard: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  orderCardUsed: {
    opacity: 0.4,
  },
  orderLabel: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  orderText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  choiceCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  choiceCardActive: {
    backgroundColor: "rgba(143,169,255,0.14)",
    borderColor: "rgba(143,169,255,0.5)",
  },
  choiceBullet: {
    color: palette.gold,
    width: 18,
    fontWeight: "700",
  },
  choiceText: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  ghostButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  ghostText: {
    color: palette.text,
    fontSize: 13,
  },
  actionButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: palette.mint,
  },
  actionText: {
    color: palette.night,
    fontSize: 14,
    fontWeight: "700",
  },
  resultNeutral: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 6,
  },
  resultSuccess: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(129,214,197,0.12)",
    borderWidth: 1,
    borderColor: "rgba(129,214,197,0.5)",
    gap: 6,
  },
  resultLabel: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  resultText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
