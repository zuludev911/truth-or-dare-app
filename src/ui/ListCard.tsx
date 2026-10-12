import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AccentColor, colors, glow, radius, space } from "../theme";
import Badge from "./Badge";
import { LockIcon } from "./Illustration";
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
  /** Se desbloquea con un video: velo oscuro con candado. */
  locked?: boolean;
  /** Tiempo de desbloqueo restante, por ejemplo "Quedan 1 h 45 min". */
  timeLeft?: string;
  onPress: () => void;
}

/** Tarjeta horizontal: niveles de Yo nunca / ¿Quién…? y lista de herramientas. */
export default function ListCard({ title, subtitle, media, accent, soon, locked, timeLeft, onPress }: Props) {
  const textColor = accent ? colors.onAccent : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={locked ? `${title}, bloqueado` : undefined}
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
        {timeLeft && <Badge label={timeLeft} style={styles.badge} />}
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: space.s4,
    borderRadius: radius.card,
    minHeight: 96,
    overflow: "hidden",
  },
  surface: { backgroundColor: colors.surface },
  texts: { flex: 1, gap: space.s1 },
  badge: { marginTop: 2 },
  soon: { opacity: 0.5 },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,10,46,0.62)",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: space.s5,
  },
  lock: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.base,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { transform: [{ scale: 0.98 }] },
});
