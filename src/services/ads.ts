import Constants from "expo-constants";

import { IOS_EDITION } from "../games/edition";

const { extra } = Constants.expoConfig || {};

export const AD_IDS = {
  ANDROID_BANNER: extra?.admobAndroidBannerId || "",
  IOS_BANNER: extra?.admobIosBannerId || "",
  ANDROID_INTERSTITIAL: extra?.admobAndroidInterstitialId || "",
  IOS_INTERSTITIAL: extra?.admobIosInterstitialId || "",
  // ADMOB_REWARD_ID es el de Android (el nombre viene de antes de iOS).
  ANDROID_REWARD: extra?.admobRewardId || "",
  IOS_REWARD: extra?.admobIosRewardId || "",
};

/**
 * Opciones de cada petición de anuncio. En iOS no se rastrea al usuario (sin
 * aviso ATT; ver games/edition), así que los anuncios no son personalizados.
 */
export const AD_REQUEST_OPTIONS = { requestNonPersonalizedAdsOnly: IOS_EDITION };
