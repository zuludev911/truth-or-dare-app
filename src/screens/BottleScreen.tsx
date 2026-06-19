import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAudioPlayer } from "expo-audio";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { ToolsStackParamList } from "../navigation/ToolsStackNavigator";
import { COLORS } from "../constants";
import { AD_IDS } from "../services/ads";
import CloseButton from "../components/CloseButton";
import AdBanner from "../components/AdBanner";
import backgroundEmpty from "../assets/background-empty.webp";

type Props = NativeStackScreenProps<ToolsStackParamList, "Bottle">;

const SPIN_DURATION = 3500;
const BOTTLE_WIDTH = 80;
const BOTTLE_HEIGHT = 200;
const AD_EVERY_N_SPINS = 20;

export default function BottleScreen({ navigation }: Props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const spinCountRef = useRef(0);

  const adUnitId = useMemo(
    () =>
      __DEV__
        ? TestIds.INTERSTITIAL
        : Platform.select({
            android: AD_IDS.ANDROID_INTERSTITIAL,
            ios: AD_IDS.IOS_INTERSTITIAL,
          }),
    []
  );

  const interstitial = useMemo(
    () => InterstitialAd.createForAdRequest(adUnitId),
    [adUnitId]
  );

  useEffect(() => {
    const loadAd = () => interstitial.load();
    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setIsAdLoaded(true)
    );
    const unsubClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsAdLoaded(false);
        loadAd();
      }
    );
    const unsubError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => setIsAdLoaded(false)
    );
    loadAd();
    return () => {
      unsubLoaded();
      unsubClosed();
      unsubError();
    };
  }, [interstitial]);

  const bottlePlayer = useAudioPlayer(
    require("../assets/sounds/bottle-spin.wav"),
    {
      keepAudioSessionActive: true,
    },
  );
  const rotation = useSharedValue(0);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current) {
        clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleBottlePress = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    spinCountRef.current += 1;
    if (spinCountRef.current >= AD_EVERY_N_SPINS && isAdLoaded) {
      spinCountRef.current = 0;
      try {
        interstitial.show();
      } catch {}
    }

    bottlePlayer
      .seekTo(0)
      .then(() => bottlePlayer.play())
      .catch((error) => {
        console.warn("Bottle sound failed to play:", error);
      });

    const randomAngle = 720 + Math.random() * 720;
    const totalRotation = rotation.value + 1080 + randomAngle;

    rotation.value = withTiming(totalRotation, {
      duration: SPIN_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    spinTimerRef.current = setTimeout(() => {
      setIsSpinning(false);
      spinTimerRef.current = null;
    }, SPIN_DURATION);
  };

  return (
    <ImageBackground source={backgroundEmpty} style={styles.background}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Gira la botella</Text>
            <Text style={styles.subtitle}>
              {isSpinning ? "Girando..." : "Toca la botella para girar"}
            </Text>
          </View>
          <CloseButton onPress={() => navigation.goBack()} size={28} />
        </View>

        <TouchableOpacity
          style={styles.bottleArea}
          activeOpacity={0.85}
          onPress={handleBottlePress}
          disabled={isSpinning}
        >
          <View style={styles.spinStage}>
            <View style={styles.plateShadow} />
            <View style={styles.plate}>
              <View style={styles.plateRim} />
              <View style={styles.plateCenter} />
              <View style={styles.plateHighlight} />
            </View>

            <Animated.View style={[styles.bottlePosition, animatedStyle]}>
              <Svg
                width={BOTTLE_WIDTH}
                height={BOTTLE_HEIGHT}
                viewBox="0 0 80 200"
              >
                <Defs>
                  <LinearGradient
                    id="glassGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <Stop
                      offset="0%"
                      stopColor="rgba(107, 163, 115, 0.4)"
                    />
                    <Stop
                      offset="30%"
                      stopColor="rgba(134, 185, 140, 0.6)"
                    />
                    <Stop
                      offset="70%"
                      stopColor="rgba(107, 163, 115, 0.5)"
                    />
                    <Stop
                      offset="100%"
                      stopColor="rgba(80, 130, 88, 0.4)"
                    />
                  </LinearGradient>
                  <LinearGradient
                    id="neckGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <Stop
                      offset="0%"
                      stopColor="rgba(107, 163, 115, 0.3)"
                    />
                    <Stop
                      offset="50%"
                      stopColor="rgba(134, 185, 140, 0.5)"
                    />
                    <Stop
                      offset="100%"
                      stopColor="rgba(80, 130, 88, 0.3)"
                    />
                  </LinearGradient>
                </Defs>

                <Path
                  d="M 28 5
                     L 28 60
                     Q 10 75 10 95
                     L 10 170
                     Q 10 195 35 195
                     L 45 195
                     Q 70 195 70 170
                     L 70 95
                     Q 70 75 52 60
                     L 52 5
                     Q 52 0 40 0
                     Q 28 0 28 5
                     Z"
                  fill="url(#glassGrad)"
                  stroke="rgba(107, 163, 115, 0.8)"
                  strokeWidth="2"
                />

                <Path
                  d="M 28 5 L 28 0 Q 28 -5 40 -5 Q 52 -5 52 0 L 52 5"
                  fill="none"
                  stroke="rgba(107, 163, 115, 0.7)"
                  strokeWidth="2"
                />

                <Path
                  d="M 18 100 Q 18 165 40 185"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <Path
                  d="M 60 120 Q 60 155 45 175"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          </View>
        </TouchableOpacity>

        <AdBanner />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  bottleArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinStage: {
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  plateShadow: {
    position: "absolute",
    width: 236,
    height: 236,
    borderRadius: 118,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    transform: [{ translateY: 12 }, { scaleY: 0.86 }],
  },
  plate: {
    position: "absolute",
    width: 244,
    height: 244,
    borderRadius: 122,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  plateRim: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: "rgba(230, 49, 64, 0.14)",
  },
  plateCenter: {
    width: 114,
    height: 114,
    borderRadius: 57,
    backgroundColor: "rgba(230, 49, 64, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(230, 49, 64, 0.16)",
  },
  plateHighlight: {
    position: "absolute",
    top: 28,
    left: 54,
    width: 92,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    transform: [{ rotate: "-18deg" }],
  },
  bottlePosition: {
    width: BOTTLE_WIDTH,
    height: BOTTLE_HEIGHT,
  },
});
