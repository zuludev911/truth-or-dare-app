import "dotenv/config";

const isDev = process.env.NODE_ENV === "development";

export default {
  expo: {
    name: "Verdad o Reto",
    slug: "truth-or-dare-app",
    version: "1.0.12",
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
      versionCode: 19,
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
            ? "ca-app-pub-3940256099942544~3347511713"
            : process.env.ADMOB_ANDROID_APP_ID,
          iosAppId: isDev
            ? "ca-app-pub-3940256099942544~1458002511"
            : process.env.ADMOB_IOS_APP_ID,
          userTrackingUsageDescription:
            "Usamos datos para personalizar anuncios.",
          // SKAdNetwork IDs requeridos por Meta, AppLovin y Unity para atribución en iOS 14+
          skAdNetworkItems: [
            "v9wttpbfk9.skadnetwork",
            "n38lu8286q.skadnetwork",
            "4fzdc2evr5.skadnetwork",
            "2fnua5tdw4.skadnetwork",
            "ydx93a7ass.skadnetwork",
            "5a6flpkh64.skadnetwork",
            "p78axxw29g.skadnetwork",
            "pp5jmsta6h.skadnetwork",
            "c6k4g5qg8m.skadnetwork",
            "s39g8k73mm.skadnetwork",
            "3qy4746246.skadnetwork",
            "3sh42y64l3.skadnetwork",
            "f38h382jlk.skadnetwork",
            "hs6bdukanm.skadnetwork",
            "prcb7njmu6.skadnetwork",
            "wzmmz9fp6w.skadnetwork",
            "yclnxrl5pm.skadnetwork",
            "t38b2kh725.skadnetwork",
            "7ug5zh24hu.skadnetwork",
            "gta9lk7p23.skadnetwork",
            "vutu7akeur.skadnetwork",
            "y5ghdn53zk.skadnetwork",
            "n9x2a3gep5.skadnetwork",
            "v4nxqhlyqp.skadnetwork",
            "6xzpu9s2p8.skadnetwork",
            "klf5c3l5u5.skadnetwork",
            "8s468mfl3y.skadnetwork",
            "2u9pt9hc89.skadnetwork",
            "7rz58n8ntl.skadnetwork",
            "ppxm28t8ap.skadnetwork",
            "kbd757ywx3.skadnetwork",
            "9t245vhmpl.skadnetwork",
            "4468km3ulz.skadnetwork",
            "2779tugdfy.skadnetwork",
            "r45fhb6rf7.skadnetwork",
            "tl55sbb4fm.skadnetwork",
            "8c4e2ghe7u.skadnetwork",
            "3rd42ekr43.skadnetwork",
            "ludvb6z3bs.skadnetwork",
            "4w7y74lxt7.skadnetwork",
            "dzg6xy7pwj.skadnetwork",
            "b9bk5wbcq9.skadnetwork",
            "9b89h5y424.skadnetwork",
            "mtkv5xtk9e.skadnetwork",
            "cg4yq2sygc.skadnetwork",
            "4dzt52r2t5.skadnetwork",
          ],
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
