import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
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
      subtitle="添付の思考力問題だけを、Case Grid / Case Layout / Rule Forge の3分類で並べた一覧です。"
    >
      <View style={styles.screen}>
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
                <Text style={styles.primaryButtonText}>この分類の続き</Text>
              </View>
            </Link>
          </View>
        </SectionCard>

        <SectionCard style={styles.flexCard} tone="highlight">
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
            <Text style={styles.modeTitle}>{currentMode.label}</Text>
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
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  flexCard: {
    flex: 1,
    minHeight: 0,
  },
  modeBody: {
    flex: 1,
    minHeight: 0,
    gap: 10,
    justifyContent: "center",
  },
  modeTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
  },
  modeText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  quizCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  quizTitle: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  quizState: {
    color: palette.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
  },
  quizPrompt: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 19,
  },
  quizMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  primaryButtonText: {
    color: palette.night,
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
});
