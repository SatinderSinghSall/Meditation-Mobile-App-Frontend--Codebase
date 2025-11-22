import "dotenv/config";

export default ({ config }) => ({
  ...config,

  name: "Meditation App",
  slug: "my-app",
  newArchEnabled: true,
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

  ios: {
    supportsTablet: true,
  },

  android: {
    package: "com.meditationapp.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  extra: {
    API_BASE: process.env.API_BASE, // ← WORKS IN APK NOW (via EAS secret)
    eas: {
      projectId: "e0807912-b7af-4a54-941a-a76ad085f9e3",
    },
  },

  plugins: ["expo-router", "expo-font"],
});
