import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { IOS_EDITION } from "../games/edition";
import { trackHomeGameSelected } from "../services/analytics";
import {
  isPrivacyOptionsRequired,
  showPrivacyOptions,
} from "../services/consent";
import { colors, space } from "../theme";
import { GameCard, Illustration, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

/** Inicio del rediseño: el centro de juegos. Sin banner (es la primera impresión). */
export default function HomeScreen({ navigation }: Props) {
  const [showPrivacyLink, setShowPrivacyLink] = useState(false);

  useEffect(() => {
    isPrivacyOptionsRequired().then(setShowPrivacyLink);
  }, []);

  const comingSoon = (text1: string, text2: string) => () =>
    Toast.show({ type: "info", text1, text2 });

  return (
    <Screen glows={["vor", "yn"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.brand}>
            <Illustration name="vor" size={28} />
            <Text variant="badge" color={colors.muted} style={styles.brandText}>
              VERDAD O RETO
            </Text>
            {__DEV__ && (
              <Pressable onPress={() => navigation.navigate("DesignSystem")} hitSlop={8} style={styles.devButton}>
                <Text variant="badge">DS</Text>
              </Pressable>
            )}
          </View>
          <Text variant="hero">¿A qué jugamos?</Text>
          <Text variant="body" color={colors.muted}>
            {/* Apple no permite referencias al precio en las capturas (guía 2.3.7). */}
            {IOS_EDITION ? "Elige un juego y que empiece la diversión." : "Gratis, sin trampas y sin pagos."}
          </Text>
        </View>

        <GameCard
          title="Verdad o Reto"
          subtitle={IOS_EDITION ? "El clásico de siempre" : "El clásico, de suave a extremo"}
          accent="vor"
          illustration="vor"
          illustrationRotate={-8}
          onPress={() => {
            trackHomeGameSelected("vor");
            navigation.navigate("Categories");
          }}
        />
        <GameCard
          title="Yo nunca"
          subtitle="Confiesa lo que sí has hecho"
          accent="yn"
          illustration="yn"
          illustrationRotate={8}
          badge="Nuevo"
          onPress={() => {
            trackHomeGameSelected("yn");
            navigation.navigate("Levels", { mode: "yn" });
          }}
        />
        <GameCard
          title="¿Quién es más probable que…?"
          subtitle="Señala al culpable"
          accent="qmp"
          illustration="qmp"
          illustrationRotate={-6}
          badge="Nuevo"
          onPress={() => {
            trackHomeGameSelected("qmp");
            navigation.navigate("Levels", { mode: "qmp" });
          }}
        />
        <GameCard
          title="Herramientas"
          subtitle={IOS_EDITION ? "Dado y más" : "Dado, botella y más"}
          accent="her"
          illustration="her"
          illustrationRotate={6}
          onPress={() => {
            trackHomeGameSelected("tools");
            navigation.navigate("Tools");
          }}
        />
        <GameCard
          title="Juego navideño"
          subtitle="Llega en diciembre"
          accent="nav"
          illustration="nav"
          illustrationRotate={-6}
          badge="Próximamente"
          disabled
          onPress={() => {
            trackHomeGameSelected("christmas");
            comingSoon("¡Llega en diciembre! 🎄", "El juego navideño viene en camino")();
          }}
        />

        {showPrivacyLink && (
          <Pressable onPress={showPrivacyOptions} style={styles.privacy} accessibilityRole="link">
            <Text variant="caption">Privacidad y anuncios</Text>
          </Pressable>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: space.s3, paddingBottom: space.s4 },
  hero: { paddingTop: space.s2, paddingBottom: space.s1, gap: space.s1 },
  brand: { flexDirection: "row", alignItems: "center", gap: space.s2 },
  brandText: { letterSpacing: 1.7, fontSize: 12 },
  devButton: {
    marginLeft: "auto",
    backgroundColor: colors.raised,
    paddingHorizontal: space.s3,
    paddingVertical: space.s1,
    borderRadius: 8,
  },
  privacy: { alignItems: "center", padding: space.s3, minHeight: 44 },
});
