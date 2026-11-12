import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAudioPlayer } from "expo-audio";

import { RootStackParamList } from "../navigation/Navigation";
import { useInterstitial } from "../hooks/useInterstitial";
import { trackToolOpened, trackToolUsed } from "../services/analytics";
import { colors, glow, motion, space } from "../theme";
import { BannerSlot, BottleIllustration, Header, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Bottle">;

const BOTTLE_HEIGHT = 260;
const RING_SIZE = 300;
/** Arranca rápido y frena largo, como en el prototipo. */
const SPIN_EASING = Easing.bezier(0.12, 0.7, 0.1, 1);

/** Botella: se gira tocándola y apunta a alguien al azar. */
export default function BottleScreen({ navigation }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const registerInterstitialAction = useInterstitial("bottle");
  const bottlePlayer = useAudioPlayer(require("../assets/sounds/bottle-spin.wav"), {
    keepAudioSessionActive: true,
  });
  const rotation = useSharedValue(0);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => trackToolOpened("bottle"), []);
  useEffect(() => () => clearTimeout(spinTimer.current), []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    trackToolUsed("bottle");
    registerInterstitialAction();
    Vibration.vibrate(15);

    bottlePlayer
      .seekTo(0)
      .then(() => bottlePlayer.play())
      .catch((error) => console.warn("Bottle sound failed to play:", error));

    // Entre 3 y 5 vueltas desde donde quedó.
    rotation.value = withTiming(rotation.value + 1080 + Math.random() * 720, {
      duration: motion.bottleSpin,
      easing: SPIN_EASING,
    });

    spinTimer.current = setTimeout(() => {
      setIsSpinning(false);
      Vibration.vibrate(30);
    }, motion.bottleSpin);
  };

  return (
    <Screen glows={["her", "yn"]} padBottom={false}>
      <Header title="Botella" onLeadingPress={navigation.goBack} />

      <Pressable
        style={styles.area}
        onPress={spin}
        disabled={isSpinning}
        accessibilityRole="button"
        accessibilityLabel="Girar la botella"
      >
        <View style={[styles.ring, glow(colors.nav, 0.25)]} />
        <Animated.View style={animatedStyle}>
          <BottleIllustration height={BOTTLE_HEIGHT} />
        </Animated.View>
      </Pressable>

      <Text variant="body" color={colors.muted} style={styles.hint}>
        {isSpinning ? "Girando…" : "Toca la botella para girarla"}
      </Text>
      <BannerSlot placement="bottle" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  hint: { textAlign: "center", paddingVertical: space.s2 },
});
