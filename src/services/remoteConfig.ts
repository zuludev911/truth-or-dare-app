import {
  fetchAndActivate,
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
};

type ConfigKey = keyof typeof DEFAULTS;

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

export const getConfigNumber = (key: ConfigKey): number => {
  const value = getNumber(remoteConfig, key);
  return Number.isFinite(value) && value > 0 ? value : DEFAULTS[key];
};
