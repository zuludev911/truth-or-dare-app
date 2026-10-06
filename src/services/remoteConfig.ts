import {
  fetchAndActivate,
  getBoolean,
  getNumber,
  getRemoteConfig,
} from "@react-native-firebase/remote-config";
import * as Sentry from "@sentry/react-native";

const remoteConfig = getRemoteConfig();

// Valores por defecto: se usan hasta que llegue la configuración de Firebase
// (o si no hay internet). Cambiarlos en la consola de Firebase no requiere publicar.
const DEFAULTS = {
  interstitial_every_n_cards: 20,
  interstitial_every_n_rolls: 20,
  interstitial_every_n_spins: 20,
  rewarded_unlock_hours: 2,
  app_open_enabled: true,
  app_open_min_hours: 4,
};

type NumberKey = {
  [K in keyof typeof DEFAULTS]: (typeof DEFAULTS)[K] extends number ? K : never;
}[keyof typeof DEFAULTS];
type BooleanKey = {
  [K in keyof typeof DEFAULTS]: (typeof DEFAULTS)[K] extends boolean ? K : never;
}[keyof typeof DEFAULTS];

remoteConfig.defaultConfig = DEFAULTS;
remoteConfig.settings = {
  // En desarrollo se refresca al instante; en producción cada hora como máximo.
  minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
  fetchTimeoutMillis: 10000,
};

export const initRemoteConfig = () =>
  fetchAndActivate(remoteConfig).catch((error) => {
    console.warn("Remote Config fetch failed:", error);
    Sentry.captureException(error);
  });

export const getConfigNumber = (key: NumberKey): number => {
  const value = getNumber(remoteConfig, key);
  return Number.isFinite(value) && value > 0 ? value : DEFAULTS[key];
};

export const getConfigBoolean = (key: BooleanKey): boolean =>
  getBoolean(remoteConfig, key);
