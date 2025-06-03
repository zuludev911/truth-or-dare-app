import Constants from "expo-constants";

const { extra } = Constants.expoConfig || {};

export const SENTRY_DSN = extra?.sentryDsn || "";
