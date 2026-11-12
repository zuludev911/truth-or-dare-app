import { useEffect, useState } from "react";
import { Modal, StyleSheet, Vibration, View } from "react-native";
import Animated, { Easing, ZoomIn } from "react-native-reanimated";

import { colors, fonts, motion, space } from "../theme";
import { Text } from "../ui";
import { CARD_STYLES } from "../games/modes";

interface Props {
  visible: boolean;
  onFinish: () => void;
}

/** Cuenta regresiva 3-2-1 de ¿Quién es más probable que…? antes de que todos señalen. */
export default function Countdown({ visible, onFinish }: Props) {
  const [step, setStep] = useState(3);

  useEffect(() => {
    if (!visible) return;
    setStep(3);
    Vibration.vibrate(15);
    let current = 3;
    const timer = setInterval(() => {
      current -= 1;
      setStep(current);
      Vibration.vibrate(current === 0 ? 60 : 15);
      if (current === 0) {
        clearInterval(timer);
        setTimeout(onFinish, 1400);
      }
    }, motion.countdownStep);
    return () => clearInterval(timer);
  }, [visible, onFinish]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent>
      <View style={styles.overlay}>
        {step > 0 ? (
          <>
            <Animated.Text
              key={step}
              entering={ZoomIn.duration(motion.countdownStep).easing(Easing.out(Easing.cubic))}
              style={styles.number}
            >
              {step}
            </Animated.Text>
            <Text variant="title" style={styles.caption}>
              Piensen a quién señalar…
            </Text>
          </>
        ) : (
          <>
            <Animated.Text entering={ZoomIn.duration(400)} style={[styles.number, styles.point]}>
              ¡Señalen!
            </Animated.Text>
            <Text variant="title" style={styles.caption}>
              {CARD_STYLES.qmp.footer}
            </Text>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(19,10,46,0.88)",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s3,
  },
  number: {
    fontFamily: fonts.display,
    fontSize: 160,
    lineHeight: 190,
    color: colors.qmp,
    textShadowColor: "rgba(255,200,61,0.6)",
    textShadowRadius: 30,
  },
  point: { fontSize: 64, lineHeight: 80, textAlign: "center" },
  caption: { fontSize: 20 },
});
