export default {
  expo: {
    name: "Meditation App",
    newArchEnabled: true,
    slug: "my-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "simplemeditation",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/simpleMeditationLogo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.meditationapp.app",
      versionCode: 1,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      API_BASE: process.env.API_BASE,
      eas: {
        projectId: "e0807912-b7af-4a54-941a-a76ad085f9e3",
      },
    },
    plugins: ["expo-router", "expo-font"],
  },
};
