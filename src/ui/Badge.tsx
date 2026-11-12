import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius } from "../theme";
import Text from "./Text";

type Variant =
  | "default" // fondo base: "NUEVO" sobre una tarjeta de color, tiempo restante
  | "new" // amarillo: "¡NUEVAS!"
  | "soon"; // atenuado: "PRÓXIMAMENTE"

interface Props {
  label: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

/** Etiqueta en forma de píldora. El texto se muestra en mayúsculas. */
export default function Badge({ label, variant = "default", style }: Props) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text variant="badge" color={variant === "new" ? colors.onAccent : variant === "soon" ? colors.muted : colors.text}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  default: { backgroundColor: colors.base },
  new: { backgroundColor: colors.qmp },
  soon: { backgroundColor: colors.raised },
});
