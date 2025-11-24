import AsyncStorage from "@react-native-async-storage/async-storage";

const UNLOCK_KEY = "lastUnlockTime";
const UNLOCK_TIME = 2;

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
 * - More that 2 hours → false
 * - Less that 2 hours → true
 */
export const isUnlocked = async (): Promise<boolean> => {
  try {
    const storedTime = await AsyncStorage.getItem(UNLOCK_KEY);

    if (!storedTime) return false;

    const savedDate = new Date(storedTime);
    const now = new Date();

    const diffMs = now.getTime() - savedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > UNLOCK_TIME) return false;

    return true;
  } catch (error) {
    console.error("Error checking unlock status:", error);
    return false;
  }
};
