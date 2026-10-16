import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Share, StyleSheet, View } from "react-native";
import IconShare from "@tabler/icons-react-native/IconShare";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { CATEGORIES } from "../constants";
import { Card, CARD_STYLES, CardType, MODES } from "../games/modes";
import { drawCard } from "../utils/getRandomReto";
import { useInterstitial } from "../hooks/useInterstitial";
import { usePlayers } from "../hooks/usePlayers";
import {
  trackCardShared,
  trackCardShown,
  trackGameEnded,
  trackGameStarted,
} from "../services/analytics";
import PlayingCard, { PlayingCardHandle } from "../components/PlayingCard";
import PlayersSheet from "../components/PlayersSheet";
import Countdown from "../components/Countdown";
import { colors, space } from "../theme";
import { BannerSlot, Button, Header, Illustration, Pill, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const STORE_URL = Platform.select({
  android: "https://play.google.com/store/apps/details?id=com.anfezuar.truthordareapp",
  // Pendiente: enlace de la App Store cuando la app esté publicada en iOS.
  ios: undefined,
});

/** Juego de cartas para los 3 modos: Verdad o Reto, Yo nunca y ¿Quién es más probable que…? */
export default function GameScreen({ route, navigation }: Props) {
  const { mode, level } = route.params;
  const config = MODES[mode];
  const levelName =
    mode === "vor"
      ? CATEGORIES.find((c) => c.id === level)?.name ?? level
      : config.levels.find((l) => l.id === level)?.name ?? level;
  const levelIllustration = CATEGORIES.find((c) => c.id === level)?.illustration;

  const registerInterstitialAction = useInterstitial("game");
  const [players, setPlayers] = usePlayers();
  const [playersVisible, setPlayersVisible] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [turn, setTurn] = useState(0);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [counted, setCounted] = useState(false);
  const cardRef = useRef<PlayingCardHandle>(null);

  // Al salir de la partida se registra cuántas cartas se jugaron.
  const cardsShown = useRef(0);
  useEffect(() => {
    trackGameStarted(mode, level);
    return () => trackGameEnded(mode, level, cardsShown.current);
  }, [mode, level]);

  const draw = (requested?: "verdad" | "reto") => {
    const type: CardType =
      mode === "vor" ? requested ?? (Math.random() < 0.5 ? "verdad" : "reto") : mode;
    const next = drawCard(mode, level, type);
    const started = cardRef.current?.flipTo(next, () => {
      setCard(next);
      setCounted(false);
    });
    if (!started) return;
    if (card) setTurn((t) => t + 1);
    cardsShown.current += 1;
    trackCardShown(mode, level, type, cardsShown.current);
    registerInterstitialAction();
  };

  const share = async () => {
    if (!card) return;
    const label = CARD_STYLES[card.type].shareLabel;
    const text = label ? `${label}: ${card.text}` : card.text;
    try {
      const result = await Share.share({
        message: `${text}\n\n¿Te atreves? Juega Verdad o Reto 🔥${STORE_URL ? `\n${STORE_URL}` : ""}`,
      });
      if (result.action === Share.sharedAction) trackCardShared(mode, level, card.type);
    } catch (error) {
      console.warn("Share failed:", error);
    }
  };

  const onCountdownFinish = useCallback(() => {
    setCountdownVisible(false);
    setCounted(true);
  }, []);

  const currentPlayer = players.length > 0 ? players[turn % players.length] : undefined;
  const glowColor = mode === "vor" ? "reto" : config.accent;

  return (
    <Screen glows={[glowColor, "yn"]} padBottom={false}>
      <Header
        leading="close"
        onLeadingPress={navigation.goBack}
        trailing={
          <View style={styles.pills}>
            <Pill
              label={levelName}
              accent={config.accent}
              icon={mode === "vor" && levelIllustration ? <Illustration name={levelIllustration} size={22} /> : undefined}
            />
            <Pill
              label={`${players.length} ${players.length === 1 ? "jugador" : "jugadores"}`}
              onPress={() => setPlayersVisible(true)}
            />
          </View>
        }
      />

      <View style={styles.turn}>
        {currentPlayer && (
          <>
            <Text variant="body" color={colors.muted} style={styles.turnLabel}>
              {config.turnLabel}
            </Text>
            <Text variant="hero" color={colors[config.accent]} style={styles.turnName} numberOfLines={1}>
              {currentPlayer}
            </Text>
          </>
        )}
      </View>

      <PlayingCard ref={cardRef} mode={mode} onPress={() => draw()} />

      <View style={styles.actions}>
        <Button
          label="Compartir carta"
          variant="ghost"
          size="small"
          icon={<IconShare color={colors.text} size={18} />}
          onPress={share}
          style={!card && styles.hidden}
          disabled={!card}
        />
        {mode === "vor" && (
          <View style={styles.row}>
            <Button label="Verdad" accent="verdad" size="tall" style={styles.flex} onPress={() => draw("verdad")} />
            <Button label="Reto" accent="reto" size="tall" style={styles.flex} onPress={() => draw("reto")} />
          </View>
        )}
        {mode === "yn" && (
          <Button label={card ? "Siguiente" : "Sacar carta"} accent="yn" size="tall" onPress={() => draw()} />
        )}
        {mode === "qmp" &&
          (card && !counted ? (
            <Button label="¡Listos!" accent="qmp" size="tall" onPress={() => setCountdownVisible(true)} />
          ) : (
            <Button label={card ? "Siguiente pregunta" : "Sacar pregunta"} accent="qmp" size="tall" onPress={() => draw()} />
          ))}
      </View>
      <BannerSlot placement="game" />

      <PlayersSheet
        visible={playersVisible}
        players={players}
        onChange={setPlayers}
        confirmLabel="Listo"
        onConfirm={() => setPlayersVisible(false)}
        onClose={() => setPlayersVisible(false)}
      />
      <Countdown visible={countdownVisible} onFinish={onCountdownFinish} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pills: { flexDirection: "row", gap: space.s2, flexShrink: 1 },
  turn: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: space.s2,
    minHeight: 46,
    paddingTop: space.s2,
  },
  turnLabel: { fontSize: 20, lineHeight: 26 },
  turnName: { fontSize: 30, lineHeight: 38, flexShrink: 1 },
  actions: { gap: space.s3, marginTop: space.s1 },
  row: { flexDirection: "row", gap: space.s3 },
  flex: { flex: 1 },
  hidden: { opacity: 0 },
});
