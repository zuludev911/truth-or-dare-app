import { Platform } from "react-native";

/**
 * Edición de la App Store. Apple rechazó la app como "juego de beber" (guía
 * 4.3b) y por contenido para adultos en la ficha (guía 1.1), así que en iOS:
 * - no hay mecánica de alcohol: castigos en vez de "toma", sin vasitos;
 * - no hay categorías ni niveles para adultos (Picante, Extremo, Chicas), y por
 *   eso tampoco hay nada que desbloquear con video;
 * - los anuncios no son personalizados (sin rastreo ni aviso ATT).
 * Android sigue con la edición completa.
 */
export const IOS_EDITION = Platform.OS === "ios";

/** Categorías de Verdad o Reto y niveles de los otros juegos que no van en iOS. */
export const HIDDEN_ON_IOS = new Set(["picante", "extremo", "chicas"]);

export const isAvailable = (id: string) => !(IOS_EDITION && HIDDEN_ON_IOS.has(id));
