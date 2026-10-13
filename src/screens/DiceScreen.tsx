import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { useInterstitial } from "../hooks/useInterstitial";
import { trackToolOpened, trackToolUsed } from "../services/analytics";
import Die from "../components/Die";
import { colors, fonts, space, TOUCH_TARGET } from "../theme";
import { BannerSlot, Button, Header, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Dice">;

const COUNTS = [1, 2, 3, 4];
const DIE_SIZE = 96;

const randomValue = () => Math.floor(Math.random() * 6) + 1;

/** Dado: de 1 a 4 dados, se lanzan con el botón o tocando los dados. */
export default function DiceScreen({ navigation }: Props) {
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState<number[]>(() => [randomValue(), randomValue()]);
  const [isRolling, setIsRolling] = useState(false);
  // La suma se muestra cuando terminan de rodar todos los dados.
  const [showTotal, setShowTotal] = useState(false);
  const rolledCount = useRef(0);
  const registerInterstitialAction = useInterstitial("dice");

  useEffect(() => trackToolOpened("dice"), []);

  const roll = () => {
    if (isRolling) return;
    rolledCount.current = 0;
    setShowTotal(false);
    setIsRolling(true);
    setValues(Array.from({ length: diceCount }, randomValue));
    trackToolUsed("dice", { dice_count: diceCount });
    registerInterstitialAction();
  };

  // Cada dado avisa al terminar; con el último se muestra la suma.
  const onDieRollComplete = useCallback(() => {
    rolledCount.current += 1;
    if (rolledCount.current < diceCount) return;
    rolledCount.current = 0;
    setIsRolling(false);
    setShowTotal(true);
    Vibration.vibrate(15);
  }, [diceCount]);

  const changeCount = (count: number) => {
    if (isRolling || count === diceCount) return;
    setDiceCount(count);
    setValues(Array.from({ length: count }, randomValue));
    setShowTotal(false);
  };

  return (
    <Screen glows={["her", "vor"]} padBottom={false}>
      <Header title="Dado" onLeadingPress={navigation.goBack} />

      <View style={styles.counts} accessibilityRole="radiogroup">
        {COUNTS.map((count) => {
          const selected = count === diceCount;
          return (
            <Pressable
              key={count}
              onPress={() => changeCount(count)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${count} ${count === 1 ? "dado" : "dados"}`}
              style={({ pressed }) => [
                styles.count,
                selected && styles.countSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.countLabel, selected && { color: colors.onAccent }]}>{count}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.area} onPress={roll} accessibilityLabel="Lanzar los dados">
        <View style={styles.dice}>
          {values.map((value, index) => (
            <Die
              key={`${diceCount}-${index}`}
              value={value}
              size={DIE_SIZE}
              isRolling={isRolling}
              onRollComplete={onDieRollComplete}
              soundDelayMs={index * 45}
            />
          ))}
        </View>
      </Pressable>

      <Text variant="title" color={colors.muted} style={styles.total}>
        {diceCount > 1 && showTotal ? `Suma: ${values.reduce((sum, value) => sum + value, 0)}` : ""}
      </Text>
      <Button label="Lanzar" accent="her" size="tall" onPress={roll} disabled={isRolling} />
      <BannerSlot placement="dice" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  counts: {
    flexDirection: "row",
    justifyContent: "center",
    gap: space.s2,
    marginTop: space.s4,
  },
  count: {
    width: 56,
    height: 56,
    minWidth: TOUCH_TARGET,
    borderRadius: 28,
    backgroundColor: colors.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  countSelected: { backgroundColor: colors.her },
  countLabel: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24 },
  pressed: { opacity: 0.8 },
  area: { flex: 1, justifyContent: "center", alignItems: "center" },
  dice: {
    // Dos dados por fila como máximo.
    width: DIE_SIZE * 2 + space.s8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: space.s8,
    rowGap: space.s6,
  },
  total: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 26,
    minHeight: 26,
    marginBottom: space.s3,
  },
});
