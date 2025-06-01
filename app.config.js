import "dotenv/config";

const isDev = process.env.NODE_ENV === "development";

export default {
  expo: {
    name: "truth-or-dare-app",
    slug: "truth-or-dare-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anfezuar.truthordareapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.anfezuar.truthordareapp",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
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
      admobAndroidBannerId: isDev
        ? "ca-app-pub-3940256099942544/6300978111" // ID de prueba para banner
        : process.env.ADMOB_ANDROID_BANNER_ID,
      admobIosBannerId: isDev
        ? "ca-app-pub-3940256099942544/2934735716" // ID de prueba para banner iOS
        : process.env.ADMOB_IOS_BANNER_ID,
      admobAndroidInterstitialId: isDev
        ? "ca-app-pub-3940256099942544/1033173712" // ID de prueba intersticial
        : process.env.ADMOB_ANDROID_INTERSTITIAL_ID,
      admobIosInterstitialId: isDev
        ? "ca-app-pub-3940256099942544/4411468940" // ID de prueba intersticial iOS
        : process.env.ADMOB_IOS_INTERSTITIAL_ID,
    },
  },
};
