#!/usr/bin/env node
/**
 * Revisa la config resuelta de la app antes de publicar un build o un update OTA.
 * Lee la salida de `npx expo config --type public --json` por stdin.
 *
 * Evita repetir errores que ya llegaron a producción: IDs de AdMob vacíos o de
 * prueba, y un DSN de Sentry que no es una URL (quedaba el texto "$DSN_SENTRY").
 */
const TEST_ADMOB_PREFIX = "ca-app-pub-3940256099942544";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const config = JSON.parse(input);
  const extra = config.extra || {};
  const errors = [];

  for (const key of [
    "admobAndroidBannerId",
    "admobAndroidInterstitialId",
    "admobRewardId",
  ]) {
    const value = extra[key];
    if (!value) errors.push(`${key} está vacío`);
    else if (value.startsWith(TEST_ADMOB_PREFIX)) errors.push(`${key} es un ID de prueba`);
  }
  if (!String(extra.sentryDsn || "").startsWith("https://")) {
    errors.push(`sentryDsn no es una URL válida (${extra.sentryDsn})`);
  }
  if (!extra.eas?.projectId) errors.push("extra.eas.projectId está vacío");

  if (errors.length) {
    console.error("La configuración no está lista para publicar:");
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }
  console.log(`Config OK: versión ${config.version}, runtime ${config.runtimeVersion}`);
});
