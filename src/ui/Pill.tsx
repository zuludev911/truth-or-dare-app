import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

import { AccentColor, colors, radius, space } from "../theme";
import Text from "./Text";

interface Props {
  label: string;
  /** Con color de acento (categoría del juego); sin él, fondo elevado. */
  accent?: AccentColor;
  icon?: ReactNode;
  onPress?: () => void;
}

/** Píldora del encabezado del juego: categoría actual o número de jugadores. */
export default function Pill({ label, accent, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : "text"}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: accent ? colors[accent] : colors.raised },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon}
      <Text variant="label" color={accent ? colors.onAccent : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: space.s4,
    borderRadius: radius.pill,
    minHeight: 44,
  },
});
