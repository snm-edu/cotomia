import type { ExpoConfig } from "expo/config";

const baseUrl = process.env.EXPO_BASE_URL;

const config: ExpoConfig = {
  name: "コトミア",
  slug: "cotomia",
  scheme: "cotomia",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  splash: {
    backgroundColor: "#09111f",
  },
  assetBundlePatterns: ["**/*"],
  plugins: ["expo-router"],
  web: {
    bundler: "metro",
    output: "static",
  },
  description: "ことばを見つめ、物語と推理で親しめる学習ゲーム『コトミア』",
  experiments: {
    typedRoutes: true,
    ...(baseUrl ? { baseUrl } : {}),
  },
};

export default config;
