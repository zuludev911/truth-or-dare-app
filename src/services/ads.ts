import Constants from "expo-constants";

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
