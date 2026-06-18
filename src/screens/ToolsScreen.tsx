import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IconDice, IconRotate2, IconClock } from "@tabler/icons-react-native";
import { ToolsStackParamList } from "../navigation/ToolsStackNavigator";
import { COLORS } from "../constants";
import AdBanner from "../components/AdBanner";
import backgroundEmpty from "../assets/background-empty.webp";

const TOOLS = [
  { id: "dados", name: "Dados" },
  { id: "botella", name: "Botella" },
  { id: "pronto", name: "Próximamente", disabled: true },
];

type Props = NativeStackScreenProps<ToolsStackParamList, "Tools">;

export default function ToolsScreen({ navigation }: Props) {
  const handleDicePress = () => navigation.navigate("Dice");
  const handleBottlePress = () => navigation.navigate("Bottle");
  return (
    <ImageBackground source={backgroundEmpty} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Diversión Extra</Text>
        <FlatList
          data={TOOLS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isDisabled = (item as any).disabled;
            const icon =
              item.id === "dados" ? (
                <IconDice
                  size={24}
                  color={isDisabled ? "#CCC" : COLORS.PRIMARY}
                />
              ) : item.id === "botella" ? (
                <IconRotate2
                  size={24}
                  color={isDisabled ? "#CCC" : COLORS.PRIMARY}
                />
              ) : (
                <IconClock
                  size={24}
                  color={isDisabled ? "#CCC" : COLORS.PRIMARY}
                />
              );

            return (
              <TouchableOpacity
                style={[styles.item, isDisabled && styles.itemDisabled]}
                onPress={
                  !isDisabled && (item.id === "dados" || item.id === "botella")
                    ? item.id === "dados"
                      ? handleDicePress
                      : handleBottlePress
                    : undefined
                }
                disabled={isDisabled}
              >
                <View style={styles.itemContent}>
                  {icon}
                  <Text
                    style={[
                      styles.itemText,
                      isDisabled && styles.itemTextDisabled,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  item: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  itemDisabled: {
    opacity: 0.9,
    borderLeftColor: "#CCC",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  itemTextDisabled: {
    color: "#999",
  },
});
