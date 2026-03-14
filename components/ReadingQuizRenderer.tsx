import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { palette, radii } from "../lib/theme";
import type { ReadingQuiz } from "../lib/types";
import { SectionCard } from "./SectionCard";

type ReadingQuizRendererProps = {
  quiz: ReadingQuiz;
  completed: boolean;
  onSolved: () => void;
};

export function ReadingQuizRenderer({
  quiz,
  completed,
  onSolved,
}: ReadingQuizRendererProps) {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [contextAnswers, setContextAnswers] = useState<Record<string, string>>({});
  const [summaryOrder, setSummaryOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    completed ? "correct" : "idle",
  );

  const solved = completed || feedback === "correct";

  const summaryFragmentsById = useMemo(() => {
    if (quiz.type !== "summary_builder") {
      return {};
    }
    return Object.fromEntries(quiz.fragments.map((fragment) => [fragment.id, fragment]));
  }, [quiz]);

  function markSolved() {
    if (!solved) {
      onSolved();
    }
    setFeedback("correct");
  }

  function checkImageChoice() {
    if (quiz.type !== "image_choice") {
      return;
    }
    if (selectedImageId === quiz.answerId) {
      markSolved();
    } else {
      setFeedback("wrong");
    }
  }

  function checkContextInsert() {
    if (quiz.type !== "context_insert") {
      return;
    }

    const isCorrect = quiz.blanks.every(
      (blank) => contextAnswers[blank.id] === blank.answer,
    );
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      onSolved();
    }
  }

  function checkSummaryBuilder() {
    if (quiz.type !== "summary_builder") {
      return;
    }

    const isCorrect =
      summaryOrder.length === quiz.answerOrder.length &&
      summaryOrder.every((fragmentId, index) => fragmentId === quiz.answerOrder[index]);
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      onSolved();
    }
  }

  return (
    <SectionCard
      title={quiz.title}
      subtitle={`${quiz.sourceRef} / 報酬: 好感度 +${quiz.reward.affection ?? 0}`}
      tone="highlight"
    >
      <Text style={styles.prompt}>{quiz.prompt}</Text>

      {quiz.type === "image_choice"
        ? (
          <View style={styles.stack}>
            {quiz.choices.map((choice) => {
              const active = selectedImageId === choice.id;
              return (
                <Pressable
                  key={choice.id}
                  style={[styles.choiceCard, active && styles.choiceCardActive]}
                  onPress={() => setSelectedImageId(choice.id)}
                >
                  <Text style={styles.choiceSymbol}>{choice.symbol}</Text>
                  <View style={styles.choiceText}>
                    <Text style={styles.choiceTitle}>{choice.title}</Text>
                    <Text style={styles.choiceCaption}>{choice.caption}</Text>
                  </View>
                </Pressable>
              );
            })}
            <Pressable style={styles.actionButton} onPress={checkImageChoice}>
              <Text style={styles.actionText}>判定する</Text>
            </Pressable>
          </View>
        )
        : null}

      {quiz.type === "context_insert"
        ? (
          <View style={styles.stack}>
            {quiz.blanks.map((blank) => (
              <View key={blank.id} style={styles.blankCard}>
                <Text style={styles.blankText}>{blank.excerpt}</Text>
                <View style={styles.optionWrap}>
                  {quiz.options.map((option) => {
                    const active = contextAnswers[blank.id] === option;
                    return (
                      <Pressable
                        key={`${blank.id}-${option}`}
                        style={[styles.token, active && styles.tokenActive]}
                        onPress={() =>
                          setContextAnswers((current) => ({ ...current, [blank.id]: option }))}
                      >
                        <Text style={styles.tokenText}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            <Pressable style={styles.actionButton} onPress={checkContextInsert}>
              <Text style={styles.actionText}>接続詞を確認する</Text>
            </Pressable>
          </View>
        )
        : null}

      {quiz.type === "summary_builder"
        ? (
          <View style={styles.stack}>
            <View style={styles.summaryPreview}>
              <Text style={styles.summaryPreviewLabel}>作成中のサブタイトル</Text>
              <Text style={styles.summaryPreviewText}>
                {summaryOrder.length
                  ? summaryOrder
                    .map((fragmentId) => summaryFragmentsById[fragmentId]?.text ?? "")
                    .join("")
                  : "ここに並べた順で文章が組み上がります。"}
              </Text>
            </View>
            <View style={styles.optionWrap}>
              {quiz.fragments.map((fragment) => {
                const used = summaryOrder.includes(fragment.id);
                return (
                  <Pressable
                    key={fragment.id}
                    style={[styles.token, used && styles.tokenDisabled]}
                    disabled={used}
                    onPress={() => setSummaryOrder((current) => [...current, fragment.id])}
                  >
                    <Text style={styles.tokenText}>{fragment.text}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.ghostButton}
                onPress={() => setSummaryOrder((current) => current.slice(0, -1))}
              >
                <Text style={styles.ghostText}>ひとつ戻す</Text>
              </Pressable>
              <Pressable style={styles.ghostButton} onPress={() => setSummaryOrder([])}>
                <Text style={styles.ghostText}>リセット</Text>
              </Pressable>
            </View>
            <Pressable style={styles.actionButton} onPress={checkSummaryBuilder}>
              <Text style={styles.actionText}>要約を確認する</Text>
            </Pressable>
          </View>
        )
        : null}

      <ResultPanel
        feedback={feedback}
        hint={quiz.hint}
        explanation={quiz.explanation}
        successLabel="読解ミッション達成"
      />
    </SectionCard>
  );
}

function ResultPanel({
  feedback,
  hint,
  explanation,
  successLabel,
}: {
  feedback: "idle" | "correct" | "wrong";
  hint: string;
  explanation: string;
  successLabel: string;
}) {
  if (feedback === "idle") {
    return (
      <View style={styles.resultNeutral}>
        <Text style={styles.hintLabel}>ヒント</Text>
        <Text style={styles.hintText}>{hint}</Text>
      </View>
    );
  }

  return (
    <View style={feedback === "correct" ? styles.resultSuccess : styles.resultWrong}>
      <Text style={styles.resultLabel}>
        {feedback === "correct" ? successLabel : "まだ整わないみたい"}
      </Text>
      <Text style={styles.resultText}>
        {feedback === "correct" ? explanation : `ヒント: ${hint}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  prompt: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
  },
  stack: {
    gap: 12,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  choiceCardActive: {
    borderColor: "rgba(129,214,197,0.7)",
    backgroundColor: "rgba(129,214,197,0.12)",
  },
  choiceSymbol: {
    fontSize: 30,
  },
  choiceText: {
    flex: 1,
    gap: 2,
  },
  choiceTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  choiceCaption: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  blankCard: {
    gap: 10,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.035)",
  },
  blankText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  token: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tokenActive: {
    backgroundColor: "rgba(242,198,109,0.16)",
    borderColor: "rgba(242,198,109,0.55)",
  },
  tokenDisabled: {
    opacity: 0.45,
  },
  tokenText: {
    color: palette.text,
    fontSize: 13,
  },
  actionButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  actionText: {
    color: palette.night,
    fontSize: 14,
    fontWeight: "700",
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
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryPreview: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    gap: 6,
  },
  summaryPreviewLabel: {
    color: palette.muted,
    fontSize: 12,
  },
  summaryPreviewText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  resultNeutral: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 6,
  },
  hintLabel: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  hintText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  resultSuccess: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(129,214,197,0.12)",
    borderWidth: 1,
    borderColor: "rgba(129,214,197,0.5)",
    gap: 6,
  },
  resultWrong: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(243,178,199,0.12)",
    borderWidth: 1,
    borderColor: "rgba(243,178,199,0.4)",
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
