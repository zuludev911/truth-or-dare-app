import { Text as RNText, TextProps, StyleSheet } from "react-native";

import { colors, fonts } from "../theme";

export type TextVariant =
  | "hero" // título del inicio
  | "title" // títulos de tarjetas y encabezados
  | "card" // texto de la carta de juego
  | "cardLong" // texto de carta con más de 120 caracteres
  | "body"
  | "bodyMedium"
  | "label" // botones pequeños, filas
  | "caption" // subtítulos y ayudas
  | "badge";

interface Props extends TextProps {
  variant?: TextVariant;
  color?: string;
}

/** Texto con la tipografía del rediseño. */
export default function Text({ variant = "body", color, style, ...props }: Props) {
  return <RNText {...props} style={[styles[variant], color ? { color } : null, style]} />;
}

const styles = StyleSheet.create({
  hero: { fontFamily: fonts.display, fontSize: 32, lineHeight: 40, color: colors.text },
  title: { fontFamily: fonts.display, fontSize: 18, lineHeight: 23, color: colors.text },
  card: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 36, color: colors.onAccent },
  cardLong: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32, color: colors.onAccent },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 21, color: colors.text },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.text },
  label: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: colors.text },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.muted },
  badge: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 0.66, color: colors.text },
});
