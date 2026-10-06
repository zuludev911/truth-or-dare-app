import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import Navigation from "./src/navigation/Navigation";
import { LogBox } from "react-native";
import { AppState } from "react-native";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";
import { SENTRY_DSN } from "./src/services/sentry";
import mobileAds from "react-native-google-mobile-ads";
import { useEffect, useRef, useState } from "react";
import { setAudioModeAsync } from "expo-audio";
import { gatherConsent } from "./src/services/consent";
import { initRemoteConfig } from "./src/services/remoteConfig";
import { setupAppOpenAd } from "./src/services/appOpenAd";
import { trackScreen } from "./src/services/analytics";

Sentry.init({
  dsn: SENTRY_DSN,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

LogBox.ignoreAllLogs(); // si deseas ocultar warnings ruidosos

AppState.addEventListener("change", (state) => {
  console.log("[AppState]", state);
});

console.log("App started");

export default Sentry.wrap(function App() {
  const [adsInitialized, setAdsInitialized] = useState(false);
  const navigationRef =
    useNavigationContainerRef<Record<string, object | undefined>>();
  const currentRouteName = useRef<string | undefined>(undefined);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
      shouldPlayInBackground: false,
    }).catch((error) => {
      console.warn("Audio mode failed to configure:", error);
      Sentry.captureException(error);
    });

    // Remote Config se baja en paralelo; las pantallas usan valores por defecto
    // mientras tanto.
    const remoteConfigReady = initRemoteConfig();

    // El consentimiento va antes de inicializar AdMob para que la primera
    // petición de anuncios ya lo respete.
    gatherConsent()
      .then(async (canRequestAds) => {
        if (!canRequestAds) return;
        await mobileAds().initialize();
        await remoteConfigReady;
        setupAppOpenAd();
      })
      .catch((error) => {
        console.warn("Google Mobile Ads failed to initialize:", error);
        Sentry.captureException(error);
      })
      .finally(() => setAdsInitialized(true));
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        currentRouteName.current = navigationRef.getCurrentRoute()?.name;
        if (currentRouteName.current) trackScreen(currentRouteName.current);
      }}
      onStateChange={() => {
        const routeName = navigationRef.getCurrentRoute()?.name;
        if (routeName && routeName !== currentRouteName.current) {
          trackScreen(routeName);
        }
        currentRouteName.current = routeName;
      }}
    >
      {adsInitialized && <Navigation />}
      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
});
