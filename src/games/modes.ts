import type { AccentColor } from "../theme";
import type { IllustrationName } from "../ui/Illustration";
import { IOS_EDITION, isAvailable } from "./edition";

/** vor = Verdad o Reto, yn = Yo nunca, qmp = ¿Quién es más probable que…? */
export type GameMode = "vor" | "yn" | "qmp";

/** Tipo de carta: en Verdad o Reto hay dos; en los otros juegos, uno por modo. */
export type CardType = "verdad" | "reto" | "yn" | "qmp";

export interface Card {
  type: CardType;
  text: string;
  /** Tragos de castigo (1 a 3). En iOS no se muestran. */
  drinks: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  illustration: IllustrationName;
  /** Se desbloquea viendo un video; el id de desbloqueo es "modo-nivel". */
  locked?: boolean;
  /** Texto del modal de desbloqueo (termina con la duración del acceso). */
  lockedText?: string;
}

interface ModeConfig {
  title: string;
  accent: AccentColor;
  illustration: IllustrationName;
  /** "Le toca a" en Verdad o Reto; "Le toca leer a" en los otros. */
  turnLabel: string;
  /** Texto del reverso de la carta. */
  backHint: string;
  /** Niveles de Yo nunca y ¿Quién…? (Verdad o Reto usa CATEGORIES). */
  levels: Level[];
}

const ALL_MODES: Record<GameMode, ModeConfig> = {
  vor: {
    title: "Verdad o Reto",
    accent: "vor",
    illustration: "vor",
    turnLabel: "Le toca a",
    backHint: "Elige Verdad o Reto",
    levels: [],
  },
  yn: {
    title: "Yo nunca",
    accent: "yn",
    illustration: "yn",
    turnLabel: "Le toca leer a",
    backHint: "Toca para sacar una carta",
    levels: [
      { id: "clasico", name: "Clásico", description: "Para romper el hielo", illustration: "clasico" },
      {
        id: "picante",
        name: "Picante",
        description: "Sube la temperatura",
        illustration: "vor",
        locked: true,
        lockedText: "Este nivel tiene preguntas para adultos. Para jugarlo debes ver un video de publicidad, el cual te dará acceso por",
      },
      { id: "parejas", name: "Parejas", description: "Solo para dos… o más", illustration: "parejas" },
    ],
  },
  qmp: {
    title: "¿Quién es más probable que…?",
    accent: "qmp",
    illustration: "qmp",
    turnLabel: "Le toca leer a",
    backHint: "Toca para sacar una pregunta",
    levels: [
      { id: "clasico", name: "Clásico", description: "Señala al culpable", illustration: "clasico" },
      {
        id: "picante",
        name: "Picante",
        description: "Con un poco de picante",
        illustration: "vor",
        locked: true,
        lockedText: "Este nivel tiene preguntas para adultos. Para jugarlo debes ver un video de publicidad, el cual te dará acceso por",
      },
      { id: "amigos", name: "Amigos", description: "Para el grupo de siempre", illustration: "amigos" },
    ],
  },
};

/** En iOS no van los niveles Picante (ver games/edition). */
export const MODES = Object.fromEntries(
  Object.entries(ALL_MODES).map(([mode, config]) => [
    mode,
    { ...config, levels: config.levels.filter((level) => isAvailable(level.id)) },
  ])
) as Record<GameMode, ModeConfig>;

/** Cómo se ve cada tipo de carta. */
export const CARD_STYLES: Record<
  CardType,
  { tag: string; footer: string; color: AccentColor; watermark: IllustrationName; shareLabel?: string }
> = {
  verdad: { tag: "VERDAD", footer: IOS_EDITION ? "Si no respondes, cumple un castigo" : "Si no respondes toma", color: "verdad", watermark: "qmp", shareLabel: "Verdad" },
  reto: { tag: "RETO", footer: IOS_EDITION ? "Si no lo haces, cumple un castigo" : "Si no lo haces toma", color: "reto", watermark: "vor", shareLabel: "Reto" },
  yn: { tag: "YO NUNCA", footer: IOS_EDITION ? "Quien lo haya hecho, baja un dedo" : "Quien lo haya hecho, toma", color: "yn", watermark: "yn" },
  qmp: { tag: "¿QUIÉN?", footer: IOS_EDITION ? "El más señalado cumple un castigo" : "El más señalado toma", color: "qmp", watermark: "qmp" },
};
