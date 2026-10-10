import AsyncStorage from "@react-native-async-storage/async-storage";

import { Reto } from "../types";

const data: Record<string, string[]> = {
  "clasico-verdad": require("../data/retos/clasico-verdad.json"),
  "clasico-reto": require("../data/retos/clasico-reto.json"),
  "picante-verdad": require("../data/retos/picante-verdad.json"),
  "picante-reto": require("../data/retos/picante-reto.json"),
  "parejas-verdad": require("../data/retos/parejas-verdad.json"),
  "parejas-reto": require("../data/retos/parejas-reto.json"),
  "amigos-verdad": require("../data/retos/amigos-verdad.json"),
  "amigos-reto": require("../data/retos/amigos-reto.json"),
  "chicas-verdad": require("../data/retos/chicas-verdad.json"),
  "chicas-reto": require("../data/retos/chicas-reto.json"),
  "extremo-verdad": require("../data/retos/extremo-verdad.json"),
  "extremo-reto": require("../data/retos/extremo-reto.json"),
};

const STORAGE_KEY = "usedCards";

// Cartas que ya salieron por "categoria-tipo". Se guardan por texto (no por
// índice) para que agregar o quitar cartas por OTA no mezcle el historial.
let usados: Record<string, string[]> = {};
let saveTimeout: ReturnType<typeof setTimeout> | undefined;

/** Carga el historial guardado; se llama una vez al abrir la app. */
export async function loadUsedCards() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) usados = JSON.parse(stored);
  } catch (error) {
    console.warn("Error loading used cards:", error);
  }
}

function saveUsedCards() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usados)).catch((error) =>
      console.warn("Error saving used cards:", error)
    );
  }, 500);
}

/**
 * Devuelve una carta que no haya salido antes, también entre sesiones. Cuando
 * se acaban las de esa categoría y tipo, el historial vuelve a empezar.
 */
export function getRandomReto(
  categoria: string,
  type: "verdad" | "reto",
): Reto {
  const key = `${categoria}-${type}`;
  const retos = data[key] || data["clasico-verdad"];
  const vistos = new Set((usados[key] ?? []).filter((text) => retos.includes(text)));

  let disponibles = retos.filter((text) => !vistos.has(text));
  if (disponibles.length === 0) {
    vistos.clear();
    disponibles = retos;
  }

  const text = disponibles[Math.floor(Math.random() * disponibles.length)];
  vistos.add(text);
  usados[key] = [...vistos];
  saveUsedCards();

  return { text, type };
}
