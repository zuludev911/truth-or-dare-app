import { memo, useState } from "react";
import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Sentry from "@sentry/react-native";

import { AD_IDS } from "../services/ads";
import { AdPlacement, trackAdFailed } from "../services/analytics";

interface Props {
  placement: AdPlacement;
}

const AdBanner = ({ placement }: Props) => {
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
    // "no-fill" es normal (no había anuncio disponible): solo va a analíticas.
    trackAdFailed("banner", placement, err);
    if (!String(err?.code ?? "").includes("no-fill")) Sentry.captureException(err);
    setError(true);
  };

  if (error && !adUnitId) return null;
  return (
    <View style={{ position: "absolute", bottom, left: 0, right: 0 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

export default memo(AdBanner);
