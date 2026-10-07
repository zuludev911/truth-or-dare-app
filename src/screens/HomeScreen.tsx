import React, { useEffect, useState } from "react";
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
import {
  isPrivacyOptionsRequired,
  showPrivacyOptions,
} from "../services/consent";

type Props = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

export default function HomeScreen({ navigation }: Props) {
  const onPressPlay = () => navigation.navigate("MainTabs");
  const [showPrivacyLink, setShowPrivacyLink] = useState(false);

  useEffect(() => {
    isPrivacyOptionsRequired().then(setShowPrivacyLink);
  }, []);

  return (
    <ImageBackground style={styles.container} source={background}>
      <TouchableOpacity style={styles.button} onPress={onPressPlay}>
        <Text style={styles.buttonText}>JUGAR</Text>
      </TouchableOpacity>
      {showPrivacyLink && (
        <TouchableOpacity
          style={styles.privacyLink}
          onPress={showPrivacyOptions}
          hitSlop={8}
        >
          <Text style={styles.privacyText}>Privacidad y anuncios</Text>
        </TouchableOpacity>
      )}
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
  privacyLink: { position: "absolute", bottom: 50, alignSelf: "center" },
  privacyText: {
    color: COLORS.WHITE,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
