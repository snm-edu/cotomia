import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { PagerControls } from "../components/PagerControls";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { StatChip } from "../components/StatChip";
import {
  characterById,
  chapters,
  contentIssues,
  episodes,
  getChapterProgress,
  getNextUnreadEpisode,
  glossaryData,
  logicQuizData,
} from "../lib/content";
import { caseboardModes } from "../lib/caseboard";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { withBuildStamp } from "../lib/navigation";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function HomeScreen() {
  const [panelIndex, setPanelIndex] = useState(0);
  const {
    hydrated,
    hydrateProgress,
    claimDailyLogin,
    readEpisodeIds,
    completedReadingQuizIds,
    completedLogicQuizIds,
    unlockedGlossaryIds,
    characterAffection,
    coins,
    seeds,
  } = useGameStore();

  useEffect(() => {
    hydrateProgress();
  }, [hydrateProgress]);

  const todayKey = getLocalDateKey();
  useEffect(() => {
    if (hydrated) {
      claimDailyLogin(todayKey);
    }
  }, [claimDailyLogin, hydrated, todayKey]);

  const nextEpisode = getNextUnreadEpisode(readEpisodeIds) ?? episodes[0] ?? null;
  const dailySelection = getDailyLogicSelection(logicQuizData, todayKey);
  const totalAffection = Object.values(characterAffection).reduce((sum, value) => sum + value, 0);
  const topCharacters = Object.entries(characterAffection)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 2)
    .map(([id, value]) => ({ id, value }));

  const homePanels = useMemo(
    () => [
      {
        id: "next",
        label: "次の物語",
        meta: nextEpisode?.title ?? "全話読了",
        stateLabel: nextEpisode ? "story" : "done",
      },
      {
        id: "daily",
        label: "今日の思考",
        meta: `${dailySelection.length} 題`,
        stateLabel: "logic",
      },
      {
        id: "progress",
        label: "進行状況",
        meta: `${readEpisodeIds.length}/${episodes.length} 話既読`,
      },
      {
        id: "archive",
        label: "図鑑と設定",
        meta: `${unlockedGlossaryIds.length}/${glossaryData.length}`,
      },
    ],
    [dailySelection.length, nextEpisode, readEpisodeIds.length, unlockedGlossaryIds.length],
  );

  return (
    <ScreenFrame
      title="コトミア"
      subtitle="ことばを見つめ、物語を読み、論理を解いて親しみながら進む。"
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
          title="CASEBOARD smartphone demo"
          subtitle="読解とは切り離した、思考力だけの試作導線です。Case Grid / Case Layout / Rule Forge を直接確認できます。"
        >
          <Text style={styles.bodyText}>
            捜査ボード感のある導線で、論理消去・配置推理・規則発見の3タイプをスマホから触れるデモです。
          </Text>
          <View style={styles.statsRow}>
            <StatChip label="Mode" value={caseboardModes.length} />
            <StatChip label="Case" value={logicQuizData.length} />
            <StatChip label="Clear" value={completedLogicQuizIds.length} />
          </View>
          <View style={styles.ctaRow}>
            <HomeAction label="CASEBOARD" href="/caseboard" />
            <HomeAction label="今日の3ケース" href="/daily" />
          </View>
        </SectionCard>

        <SectionCard
          title="今日の放課後ループ"
          subtitle={hydrated ? `ログイン日: ${todayKey}` : "保存データを読み込み中"}
          tone="highlight"
        >
          <View style={styles.statsRow}>
            <StatChip label="好感度" value={totalAffection} />
            <StatChip label="星しずく" value={coins} />
            <StatChip label="種" value={seeds} />
            <StatChip label="用語" value={`${unlockedGlossaryIds.length}/${glossaryData.length}`} />
          </View>
          <View style={styles.ctaRow}>
            <HomeAction label="診療録" href="/story" />
            <HomeAction label="思考" href="/daily" />
          </View>
        </SectionCard>

        <SectionCard style={styles.panelCard}>
          <PagerControls items={homePanels} index={panelIndex} onChange={setPanelIndex} />

          <View style={styles.panelBody}>
            {panelIndex === 0 && nextEpisode ? (
              <>
                <Text style={styles.focusTitle}>{nextEpisode.title}</Text>
                <Text style={styles.bodyText}>{nextEpisode.summary}</Text>
                <Text style={styles.panelMeta}>{nextEpisode.sourceRef}</Text>
                <Link href={getChapterPathByEpisodeId(nextEpisode.id)}>
                  <View style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>続きから読む</Text>
                  </View>
                </Link>
              </>
            ) : null}

            {panelIndex === 0 && !nextEpisode ? (
              <>
                <Text style={styles.focusTitle}>いまは全話読了済みです</Text>
                <Text style={styles.bodyText}>
                  章一覧から好きな場面へ戻るか、デイリー思考と用語集で定着を進められます。
                </Text>
                <Link href={withBuildStamp("/story")}>
                  <View style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>章一覧へ</Text>
                  </View>
                </Link>
              </>
            ) : null}

            {panelIndex === 1 ? (
              <>
                {dailySelection.map((quiz) => (
                  <Link key={quiz.id} href={withBuildStamp(`/mini/${quiz.id}`)}>
                    <View style={styles.dailyCard}>
                      <View style={styles.dailyCardHeader}>
                        <Text style={styles.dailyType}>{quiz.type}</Text>
                        <Text style={styles.dailyDone}>
                          {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "TODAY"}
                        </Text>
                      </View>
                      <Text style={styles.dailyTitle}>{quiz.title}</Text>
                    </View>
                  </Link>
                ))}
                <HomeAction label="3題まとめて開く" href="/daily" />
              </>
            ) : null}

            {panelIndex === 2 ? (
              <>
                {chapters.map((chapter) => (
                  <View key={chapter.id} style={styles.progressBlock}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressTitle}>{chapter.title}</Text>
                      <Text style={styles.progressValue}>
                        {Math.round(getChapterProgress(chapter.id, readEpisodeIds) * 100)}%
                      </Text>
                    </View>
                    <Text style={styles.progressMeta}>
                      {chapter.episodes.filter((episode) => readEpisodeIds.includes(episode.id)).length}
                      /{chapter.episodes.length} 話 ・ 読解 {chapter.episodes
                        .flatMap((episode) => episode.quizIds)
                        .filter((quizId) => completedReadingQuizIds.includes(quizId)).length} クリア
                    </Text>
                  </View>
                ))}
              </>
            ) : null}

            {panelIndex === 3 ? (
              <>
                <Text style={styles.focusTitle}>図鑑の解放状況</Text>
                <Text style={styles.bodyText}>
                  用語は {unlockedGlossaryIds.length} 語。好感度上位は
                  {topCharacters
                    .map((character) =>
                      ` ${characterById[character.id]?.name ?? character.id}:${character.value}`)
                    .join(" / ")}
                  です。
                </Text>
                <View style={styles.ctaRow}>
                  <HomeAction label="キャラクター" href="/characters" />
                  <HomeAction label="用語集" href="/glossary" />
                  <HomeAction label="設定" href="/settings" />
                </View>
              </>
            ) : null}
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
  panelCard: {
    flex: 1,
    minHeight: 0,
  },
  panelBody: {
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
  panelMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  primaryButton: {
    alignSelf: "flex-start",
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
  dailyCard: {
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  dailyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dailyType: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  dailyDone: {
    color: palette.muted,
    fontSize: 12,
  },
  dailyTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  progressBlock: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.035)",
    gap: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  progressValue: {
    color: palette.gold,
    fontSize: 14,
    fontWeight: "700",
  },
  progressMeta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
});

function getChapterPathByEpisodeId(episodeId: string) {
  const chapterId =
    chapters.find((chapter) => chapter.episodes.some((episode) => episode.id === episodeId))?.id ??
    "chapter-1";
  return withBuildStamp(`/story/${chapterId}`);
}
