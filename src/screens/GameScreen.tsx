import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { Reto } from "../types";
import { getRandomReto } from "../utils/getRandomReto";
import { AD_IDS } from "../services/ads";
import { COLORS } from "../constants";
import AdBanner from "../components/AdBanner";
import Animated, { FlipInEasyY, FlipOutEasyY } from "react-native-reanimated";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      android: AD_IDS.ANDROID_INTERSTITIAL,
      ios: AD_IDS.IOS_INTERSTITIAL,
    });

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

export default function GameScreen({ route }: Props) {
  const { category } = route.params;
  console.warn("adUnitId", !!adUnitId);
  const [retoActual, setRetoActual] = useState<Reto>(() => {
    const reto = getRandomReto(category);
    return reto ?? { tipo: "reto", texto: "No se encontró un reto." };
  });
  const [retosVistos, setRetosVistos] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    const loadAd = () => {
      console.warn("Cargando interstitial");
      interstitial.load();
    };

    const onAdLoaded = () => {
      console.warn("Interstitial cargado");
      setIsAdLoaded(true);
    };

    const onAdClosed = () => {
      console.warn("Interstitial cerrado");
      setIsAdLoaded(false);
      interstitial.load();
    };

    const onAdError = (err: any) => {
      console.warn("Interstitial error:", err);
      setIsAdLoaded(false);
    };

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      onAdLoaded
    );
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      onAdClosed
    );
    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      onAdError
    );

    loadAd();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const handleNext = async () => {
    setIsFlipped(true);
    const newCount = retosVistos + 1;
    setRetosVistos(newCount);
    console.log("isAdLoaded:", isAdLoaded);
    console.log("interstitial.loaded:", interstitial?.loaded);
    if (newCount % 20 === 0 && isAdLoaded && adUnitId) {
      if (interstitial?.loaded) {
        console.warn("Mostrando interstitial");
        try {
          await interstitial.show();
          console.warn("Interstitial mostrado");
        } catch (err) {
          console.warn("Error al mostrar interstitial:", err);
        }
        setIsAdLoaded(false);
      } else {
        console.warn("Interstitial aún no está listo, se omite");
        interstitial.load();
      }
    }

    setRetoActual(
      getRandomReto(category) || { tipo: "reto", texto: "No hay más retos." }
    );
    setTimeout(() => {
      setIsFlipped(false);
    }, 700);
  };

  return (
    <View style={styles.container}>
      {isFlipped ? (
        <Animated.View
          style={styles.card}
          entering={FlipInEasyY.duration(600)}
          exiting={FlipOutEasyY.duration(600)}
          key={`${retoActual.texto}-back`}
        >
          <Image
            source={require("../assets/card-back.jpg")}
            style={styles.cardImage}
          />
        </Animated.View>
      ) : (
        <Animated.View
          entering={FlipInEasyY.duration(600)}
          exiting={FlipOutEasyY.duration(600)}
          key={retoActual.texto}
          style={styles.card}
        >
          <View
            style={[
              styles.cardHeader,
              {
                backgroundColor:
                  retoActual.tipo === "verdad"
                    ? COLORS.PRIMARY
                    : COLORS.SECONDARY,
              },
            ]}
          >
            <Text style={styles.tipo}>{retoActual.tipo.toUpperCase()}</Text>
          </View>
          <Text style={styles.texto}>{retoActual.texto}</Text>
        </Animated.View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  tipo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  texto: { fontSize: 24, textAlign: "center" },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    height: "60%",
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
});
