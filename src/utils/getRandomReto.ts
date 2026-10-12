import AsyncStorage from "@react-native-async-storage/async-storage";

import { extremoReto, extremoVerdad } from "../data/extremo";
import { Card, CardType, GameMode } from "../games/modes";

// Mazos por "nivel-tipo" (Verdad o Reto) o "modo-nivel" (Yo nunca, ¿Quién…?).
// Las claves de Verdad o Reto son las mismas de antes para conservar el historial.
const DECKS: Record<string, string[]> = {
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
  // Extremo tiene un mazo distinto en iOS (ver src/data/extremo.ios.ts).
  "extremo-verdad": extremoVerdad,
  "extremo-reto": extremoReto,

  "yn-clasico": require("../data/yo-nunca/clasico.json"),
  "yn-picante": require("../data/yo-nunca/picante.json"),
  "yn-parejas": require("../data/yo-nunca/parejas.json"),

  "qmp-clasico": require("../data/quien/clasico.json"),
  "qmp-picante": require("../data/quien/picante.json"),
  "qmp-amigos": require("../data/quien/amigos.json"),
};

const STORAGE_KEY = "usedCards";

// Cartas que ya salieron por mazo. Se guardan por texto (no por índice) para
// que agregar o quitar cartas por OTA no mezcle el historial.
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

const deckKey = (mode: GameMode, level: string, type: CardType) =>
  mode === "vor" ? `${level}-${type}` : `${mode}-${level}`;

/**
 * Saca una carta que no haya salido antes, también entre sesiones. Cuando se
 * acaban las de ese mazo, el historial vuelve a empezar.
 */
export function drawCard(mode: GameMode, level: string, type: CardType): Card {
  const key = deckKey(mode, level, type);
  const deck = DECKS[key] ?? DECKS["clasico-verdad"];
  const vistos = new Set((usados[key] ?? []).filter((text) => deck.includes(text)));

  let disponibles = deck.filter((text) => !vistos.has(text));
  if (disponibles.length === 0) {
    vistos.clear();
    disponibles = deck;
  }

  const text = disponibles[Math.floor(Math.random() * disponibles.length)];
  vistos.add(text);
  usados[key] = [...vistos];
  saveUsedCards();

  return { type, text, drinks: 1 + Math.floor(Math.random() * 3) };
}
