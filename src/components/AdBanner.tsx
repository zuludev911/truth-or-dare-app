import { memo, useState } from "react";
import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    // Los fallos de AdMob (sin anuncio, sin internet, error interno de Google,
    // petición rechazada) no son fallas de la app y no se pueden corregir desde
    // aquí: solo van a analíticas (ad_failed), para no llenar la cuota de Sentry.
    trackAdFailed("banner", placement, err);
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
