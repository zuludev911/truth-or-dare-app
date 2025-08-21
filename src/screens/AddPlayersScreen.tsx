import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
} from "react-native";
import backgroundGame from "../assets/background-game.webp";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPlayersScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <ImageBackground
      source={backgroundGame}
      style={[styles.container, { paddingTop: top }]}
    >
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} />
        <MaterialIcons name="boy" size={50} color={COLORS.SECONDARY} />
        <MaterialIcons name="girl" size={50} color={COLORS.BLACK} />
      </View>
      <Text style={styles.title}>Jugadores</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    width: "60%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
});
