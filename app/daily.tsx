import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { getDailyLogicSelection, getLocalDateKey } from "../lib/daily";
import { logicQuizData } from "../lib/content";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function DailyScreen() {
  const router = useRouter();
  const completedLogicQuizIds = useGameStore((state) => state.completedLogicQuizIds);
  const todayKey = getLocalDateKey();
  const selection = getDailyLogicSelection(logicQuizData, todayKey);

  return (
    <ScreenFrame
      title="デイリー思考"
      subtitle={`${todayKey} の出題。並べ替え・真偽推理・配置推理を 1 問ずつ。`}
    >
      {selection.map((quiz) => (
        <SectionCard
          key={quiz.id}
          title={quiz.title}
          subtitle={`${quiz.type} / ${quiz.sourceRef}`}
        >
          <Text style={styles.prompt}>{quiz.prompt}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {completedLogicQuizIds.includes(quiz.id) ? "CLEAR" : "未挑戦"}
            </Text>
            <Text style={styles.metaText}>報酬 +{quiz.reward.affection ?? 0}</Text>
          </View>
          <Pressable
            style={styles.button}
            onPress={() => router.push({ pathname: "/mini/[id]", params: { id: quiz.id } })}
          >
            <Text style={styles.buttonText}>挑戦する</Text>
          </Pressable>
        </SectionCard>
      ))}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  prompt: {
    color: palette.text,
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
    backgroundColor: palette.mint,
  },
  buttonText: {
    color: palette.night,
    fontWeight: "700",
  },
});
