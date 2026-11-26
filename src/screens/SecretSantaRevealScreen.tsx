import { useEffect, useState } from "react";
import { AccessibilityInfo, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { STORE_URL } from "../constants";
import { RootStackParamList } from "../navigation/Navigation";
import { trackSecretSantaCompleted, trackSecretSantaReminderShared } from "../services/analytics";
import {
  formatAmount,
  loadSecretSanta,
  reminderText,
  saveSecretSanta,
  SecretSantaState,
} from "../services/secretSanta";
import { colors, glow, radius, space } from "../theme";
import { Button, Header, Illustration, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "SecretSantaReveal">;

/**
 * pass: se pide el teléfono a la persona que sigue.
 * view: esa persona ve a quién le regala.
 * done: todos vieron; se puede compartir el recordatorio.
 * remindPick / remind: alguien olvidó a quién le tocaba y lo vuelve a ver.
 */
type Phase = "pass" | "view" | "done" | "remindPick" | "remind";

/** Tarjeta tapada: el nombre solo se ve mientras se mantiene presionada. */
function SecretCard({ receiver, onViewed }: { receiver: string; onViewed: () => void }) {
  const [shown, setShown] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader);
  }, []);

  const show = (value: boolean) => {
    setShown(value);
    if (value) onViewed();
  };

  return (
    <Pressable
      // Con lector de pantalla no se puede mantener presionado: se toca para ver y ocultar.
      onPress={screenReader ? () => show(!shown) : undefined}
      onPressIn={screenReader ? undefined : () => show(true)}
      onPressOut={screenReader ? undefined : () => setShown(false)}
      accessibilityRole="button"
      accessibilityLabel={shown ? `Le regalas a ${receiver}` : "Tarjeta tapada. Toca para ver a quién le regalas"}
      style={[styles.secret, shown ? styles.secretOpen : styles.secretClosed]}
    >
      {shown ? (
        <>
          <Text variant="label" color={colors.onAccent}>
            Le regalas a
          </Text>
          <Text variant="hero" color={colors.onAccent} style={styles.receiver} adjustsFontSizeToFit numberOfLines={2}>
            {receiver}
          </Text>
        </>
      ) : (
        <>
          <Illustration name="nav" size={96} />
          <Text variant="label" color={colors.text} style={styles.center}>
            {screenReader ? "Toca para ver" : "Mantén presionado para ver"}
          </Text>
        </>
      )}
    </Pressable>
  );
}

