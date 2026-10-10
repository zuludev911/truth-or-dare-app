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
  /**
   * Dentro del flujo de la pantalla (rediseño, ver ui/BannerSlot). Sin esta
   * opción el banner queda fijo abajo, sobre el contenido, como en el diseño anterior.
   */
  inline?: boolean;
}

const AdBanner = ({ placement, inline }: Props) => {
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
    // Sin anuncio disponible o sin internet no son fallas de la app: solo van a
    // analíticas, para no llenar Sentry cuando el teléfono está sin conexión.
    trackAdFailed("banner", placement, err);
    const code = String(err?.code ?? "");
    if (!code.includes("no-fill") && !code.includes("network-error")) {
      Sentry.captureException(err);
    }
    setError(true);
  };

  if (error && !adUnitId) return null;
  return (
    <View
      style={
        inline
          ? { alignItems: "center" }
          : { position: "absolute", bottom, left: 0, right: 0 }
      }
    >
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
