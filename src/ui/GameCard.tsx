import { Pressable, StyleSheet, View } from "react-native";

import { AccentColor, colors, glow, radius, space } from "../theme";
import Badge from "./Badge";
import Illustration, { IllustrationName } from "./Illustration";
import Text from "./Text";

interface Props {
  title: string;
  subtitle: string;
  accent: AccentColor;
  illustration: IllustrationName;
  /** Rotación de la ilustración, como en el prototipo. */
  illustrationRotate?: number;
  badge?: string;
  /** Deshabilitada ("Próximamente"): se ve atenuada pero se puede tocar para avisar. */
  disabled?: boolean;
  onPress: () => void;
}

/** Tarjeta grande de un juego en la pantalla de inicio. */
export default function GameCard({
  title,
  subtitle,
  accent,
  illustration,
  illustrationRotate = 0,
  badge,
  disabled,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors[accent] },
        !disabled && glow(colors[accent]),
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.texts}>
        <Text variant="title" color={colors.onAccent}>
          {title}
        </Text>
        <Text variant="bodyMedium" color={colors.onAccent}>
          {subtitle}
        </Text>
        {badge && <Badge label={badge} variant={disabled ? "soon" : "default"} />}
      </View>
      <Illustration name={illustration} size={108} rotate={illustrationRotate} style={styles.illustration} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    borderRadius: radius.card,
    paddingVertical: space.s4,
    paddingLeft: space.s5,
    paddingRight: 112,
    justifyContent: "center",
  },
  texts: { gap: space.s1 },
  illustration: {
    position: "absolute",
    right: 4,
    top: "50%",
    marginTop: -60,
  },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
});
