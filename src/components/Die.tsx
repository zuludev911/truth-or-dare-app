import React, { useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAudioPlayer } from "expo-audio";
import { COLORS } from "../constants";

interface DieProps {
  value: number;
  size?: number;
  isRolling?: boolean;
  onRollComplete?: () => void;
  soundDelayMs?: number;
}

const ANIMATION_DURATION = 800;
const TICK_INTERVAL = 80;
// Para el cycling antes de que termine la animación
const STOP_CYCLING_AT = ANIMATION_DURATION - 100; // 700ms: para 100ms antes de que la animación termine
const COMPLETE_AT = ANIMATION_DURATION + 50;       // 850ms: notifica completion después de que la animación termina

export default function Die({
  value,
  size = 110,
  isRolling = false,
  onRollComplete,
  soundDelayMs = 0,
}: DieProps) {
  const dicePlayer = useAudioPlayer(require("../assets/sounds/dice-roll.wav"), {
    keepAudioSessionActive: true,
  });
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const shadowOffsetY = useSharedValue(6);
  const shadowScale = useSharedValue(1);
  const [displayValue, setDisplayValue] = React.useState(value);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const valueRef = useRef(value);
  const onRollCompleteRef = useRef(onRollComplete);

  valueRef.current = value;
  onRollCompleteRef.current = onRollComplete;

  const clearAll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
  }, []);

  useEffect(() => {
    if (!isRolling) return;

    clearAll();

    timeoutIdsRef.current.push(
      setTimeout(() => {
        dicePlayer
          .seekTo(0)
          .then(() => dicePlayer.play())
          .catch((error) => {
            console.warn("Dice sound failed to play:", error);
          });
      }, soundDelayMs)
    );

    // Ciclar valores aleatoriamente mientras dura la animación
    intervalRef.current = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, TICK_INTERVAL);

    // Parar el cycling y mostrar el valor final 100ms ANTES de que termine la animación
    // → el dado muestra el resultado final mientras todavía está desacelerando ("aterrizando")
    timeoutIdsRef.current.push(
      setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayValue(valueRef.current);
      }, STOP_CYCLING_AT)
    );

    // Notificar que terminó 50ms después de que la animación termina
    timeoutIdsRef.current.push(
      setTimeout(() => {
        onRollCompleteRef.current?.();
      }, COMPLETE_AT)
    );

    // Deriva horizontal y salto vertical aleatorios para que cada dado "vuele" distinto
    const driftX = (Math.random() - 0.5) * 70;
    const jumpHeight = 55 + Math.random() * 25;
    const spinDir = Math.random() > 0.5 ? 1 : -1;

    // Animaciones Reanimated (solo visuales, ya no controlan el timing del valor)
    rotateX.value = withSequence(
      withTiming(spinDir * (630 + Math.random() * 180), {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(0, { duration: 0 })
    );

    rotateY.value = withSequence(
      withTiming(-spinDir * (450 + Math.random() * 180), {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(0, { duration: 0 })
    );

    rotateZ.value = withSequence(
      withTiming(spinDir * (270 + Math.random() * 180), {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(0, { duration: 0 })
    );

    // Trayectoria de "vuelo": sube, cae, rebota levemente y se asienta
    translateY.value = withSequence(
      withTiming(-jumpHeight, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(8, { duration: 300, easing: Easing.in(Easing.quad) }),
      withTiming(-6, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 100, easing: Easing.out(Easing.quad) })
    );

    translateX.value = withSequence(
      withTiming(driftX, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(driftX * 0.3, { duration: 250, easing: Easing.inOut(Easing.quad) }),
      withTiming(0, { duration: 150, easing: Easing.out(Easing.quad) })
    );

    scale.value = withSequence(
      withTiming(1.12, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(0.92, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withTiming(1.05, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) })
    );

    // La sombra se achica/aleja mientras el dado "vuela" y vuelve al aterrizar
    shadowOffsetY.value = withSequence(
      withTiming(2, { duration: 200 }),
      withTiming(6, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    shadowScale.value = withSequence(
      withTiming(0.7, { duration: 250, easing: Easing.out(Easing.quad) }),
      withTiming(1.1, { duration: 300, easing: Easing.in(Easing.quad) }),
      withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) })
    );
  }, [
    isRolling,
    clearAll,
    dicePlayer,
    soundDelayMs,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    translateX,
    translateY,
    shadowOffsetY,
    shadowScale,
  ]);

  // Cleanup al desmontar
  useEffect(() => () => clearAll(), [clearAll]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { rotateZ: `${rotateZ.value}deg` },
      { scale: scale.value },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: shadowOffsetY.value },
      { scaleX: shadowScale.value },
    ],
  }));

  const getDotPositions = () => {
    const patterns: { [key: number]: Array<[number, number]> } = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
    };
    return patterns[displayValue] || [];
  };

  const dotSize = size * 0.14;
  const dotPositions = getDotPositions();
  const borderRadius = size * 0.22;

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          { width: size, height: size, justifyContent: "center", alignItems: "center" },
          animatedStyle,
        ]}
      >
        <View style={[styles.dieShadowWrap, { width: size, height: size, borderRadius }]}>
          <View style={[styles.dieClip, { width: size, height: size, borderRadius }]}>
            <LinearGradient
              colors={["#FFFFFF", "#F1EEF4", "#DAD5E0"]}
              start={{ x: 0.15, y: 0.05 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Brillo superior para dar sensación de superficie pulida */}
            <LinearGradient
              colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0)"]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.6, y: 0.7 }}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Bisel inferior/derecho oscuro para simular canto del cubo */}
            <View
              style={[
                styles.bevel,
                {
                  borderRightWidth: size * 0.02,
                  borderBottomWidth: size * 0.02,
                },
              ]}
            />
            {dotPositions.map((pos, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    left: (size * pos[0]) / 100 - dotSize / 2,
                    top: (size * pos[1]) / 100 - dotSize / 2,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.shadow, { width: size * 0.8, height: size * 0.2 }, shadowStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dieShadowWrap: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dieClip: {
    position: "relative",
    overflow: "hidden",
  },
  bevel: {
    ...StyleSheet.absoluteFillObject,
    borderRightColor: "rgba(0,0,0,0.12)",
    borderBottomColor: "rgba(0,0,0,0.16)",
  },
  dot: {
    backgroundColor: COLORS.PRIMARY,
    position: "absolute",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  shadow: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 50,
    marginTop: -8,
  },
});
