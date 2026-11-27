import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Assignment, Exclusion } from "../games/secretSanta";

const STORAGE_KEY = "secretSanta";
export const MAX_AMOUNT_LENGTH = 12;
export const MAX_NOTE_LENGTH = 60;

/** Borrador del sorteo y, una vez hecho, el resultado y quiénes ya vieron su amigo. */
export interface SecretSantaState {
  participants: string[];
  /** Tope del regalo en pesos, solo dígitos ("50000"). */
  amount: string;
  date: string;
  place: string;
  exclusions: Exclusion[];
  draw: Assignment[] | null;
  /** Quienes ya vieron a quién le regalan. */
  seen: string[];
}

export const EMPTY_STATE: SecretSantaState = {
  participants: [],
  amount: "",
  date: "",
  place: "",
  exclusions: [],
  draw: null,
  seen: [],
};

export async function loadSecretSanta(): Promise<SecretSantaState> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? { ...EMPTY_STATE, ...JSON.parse(stored) } : EMPTY_STATE;
  } catch (error) {
    console.warn("Error loading secret santa:", error);
    return EMPTY_STATE;
  }
}

export async function saveSecretSanta(state: SecretSantaState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Error saving secret santa:", error);
  }
}

/** "50000" → "$50.000". */
export function formatAmount(amount: string): string {
  const digits = amount.replace(/\D/g, "");
  return digits ? `$${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}` : "";
}

/** Texto del recordatorio que se comparte: nunca incluye quién le regala a quién. */
export function reminderText(state: SecretSantaState): string {
  const lines = ["🎄 ¡Amigo secreto! Ya hicimos el sorteo."];
  const amount = formatAmount(state.amount);
  if (amount) lines.push(`🎁 Tope del regalo: ${amount}`);
  if (state.date.trim()) lines.push(`📅 ${state.date.trim()}`);
  if (state.place.trim()) lines.push(`📍 ${state.place.trim()}`);
  lines.push("Sorteado con Verdad o Reto");
  return lines.join("\n");
}
