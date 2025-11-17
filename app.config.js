import "dotenv/config";

const isDev = process.env.NODE_ENV === "development";

export default {
  expo: {
    name: "Verdad o Reto",
    slug: "truth-or-dare-app",
    version: "1.0.3",
    description: "Juego de Verdad o Reto para fiestas, parejas y amigos.",
    keywords: [
      "verdad o reto",
      "truth or dare",
      "juego",
      "retos",
      "parejas",
      "amigos",
    ],
    githubUrl: "https://github.com/zuludev911/truth-or-dare-app",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "cover",
      backgroundColor: "#E63140",
    },
    ios: {
      buildNumber: "2",
      supportsTablet: true,
      displayName: "Verdad o Reto 🔥",
      bundleIdentifier: "com.anfezuar.truthordareapp",
    },
    android: {
      applicationLabel: "Verdad o Reto 🔥",
      versionCode: 14,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anfezuar.truthordareapp",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-updates",
      // Configuración de AdMob (como array separado)
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: isDev
            ? "ca-app-pub-3940256099942544~3347511713" // ¡Ojo! App ID usa ~, no /
            : process.env.ADMOB_ANDROID_APP_ID,
          iosAppId: isDev
            ? "ca-app-pub-3940256099942544~1458002511" // ¡Ojo! App ID usa ~
            : process.env.ADMOB_IOS_APP_ID,
          userTrackingUsageDescription:
            "Usamos datos para personalizar anuncios.",
        },
      ],
    ],
    extra: {
      sentryDsn: process.env.DSN_SENTRY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
      admobAndroidBannerId: isDev
        ? "ca-app-pub-3940256099942544/6300978111" // ID de prueba para banner
        : process.env.ADMOB_ANDROID_BANNER_ID,
      admobIosBannerId: isDev
        ? "ca-app-pub-3940256099942544/2934735716" // ID de prueba para banner iOS
        : process.env.ADMOB_IOS_BANNER_ID,
      admobAndroidInterstitialId: isDev
        ? "ca-app-pub-3940256099942544/1033173712"
        : process.env.ADMOB_ANDROID_INTERSTITIAL_ID,
      admobIosInterstitialId: isDev
        ? "ca-app-pub-3940256099942544/4411468940"
        : process.env.ADMOB_IOS_INTERSTITIAL_ID,
      admobRewardId: process.env.ADMOB_REWARD_ID,
    },
  },
  jsEngine: "hermes",
};
