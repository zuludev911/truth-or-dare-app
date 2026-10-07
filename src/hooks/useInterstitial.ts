import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

import { AD_IDS } from "../services/ads";
import { trackAdFailed, trackAdShown, AdPlacement } from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";

const FREQUENCY_KEY = {
  game: "interstitial_every_n_cards",
  dice: "interstitial_every_n_rolls",
  bottle: "interstitial_every_n_spins",
} as const;

type InterstitialPlacement = keyof typeof FREQUENCY_KEY & AdPlacement;

/**
 * Carga un intersticial y lo muestra cada N acciones (N viene de Remote Config).
 * Devuelve `registerAction`, que se llama en cada carta, tirada o giro.
 */
export function useInterstitial(placement: InterstitialPlacement) {
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        android: AD_IDS.ANDROID_INTERSTITIAL,
        ios: AD_IDS.IOS_INTERSTITIAL,
      });

  const interstitial = useMemo(
    () => (adUnitId ? InterstitialAd.createForAdRequest(adUnitId) : null),
    [adUnitId]
  );
  const actionCount = useRef(0);

  useEffect(() => {
    if (!interstitial) return;

    const unsubscribers = [
      interstitial.addAdEventListener(AdEventType.OPENED, () =>
        trackAdShown("interstitial", placement)
      ),
      interstitial.addAdEventListener(AdEventType.CLOSED, () =>
        interstitial.load()
      ),
      interstitial.addAdEventListener(AdEventType.ERROR, (error) =>
        trackAdFailed("interstitial", placement, error)
      ),
    ];
    interstitial.load();

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [interstitial, placement]);

  return useCallback(() => {
    if (!interstitial) return;
    actionCount.current += 1;
    if (actionCount.current < getConfigNumber(FREQUENCY_KEY[placement])) return;

    if (interstitial.loaded) {
      actionCount.current = 0;
      interstitial.show().catch((error) => {
        trackAdFailed("interstitial", placement, error);
        interstitial.load();
      });
    } else {
      // Aún no cargó: se intenta en la siguiente acción sin reiniciar el contador.
      interstitial.load();
    }
  }, [interstitial, placement]);
}
