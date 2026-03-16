import { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
      subtitle="添付の pre_shikou.pdf / pre_shikou_kaitou.pdf 由来の思考力問題だけを、見やすいスマホUIで遊ぶデモです。"
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
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
          title="思考パズルだけを遊ぶ"
          subtitle="読解やストーリーは見せず、原問の条件整理に集中できる形へ寄せています。"
          tone="highlight"
        >
          <View style={styles.heroRibbon}>
            <Text style={styles.heroRibbonText}>かわいく、でも整理しやすく。</Text>
          </View>
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
            <HomeAction label="続きから遊ぶ" href={`/caseboard/${nextQuiz.id}`} tone="primary" />
            <HomeAction label="問題一覧を見る" href="/caseboard" tone="secondary" />
            <HomeAction label="今日の3題へ" href="/daily" tone="secondary" />
          </View>
        </SectionCard>

        <SectionCard title="分類から選ぶ" subtitle="3モードの中から、今日進めたい種類を選びます。">
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
            <View style={styles.modeHeading}>
              <Text style={styles.focusTitle}>{currentMode.label}</Text>
              <View style={styles.modeBadge}>
                <Text style={styles.modeBadgeText}>{currentMode.eyebrow}</Text>
              </View>
            </View>
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
      </ScrollView>
    </ScreenFrame>
  );
}

function HomeAction({
  label,
  href,
  tone,
}: {
  label: string;
  href: string;
  tone: "primary" | "secondary";
}) {
  return (
    <Link href={withBuildStamp(href)}>
      <View style={[styles.actionPill, tone === "primary" ? styles.actionPrimary : styles.actionSecondary]}>
        <Text
          style={[
            styles.actionPillText,
            tone === "primary" ? styles.actionPrimaryText : styles.actionSecondaryText,
          ]}
        >
          {label}
        </Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  warningText: {
    color: palette.warning,
    fontSize: 14,
    lineHeight: 21,
  },
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
  ctaRow: {
    gap: 10,
  },
  heroRibbon: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 180, 207, 0.16)",
  },
  heroRibbonText: {
    color: palette.rose,
    fontSize: 12,
    fontWeight: "700",
  },
  deckBody: {
    gap: 12,
  },
  actionPill: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  actionPillText: {
    fontSize: 15,
    fontWeight: "800",
  },
  actionPrimary: {
    backgroundColor: palette.peach,
    borderColor: "rgba(255, 210, 122, 0.22)",
  },
  actionSecondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  actionPrimaryText: {
    color: palette.night,
  },
  actionSecondaryText: {
    color: palette.text,
  },
  modeHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  modeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(146, 228, 210, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(146, 228, 210, 0.24)",
  },
  modeBadgeText: {
    color: palette.mint,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  focusTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
  },
  bodyText: {
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
    color: palette.text,
    minWidth: 180,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
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
});
