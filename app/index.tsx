import { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PagerControls } from "../components/PagerControls";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { StatChip } from "../components/StatChip";
import {
  caseboardModes,
  getCaseboardCasesByMode,
  getCaseboardModeMeta,
} from "../lib/caseboard";
import { contentIssues, logicQuizData } from "../lib/content";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { withBuildStamp } from "../lib/navigation";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function HomeScreen() {
  const [modeIndex, setModeIndex] = useState(0);
  const { hydrated, hydrateProgress, claimDailyLogin, completedLogicQuizIds } = useGameStore();

  useEffect(() => {
    hydrateProgress();
  }, [hydrateProgress]);

  const todayKey = getLocalDateKey();
  useEffect(() => {
    if (hydrated) {
      claimDailyLogin(todayKey);
    }
  }, [claimDailyLogin, hydrated, todayKey]);

  const nextQuiz = logicQuizData.find((quiz) => !completedLogicQuizIds.includes(quiz.id)) ?? logicQuizData[0];
  const dailySelection = getDailyLogicSelection(logicQuizData, todayKey);
  const modeGroups = useMemo(
    () =>
      caseboardModes.map((mode) => ({
        ...mode,
        quizzes: getCaseboardCasesByMode(mode.id),
      })),
    [],
  );
  const currentMode = modeGroups[modeIndex];

  return (
    <ScreenFrame
      title="CASEBOARD"
      subtitle="添付の pre_shikou.pdf / pre_shikou_kaitou.pdf 由来の思考力問題だけを収録したスマホデモ。"
    >
      <View style={styles.screen}>
        {contentIssues.length ? (
          <SectionCard title="コンテンツ検証エラー" subtitle="dev 用の安全表示です。" tone="warning">
            {contentIssues.slice(0, 2).map((issue) => (
              <Text key={issue} style={styles.warningText}>
                ・{issue}
              </Text>
            ))}
          </SectionCard>
        ) : null}

        <SectionCard
          title="添付PDFの問題だけ"
          subtitle="読解、ストーリー、独自ケースは前面に出さず、思考力問題の原問変換だけを見せます。"
          tone="highlight"
        >
          <View style={styles.statsRow}>
            <StatChip label="Total" value={logicQuizData.length} />
            <StatChip
              label="Clear"
              value={logicQuizData.filter((quiz) => completedLogicQuizIds.includes(quiz.id)).length}
            />
            <StatChip label="Daily" value={dailySelection.length} />
          </View>
          <Text style={styles.bodyText}>
            次に開く問題: {nextQuiz.title} / {getCaseboardModeMeta(nextQuiz).label}
          </Text>
          <View style={styles.ctaRow}>
            <HomeAction label="続きから" href={`/caseboard/${nextQuiz.id}`} />
            <HomeAction label="問題一覧" href="/caseboard" />
            <HomeAction label="今日の3題" href="/daily" />
          </View>
        </SectionCard>

        <SectionCard style={styles.flexCard}>
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

          <View style={styles.deckBody}>
            <Text style={styles.focusTitle}>{currentMode.label}</Text>
            <Text style={styles.bodyText}>{currentMode.description}</Text>
            {currentMode.quizzes.map((quiz) => (
              <Link key={quiz.id} href={withBuildStamp(`/caseboard/${quiz.id}`)}>
                <View style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <Text style={styles.quizTitle}>{quiz.title}</Text>
                    <Text style={styles.quizState}>
                      {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "PDF"}
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

function HomeAction({ label, href }: { label: string; href: string }) {
  return (
    <Link href={withBuildStamp(href)}>
      <View style={styles.actionPill}>
        <Text style={styles.actionPillText}>{label}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  warningText: {
    color: palette.warning,
    fontSize: 13,
    lineHeight: 20,
  },
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
  ctaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  flexCard: {
    flex: 1,
    minHeight: 0,
  },
  deckBody: {
    flex: 1,
    minHeight: 0,
    gap: 10,
    justifyContent: "center",
  },
  actionPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  actionPillText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  focusTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  bodyText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  quizCard: {
    padding: 12,
    borderRadius: radii.lg,
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
    fontSize: 15,
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
    fontSize: 14,
    lineHeight: 20,
  },
  quizMeta: {
    color: palette.muted,
    fontSize: 12,
  },
});
