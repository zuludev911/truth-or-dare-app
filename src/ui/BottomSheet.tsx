import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, { Easing, FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, motion, radius, space } from "../theme";
import Text from "./Text";

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** Hoja inferior con fondo oscurecido; se cierra tocando fuera o con el botón atrás. */
export default function BottomSheet({ visible, onClose, title, subtitle, children }: Props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Animated.View entering={FadeIn.duration(200)} style={styles.scrim}>
          <Pressable style={styles.flex} onPress={onClose} accessibilityLabel="Cerrar" />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.duration(motion.sheet).easing(Easing.bezier(0.2, 0.8, 0.2, 1))}
          style={[styles.sheet, { paddingBottom: bottom + space.s6 + OVERHANG }]}
        >
          <View style={styles.handle} />
          <Text variant="title">{title}</Text>
          {subtitle && (
            <Text variant="caption" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// En Android el modal puede medir un poco menos que la pantalla y dejar ver el
// contenido de abajo; la hoja se extiende más allá del borde para taparlo.
const OVERHANG = 120;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,5,28,0.7)",
  },
  sheet: {
    marginTop: "auto",
    marginBottom: -OVERHANG,
    maxHeight: "88%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingTop: space.s3,
    paddingHorizontal: space.s5,
    gap: 14,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
  },
  subtitle: { marginTop: -8 },
});
