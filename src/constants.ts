import type { IllustrationName } from "./ui/Illustration";

export interface CategoryConfig {
  id: string;
  name: string;
  /** Ilustración del rediseño. */
  illustration: IllustrationName;
  /** Intensidad de 1 a 3 llamas. */
  level: number;
  /** Se desbloquea viendo un video (ver utils/unlock). */
  locked?: boolean;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: "clasico", name: "Clásico", illustration: "clasico", level: 1 },
  { id: "picante", name: "Picante", illustration: "vor", level: 2 },
  { id: "extremo", name: "Extremo", illustration: "extremo", level: 3, locked: true },
  { id: "parejas", name: "Parejas", illustration: "parejas", level: 2 },
  { id: "amigos", name: "Amigos", illustration: "amigos", level: 1 },
  { id: "chicas", name: "Chicas", illustration: "chicas", level: 2, locked: true },
];

// Categorías con cartas nuevas: muestran la etiqueta "¡Nuevas!" hasta esa fecha.
export const NEW_CONTENT_UNTIL: Record<string, string> = {
  picante: "2026-11-09",
  extremo: "2026-11-09",
};
