import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "players";
export const MAX_PLAYERS = 20;
export const MAX_NAME_LENGTH = 20;

/** Nombres de los jugadores de la última partida, para no escribirlos cada vez. */
export async function loadPlayers(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Error loading players:", error);
    return [];
  }
}

export async function savePlayers(players: string[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.warn("Error saving players:", error);
  }
}
