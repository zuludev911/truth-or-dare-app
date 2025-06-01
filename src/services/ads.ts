import Constants from "expo-constants";

const { extra } = Constants.expoConfig || {};

export const AD_IDS = {
  ANDROID_BANNER: extra?.admobAndroidBannerId || "",
  IOS_BANNER: extra?.admobIosBannerId || "",
  ANDROID_INTERSTITIAL: extra?.admobAndroidInterstitialId || "",
  IOS_INTERSTITIAL: extra?.admobIosInterstitialId || "",
};
