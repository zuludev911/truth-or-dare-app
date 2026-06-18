import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ToolsStackParamList } from "../navigation/ToolsStackNavigator";
import { COLORS } from "../constants";
import Die from "../components/Die";
import DiceCountSelector from "../components/DiceCountSelector";
import CloseButton from "../components/CloseButton";
import AdBanner from "../components/AdBanner";
import backgroundEmpty from "../assets/background-empty.webp";

type Props = NativeStackScreenProps<ToolsStackParamList, "Dice">;

const DICE_SIZE = 110;

export default function DiceScreen({ navigation }: Props) {
  const [diceCount, setDiceCount] = useState(2);
  const [diceValues, setDiceValues] = useState<number[]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  const generateRandomValue = () => Math.floor(Math.random() * 6) + 1;

  const handleRoll = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    const newValues = Array.from({ length: diceCount }, () =>
      generateRandomValue()
    );
    setDiceValues(newValues);
  }, [diceCount, isRolling]);

  const rolledCountRef = React.useRef(0);

  const handleDieRollComplete = useCallback(() => {
    rolledCountRef.current += 1;
    if (rolledCountRef.current >= diceCount) {
      setIsRolling(false);
      rolledCountRef.current = 0;
    }
  }, [diceCount]);

  const handleDiceCountChange = useCallback((newCount: number) => {
    setDiceCount(newCount);
    setDiceValues(Array(newCount).fill(1));
    setIsRolling(false);
    rolledCountRef.current = 0;
  }, []);

  const renderDice = () => {
    if (diceCount === 4) {
      // Explicit 2x2 grid for 4 dices
      return (
        <View style={styles.grid2x2}>
          <View style={styles.row}>
            <Die
              value={diceValues[0] || 1}
              size={DICE_SIZE}
              isRolling={isRolling}
              onRollComplete={handleDieRollComplete}
              soundDelayMs={0}
            />
            <Die
              value={diceValues[1] || 1}
              size={DICE_SIZE}
              isRolling={isRolling}
              onRollComplete={handleDieRollComplete}
              soundDelayMs={45}
            />
          </View>
          <View style={styles.row}>
            <Die
              value={diceValues[2] || 1}
              size={DICE_SIZE}
              isRolling={isRolling}
              onRollComplete={handleDieRollComplete}
              soundDelayMs={90}
            />
            <Die
              value={diceValues[3] || 1}
              size={DICE_SIZE}
              isRolling={isRolling}
              onRollComplete={handleDieRollComplete}
              soundDelayMs={135}
            />
          </View>
        </View>
      );
    }

    // 1, 2, or 3 dices stacked vertically
    return (
      <View style={styles.column}>
        {diceValues.map((value, index) => (
          <Die
            key={index}
            value={value}
            size={DICE_SIZE}
            isRolling={isRolling}
            onRollComplete={handleDieRollComplete}
            soundDelayMs={index * 45}
          />
        ))}
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundEmpty} style={styles.background}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Lanza los dados</Text>
            <Text style={styles.subtitle}>Toca la pantalla para lanzar</Text>
          </View>
          <CloseButton onPress={() => navigation.goBack()} size={28} />
        </View>

        <TouchableOpacity
          style={styles.diceArea}
          activeOpacity={0.9}
          onPress={handleRoll}
        >
          {renderDice()}
        </TouchableOpacity>

        <DiceCountSelector
          currentCount={diceCount}
          onSelect={handleDiceCountChange}
        />
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
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
  diceArea: {
    flex: 1,
    paddingVertical: 20,
  },
  column: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  grid2x2: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
