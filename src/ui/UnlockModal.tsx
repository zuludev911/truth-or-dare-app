import { Modal, StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, ZoomIn } from "react-native-reanimated";
import IconX from "@tabler/icons-react-native/IconX";

import { colors, radius, space } from "../theme";
import Button from "./Button";
import IconButton from "./IconButton";
import Illustration, { IllustrationName } from "./Illustration";
import Text from "./Text";

export type UnlockState = "ready" | "loading" | "offline" | "noads";

interface Props {
  visible: boolean;
  illustration: IllustrationName;
  description: string;
  state: UnlockState;
  onWatch: () => void;
  onClose: () => void;
}

const ERRORS: Partial<Record<UnlockState, string>> = {
  offline: "Sin conexión a internet. Conéctate para ver el video y desbloquear esta categoría.",
  noads: "No se cargaron anuncios, intenta más tarde",
};

/** Modal para desbloquear una categoría para adultos viendo un video. */
export default function UnlockModal({ visible, illustration, description, state, onWatch, onClose }: Props) {
  const error = ERRORS[state];
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Animated.View entering={FadeIn.duration(200)} style={styles.scrim}>
        <Animated.View entering={ZoomIn.duration(280).easing(Easing.bezier(0.2, 0.8, 0.2, 1))} style={styles.modal}>
          <IconButton
            icon={<IconX color={colors.text} size={22} strokeWidth={2.5} />}
            onPress={onClose}
            accessibilityLabel="Cerrar"
            style={styles.close}
          />
          <Illustration name={illustration} size={120} />
          <Text variant="title" style={styles.center}>
            Categoría para adultos
          </Text>
          <Text variant="body" color={colors.muted} style={[styles.center, styles.description]}>
            {description}
          </Text>
          {error && (
            <Text variant="bodyMedium" color={colors.error} style={styles.center}>
              {error}
            </Text>
          )}
          <Button
            label="Ver video ▶"
            onPress={onWatch}
            loading={state === "loading"}
            disabled={state === "offline" || state === "noads"}
            style={styles.button}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(10,5,28,0.7)",
    justifyContent: "center",
    padding: space.s5,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space.s6,
    alignItems: "center",
    gap: 14,
  },
  close: { position: "absolute", top: space.s3, right: space.s3, zIndex: 1 },
  center: { textAlign: "center" },
  description: { fontSize: 16, lineHeight: 24 },
  button: { alignSelf: "stretch" },
});
