import Constants from "expo-constants";

const { extra } = Constants.expoConfig || {};

// Si la variable no llegó al build (p. ej. queda el texto "$DSN_SENTRY"), Sentry se
// desactivaría sin avisar; mejor dejarlo vacío y advertirlo en la consola.
const dsn: string = extra?.sentryDsn || "";
if (!dsn.startsWith("https://")) {
  console.warn("Sentry DSN inválido o ausente, los errores no se reportarán:", dsn);
}

export const SENTRY_DSN = dsn.startsWith("https://") ? dsn : "";
