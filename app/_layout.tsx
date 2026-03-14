import "../lib/webPolyfills";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { palette } from "../lib/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.night },
          headerTintColor: palette.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: palette.night },
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "ホーム", headerShown: false }} />
        <Stack.Screen name="story/index" options={{ title: "診療録一覧" }} />
        <Stack.Screen name="story/[chapter]" options={{ title: "ストーリー" }} />
        <Stack.Screen name="quiz/[id]" options={{ title: "読解ミッション" }} />
        <Stack.Screen name="daily" options={{ title: "デイリー思考" }} />
        <Stack.Screen name="mini/[id]" options={{ title: "思考ミニゲーム" }} />
        <Stack.Screen name="characters" options={{ title: "キャラクター" }} />
        <Stack.Screen name="glossary" options={{ title: "用語集" }} />
        <Stack.Screen name="settings" options={{ title: "設定" }} />
      </Stack>
    </>
  );
}