/** Reparto del amigo secreto: cada persona ve en secreto a quién le regala. */
export default function SecretSantaRevealScreen({ navigation }: Props) {
  const [state, setState] = useState<SecretSantaState | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("pass");
  const [viewed, setViewed] = useState(false);
  const [remindFor, setRemindFor] = useState("");

  useEffect(() => {
    loadSecretSanta().then((stored) => {
      if (!stored.draw) return navigation.goBack();
      const pending = stored.participants.filter((p) => !stored.seen.includes(p));
      setState(stored);
      setQueue(pending);
      setPhase(pending.length ? "pass" : "done");
    });
  }, [navigation]);

  if (!state?.draw) return <Screen glows={["nav", "vor"]}>{null}</Screen>;

  const receiverOf = (giver: string) => state.draw?.find((a) => a.giver === giver)?.receiver ?? "";
  const current = queue[0];

  const finishTurn = () => {
    const next = { ...state, seen: [...state.seen, current] };
    setState(next);
    saveSecretSanta(next);
    const rest = queue.slice(1);
    setQueue(rest);
    setViewed(false);
    if (rest.length) return setPhase("pass");
    trackSecretSantaCompleted(state.participants.length);
    setPhase("done");
  };

  const skipTurn = () => setQueue([...queue.slice(1), current]);

  const shareReminder = async () => {
    try {
      const result = await Share.share({ message: `${reminderText(state)}\n${STORE_URL}` });
      if (result.action === Share.sharedAction) trackSecretSantaReminderShared();
    } catch (error) {
      console.warn("Share failed:", error);
    }
  };

  const amount = formatAmount(state.amount);
  const details = [amount && `Tope: ${amount}`, state.date.trim(), state.place.trim()].filter(Boolean);

  return (
    <Screen glows={["nav", "vor"]}>
      <Header title="Amigo secreto" leading="close" onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {phase === "pass" && (
          <>
            <Text variant="caption" style={styles.center}>
              {state.seen.length} de {state.participants.length} ya vieron
            </Text>
            <Text variant="caption" style={styles.center}>
              Pásale el teléfono a
            </Text>
            <Text variant="hero" style={styles.center}>
              {current}
            </Text>
            <Button
              label={`Soy ${current}`}
              accent="nav"
              size="tall"
              onPress={() => {
                setViewed(false);
                setPhase("view");
              }}
            />
            {queue.length > 1 && <Button label="Todavía no está" variant="ghost" onPress={skipTurn} />}
          </>
        )}

        {(phase === "view" || phase === "remind") && (
          <>
            <Text variant="title" style={styles.center}>
              {phase === "view" ? current : remindFor}
            </Text>
            <SecretCard
              key={phase === "view" ? current : remindFor}
              receiver={receiverOf(phase === "view" ? current : remindFor)}
              onViewed={() => setViewed(true)}
            />
            {details.length > 0 && (
              <Text variant="body" color={colors.muted} style={styles.center}>
                {details.join(" · ")}
              </Text>
            )}
            {phase === "view" ? (
              <Button
                label="Listo, pasar el teléfono"
                accent="nav"
                disabled={!viewed}
                onPress={finishTurn}
              />
            ) : (
              <Button label="Volver" accent="nav" onPress={() => setPhase("remindPick")} />
            )}
          </>
        )}

        {phase === "done" && (
          <>
            <Illustration name="nav" size={112} />
            <Text variant="hero" style={styles.center}>
              ¡Listo!
            </Text>
            <Text variant="body" color={colors.muted} style={styles.center}>
              Ya todos saben a quién le regalan.
            </Text>
            {details.length > 0 && (
              <Text variant="label" style={styles.center}>
                {details.join(" · ")}
              </Text>
            )}
            <Button label="Compartir recordatorio" accent="nav" onPress={shareReminder} />
            <Button label="Recordar el mío" variant="ghost" onPress={() => setPhase("remindPick")} />
            <Button label="Salir" variant="ghost" onPress={navigation.popToTop} />
          </>
        )}

        {phase === "remindPick" && (
          <>
            <Text variant="title" style={styles.center}>
              ¿Quién eres?
            </Text>
            <Text variant="caption" style={styles.center}>
              Que nadie más mire la pantalla.
            </Text>
            <View style={styles.names}>
              {state.participants.map((participant) => (
                <Pressable
                  key={participant}
                  onPress={() => {
                    setRemindFor(participant);
                    setPhase("remind");
                  }}
                  accessibilityRole="button"
                  style={styles.nameRow}
                >
                  <Text variant="label">{participant}</Text>
                </Pressable>
              ))}
            </View>
            <Button label="Volver" variant="ghost" onPress={() => setPhase("done")} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: "center", gap: space.s4, paddingVertical: space.s4 },
  center: { textAlign: "center", alignSelf: "center" },
  secret: {
    minHeight: 260,
    borderRadius: radius.card,
    alignItems: "center",
    justifyContent: "center",
    gap: space.s4,
    padding: space.s5,
  },
  secretClosed: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  secretOpen: { backgroundColor: colors.nav, ...glow(colors.nav) },
  receiver: { textAlign: "center" },
  names: { gap: space.s2 },
  nameRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    minHeight: 56,
    paddingHorizontal: space.s4,
    justifyContent: "center",
  },
});
