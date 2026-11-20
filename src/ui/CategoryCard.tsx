import { Pressable, StyleSheet, View } from "react-native";

import { AccentColor, colors, glow, radius, space } from "../theme";
import Badge from "./Badge";
import Illustration, { Flames, IllustrationName, LockIcon } from "./Illustration";
import Text from "./Text";

interface Props {
  name: string;
  illustration: IllustrationName;
  /** Intensidad de 1 a 3 llamas. */
  level: number;
  accent?: AccentColor;
  isNew?: boolean;
  locked?: boolean;
  /** Tiempo de desbloqueo restante, por ejemplo "Quedan 1 h 45 min". */
  timeLeft?: string;
  onPress: () => void;
}

/** Tarjeta de categoría en la grilla de dos columnas de Verdad o Reto. */
export default function CategoryCard({
  name,
  illustration,
  level,
  accent = "vor",
  isNew,
  locked,
  timeLeft,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={locked ? `${name}, bloqueada` : name}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors[accent], ...glow(colors[accent], 0.4) },
        pressed && styles.pressed,
      ]}
    >
      {isNew && <Badge label="¡Nuevas!" variant="new" style={styles.badge} />}
      <Illustration name={illustration} size={96} />
      <Text variant="title" color={colors.onAccent}>
        {name}
      </Text>
      <Flames level={level} />
      {timeLeft && <Badge label={timeLeft} />}
      {locked && (
        <View style={styles.veil}>
          <View style={styles.lock}>
            <LockIcon />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 178,
    borderRadius: radius.card,
    paddingTop: space.s3,
    paddingHorizontal: space.s3,
    paddingBottom: space.s4,
    alignItems: "center",
    gap: 6,
    overflow: "hidden",
  },
  badge: { position: "absolute", top: 10, left: 10, zIndex: 1 },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,10,46,0.62)",
    alignItems: "center",
    justifyContent: "center",
  },
  lock: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.base,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
