import { StyleSheet, Text, View } from "react-native";
import { palette, radii } from "../lib/theme";
import type { StoryEpisode } from "../lib/types";

type StoryPlayerProps = {
  episode: StoryEpisode;
  accent: string;
};

export function StoryPlayer({ episode, accent }: StoryPlayerProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.glow, { backgroundColor: accent }]} />
      <Text style={styles.kicker}>{episode.sourceRef}</Text>
      <Text style={styles.title}>{episode.title}</Text>
      <Text style={styles.summary}>{episode.summary}</Text>
      {episode.lines.map((line, index) => (
        <View
          key={`${episode.id}-${index}`}
          style={[
            styles.lineCard,
            line.tone === "quote" && styles.quoteCard,
            line.tone === "guide" && { borderColor: `${accent}55` },
          ]}
        >
          <Text style={[styles.speaker, line.tone === "guide" && { color: accent }]}>
            {line.speaker}
          </Text>
          <Text style={styles.text}>{line.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 18,
    borderRadius: radii.xl,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: -40,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 999,
    opacity: 0.16,
  },
  kicker: {
    color: palette.gold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
  },
  summary: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  lineCard: {
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  quoteCard: {
    backgroundColor: "rgba(242,198,109,0.08)",
  },
  speaker: {
    color: palette.mist,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  text: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
  },
});
