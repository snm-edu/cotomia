import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenFrame } from "../../components/ScreenFrame";
import { SectionCard } from "../../components/SectionCard";
import { chapters, getChapterProgress } from "../../lib/content";
import { palette, radii } from "../../lib/theme";
import { useGameStore } from "../../store/useGameStore";

export default function StoryIndexScreen() {
  const router = useRouter();
  const readEpisodeIds = useGameStore((state) => state.readEpisodeIds);

  return (
    <ScreenFrame
      title="診療録一覧"
      subtitle="実教材ベースで、第1章からケイロンの教えまでを小さな章に分けて収録。"
    >
      {chapters.map((chapter) => {
        const completed = chapter.episodes.filter((episode) =>
          readEpisodeIds.includes(episode.id),
        ).length;
        const progress = Math.round(getChapterProgress(chapter.id, readEpisodeIds) * 100);

        return (
          <SectionCard
            key={chapter.id}
            title={chapter.title}
            subtitle={`${chapter.subtitle} / ${chapter.sourceRef}`}
          >
            <Text style={styles.summary}>{chapter.summary}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>読了 {completed}/{chapter.episodes.length}</Text>
              <Text style={styles.metaText}>進捗 {progress}%</Text>
            </View>
            <Pressable
              style={styles.button}
              onPress={() =>
                router.push({ pathname: "/story/[chapter]", params: { chapter: chapter.id } })}
            >
              <Text style={styles.buttonText}>この章を開く</Text>
            </Pressable>
          </SectionCard>
        );
      })}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
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
});
