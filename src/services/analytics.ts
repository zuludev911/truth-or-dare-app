import {
  getAnalytics,
  logEvent,
  logScreenView,
  setAnalyticsCollectionEnabled,
} from "@react-native-firebase/analytics";
import * as Sentry from "@sentry/react-native";

const analytics = getAnalytics();

// En desarrollo no enviamos eventos para no ensuciar los datos de producción.
setAnalyticsCollectionEnabled(analytics, !__DEV__).catch(() => {});

type Params = Record<string, string | number | boolean | undefined>;

const track = (name: string, params: Params = {}) => {
  if (__DEV__) console.log(`[analytics] ${name}`, params);
  Promise.resolve(logEvent(analytics, name, params)).catch((error) =>
    Sentry.captureException(error)
  );
};

export type AdFormat = "banner" | "interstitial" | "rewarded";
export type AdPlacement =
  | "game"
  | "dice"
  | "bottle"
  | "categories"
  | "tools";

export const trackScreen = (screenName: string) => {
  logScreenView(analytics, {
    screen_name: screenName,
    screen_class: screenName,
  }).catch(() => {});
};

/** Tarjeta tocada en el centro de juegos del inicio. */
export const trackHomeGameSelected = (
  game: "vor" | "yn" | "qmp" | "tools" | "christmas"
) => track("home_game_selected", { game });

export const trackCategorySelected = (category: string, locked: boolean) =>
  track("category_selected", { category, locked });

// `mode`: vor (Verdad o Reto), yn (Yo nunca), qmp (¿Quién es más probable que…?).
// `category` es la categoría de Verdad o Reto o el nivel de los otros juegos.
type GameMode = "vor" | "yn" | "qmp";
type CardType = "verdad" | "reto" | "yn" | "qmp";

export const trackCardShown = (
  mode: GameMode,
  category: string,
  type: CardType,
  cardNumber: number
) => track("card_shown", { mode, category, type, card_number: cardNumber });

/** Entrada a un juego (también después de desbloquear una categoría con un video). */
export const trackGameStarted = (mode: GameMode, category: string) =>
  track("game_started", { mode, category });

export const trackGameEnded = (mode: GameMode, category: string, cardsShown: number) =>
  track("game_ended", { mode, category, cards_shown: cardsShown });

export const trackPlayersUpdated = (count: number) =>
  track("players_updated", { count });

export const trackCardShared = (mode: GameMode, category: string, type: CardType) =>
  track("card_shared", { mode, category, type });

export type Tool = "dice" | "bottle";

/** Entrada a una herramienta (una vez por visita). */
export const trackToolOpened = (tool: Tool) => track("tool_opened", { tool });

/** Cada tirada del dado o giro de la botella. */
export const trackToolUsed = (tool: Tool, params: Params = {}) =>
  track("tool_used", { tool, ...params });

export const trackAdShown = (format: AdFormat, placement: AdPlacement) =>
  track("ad_shown", { format, placement });

export const trackAdFailed = (
  format: AdFormat,
  placement: AdPlacement,
  error: unknown
) =>
  track("ad_failed", {
    format,
    placement,
    // Ej: "googleMobileAds/error-code-no-fill"
    code: String((error as { code?: string })?.code ?? error).slice(0, 100),
  });

export const trackRewardEarned = (unlock: string) =>
  track("rewarded_earned", { unlock });
