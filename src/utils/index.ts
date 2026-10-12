import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConfigNumber } from "../services/remoteConfig";

// Mismas claves que las versiones anteriores, para no perder desbloqueos activos.
const UNLOCK_KEYS: Record<string, string> = {
  extremo: "lastUnlockTime",
  chicas: "lastUnlockTimeChicas",
  "yn-picante": "lastUnlockTimeYnPicante",
};

/** Guarda la hora en que se desbloqueó la categoría con un video. */
export const saveUnlockTime = async (category: string) => {
  const key = UNLOCK_KEYS[category];
  if (!key) return;
  try {
    await AsyncStorage.setItem(key, new Date().toISOString());
  } catch (error) {
    console.error("Error saving unlock time:", error);
  }
};

/**
 * Milisegundos que le quedan al desbloqueo de la categoría, o 0 si está
 * bloqueada. La duración viene de Remote Config (rewarded_unlock_hours).
 */
export const getUnlockRemainingMs = async (category: string): Promise<number> => {
  const key = UNLOCK_KEYS[category];
  if (!key) return 0;
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return 0;
    const durationMs = getConfigNumber("rewarded_unlock_hours") * 60 * 60 * 1000;
    const remaining = new Date(stored).getTime() + durationMs - Date.now();
    return Math.max(0, remaining);
  } catch (error) {
    console.error("Error checking unlock status:", error);
    return 0;
  }
};

/** "Quedan 1 h 45 min" / "Quedan 2 h" / "Quedan 12 min". */
export const formatTimeLeft = (ms: number) => {
  const minutes = Math.ceil(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `Quedan ${rest} min`;
  return rest === 0 ? `Quedan ${hours} h` : `Quedan ${hours} h ${rest} min`;
};

/** "2 horas" / "1 hora", para los textos del modal de desbloqueo. */
export const formatUnlockHours = (hours: number) =>
  hours === 1 ? "1 hora" : `${hours} horas`;
