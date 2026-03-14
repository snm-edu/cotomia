import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { StatChip } from "../components/StatChip";
import {
  chapters,
  contentIssues,
  episodes,
  getChapterProgress,
  getNextUnreadEpisode,
  glossaryData,
  logicQuizData,
} from "../lib/content";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function HomeScreen() {
  const router = useRouter();
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

  return (
    <ScreenFrame
      title="アスクレピオス学園"
      subtitle="神話を読み、ことばを拾い、論理を解いて推しと世界を育てる。"
    >
      {contentIssues.length
        ? (
          <SectionCard title="コンテンツ検証エラー" subtitle="dev 用の安全表示です。" tone="warning">
            {contentIssues.map((issue) => (
              <Text key={issue} style={styles.warningText}>
                ・{issue}
              </Text>
            ))}
          </SectionCard>
        )
        : null}

      <SectionCard
        title="今日の放課後ループ"
        subtitle={hydrated ? `ログイン日: ${todayKey}` : "保存データを読み込み中"}
        tone="highlight"
      >
        <View style={styles.statsRow}>
          <StatChip label="好感度合計" value={totalAffection} />
          <StatChip label="星しずく" value={coins} />
          <StatChip label="種" value={seeds} />
          <StatChip label="用語解放" value={`${unlockedGlossaryIds.length}/${glossaryData.length}`} />
        </View>
        <View style={styles.ctaRow}>
          <HomeAction label="診療録を読む" onPress={() => router.push("/story")} />
          <HomeAction label="デイリー思考" onPress={() => router.push("/daily")} />
        </View>
      </SectionCard>

      {nextEpisode
        ? (
          <SectionCard
            title="次の未読エピソード"
            subtitle={`${nextEpisode.title} / ${nextEpisode.sourceRef}`}
          >
            <Text style={styles.bodyText}>{nextEpisode.summary}</Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() =>
                router.push({
                  pathname: "/story/[chapter]",
                  params: {
                    chapter:
                      chapters.find((chapter) =>
                        chapter.episodes.some((episode) => episode.id === nextEpisode.id),
                      )?.id ?? "chapter-1",
                  },
                })}
            >
              <Text style={styles.primaryButtonText}>続きから読む</Text>
            </Pressable>
          </SectionCard>
        )
        : null}

      <SectionCard title="今日の思考ミニゲーム" subtitle="日付で 3 種類をローテーション">
        {dailySelection.map((quiz) => (
          <Pressable
            key={quiz.id}
            style={styles.dailyCard}
            onPress={() => router.push({ pathname: "/mini/[id]", params: { id: quiz.id } })}
          >
            <View style={styles.dailyCardHeader}>
              <Text style={styles.dailyType}>{quiz.type}</Text>
              <Text style={styles.dailyDone}>
                {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "TODAY"}
              </Text>
            </View>
            <Text style={styles.dailyTitle}>{quiz.title}</Text>
            <Text style={styles.dailyPrompt}>{quiz.prompt}</Text>
          </Pressable>
        ))}
      </SectionCard>

      <SectionCard title="進行メモ" subtitle="章ごとの読了率とミッションの進み具合">
        {chapters.map((chapter) => (
          <View key={chapter.id} style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{chapter.title}</Text>
              <Text style={styles.progressValue}>
                {Math.round(getChapterProgress(chapter.id, readEpisodeIds) * 100)}%
              </Text>
            </View>
            <Text style={styles.progressMeta}>
              エピソード {chapter.episodes.filter((episode) => readEpisodeIds.includes(episode.id)).length}
              /{chapter.episodes.length} ・ 読解クリア {completedReadingQuizIds.length}
            </Text>
          </View>
        ))}
        <View style={styles.ctaRow}>
          <HomeAction label="キャラクター" onPress={() => router.push("/characters")} />
          <HomeAction label="用語集" onPress={() => router.push("/glossary")} />
          <HomeAction label="設定" onPress={() => router.push("/settings")} />
        </View>
      </SectionCard>
    </ScreenFrame>
  );
}

function HomeAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.actionPill} onPress={onPress}>
      <Text style={styles.actionPillText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  warningText: {
    color: palette.warning,
    fontSize: 13,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ctaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionPill: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  actionPillText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  bodyText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
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
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
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
    fontSize: 16,
    fontWeight: "700",
  },
  dailyPrompt: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
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
  },
});
