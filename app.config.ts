import type { ExpoConfig } from "expo/config";

const baseUrl = process.env.EXPO_BASE_URL;

const config: ExpoConfig = {
  name: "アスクレピオス学園",
  slug: "asklepios-academy-mvp",
  scheme: "asklepios-academy",
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
  experiments: {
    typedRoutes: true,
    ...(baseUrl ? { baseUrl } : {}),
  },
};

export default config;
