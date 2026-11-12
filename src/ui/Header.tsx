import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import IconArrowLeft from "@tabler/icons-react-native/IconArrowLeft";
import IconX from "@tabler/icons-react-native/IconX";

import { colors, space } from "../theme";
import IconButton from "./IconButton";
import Text from "./Text";

interface Props {
  title?: string;
  /** "back" muestra una flecha; "close", una X (sale del juego). */
  leading?: "back" | "close";
  onLeadingPress: () => void;
  /** Acción a la derecha, por ejemplo la píldora de jugadores. */
  trailing?: ReactNode;
}

/** Encabezado de pantalla: botón de volver o cerrar, título y acción opcional. */
export default function Header({ title, leading = "back", onLeadingPress, trailing }: Props) {
  const Icon = leading === "back" ? IconArrowLeft : IconX;
  return (
    <View style={styles.header}>
      <IconButton
        icon={<Icon color={colors.text} size={22} strokeWidth={2.5} />}
        onPress={onLeadingPress}
        accessibilityLabel={leading === "back" ? "Volver" : "Cerrar"}
      />
      <Text variant="title" style={styles.title} numberOfLines={2}>
        {title ?? ""}
      </Text>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.s2,
    minHeight: 48,
    marginTop: space.s2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
  },
});
