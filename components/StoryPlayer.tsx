import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PagerControls } from "./PagerControls";
import { palette, radii } from "../lib/theme";
import type { StoryEpisode } from "../lib/types";

type StoryPlayerProps = {
  episode: StoryEpisode;
  accent: string;
};

export function StoryPlayer({ episode, accent }: StoryPlayerProps) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setLineIndex(0);
  }, [episode.id]);

  const currentLine = episode.lines[lineIndex];

  return (
    <View style={styles.container}>
      <View style={[styles.glow, { backgroundColor: accent }]} />
      <View style={styles.summaryBlock}>
        <Text style={styles.kicker}>{episode.sourceRef}</Text>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.summary}>{episode.summary}</Text>
      </View>

      <View style={styles.lineStage}>
        <PagerControls
          items={episode.lines.map((line, index) => ({
            id: `${episode.id}-${index}`,
            label: line.speaker,
            meta: `セリフ ${index + 1}`,
          }))}
          index={lineIndex}
          onChange={setLineIndex}
        />
        <View
          style={[
            styles.lineCard,
            currentLine.tone === "quote" && styles.quoteCard,
            currentLine.tone === "guide" && { borderColor: `${accent}55` },
          ]}
        >
          <Text style={[styles.speaker, currentLine.tone === "guide" && { color: accent }]}>
            {currentLine.speaker}
          </Text>
          <Text style={styles.text}>{currentLine.text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    gap: 12,
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
  summaryBlock: {
    gap: 6,
    padding: 12,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.035)",
  },
  kicker: {
    color: palette.gold,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  summary: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  lineStage: {
    flex: 1,
    minHeight: 0,
    gap: 10,
  },
  lineCard: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  quoteCard: {
    backgroundColor: "rgba(242,198,109,0.08)",
  },
  speaker: {
    color: palette.mist,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  text: {
    color: palette.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
