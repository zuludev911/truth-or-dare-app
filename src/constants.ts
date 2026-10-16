import clasico from "./assets/clasico.webp";
import picante from "./assets/picante.webp";
import parejas from "./assets/parejas.webp";
import amigos from "./assets/amigos.webp";
import chicas from "./assets/chicas.webp";
import extremo from "./assets/extremo.webp";

import type { IllustrationName } from "./ui/Illustration";

export interface CategoryConfig {
  id: string;
  name: string;
  /** Imagen del diseño anterior (todavía la usa la pantalla de juego). */
  icon: number;
  /** Ilustración del rediseño. */
  illustration: IllustrationName;
  /** Intensidad de 1 a 3 llamas. */
  level: number;
  /** Se desbloquea viendo un video (ver utils/unlock). */
  locked?: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: "clasico", name: "Clásico", icon: clasico, illustration: "clasico", level: 1 },
  { id: "picante", name: "Picante", icon: picante, illustration: "vor", level: 2 },
  { id: "extremo", name: "Extremo", icon: extremo, illustration: "extremo", level: 3, locked: true },
  { id: "parejas", name: "Parejas", icon: parejas, illustration: "parejas", level: 2 },
  { id: "amigos", name: "Amigos", icon: amigos, illustration: "amigos", level: 1 },
  { id: "chicas", name: "Chicas", icon: chicas, illustration: "chicas", level: 2, locked: true },
];

// Categorías con cartas nuevas: muestran la etiqueta "¡Nuevas!" hasta esa fecha.
export const NEW_CONTENT_UNTIL: Record<string, string> = {
  picante: "2026-11-09",
  extremo: "2026-11-09",
};

export const COLORS = {
  PRIMARY: "#E63140",
  SECONDARY: "#97d0ca",
  BLACK: "#000000",
  WHITE: "#ffffff",
};
