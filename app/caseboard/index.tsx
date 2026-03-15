import { useMemo, useState } from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PagerControls } from "../../components/PagerControls";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { StatChip } from "../../components/StatChip";
import { caseboardModes } from "../../lib/caseboard";
import {
  caseboardCaseData,
  getNextUnclearedCaseboardCase,
} from "../../lib/caseboardContent";
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
        quizzes: caseboardCaseData.filter((puzzle) => puzzle.mode === mode.id),
        sourceQuizzes: logicQuizData.filter((quiz) => {
          if (mode.id === "case_grid") {
            return quiz.type === "truth_logic";
          }
          if (mode.id === "case_layout") {
            return quiz.type === "seat_puzzle";
          }
          return quiz.type === "order_sort";
        }),
      })),
    [],
  );
  const [modeIndex, setModeIndex] = useState(0);
  const [caseIndexes, setCaseIndexes] = useState<Record<string, number>>({
    case_grid: 0,
    case_layout: 0,
    rule_forge: 0,
  });

  const currentMode = modeGroups[modeIndex];
  const currentCaseIndex = caseIndexes[currentMode.id] ?? 0;
  const currentQuiz = currentMode.quizzes[currentCaseIndex];
  const nextCase = getNextUnclearedCaseboardCase(completedLogicQuizIds) ?? caseboardCaseData[0];

  return (
    <ScreenFrame
      title="CASEBOARD demo"
      subtitle="思考力だけのスマホ試作導線。捜査ボードの感覚で、消去・配置・規則の3タイプを切り替えて確認する。"
    >
      <View style={styles.screen}>
        <SectionCard
          title="Mode overview"
          subtitle="読解とは切り離した導線です。1問1ケースで、論理整理の触り心地を先に確認します。"
        >
          <View style={styles.statsRow}>
            <StatChip label="Mode" value={modeGroups.length} />
            <StatChip label="Case" value={caseboardCaseData.length} />
            <StatChip
              label="Clear"
              value={caseboardCaseData.filter((puzzle) => completedLogicQuizIds.includes(puzzle.id)).length}
            />
          </View>
          <View style={styles.linkRow}>
            <Link href={withBuildStamp(`/caseboard/${nextCase.id}`)}>
              <View style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>続きから再開</Text>
              </View>
            </Link>
            <Link href={withBuildStamp("/")}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>コトミアへ戻る</Text>
              </View>
            </Link>
          </View>
        </SectionCard>

        <SectionCard style={styles.flexCard} tone="highlight">
          <PagerControls
            items={modeGroups.map((mode) => ({
              id: mode.id,
              label: mode.label,
              meta: `${mode.quizzes.length} cases`,
              stateLabel: mode.eyebrow,
            }))}
            index={modeIndex}
            onChange={setModeIndex}
          />

          <View style={styles.modeBody}>
            <Text style={styles.modeTitle}>{currentMode.label}</Text>
            <Text style={styles.modeText}>{currentMode.description}</Text>

            <PagerControls
              items={currentMode.quizzes.map((quiz) => ({
                id: quiz.id,
                label: quiz.title,
                meta: `${quiz.estimatedMinutes} min`,
                stateLabel: completedLogicQuizIds.includes(quiz.id) ? "clear" : "new",
              }))}
              index={currentCaseIndex}
              onChange={(index) =>
                setCaseIndexes((current) => ({
                  ...current,
                  [currentMode.id]: index,
                }))}
            />

            <View style={styles.previewCard}>
              <Text style={styles.previewEyebrow}>{currentMode.eyebrow}</Text>
              <Text style={styles.previewTitle}>{currentQuiz.title}</Text>
              <Text style={styles.previewText}>{currentQuiz.missionText}</Text>
              <View style={styles.clueBlock}>
                {currentQuiz.clueCards.slice(0, 2).map((clue) => (
                  <Text key={clue.id} style={styles.clueText}>
                    ・{clue.text}
                  </Text>
                ))}
              </View>
              <View style={styles.linkRow}>
                <Link href={withBuildStamp(`/caseboard/${currentQuiz.id}`)}>
                  <View style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>ケースを開く</Text>
                  </View>
                </Link>
              </View>
            </View>

            <View style={styles.previewCard}>
              <Text style={styles.previewEyebrow}>PDF CASES</Text>
              <Text style={styles.previewTitle}>添付PDFの実問題</Text>
              <Text style={styles.previewText}>
                {currentMode.label} として先に触れる原問変換版です。勤務表、リーグ戦、寮の部屋割りなどはここから入れます。
              </Text>
              <View style={styles.sourceList}>
                {currentMode.sourceQuizzes.map((quiz) => (
                  <Link key={quiz.id} href={withBuildStamp(`/mini/${quiz.id}`)}>
                    <View style={styles.sourceCard}>
                      <View style={styles.sourceCardHeader}>
                        <Text style={styles.sourceCardTitle}>{quiz.title}</Text>
                        <Text style={styles.sourceCardState}>
                          {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "PDF"}
                        </Text>
                      </View>
                      <Text style={styles.sourceCardText}>{quiz.prompt}</Text>
                    </View>
                  </Link>
                ))}
              </View>
            </View>
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
  previewCard: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  previewEyebrow: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  previewTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  previewText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  clueBlock: {
    gap: 4,
  },
  clueText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  sourceList: {
    gap: 8,
  },
  sourceCard: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  sourceCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  sourceCardTitle: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  sourceCardState: {
    color: palette.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
  },
  sourceCardText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
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
