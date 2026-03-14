import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
      <SectionCard title="章内ナビ" subtitle={`${currentIndex + 1}/${chapter.episodes.length}`}>
        <View style={styles.episodeTabs}>
          {chapter.episodes.map((item, index) => {
            const active = index === currentIndex;
            const complete = readEpisodeIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[styles.episodeTab, active && styles.episodeTabActive]}
                onPress={() => setCurrentIndex(index)}
              >
                <Text style={styles.episodeTabTitle}>{item.title}</Text>
                <Text style={styles.episodeTabMeta}>{complete ? "読了" : "未読"}</Text>
              </Pressable>
            );
          })}
        </View>
      </SectionCard>

      <StoryPlayer episode={episode} accent={character?.accent ?? palette.violet} />

      <SectionCard title="操作" subtitle="読了後にミッションへ進む導線">
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
            <Text style={styles.ghostText}>前へ</Text>
          </Pressable>
          <Pressable
            style={styles.ghostButton}
            disabled={currentIndex === chapter.episodes.length - 1}
            onPress={() =>
              setCurrentIndex((value) => Math.min(chapter.episodes.length - 1, value + 1))}
          >
            <Text style={styles.ghostText}>次へ</Text>
          </Pressable>
        </View>
        {episode.quizIds.length
          ? (
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
          )
          : (
            <Text style={styles.metaText}>このエピソードには読解ミッションはありません。</Text>
          )}
      </SectionCard>

      {episode.glossaryUnlockIds.length
        ? (
          <SectionCard title="解放される用語">
            <View style={styles.tokenRow}>
              {episode.glossaryUnlockIds.map((glossaryId) => {
                const unlocked = unlockedGlossaryIds.includes(glossaryId);
                return (
                  <View
                    key={glossaryId}
                    style={[styles.token, unlocked && styles.tokenUnlocked]}
                  >
                    <Text style={styles.tokenText}>{glossaryId}</Text>
                  </View>
                );
              })}
            </View>
          </SectionCard>
        )
        : null}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  episodeTabs: {
    gap: 8,
  },
  episodeTab: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 4,
  },
  episodeTabActive: {
    borderColor: "rgba(242,198,109,0.55)",
    backgroundColor: "rgba(242,198,109,0.12)",
  },
  episodeTabTitle: {
    color: palette.text,
    fontWeight: "700",
  },
  episodeTabMeta: {
    color: palette.muted,
    fontSize: 12,
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
