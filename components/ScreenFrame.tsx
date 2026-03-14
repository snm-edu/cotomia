import { PropsWithChildren } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../lib/theme";

type ScreenFrameProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.stage, style]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.night,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 14,
    gap: 12,
  },
  header: {
    paddingTop: 8,
    gap: 6,
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 560,
  },
  stage: {
    flex: 1,
    minHeight: 0,
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
