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

export const trackCategorySelected = (category: string, locked: boolean) =>
  track("category_selected", { category, locked });

export const trackCardShown = (
  category: string,
  type: "verdad" | "reto",
  cardNumber: number
) => track("card_shown", { category, type, card_number: cardNumber });

/** Entrada al juego de una categoría (también después de desbloquearla con un video). */
export const trackGameStarted = (category: string) =>
  track("game_started", { category });

export const trackGameEnded = (category: string, cardsShown: number) =>
  track("game_ended", { category, cards_shown: cardsShown });

export const trackPlayersUpdated = (count: number) =>
  track("players_updated", { count });

export const trackCardShared = (category: string, type: "verdad" | "reto") =>
  track("card_shared", { category, type });

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
