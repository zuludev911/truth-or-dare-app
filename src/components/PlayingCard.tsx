import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, StyleSheet, Vibration, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Card, CARD_STYLES, GameMode, MODES } from "../games/modes";
import { colors, glow, motion, radius, space } from "../theme";
import { Illustration, Spark, Text } from "../ui";
import { IOS_EDITION } from "../games/edition";

/** Las cartas con más caracteres que esto usan una letra un poco más chica. */
const LONG_TEXT = 120;

export interface PlayingCardHandle {
  /** Gira la carta y muestra `next` a mitad del giro. Devuelve false si ya estaba girando. */
  flipTo: (next: Card, onDone?: () => void) => boolean;
}

interface Props {
  mode: GameMode;
  onPress: () => void;
}

/** Carta del juego: reverso hasta la primera carta, luego la cara con un giro de 250 + 250 ms. */
const PlayingCard = forwardRef<PlayingCardHandle, Props>(({ mode, onPress }, ref) => {
  const [card, setCard] = useState<Card | null>(null);
  const rotation = useSharedValue(0);
  const busy = useRef(false);

  useImperativeHandle(ref, () => ({
    flipTo: (next, onDone) => {
      if (busy.current) return false;
      busy.current = true;
      Vibration.vibrate(15);
      const finish = () => {
        busy.current = false;
        onDone?.();
      };
      rotation.value = withTiming(90, { duration: motion.flip, easing: Easing.bezier(0.4, 0, 1, 1) }, () => {
        scheduleOnRN(setCard, next);
        rotation.value = -90;
        rotation.value = withTiming(0, { duration: motion.flip, easing: Easing.bezier(0, 0, 0.2, 1) }, () => {
          scheduleOnRN(finish);
        });
      });
      return true;
    },
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${rotation.value}deg` }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.wrap} accessibilityRole="button" accessibilityLabel={card?.text ?? "Sacar carta"}>
      <Animated.View style={[styles.flex, animatedStyle]}>
        {card ? <CardFront card={card} /> : <CardBack mode={mode} />}
      </Animated.View>
    </Pressable>
  );
});

export default PlayingCard;

function CardBack({ mode }: { mode: GameMode }) {
  return (
    <View style={[styles.face, styles.back, glow(colors.vor, 0.35)]}>
      <Illustration name="vor" size={190} />
      <Text variant="title" style={styles.backTitle}>
        VERDAD O RETO
      </Text>
      <Text variant="caption">{MODES[mode].backHint}</Text>
    </View>
  );
}

function CardFront({ card }: { card: Card }) {
  const style = CARD_STYLES[card.type];
  const color = colors[style.color];
  const isLong = card.text.length > LONG_TEXT;
  return (
    <View style={[styles.face, { backgroundColor: color }, glow(color, 0.4)]}>
      <Illustration name={style.watermark} size={230} rotate={-14} style={styles.watermark} />
      <View style={styles.spark}>
        <Spark size={22} />
      </View>
      <View style={styles.spark2}>
        <Spark size={14} />
      </View>
      <View>
        <View style={styles.tag}>
          <Text variant="title" style={styles.tagText}>
            {style.tag}
          </Text>
        </View>
        <Text variant={isLong ? "cardLong" : "card"} style={styles.text}>
          {card.text}
        </Text>
      </View>
      <View style={styles.footer}>
        {/* Los vasitos de castigo no van en la edición de iOS (ver games/edition). */}
        {!IOS_EDITION && (
          <View style={styles.drinks}>
            {Array.from({ length: card.drinks }).map((_, i) => (
              <Illustration key={i} name="yn" size={32} style={styles.drink} />
            ))}
          </View>
        )}
        <Text variant="bodyMedium" color={colors.onAccent} style={styles.footerText}>
          {style.footer}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, marginVertical: space.s2 },
  flex: { flex: 1 },
  face: {
    flex: 1,
    borderRadius: radius.card,
    paddingVertical: 28,
    paddingHorizontal: space.s6,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  back: {
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
    gap: space.s3,
  },
  backTitle: { fontSize: 16, letterSpacing: 1.6 },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: colors.base,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  tagText: { fontSize: 16, letterSpacing: 1.6 },
  text: { marginTop: space.s5 },
  footer: { flexDirection: "row", alignItems: "center", gap: space.s2 },
  drinks: { flexDirection: "row" },
  drink: { marginRight: -6 },
  footerText: { fontSize: 16, lineHeight: 20, flexShrink: 1 },
  watermark: { position: "absolute", right: -30, bottom: -30, opacity: 0.16 },
  spark: { position: "absolute", right: 28, top: 26 },
  spark2: { position: "absolute", right: 60, top: 62, opacity: 0.8 },
});
