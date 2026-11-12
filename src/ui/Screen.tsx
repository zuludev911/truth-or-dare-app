import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

import { colors, AccentColor, CONTENT_MAX_WIDTH, space } from "../theme";

/**
 * Brillo neón difuso del fondo. En el prototipo es un círculo con blur(90px);
 * aquí se aproxima con un degradado radial que se desvanece hacia el borde.
 */
function Glow({ color, size, opacity, style }: { color: string; size: number; opacity: number; style: ViewStyle }) {
  const id = `glow-${color.slice(1)}-${size}`;
  return (
    <View pointerEvents="none" style={[styles.glow, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

interface Props {
  children: ReactNode;
  /** Colores de los dos brillos: arriba a la izquierda y abajo a la derecha. */
  glows?: [AccentColor, AccentColor];
  /** Respeta el área segura de abajo (false cuando el banner ya la maneja). */
  padBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Contenedor de pantalla: fondo base, brillos y áreas seguras. */
export default function Screen({ children, glows = ["vor", "yn"], padBottom = true, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: padBottom ? insets.bottom + space.s4 : 0 },
        style,
      ]}
    >
      <Glow color={colors[glows[0]]} size={420} opacity={0.45} style={{ left: -170, top: -180 }} />
      <Glow color={colors[glows[1]]} size={440} opacity={0.38} style={{ right: -180, bottom: 20 }} />
      {/* En tablets el contenido no se estira: ancho máximo y centrado. */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.base,
    paddingHorizontal: space.s5,
  },
  glow: {
    position: "absolute",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
  },
});
