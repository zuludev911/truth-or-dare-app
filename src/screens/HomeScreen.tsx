import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/Navigation";
import { COLORS } from "../constants";
import background from "../assets/background.webp";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const onPressPlay = () => navigation.navigate("Categories");
  const onPressAddPlayers = () => navigation.navigate("AddPlayers");

  const { bottom } = useSafeAreaInsets();

  return (
    <ImageBackground
      style={[styles.container, { paddingBottom: bottom + 10 }]}
      source={background}
    >
      <TouchableOpacity style={styles.button} onPress={onPressPlay}>
        <Text style={styles.buttonText}>JUGAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonAddPlayers}
        onPress={onPressAddPlayers}
      >
        <Text style={styles.buttonText}>Agregar Jugadores</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  button: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    // position: "absolute",
    // bottom: 100,
    alignSelf: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: { color: COLORS.BLACK, fontSize: 20, fontWeight: "bold" },
  buttonAddPlayers: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    // position: "absolute",
    // bottom: 80,
    alignSelf: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
