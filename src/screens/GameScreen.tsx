import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import Animated, { FlipInEasyY, FlipOutEasyY } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import IconBeerFilled from "@tabler/icons-react-native/IconBeerFilled";

import { HomeStackParamList } from "../navigation/HomeStackNavigator";
import { Reto } from "../types";
import { getRandomReto } from "../utils/getRandomReto";
import { useInterstitial } from "../hooks/useInterstitial";
import { trackCardShown, trackGameEnded } from "../services/analytics";
import { CATEGORIES, COLORS } from "../constants";
import AdBanner from "../components/AdBanner";
import backgroundGame from "../assets/background-game.webp";
import CloseButton from "../components/CloseButton";

type Props = NativeStackScreenProps<HomeStackParamList, "Game">;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function GameScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const registerInterstitialAction = useInterstitial("game");

  const [retoActual, setRetoActual] = useState<Reto>();
  const [retosVistos, setRetosVistos] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Al salir de la partida se registra cuántas cartas se jugaron.
  const retosVistosRef = useRef(0);
  retosVistosRef.current = retosVistos;
  useEffect(
    () => () => trackGameEnded(category, retosVistosRef.current),
    [category]
  );

  const shotsCount = Math.floor(Math.random() * 3) + 1;

  const handleNext = (type: "verdad" | "reto") => () => {
    setIsFlipped(true);
    const newCount = retosVistos + 1;
    setRetosVistos(newCount);
    trackCardShown(category, type, newCount);
    registerInterstitialAction();
    setRetoActual(
      getRandomReto(category, type) || {
        type: "reto",
        text: "No hay más retos.",
      }
    );
    setTimeout(
      () => {
        setIsFlipped(false);
      },
      retosVistos === 0 ? 0 : 600
    );
  };

  const isTruth = retoActual?.type === "verdad";

  const categoryImage = useMemo(
    () => CATEGORIES.find((c) => c.id === category)?.icon,
    [category]
  );

  const questionType: ("verdad" | "reto")[] = ["verdad", "reto"];

  const selectedQuestionTypeIndex = Math.floor(
    Math.random() * questionType.length
  );

  return (
    <ImageBackground source={backgroundGame} style={styles.container}>
      <CloseButton onPress={navigation.goBack} style={styles.buttonExit} />
      {/* <TouchableOpacity
        onPress={navigation.goBack}
        hitSlop={8}
        style={styles.buttonExit}
      >
        <Image
          source={closeIcon}
          style={styles.closeIcon}
          resizeMode="contain"
        />
      </TouchableOpacity> */}
      <Image source={categoryImage} style={styles.categoryImage} />
      {isFlipped || !retoActual ? (
        <AnimatedTouchableOpacity
          style={styles.card}
          entering={FlipInEasyY.duration(retosVistos === 0 ? 0 : 600)}
          exiting={FlipOutEasyY.duration(retosVistos === 0 ? 0 : 600)}
          onPress={handleNext(questionType[selectedQuestionTypeIndex])}
        >
          <Image
            source={require("../assets/card-back.webp")}
            style={styles.cardImage}
          />
        </AnimatedTouchableOpacity>
      ) : (
        <AnimatedTouchableOpacity
          entering={FlipInEasyY.duration(600)}
          exiting={FlipOutEasyY.duration(600)}
          key={retoActual.text}
          style={styles.card}
          onPress={handleNext(questionType[selectedQuestionTypeIndex])}
        >
          <View
            style={[
              styles.cardHeader,
              { backgroundColor: isTruth ? COLORS.PRIMARY : COLORS.SECONDARY },
            ]}
          >
            <Text style={styles.tipo}>{retoActual.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.texto}>{retoActual.text}</Text>
          {shotsCount > 0 && (
            <View style={styles.footer}>
              <Text>
                {isTruth ? "Si no respondes toma" : "Si no lo haces toma"}
              </Text>
              <View style={styles.iconContainer}>
                {Array.from({ length: shotsCount }).map((_, index) => (
                  <IconBeerFilled key={index} size={24} />
                ))}
              </View>
            </View>
          )}
        </AnimatedTouchableOpacity>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.PRIMARY }]}
          onPress={handleNext("verdad")}
        >
          <Text style={styles.buttonText}>Verdad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.SECONDARY }]}
          onPress={handleNext("reto")}
        >
          <Text style={styles.buttonText}>Reto</Text>
        </TouchableOpacity>
      </View>
      <AdBanner placement="game" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  tipo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  texto: { fontSize: 24, textAlign: "center" },
  button: {
    minWidth: 120,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    textAlign: "center",
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: 18,
  },
  card: {
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
  },
  cardImage: {
    maxWidth: 300,
    maxHeight: 300,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    gap: 6,
  },
  categoryImage: {
    width: 210,
    height: 90,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  buttonExit: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
