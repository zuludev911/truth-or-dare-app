import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AD_IDS } from "../services/ads";
import { useState } from "react";
import * as Sentry from "@sentry/react-native";

const AdBanner = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.select({
        android: AD_IDS.ANDROID_BANNER,
        ios: AD_IDS.IOS_BANNER,
      });

  const { bottom } = useSafeAreaInsets();

  const handleAdLoaded = () => {
    setLoaded(true);
  };

  const handleAdFailedToLoad = (err: any) => {
    console.warn("Ad failed to load:", err);
    Sentry.captureException(err);
    setError(true);
  };

  if (error && !adUnitId) return null;
  return (
    <View style={{ position: "absolute", bottom, left: 0, right: 0 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

export default AdBanner;
