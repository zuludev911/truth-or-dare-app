import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AccentColor, colors, glow, radius, space } from "../theme";
import Badge from "./Badge";
import Text from "./Text";

interface Props {
  title: string;
  subtitle: string;
  /** Ilustración o ícono de la izquierda. */
  media: ReactNode;
  /** Con acento: tarjeta de nivel (Yo nunca, ¿Quién…?). Sin acento: tarjeta de herramienta. */
  accent?: AccentColor;
  /** Herramienta deshabilitada: atenuada y con "Próximamente". */
  soon?: boolean;
  onPress: () => void;
}

/** Tarjeta horizontal: niveles de Yo nunca / ¿Quién…? y lista de herramientas. */
export default function ListCard({ title, subtitle, media, accent, soon, onPress }: Props) {
  const textColor = accent ? colors.onAccent : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: soon }}
      style={({ pressed }) => [
        styles.card,
        accent ? { backgroundColor: colors[accent], ...glow(colors[accent], 0.2) } : styles.surface,
        soon && styles.soon,
        pressed && styles.pressed,
      ]}
    >
      {media}
      <View style={styles.texts}>
        <Text variant="title" color={textColor}>
          {title}
        </Text>
        <Text variant={accent ? "bodyMedium" : "caption"} color={accent ? colors.onAccent : undefined}>
          {subtitle}
        </Text>
        {soon && <Badge label="Próximamente" variant="soon" style={styles.badge} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: space.s4,
    borderRadius: radius.card,
    minHeight: 96,
  },
  surface: { backgroundColor: colors.surface },
  texts: { flex: 1, gap: space.s1 },
  badge: { marginTop: 2 },
  soon: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
});
