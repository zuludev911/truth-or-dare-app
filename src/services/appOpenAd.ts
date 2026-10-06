import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdEventType, AppOpenAd, TestIds } from "react-native-google-mobile-ads";

import { AD_IDS } from "./ads";
import { trackAdFailed, trackAdShown } from "./analytics";
import { getConfigBoolean, getConfigNumber } from "./remoteConfig";
import {
  markFullscreenAdClosed,
  markFullscreenAdOpened,
  wasFullscreenAdRecent,
} from "./fullscreenAds";

const LAST_SHOWN_KEY = "appOpenAdLastShown";
// En el arranque en frío solo se muestra si carga rápido; si no, el usuario ya
// está usando la app y aparecer de golpe sería molesto.
const COLD_START_MAX_WAIT_MS = 4000;

const adUnitId = __DEV__
  ? TestIds.APP_OPEN
  : Platform.select({ android: AD_IDS.ANDROID_APP_OPEN, ios: "" });

let appOpenAd: AppOpenAd | null = null;
let isShowing = false;

const minIntervalPassed = async () => {
  const lastShown = Number(await AsyncStorage.getItem(LAST_SHOWN_KEY));
  const minMs = getConfigNumber("app_open_min_hours") * 60 * 60 * 1000;
  return !lastShown || Date.now() - lastShown >= minMs;
};

const showIfAllowed = async () => {
  if (!appOpenAd?.loaded || isShowing || wasFullscreenAdRecent()) return;
  if (!getConfigBoolean("app_open_enabled") || !(await minIntervalPassed())) {
    return;
  }
  isShowing = true;
  appOpenAd.show().catch((error) => {
    isShowing = false;
    trackAdFailed("app_open", "app_open", error);
  });
};

/** Se llama una vez al iniciar, después de inicializar AdMob. */
export const setupAppOpenAd = () => {
  if (!adUnitId || appOpenAd) return;

  appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
  const startedAt = Date.now();
  let coldStartHandled = false;

  appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
    if (coldStartHandled) return;
    coldStartHandled = true;
    if (Date.now() - startedAt <= COLD_START_MAX_WAIT_MS) showIfAllowed();
  });
  appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
    markFullscreenAdOpened();
    AsyncStorage.setItem(LAST_SHOWN_KEY, String(Date.now())).catch(() => {});
    trackAdShown("app_open", "app_open");
  });
  appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
    isShowing = false;
    markFullscreenAdClosed();
    appOpenAd?.load();
  });
  appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
    coldStartHandled = true;
    trackAdFailed("app_open", "app_open", error);
  });

  appOpenAd.load();

  AppState.addEventListener("change", (state) => {
    if (state !== "active") return;
    if (appOpenAd?.loaded) showIfAllowed();
    else appOpenAd?.load();
  });
};
