import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { CaseboardCaseRenderer } from "../../components/caseboard/CaseboardCaseRenderer";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { getCaseboardModeMeta } from "../../lib/caseboard";
import { caseboardCaseById, caseboardCaseData } from "../../lib/caseboardContent";
import { withBuildStamp } from "../../lib/navigation";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return caseboardCaseData.map((puzzle) => ({ id: puzzle.id }));
}

export default function CaseboardQuizScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const quizId = typeof params.id === "string" ? params.id : "";
  const quiz = caseboardCaseById[quizId];
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

  const mode = getCaseboardModeMeta(quiz.mode);

  return (
    <ScreenFrame
      title="CASEBOARD"
      subtitle={`${mode.label} / ${quiz.prompt}`}
      style={styles.screen}
    >
      <SectionCard
        title={quiz.title}
        subtitle={`${quiz.sourceRef} / ${completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "NEW"}`}
      >
        <Text style={styles.summaryText}>{quiz.goalText}</Text>
        <View style={styles.linkRow}>
          <Link href={withBuildStamp("/caseboard")}>
            <View style={styles.linkButton}>
              <Text style={styles.linkButtonText}>一覧へ戻る</Text>
            </View>
          </Link>
        </View>
      </SectionCard>

      <CaseboardCaseRenderer
        puzzle={quiz}
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
