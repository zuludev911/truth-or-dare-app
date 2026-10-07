import AsyncStorage from "@react-native-async-storage/async-storage";
import { getConfigNumber } from "../services/remoteConfig";

const UNLOCK_KEY = "lastUnlockTime";
const UNLOCK_KEY_CHICAS = "lastUnlockTimeChicas";

/**
 * Save current date/time in the local storage.
 */
export const saveUnlockTime = async () => {
  try {
    const now = new Date().toISOString();
    await AsyncStorage.setItem(UNLOCK_KEY, now);
  } catch (error) {
    console.error("Error saving unlock time:", error);
  }
};

/**
 * Check data to validate time.
 * - Empty data → false
 * - More than rewarded_unlock_hours (Remote Config) → false
 * - Less than rewarded_unlock_hours → true
 */
export const isUnlocked = async (): Promise<boolean> => {
  try {
    const storedTime = await AsyncStorage.getItem(UNLOCK_KEY);

    if (!storedTime) return false;

    const savedDate = new Date(storedTime);
    const now = new Date();

    const diffMs = now.getTime() - savedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > getConfigNumber("rewarded_unlock_hours")) return false;

    return true;
  } catch (error) {
    console.error("Error checking unlock status:", error);
    return false;
  }
};

export const saveUnlockTimeChicas = async () => {
  try {
    const now = new Date().toISOString();
    await AsyncStorage.setItem(UNLOCK_KEY_CHICAS, now);
  } catch (error) {
    console.error("Error saving chicas unlock time:", error);
  }
};

export const isUnlockedChicas = async (): Promise<boolean> => {
  try {
    const storedTime = await AsyncStorage.getItem(UNLOCK_KEY_CHICAS);

    if (!storedTime) return false;

    const savedDate = new Date(storedTime);
    const now = new Date();

    const diffMs = now.getTime() - savedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > getConfigNumber("rewarded_unlock_hours")) return false;

    return true;
  } catch (error) {
    console.error("Error checking chicas unlock status:", error);
    return false;
  }
};
