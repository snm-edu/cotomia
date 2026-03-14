import { Alert, Pressable, StyleSheet, Text } from "react-native";
import { ScreenFrame } from "../components/ScreenFrame";
import { SectionCard } from "../components/SectionCard";
import { contentIssues } from "../lib/content";
import { STORAGE_SCHEMA_VERSION } from "../lib/progress";
import { palette, radii } from "../lib/theme";
import { useGameStore } from "../store/useGameStore";

export default function SettingsScreen() {
  const resetProgress = useGameStore((state) => state.resetProgress);

  return (
    <ScreenFrame title="設定" subtitle="MVP 用の保存情報と検証状態を表示します。">
      <SectionCard title="保存情報">
        <Text style={styles.body}>スキーマ: GameProgressV{STORAGE_SCHEMA_VERSION}</Text>
        <Text style={styles.body}>保存方式: Zustand persist + AsyncStorage</Text>
      </SectionCard>

      <SectionCard title="コンテンツ検証">
        <Text style={styles.body}>
          {contentIssues.length ? `${contentIssues.length} 件の問題があります。` : "問題は見つかっていません。"}
        </Text>
      </SectionCard>

      <SectionCard title="進行リセット" subtitle="デバッグ向け。既読・好感度・所持報酬を初期化します。">
        <Pressable
          style={styles.resetButton}
          onPress={() =>
            Alert.alert("進行を初期化しますか？", "この操作は元に戻せません。", [
              { text: "キャンセル", style: "cancel" },
              { text: "初期化", style: "destructive", onPress: resetProgress },
            ])}
        >
          <Text style={styles.resetText}>保存データをリセット</Text>
        </Pressable>
      </SectionCard>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: {
    color: palette.text,
    lineHeight: 22,
  },
  resetButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: palette.danger,
  },
  resetText: {
    color: palette.night,
    fontWeight: "700",
  },
});
