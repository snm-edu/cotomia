import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { palette, radii } from "../lib/theme";

export default function NotFoundScreen() {
  return (
    <ScreenFrame
      title="診療録が見つかりません"
      subtitle="ページが存在しないか、まだ実装されていない導線にアクセスしました。"
    >
      <SectionCard>
        <Pressable style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>ホームへ戻る</Text>
        </Pressable>
      </SectionCard>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.gold,
  },
  buttonText: {
    color: palette.night,
    fontWeight: "700",
  },
});
