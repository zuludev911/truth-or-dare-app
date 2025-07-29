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

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const onPressPlay = () => navigation.navigate("Categories");

  return (
    <ImageBackground style={styles.container} source={background}>
      <TouchableOpacity style={styles.button} onPress={onPressPlay}>
        <Text style={styles.buttonText}>JUGAR</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: { color: COLORS.BLACK, fontSize: 20, fontWeight: "bold" },
});
