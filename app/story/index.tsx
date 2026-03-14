import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PagerControls } from "../../components/PagerControls";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { chapters, getChapterProgress } from "../../lib/content";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export default function StoryIndexScreen() {
  const router = useRouter();
  const [chapterIndex, setChapterIndex] = useState(0);
  const readEpisodeIds = useGameStore((state) => state.readEpisodeIds);
  const chapter = chapters[chapterIndex];
  const completed = chapter.episodes.filter((episode) => readEpisodeIds.includes(episode.id)).length;
  const progress = Math.round(getChapterProgress(chapter.id, readEpisodeIds) * 100);

  return (
    <ScreenFrame
      title="診療録一覧"
      subtitle="章ごとに切り替えながら、物語の進行と未読話を確認します。"
    >
      <SectionCard
        title={chapter.title}
        subtitle={`${chapter.subtitle} / ${chapter.sourceRef}`}
        style={styles.card}
      >
        <PagerControls
          items={chapters.map((item) => ({
            id: item.id,
            label: item.title,
            meta: item.subtitle,
            stateLabel: `${Math.round(getChapterProgress(item.id, readEpisodeIds) * 100)}%`,
          }))}
          index={chapterIndex}
          onChange={setChapterIndex}
        />

        <View style={styles.body}>
          <Text style={styles.summary}>{chapter.summary}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>読了 {completed}/{chapter.episodes.length}</Text>
            <Text style={styles.metaText}>進捗 {progress}%</Text>
          </View>

          <View style={styles.episodeList}>
            {chapter.episodes.map((episode, index) => (
              <View key={episode.id} style={styles.episodeCard}>
                <Text style={styles.episodeIndex}>#{index + 1}</Text>
                <View style={styles.episodeText}>
                  <Text style={styles.episodeTitle}>{episode.title}</Text>
                  <Text style={styles.episodeMeta} numberOfLines={2}>
                    {episode.summary}
                  </Text>
                </View>
                <Text style={styles.episodeDone}>
                  {readEpisodeIds.includes(episode.id) ? "読了" : "未読"}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.button}
            onPress={() =>
              router.push({ pathname: "/story/[chapter]", params: { chapter: chapter.id } })}
          >
            <Text style={styles.buttonText}>この章を開く</Text>
          </Pressable>
        </View>
      </SectionCard>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 0,
  },
  body: {
    flex: 1,
    minHeight: 0,
    gap: 12,
  },
  summary: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaText: {
    color: palette.muted,
    fontSize: 13,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.violet,
  },
  buttonText: {
    color: palette.night,
    fontWeight: "700",
  },
  episodeList: {
    flex: 1,
    minHeight: 0,
    gap: 8,
    justifyContent: "center",
  },
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  episodeIndex: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: "700",
    width: 24,
  },
  episodeText: {
    flex: 1,
    gap: 2,
  },
  episodeTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  episodeMeta: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  episodeDone: {
    color: palette.muted,
    fontSize: 12,
  },
});
