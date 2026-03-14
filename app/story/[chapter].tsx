import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PagerControls } from "../../components/PagerControls";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { StoryPlayer } from "../../components/StoryPlayer";
import { chapterById, chapters, characterById, readingQuizById } from "../../lib/content";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export function generateStaticParams() {
  return chapters.map((chapter) => ({ chapter: chapter.id }));
}

export default function ChapterScreen() {
  const params = useLocalSearchParams<{ chapter?: string }>();
  const router = useRouter();
  const chapterId = typeof params.chapter === "string" ? params.chapter : "";
  const chapter = chapterById[chapterId];
  const [currentIndex, setCurrentIndex] = useState(0);

  const readEpisodeIds = useGameStore((state) => state.readEpisodeIds);
  const completedReadingQuizIds = useGameStore((state) => state.completedReadingQuizIds);
  const advanceEpisode = useGameStore((state) => state.advanceEpisode);
  const unlockedGlossaryIds = useGameStore((state) => state.unlockedGlossaryIds);

  useEffect(() => {
    if (!chapter) {
      return;
    }
    const firstUnread = chapter.episodes.findIndex(
      (episode) => !readEpisodeIds.includes(episode.id),
    );
    setCurrentIndex(firstUnread >= 0 ? firstUnread : 0);
  }, [chapter, readEpisodeIds]);

  if (!chapter) {
    return (
      <ScreenFrame title="章が見つかりません" subtitle="ルートの指定を確認してください。">
        <SectionCard>
          <Text style={styles.bodyText}>存在しない chapter id です。</Text>
        </SectionCard>
      </ScreenFrame>
    );
  }

  const episode = chapter.episodes[currentIndex];
  const character = characterById[episode.featuredCharacterId];
  const isRead = readEpisodeIds.includes(episode.id);

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
            onChange={setCurrentIndex}
          />
          <StoryPlayer episode={episode} accent={character?.accent ?? palette.violet} />
        </SectionCard>

        <SectionCard title="操作" subtitle="読了とミッション、次話への導線" style={styles.actionCard}>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.actionButton, isRead && styles.actionButtonMuted]}
              onPress={() => advanceEpisode(episode.id, episode.glossaryUnlockIds)}
            >
              <Text style={styles.actionText}>{isRead ? "読了済み" : "読了にする"}</Text>
            </Pressable>
            <Pressable
              style={styles.ghostButton}
              disabled={currentIndex === 0}
              onPress={() => setCurrentIndex((value) => Math.max(0, value - 1))}
            >
              <Text style={styles.ghostText}>前話</Text>
            </Pressable>
            <Pressable
              style={styles.ghostButton}
              disabled={currentIndex === chapter.episodes.length - 1}
              onPress={() =>
                setCurrentIndex((value) => Math.min(chapter.episodes.length - 1, value + 1))}
            >
              <Text style={styles.ghostText}>次話</Text>
            </Pressable>
          </View>

          {episode.quizIds.length ? (
            <View style={styles.quizList}>
              {episode.quizIds.map((quizId) => {
                const quiz = readingQuizById[quizId];
                const solved = completedReadingQuizIds.includes(quizId);
                return (
                  <Pressable
                    key={quizId}
                    style={styles.quizButton}
                    onPress={() =>
                      router.push({ pathname: "/quiz/[id]", params: { id: quizId } })}
                  >
                    <Text style={styles.quizButtonTitle}>{quiz.title}</Text>
                    <Text style={styles.quizButtonMeta}>{solved ? "CLEAR" : "未挑戦"}</Text>
                  </Pressable>
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
