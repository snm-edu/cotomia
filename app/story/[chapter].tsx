import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { PagerControls } from "../../components/PagerControls";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { StoryPlayer } from "../../components/StoryPlayer";
import { chapterById, chapters, characterById, episodeById, readingQuizById } from "../../lib/content";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return chapters.map((chapter) => ({ chapter: chapter.id }));
}

export default function ChapterScreen() {
  const params = useLocalSearchParams<{
    chapter?: string;
    episode?: string;
    line?: string;
    advance?: string;
  }>();
  const chapterId = typeof params.chapter === "string" ? params.chapter : "";
  const chapter = chapterById[chapterId];

  const readEpisodeIds = useGameStore((state) => state.readEpisodeIds);
  const completedReadingQuizIds = useGameStore((state) => state.completedReadingQuizIds);
  const advanceEpisode = useGameStore((state) => state.advanceEpisode);
  const unlockedGlossaryIds = useGameStore((state) => state.unlockedGlossaryIds);
  const pendingAdvanceId = typeof params.advance === "string" ? params.advance : null;

  if (!chapter) {
    return (
      <ScreenFrame title="章が見つかりません" subtitle="ルートの指定を確認してください。">
        <SectionCard>
          <Text style={styles.bodyText}>存在しない chapter id です。</Text>
        </SectionCard>
      </ScreenFrame>
    );
  }

  const defaultEpisodeIndex = Math.max(
    chapter.episodes.findIndex((episode) => !readEpisodeIds.includes(episode.id)),
    0,
  );
  const requestedEpisodeIndex = Number.parseInt(
    typeof params.episode === "string" ? params.episode : `${defaultEpisodeIndex}`,
    10,
  );
  const currentIndex = Number.isFinite(requestedEpisodeIndex)
    ? Math.min(Math.max(requestedEpisodeIndex, 0), chapter.episodes.length - 1)
    : defaultEpisodeIndex;
  const episode = chapter.episodes[currentIndex];
  const requestedLineIndex = Number.parseInt(typeof params.line === "string" ? params.line : "0", 10);
  const currentLineIndex = Number.isFinite(requestedLineIndex)
    ? Math.min(Math.max(requestedLineIndex, 0), episode.lines.length - 1)
    : 0;
  const character = characterById[episode.featuredCharacterId];
  const isRead = readEpisodeIds.includes(episode.id);
  const nextEpisodeIndex = Math.min(currentIndex + 1, chapter.episodes.length - 1);
  const hasNextEpisode = currentIndex < chapter.episodes.length - 1;

  useEffect(() => {
    if (!pendingAdvanceId || readEpisodeIds.includes(pendingAdvanceId)) {
      return;
    }

    const pendingEpisode = episodeById[pendingAdvanceId];
    advanceEpisode(pendingAdvanceId, pendingEpisode?.glossaryUnlockIds ?? []);
  }, [advanceEpisode, pendingAdvanceId, readEpisodeIds]);

  return (
    <ScreenFrame title={chapter.title} subtitle={chapter.subtitle}>
      <View style={styles.screen}>
        <SectionCard tone="highlight" style={styles.storyCard}>
          <PagerControls
            items={chapter.episodes.map((item) => ({
              id: item.id,
              label: item.title,
              meta: item.summary,
              stateLabel: readEpisodeIds.includes(item.id) ? "read" : "new",
            }))}
            index={currentIndex}
            onChange={() => {}}
            getHref={(index) => buildChapterHref(chapter.id, index, 0)}
          />
          <StoryPlayer
            episode={episode}
            accent={character?.accent ?? palette.violet}
            lineIndex={currentLineIndex}
            onLineChange={() => {}}
            getLineHref={(index) => buildChapterHref(chapter.id, currentIndex, index)}
          />
        </SectionCard>

        <SectionCard title="操作" subtitle="読了とミッション、次話への導線" style={styles.actionCard}>
          <View style={styles.buttonRow}>
            <Link href={buildAdvanceHref(chapter.id, hasNextEpisode ? nextEpisodeIndex : currentIndex, episode.id)}>
              <View style={StyleSheet.flatten([styles.actionButton, isRead && styles.actionButtonMuted])}>
                <Text style={styles.actionText}>{isRead ? "読了済み" : "読了にする"}</Text>
              </View>
            </Link>
            {currentIndex > 0 ? (
              <Link href={buildChapterHref(chapter.id, currentIndex - 1, 0)}>
                <View style={styles.ghostButton}>
                  <Text style={styles.ghostText}>前話</Text>
                </View>
              </Link>
            ) : (
              <View style={[styles.ghostButton, styles.ghostButtonDisabled]}>
                <Text style={styles.ghostText}>前話</Text>
              </View>
            )}
            {currentIndex < chapter.episodes.length - 1 ? (
              <Link href={buildChapterHref(chapter.id, currentIndex + 1, 0)}>
                <View style={styles.ghostButton}>
                  <Text style={styles.ghostText}>次話</Text>
                </View>
              </Link>
            ) : (
              <View style={[styles.ghostButton, styles.ghostButtonDisabled]}>
                <Text style={styles.ghostText}>次話</Text>
              </View>
            )}
          </View>

          {episode.quizIds.length ? (
            <View style={styles.quizList}>
              {episode.quizIds.map((quizId) => {
                const quiz = readingQuizById[quizId];
                const solved = completedReadingQuizIds.includes(quizId);
                return (
                  <Link key={quizId} href={`/quiz/${quizId}`} asChild>
                    <Pressable style={styles.quizButton}>
                      <Text style={styles.quizButtonTitle}>{quiz.title}</Text>
                      <Text style={styles.quizButtonMeta}>{solved ? "CLEAR" : "未挑戦"}</Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          ) : (
            <Text style={styles.metaText}>この話には読解ミッションはありません。</Text>
          )}

          {episode.glossaryUnlockIds.length ? (
            <View style={styles.tokenRow}>
              {episode.glossaryUnlockIds.map((glossaryId) => {
                const unlocked = unlockedGlossaryIds.includes(glossaryId);
                return (
                  <View key={glossaryId} style={[styles.token, unlocked && styles.tokenUnlocked]}>
                    <Text style={styles.tokenText}>{glossaryId}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
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
  storyCard: {
    flex: 1,
    minHeight: 0,
  },
  actionCard: {
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  actionButtonMuted: {
    backgroundColor: "#756340",
  },
  actionText: {
    color: palette.night,
    fontWeight: "700",
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  ghostButtonDisabled: {
    opacity: 0.45,
  },
  ghostText: {
    color: palette.text,
    fontWeight: "600",
  },
  quizList: {
    gap: 8,
  },
  quizButton: {
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 4,
  },
  quizButtonTitle: {
    color: palette.text,
    fontWeight: "700",
  },
  quizButtonMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  metaText: {
    color: palette.muted,
    lineHeight: 20,
  },
  bodyText: {
    color: palette.text,
  },
  tokenRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 2,
  },
  token: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  tokenUnlocked: {
    backgroundColor: "rgba(129,214,197,0.12)",
  },
  tokenText: {
    color: palette.text,
    fontSize: 12,
  },
});

function buildChapterHref(chapterId: string, episodeIndex: number, lineIndex: number) {
  return `/story/${chapterId}?episode=${episodeIndex}&line=${lineIndex}`;
}

function buildAdvanceHref(chapterId: string, nextEpisodeIndex: number, episodeId: string) {
  return `/story/${chapterId}?episode=${nextEpisodeIndex}&line=0&advance=${episodeId}`;
}
