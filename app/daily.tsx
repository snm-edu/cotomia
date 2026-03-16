import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard
          title={quiz.title}
          subtitle={`${getCaseboardModeMeta(quiz).label} / ${quiz.sourceRef}`}
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
              <Text style={styles.blockTitle}>今日の条件</Text>
              {quiz.clues.map((clue) => (
                <Text key={clue} style={styles.clueText}>
                  ・{clue}
                </Text>
              ))}
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>
                  {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "未挑戦"}
                </Text>
              </View>
              <View style={styles.metaPill}>
                <Text style={styles.metaText}>報酬 +{quiz.reward.affection ?? 0}</Text>
              </View>
            </View>
            <Link href={withBuildStamp(`/caseboard/${quiz.id}`)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>ケースを開く</Text>
              </View>
            </Link>
          </View>
        </SectionCard>
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingBottom: 28,
  },
  body: {
    gap: 14,
  },
  prompt: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
  },
  clueBlock: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 8,
  },
  blockTitle: {
    color: palette.peach,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  clueText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  metaText: {
    color: palette.muted,
    fontSize: 13,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    backgroundColor: palette.peach,
  },
  buttonText: {
    color: palette.night,
    fontSize: 15,
    fontWeight: "800",
  },
});
