import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { PagerControls } from "../components/PagerControls";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { getCaseboardModeMeta } from "../lib/caseboard";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { logicQuizData } from "../lib/content";
import { withBuildStamp } from "../lib/navigation";
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
      title="今日の CASEBOARD"
      subtitle={`${todayKey} の出題。Case Grid / Case Layout / Rule Forge を 1 問ずつ。`}
    >
      <SectionCard
        title={quiz.title}
        subtitle={`${getCaseboardModeMeta(quiz).label} / ${quiz.sourceRef}`}
        style={styles.card}
      >
        <PagerControls
          items={selection.map((item) => ({
            id: item.id,
            label: item.title,
            meta: getCaseboardModeMeta(item).label,
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
          <Link href={withBuildStamp(`/caseboard/${quiz.id}`)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>ケースを開く</Text>
            </View>
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
