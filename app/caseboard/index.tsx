import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PagerControls } from "../../components/PagerControls";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { StatChip } from "../../components/StatChip";
import {
  caseboardModes,
  getCaseboardCasesByMode,
  getCaseboardModeMeta,
} from "../../lib/caseboard";
import { logicQuizData } from "../../lib/content";
import { withBuildStamp } from "../../lib/navigation";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export default function CaseboardIndexScreen() {
  const completedLogicQuizIds = useGameStore((state) => state.completedLogicQuizIds);
  const modeGroups = useMemo(
    () =>
      caseboardModes.map((mode) => ({
        ...mode,
        quizzes: getCaseboardCasesByMode(mode.id),
      })),
    [],
  );
  const [modeIndex, setModeIndex] = useState(0);
  const currentMode = modeGroups[modeIndex];
  const nextQuiz =
    currentMode.quizzes.find((quiz) => !completedLogicQuizIds.includes(quiz.id)) ??
    currentMode.quizzes[0];

  return (
    <ScreenFrame
      title="CASEBOARD 問題一覧"
      subtitle="添付の思考力問題だけを、Case Grid / Case Layout / Rule Forge の3分類で見やすく並べた一覧です。"
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="収録範囲" subtitle="pre_shikou.pdf 由来の問題のみを掲載。">
          <View style={styles.statsRow}>
            <StatChip label="Total" value={logicQuizData.length} />
            <StatChip label="Mode" value={modeGroups.length} />
            <StatChip
              label="Clear"
              value={logicQuizData.filter((quiz) => completedLogicQuizIds.includes(quiz.id)).length}
            />
          </View>
          <View style={styles.linkRow}>
            <Link href={withBuildStamp("/")}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>ホームへ戻る</Text>
              </View>
            </Link>
            <Link href={withBuildStamp(`/caseboard/${nextQuiz.id}`)}>
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>この分類の続きへ</Text>
              </View>
            </Link>
          </View>
        </SectionCard>

        <SectionCard
          title="モード別の出題"
          subtitle="気分に合わせて、消し込み・配置・規則の3種類から選べます。"
          tone="highlight"
        >
          <PagerControls
            items={modeGroups.map((mode) => ({
              id: mode.id,
              label: mode.label,
              meta: `${mode.quizzes.length} 問`,
              stateLabel: mode.eyebrow,
            }))}
            index={modeIndex}
            onChange={setModeIndex}
          />

          <View style={styles.modeBody}>
            <View style={styles.modeHeading}>
              <Text style={styles.modeTitle}>{currentMode.label}</Text>
              <View style={styles.modePill}>
                <Text style={styles.modePillText}>{currentMode.eyebrow}</Text>
              </View>
            </View>
            <Text style={styles.modeText}>{currentMode.description}</Text>

            {currentMode.quizzes.map((quiz) => (
              <Link key={quiz.id} href={withBuildStamp(`/caseboard/${quiz.id}`)}>
                <View style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizState}>
                      {completedLogicQuizIds.includes(quiz.id)
                        ? "CLEAR"
                        : getCaseboardModeMeta(quiz).shortLabel}
                    </Text>
                  </View>
                  <Text style={styles.quizPrompt}>{quiz.prompt}</Text>
                  <Text style={styles.quizMeta}>{quiz.sourceRef}</Text>
                </View>
              </Link>
            ))}
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
    gap: 14,
    paddingBottom: 28,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modeBody: {
    gap: 12,
  },
  modeHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  modePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 199, 168, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 122, 0.2)",
  },
  modePillText: {
    color: palette.peach,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  modeTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
  },
  modeText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
  },
  quizCard: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  quizTitle: {
    flex: 1,
    minWidth: 180,
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  quizState: {
    color: palette.peach,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.9,
  },
  quizPrompt: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  quizMeta: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  linkRow: {
    gap: 10,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    backgroundColor: palette.peach,
    alignItems: "center",
  },
  primaryButtonText: {
    color: palette.night,
    fontSize: 15,
    fontWeight: "800",
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
