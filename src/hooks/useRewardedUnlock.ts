import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

import { AD_IDS, AD_REQUEST_OPTIONS } from "../services/ads";
import {
  AdPlacement,
  trackAdFailed,
  trackAdShown,
  trackRewardEarned,
  trackUnlockWithoutAd,
} from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";
import { formatUnlockHours, getUnlockRemainingMs, saveUnlockTime } from "../utils";
import type { UnlockState } from "../ui";

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({ ios: AD_IDS.IOS_REWARD, default: AD_IDS.ANDROID_REWARD });
/** Si el video no carga en este tiempo, se avisa que no hay anuncios. */
const LOAD_TIMEOUT_MS = 10000;
/** Respaldo por si el modal no avisa que terminó de cerrarse (onDismiss). */
const MODAL_DISMISS_FALLBACK_MS = 600;

/**
 * Desbloqueo de contenido con un video recompensado (categorías de Verdad o
 * Reto y niveles de los otros juegos). `unlockIds` son las claves de
 * utils/UNLOCK_KEYS; `onUnlocked` se llama al cerrar el video con la recompensa.
 */
export function useRewardedUnlock(
  unlockIds: string[],
  onUnlocked: (id: string) => void,
  placement: AdPlacement
) {
  // Tiempo de desbloqueo restante (ms) de cada id.
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const [modalId, setModalId] = useState<string | null>(null);
  const [unlockState, setUnlockState] = useState<UnlockState>("ready");

  const rewarded = useMemo(() => RewardedAd.createForAdRequest(AD_UNIT_ID, AD_REQUEST_OPTIONS), []);
  const isLoaded = useRef(false);
  const pendingId = useRef<string | null>(null);
  const earned = useRef(false);
  const loadTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** Lo que se hace cuando el modal termina de cerrarse (ver `afterModalCloses`). */
  const afterDismiss = useRef<(() => void) | null>(null);
  const dismissFallback = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onUnlockedRef = useRef(onUnlocked);
  onUnlockedRef.current = onUnlocked;
  const idsKey = unlockIds.join(",");

  const refresh = useCallback(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    Promise.all(ids.map(getUnlockRemainingMs)).then((values) =>
      setRemaining(Object.fromEntries(ids.map((id, i) => [id, values[i]])))
    );
  }, [idsKey]);

  // Al volver a la pantalla y cada 30 s, para que el tiempo restante avance.
  useFocusEffect(
    useCallback(() => {
      refresh();
      const interval = setInterval(refresh, 30000);
      return () => clearInterval(interval);
    }, [refresh])
  );

  /** Ejecuta la acción que quedó pendiente de que se cerrara el modal. */
  const runAfterDismiss = useCallback(() => {
    clearTimeout(dismissFallback.current);
    const action = afterDismiss.current;
    afterDismiss.current = null;
    action?.();
  }, []);

  /**
   * En iOS no se puede abrir nada (el video o la hoja de jugadores) encima del
   * modal de desbloqueo mientras se cierra: al cerrarse, iOS cierra también lo
   * que tenga encima y deja una capa invisible que bloquea la app. Por eso
   * primero se cierra el modal y la acción corre en su onDismiss.
   */
  const afterModalCloses = useCallback(
    (action: () => void) => {
      afterDismiss.current = action;
      setModalId(null);
      dismissFallback.current = setTimeout(runAfterDismiss, MODAL_DISMISS_FALLBACK_MS);
    },
    [runAfterDismiss]
  );

  const present = useCallback(
    () => afterModalCloses(() => rewarded.show().catch(() => {})),
    [afterModalCloses, rewarded]
  );

  /**
   * Si no hay video disponible (sin inventario de AdMob, error de carga…) la
   * categoría se desbloquea igual, gratis, por el mismo tiempo: nunca queda un
   * contenido imposible de abrir (requisito de la revisión de Apple, 2.1).
   */
  const unlockWithoutAd = useCallback(() => {
    const id = pendingId.current;
    pendingId.current = null;
    if (!id) return;
    trackUnlockWithoutAd(id, placement);
    saveUnlockTime(id).then(refresh);
    afterModalCloses(() => {
      Toast.show({
        type: "success",
        text1: "¡Desbloqueado gratis!",
        text2: `No hay videos disponibles ahora. Acceso por ${formatUnlockHours(getConfigNumber("rewarded_unlock_hours"))}`,
      });
      onUnlockedRef.current(id);
    });
  }, [afterModalCloses, placement, refresh]);

  useEffect(() => {
    const clearLoadTimeout = () => {
      clearTimeout(loadTimeout.current);
      loadTimeout.current = undefined;
    };
    const unsubscribers = [
      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        isLoaded.current = true;
        // Si el usuario ya tocó "Ver video" mientras cargaba, se muestra enseguida.
        if (pendingId.current && loadTimeout.current) {
          clearLoadTimeout();
          present();
        }
      }),
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        const id = pendingId.current;
        if (!id) return;
        earned.current = true;
        trackRewardEarned(id);
        saveUnlockTime(id).then(refresh);
      }),
      rewarded.addAdEventListener(AdEventType.OPENED, () => {
        setModalId(null);
        trackAdShown("rewarded", placement);
      }),
      rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        isLoaded.current = false;
        const id = pendingId.current;
        if (earned.current && id) {
          Toast.show({
            type: "success",
            text1: "¡Desbloqueado!",
            text2: `Acceso por ${formatUnlockHours(getConfigNumber("rewarded_unlock_hours"))}`,
          });
          onUnlockedRef.current(id);
        }
        earned.current = false;
        pendingId.current = null;
        rewarded.load();
      }),
      rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        isLoaded.current = false;
        trackAdFailed("rewarded", placement, error);
        if (loadTimeout.current) {
          clearLoadTimeout();
          unlockWithoutAd();
        }
      }),
    ];
    // Sin nada que desbloquear (edición de iOS) no se pide ningún video.
    if (idsKey) rewarded.load();
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      clearLoadTimeout();
      clearTimeout(dismissFallback.current);
    };
  }, [rewarded, refresh, placement, present, unlockWithoutAd, idsKey]);

  /** true si el id está bloqueado ahora mismo. */
  const isLocked = (id: string) => unlockIds.includes(id) && !remaining[id];

  /** Abre el modal de desbloqueo para ese id. */
  const requestUnlock = (id: string) => {
    setUnlockState("ready");
    setModalId(id);
  };

  const watch = async () => {
    pendingId.current = modalId;
    if (isLoaded.current) return present();

    // Si el módulo nativo de NetInfo no existe en la versión instalada, se
    // asume que hay conexión en vez de lanzar un error (ver PR #27).
    const { isConnected } = await NetInfo.fetch().catch(() => ({ isConnected: null }));
    if (isConnected === false) return setUnlockState("offline");

    setUnlockState("loading");
    rewarded.load();
    loadTimeout.current = setTimeout(() => {
      loadTimeout.current = undefined;
      unlockWithoutAd();
    }, LOAD_TIMEOUT_MS);
  };

  const closeModal = () => {
    afterDismiss.current = null;
    clearTimeout(dismissFallback.current);
    clearTimeout(loadTimeout.current);
    loadTimeout.current = undefined;
    pendingId.current = null;
    setModalId(null);
  };

  return {
    remaining,
    isLocked,
    modalId,
    unlockState,
    requestUnlock,
    watch,
    closeModal,
    /** Va en el onDismiss del UnlockModal. */
    onModalDismiss: runAfterDismiss,
  };
}
