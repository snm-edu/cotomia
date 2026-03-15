import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LogicQuizRenderer } from "../../components/LogicQuizRenderer";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { getCaseboardModeMeta } from "../../lib/caseboard";
import { logicQuizById, logicQuizData } from "../../lib/content";
import { withBuildStamp } from "../../lib/navigation";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return logicQuizData.map((quiz) => ({ id: quiz.id }));
}

export default function CaseboardQuizScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const quizId = typeof params.id === "string" ? params.id : "";
  const quiz = logicQuizById[quizId];
  const completedLogicQuizIds = useGameStore((state) => state.completedLogicQuizIds);
  const submitLogicQuiz = useGameStore((state) => state.submitLogicQuiz);

  if (!quiz) {
    return (
      <ScreenFrame title="CASEBOARD" subtitle="ケースが見つかりません。">
        <SectionCard>
          <Link href={withBuildStamp("/caseboard")}>
            <View style={styles.linkButton}>
              <Text style={styles.linkButtonText}>CASEBOARD 一覧へ戻る</Text>
            </View>
          </Link>
        </SectionCard>
      </ScreenFrame>
    );
  }

  const mode = getCaseboardModeMeta(quiz);

  return (
    <ScreenFrame
      title="CASEBOARD"
      subtitle={`${mode.label} / ${mode.description}`}
      style={styles.screen}
    >
      <SectionCard
        title={quiz.title}
        subtitle={`${quiz.sourceRef} / ${completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "NEW"}`}
      >
        <Text style={styles.summaryText}>{quiz.prompt}</Text>
        <View style={styles.linkRow}>
          <Link href={withBuildStamp("/caseboard")}>
            <View style={styles.linkButton}>
              <Text style={styles.linkButtonText}>一覧へ戻る</Text>
            </View>
          </Link>
          <Link href={withBuildStamp("/daily")}>
            <View style={styles.linkButton}>
              <Text style={styles.linkButtonText}>今日の3ケース</Text>
            </View>
          </Link>
        </View>
      </SectionCard>

      <LogicQuizRenderer
        quiz={quiz}
        completed={completedLogicQuizIds.includes(quiz.id)}
        onSolved={() => submitLogicQuiz(quiz.id, quiz.reward)}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 12,
  },
  summaryText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  linkButtonText: {
    color: palette.text,
    fontWeight: "700",
  },
});
