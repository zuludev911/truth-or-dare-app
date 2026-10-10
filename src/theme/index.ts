/**
 * Tokens del rediseño "Neón Noche". Los valores son los mismos de las Variables
 * de Figma y del prototipo (docs/prototipo/index.html); si cambian allá, cambian aquí.
 */

export const colors = {
  base: "#130A2E",
  surface: "#1E1245",
  raised: "#2A1B5E",
  border: "#3B2A7A",
  text: "#FFFFFF",
  muted: "#B9AEE0",
  /** Texto sobre los colores de acento (siempre oscuro). */
  onAccent: "#130A2E",

  // Un color por juego
  vor: "#FF2E88",
  yn: "#A78BFA",
  qmp: "#FFC83D",
  her: "#2DE2C6",
  nav: "#3DDC84",

  // Cartas de Verdad o Reto
  verdad: "#2DE2C6",
  reto: "#FF4D5E",

  error: "#FF6B6B",
  ok: "#3DDC84",
} as const;

export type AccentColor = "vor" | "yn" | "qmp" | "her" | "nav" | "verdad" | "reto";

export const radius = {
  card: 28,
  button: 20,
  pill: 999,
} as const;

/** Escala de 4 en 4: s1 = 4, s2 = 8… */
export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
} as const;

/** Nombres con los que se registran las fuentes en `useAppFonts`. */
export const fonts = {
  display: "Unbounded_700Bold",
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  bold: "DMSans_700Bold",
} as const;

export const motion = {
  /** Cada mitad del giro de la carta. */
  flip: 250,
  screen: 280,
  sheet: 320,
  countdownStep: 800,
  bottleSpin: 3200,
  diceRoll: 900,
} as const;

/** Espacio reservado para el banner adaptable (puede medir de 50 a 90 dp). */
export const BANNER_HEIGHT = 60;

/** Tamaño mínimo de cualquier zona táctil. */
export const TOUCH_TARGET = 48;

/** Brillo neón de un color, para sombras en iOS y `elevation` en Android. */
export const glow = (color: string, opacity = 0.45) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: opacity,
  shadowRadius: 14,
  elevation: 8,
});
