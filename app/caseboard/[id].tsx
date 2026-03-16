import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
      <ScreenFrame title="CASEBOARD" subtitle="問題が見つかりません。">
        <SectionCard>
          <Link href={withBuildStamp("/caseboard")}>
            <View style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>問題一覧へ戻る</Text>
            </View>
          </Link>
        </SectionCard>
      </ScreenFrame>
    );
  }

  const mode = getCaseboardModeMeta(quiz);

  return (
    <ScreenFrame
      title={quiz.title}
      subtitle={`${mode.label} / 添付PDFの原問変換`}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="ケース概要" subtitle={quiz.sourceRef}>
          <Text style={styles.summaryText}>{quiz.prompt}</Text>
          <View style={styles.linkRow}>
            <Link href={withBuildStamp("/caseboard")}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>問題一覧へ戻る</Text>
              </View>
            </Link>
            <Link href={withBuildStamp("/daily")}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>今日の3題へ</Text>
              </View>
            </Link>
          </View>
        </SectionCard>

        <LogicQuizRenderer
          quiz={quiz}
          completed={completedLogicQuizIds.includes(quiz.id)}
          onSolved={() => submitLogicQuiz(quiz.id, quiz.reward)}
        />
      </ScrollView>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    gap: 14,
    paddingBottom: 28,
  },
  summaryText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
  },
  linkRow: {
    gap: 10,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
