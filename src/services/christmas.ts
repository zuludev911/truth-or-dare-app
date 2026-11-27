import { getConfigNumber } from "./remoteConfig";

/**
 * Temporada navideña: del 15 de noviembre al 6 de enero (la gente organiza el
 * amigo secreto desde noviembre). Remote Config `christmas_season` permite
 * adelantarla o cortarla sin publicar: 0 = por fecha, 1 = siempre, 2 = nunca.
 */
export function isChristmasSeason(now: Date = new Date()): boolean {
  const override = getConfigNumber("christmas_season");
  if (override === 1) return true;
  if (override === 2) return false;
  const month = now.getMonth(); // 0 = enero
  return month === 11 || (month === 10 && now.getDate() >= 15) || (month === 0 && now.getDate() <= 6);
}
