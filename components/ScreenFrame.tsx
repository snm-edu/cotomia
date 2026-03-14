import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../lib/theme";

type ScreenFrameProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}>;

export function ScreenFrame({
  children,
  title,
  subtitle,
  style,
}: ScreenFrameProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundOrbOne} />
      <View style={styles.backgroundOrbTwo} />
      <ScrollView contentContainerStyle={[styles.content, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.night,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    paddingTop: 10,
    gap: 8,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 560,
  },
  backgroundOrbOne: {
    position: "absolute",
    top: -40,
    right: -10,
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: "rgba(143,169,255,0.18)",
  },
  backgroundOrbTwo: {
    position: "absolute",
    top: 180,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: "rgba(243,178,199,0.12)",
  },
});
