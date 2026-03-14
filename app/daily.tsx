import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { PagerControls } from "../components/PagerControls";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { logicQuizData } from "../lib/content";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function DailyScreen() {
  const [quizIndex, setQuizIndex] = useState(0);
  const completedLogicQuizIds = useGameStore((state) => state.completedLogicQuizIds);
  const todayKey = getLocalDateKey();
  const selection = getDailyLogicSelection(logicQuizData, todayKey);
  const quiz = selection[quizIndex];

  return (
    <ScreenFrame
      title="デイリー思考"
      subtitle={`${todayKey} の出題。並べ替え・真偽推理・配置推理を 1 問ずつ。`}
    >
      <SectionCard
        title={quiz.title}
        subtitle={`${quiz.type} / ${quiz.sourceRef}`}
        style={styles.card}
      >
        <PagerControls
          items={selection.map((item) => ({
            id: item.id,
            label: item.title,
            meta: item.type,
            stateLabel: completedLogicQuizIds.includes(item.id) ? "clear" : "today",
          }))}
          index={quizIndex}
          onChange={setQuizIndex}
        />

        <View style={styles.body}>
          <Text style={styles.prompt}>{quiz.prompt}</Text>
          <View style={styles.clueBlock}>
            {quiz.clues.map((clue) => (
              <Text key={clue} style={styles.clueText}>
                ・{clue}
              </Text>
            ))}
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "未挑戦"}
            </Text>
            <Text style={styles.metaText}>報酬 +{quiz.reward.affection ?? 0}</Text>
          </View>
          <Link href={`/mini/${quiz.id}`} asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>挑戦する</Text>
            </Pressable>
          </Link>
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
  body: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
    gap: 12,
  },
  prompt: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  clueBlock: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 6,
  },
  clueText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaText: {
    color: palette.muted,
    fontSize: 13,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.mint,
  },
  buttonText: {
    color: palette.night,
    fontWeight: "700",
  },
});
