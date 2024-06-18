import type { ExpoConfig } from "expo/config";

export default (): ExpoConfig => ({
  name: "Music",
  slug: "Music",
  description: "A Nothing inspired music player.",
  version: "1.0.0-rc.2",
  platforms: ["android"],
  githubUrl: "https://github.com/MissingCore/Music",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "music",
  backgroundColor: "#000000",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  android: {
    package: "com.cyanchill.missingcore.music",
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      monochromeImage: "./assets/adaptive-icon-monochrome.png",
      backgroundColor: "#000000",
    },
    blockedPermissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
    ],
  },
  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "assets/fonts/Geist-Light.ttf",
          "assets/fonts/GeistMono-Light.ttf",
          "assets/fonts/GeistMono-Regular.ttf",
          "assets/fonts/Ndot-57.ttf",
          "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf",
          "node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf",
        ],
      },
    ],
    [
      "react-native-bootsplash",
      {
        assetsDir: "assets/bootsplash",
        android: { parentTheme: "EdgeToEdge" },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
