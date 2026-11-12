import { StyleSheet, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

import { colors, radius, space } from "../theme";
import Text from "./Text";

function AppToast({ title, message, error }: { title?: string; message?: string; error?: boolean }) {
  const accent = error ? colors.error : colors.her;
  return (
    <View style={[styles.toast, { borderColor: accent }]}>
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <Text variant="label" color={colors.onAccent}>
          {error ? "!" : "i"}
        </Text>
      </View>
      <View style={styles.texts}>
        {title && <Text variant="label">{title}</Text>}
        {message && <Text variant="caption">{message}</Text>}
      </View>
    </View>
  );
}

/** Estilo de los toasts del rediseño para react-native-toast-message (tipos info, success y error). */
export const toastConfig: ToastConfig = {
  info: ({ text1, text2 }) => <AppToast title={text1} message={text2} />,
  success: ({ text1, text2 }) => <AppToast title={text1} message={text2} />,
  error: ({ text1, text2 }) => <AppToast title={text1} message={text2} error />,
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.s3,
    width: "90%",
    paddingVertical: space.s3,
    paddingHorizontal: space.s4,
    borderRadius: radius.button,
    borderWidth: 2,
    backgroundColor: colors.raised,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: { flex: 1 },
});
