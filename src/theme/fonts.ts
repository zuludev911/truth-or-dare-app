import { useFonts } from "expo-font";

import { fonts } from "./index";

// Se importa cada archivo por separado: el índice de los paquetes
// @expo-google-fonts incluye todos los pesos y agrandaría el update OTA.
const FONT_FILES = {
  [fonts.display]: require("@expo-google-fonts/unbounded/700Bold/Unbounded_700Bold.ttf"),
  [fonts.regular]: require("@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf"),
  [fonts.medium]: require("@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf"),
  [fonts.bold]: require("@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf"),
};

/** Carga las fuentes del rediseño. Devuelve true cuando ya se pueden usar (o si fallaron). */
export function useAppFonts() {
  const [loaded, error] = useFonts(FONT_FILES);
  return loaded || !!error;
}
