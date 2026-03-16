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
      <View style={styles.backgroundOrbThree} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mobile Demo</Text>
          </View>
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
    paddingBottom: 18,
    gap: 16,
  },
  header: {
    paddingTop: 10,
    gap: 10,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 199, 168, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 122, 0.28)",
  },
  badgeText: {
    color: palette.peach,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  title: {
    color: palette.text,
    fontSize: 31,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 560,
  },
  stage: {
    flex: 1,
  },
  backgroundOrbOne: {
    position: "absolute",
    top: -30,
    right: -20,
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: "rgba(255, 180, 207, 0.17)",
  },
  backgroundOrbTwo: {
    position: "absolute",
    top: 220,
    left: -50,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: "rgba(146, 228, 210, 0.13)",
  },
  backgroundOrbThree: {
    position: "absolute",
    top: 120,
    right: 36,
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "rgba(181, 182, 255, 0.14)",
  },
});
