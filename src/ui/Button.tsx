import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { AccentColor, colors, fonts, glow, radius, space } from "../theme";
import Text from "./Text";

type Variant = "primary" | "secondary" | "ghost";
type Size = "small" | "default" | "tall";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** Color de acento para la variante primary (por defecto, el de Verdad o Reto). */
  accent?: AccentColor;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Botón del rediseño: primary (color de acento con brillo), secondary o ghost. */
export default function Button({
  label,
  onPress,
  variant = "primary",
  accent = "vor",
  size = "default",
  disabled,
  loading,
  icon,
  style,
}: Props) {
  const isPrimary = variant === "primary";
  const textColor = isPrimary ? colors.onAccent : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        isPrimary && { backgroundColor: colors[accent], ...glow(colors[accent]) },
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              size === "small" ? styles.smallText : styles.text,
              size === "tall" && styles.tallText,
              { color: textColor },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    paddingHorizontal: space.s6,
    alignItems: "center",
    justifyContent: "center",
  },
  small: { height: 44 },
  default: { height: 56 },
  tall: { height: 64 },
  secondary: { backgroundColor: colors.raised },
  ghost: { borderWidth: 2, borderColor: colors.border },
  disabled: { opacity: 0.4, shadowOpacity: 0, elevation: 0 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  content: { flexDirection: "row", alignItems: "center", gap: space.s2 },
  text: { fontFamily: fonts.display, fontSize: 18 },
  tallText: { fontSize: 20 },
  smallText: { fontFamily: fonts.bold, fontSize: 14 },
});
