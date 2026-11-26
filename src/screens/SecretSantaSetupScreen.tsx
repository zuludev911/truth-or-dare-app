import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import IconPlus from "@tabler/icons-react-native/IconPlus";
import IconX from "@tabler/icons-react-native/IconX";

import ExclusionsSheet from "../components/ExclusionsSheet";
import { drawSecretSanta, MAX_PARTICIPANTS, MIN_PARTICIPANTS } from "../games/secretSanta";
import { RootStackParamList } from "../navigation/Navigation";
import {
  trackSecretSantaDrawFailed,
  trackSecretSantaDrawn,
  trackSecretSantaReset,
  trackSecretSantaStarted,
} from "../services/analytics";
import { MAX_NAME_LENGTH } from "../services/players";
import {
  EMPTY_STATE,
  formatAmount,
  loadSecretSanta,
  MAX_AMOUNT_LENGTH,
  MAX_NOTE_LENGTH,
  saveSecretSanta,
  SecretSantaState,
} from "../services/secretSanta";
import { colors, fonts, radius, space } from "../theme";
import { BannerSlot, Button, Header, IconButton, Screen, Text } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "SecretSantaSetup">;

const AMOUNT_SHORTCUTS = ["20000", "50000", "100000"];

/** Amigo secreto: arma el grupo, las reglas y haz el sorteo. */
export default function SecretSantaSetupScreen({ navigation }: Props) {
  const [state, setState] = useState<SecretSantaState>(EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [exclusionsOpen, setExclusionsOpen] = useState(false);
  const nameInput = useRef<TextInput>(null);

  // Se recarga al volver del sorteo (puede haber avanzado) y al abrir la pantalla.
  useFocusEffect(
    useCallback(() => {
      loadSecretSanta().then((stored) => {
        setState(stored);
        setLoaded(true);
      });
    }, [])
  );

  // El borrador se guarda al editar; la espera evita escribir en cada letra.
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => saveSecretSanta(state), 300);
    return () => clearTimeout(timer);
  }, [state, loaded]);

  const update = (patch: Partial<SecretSantaState>) => {
    setError("");
    setState((current) => ({ ...current, ...patch }));
  };

  const addParticipant = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (state.participants.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Ese nombre ya está en la lista.");
    }
    if (state.participants.length >= MAX_PARTICIPANTS) {
      return setError(`Máximo ${MAX_PARTICIPANTS} participantes.`);
    }
    update({ participants: [...state.participants, trimmed] });
    setName("");
    nameInput.current?.focus();
  };

  const removeParticipant = (removed: string) =>
    update({
      participants: state.participants.filter((p) => p !== removed),
      exclusions: state.exclusions.filter(([g, r]) => g !== removed && r !== removed),
    });

  const startOver = () =>
    Alert.alert(
      "¿Hacer un sorteo nuevo?",
      "Se borra el sorteo actual y nadie podrá volver a ver a quién le tocaba.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sortear de nuevo",
          style: "destructive",
          onPress: () => {
            trackSecretSantaReset();
            update({ draw: null, seen: [] });
          },
        },
      ]
    );

  const draw = () => {
    if (state.participants.length < MIN_PARTICIPANTS) {
      return setError(`Agrega al menos ${MIN_PARTICIPANTS} participantes.`);
    }
    const result = drawSecretSanta(state.participants, state.exclusions);
    if (!result) {
      trackSecretSantaDrawFailed(state.participants.length, state.exclusions.length / 2);
      return setError("Con esas restricciones no hay forma de sortear. Quita alguna.");
    }
    trackSecretSantaStarted(state.participants.length, !!state.amount, state.exclusions.length > 0);
    trackSecretSantaDrawn(state.participants.length);
    const next = { ...state, draw: result, seen: [] };
    setState(next);
    // Se guarda al instante: si se cierra la app justo ahora no se pierde el sorteo.
    saveSecretSanta(next).then(() => navigation.navigate("SecretSantaReveal"));
  };

  const hasDraw = !!state.draw;
  const exclusionPairs = state.exclusions.length / 2;

  return (
    <Screen glows={["nav", "vor"]} padBottom={false}>
      <Header title="Amigo secreto" onLeadingPress={navigation.goBack} />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {hasDraw ? (
            <View style={styles.card}>
              <Text variant="title">Tienes un sorteo en curso</Text>
              <Text variant="body" color={colors.muted}>
                {state.seen.length} de {state.participants.length} ya vieron a quién le regalan.
              </Text>
              <Button label="Continuar" accent="nav" onPress={() => navigation.navigate("SecretSantaReveal")} />
              <Button label="Hacer un sorteo nuevo" variant="ghost" onPress={startOver} />
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text variant="title">
                  Participantes{state.participants.length ? ` (${state.participants.length})` : ""}
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    ref={nameInput}
                    style={[styles.input, styles.flex, error && styles.inputError]}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setError("");
                    }}
                    onSubmitEditing={addParticipant}
                    submitBehavior="submit"
                    returnKeyType="next"
                    placeholder="Nombre"
                    placeholderTextColor={colors.muted}
                    maxLength={MAX_NAME_LENGTH}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  <Pressable onPress={addParticipant} style={styles.add} accessibilityLabel="Agregar participante" hitSlop={4}>
                    <IconPlus color={colors.onAccent} size={26} strokeWidth={3} />
                  </Pressable>
                </View>
                {state.participants.map((participant) => (
                  <View key={participant} style={styles.row}>
                    <Text variant="label" style={styles.flex}>
                      {participant}
                    </Text>
                    <IconButton
                      icon={<IconX color={colors.text} size={18} strokeWidth={2.5} />}
                      onPress={() => removeParticipant(participant)}
                      accessibilityLabel={`Quitar a ${participant}`}
                      style={styles.remove}
                    />
                  </View>
                ))}
                {state.participants.length < MIN_PARTICIPANTS && (
                  <Text variant="caption">Mínimo {MIN_PARTICIPANTS} participantes.</Text>
                )}
              </View>

              <View style={styles.section}>
                <Text variant="title">Tope del regalo (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={formatAmount(state.amount)}
                  onChangeText={(text) => update({ amount: text.replace(/\D/g, "").slice(0, MAX_AMOUNT_LENGTH) })}
                  keyboardType="number-pad"
                  placeholder="$50.000"
                  placeholderTextColor={colors.muted}
                />
                <View style={styles.shortcuts}>
                  {AMOUNT_SHORTCUTS.map((amount) => {
                    const active = state.amount === amount;
                    return (
                      <Pressable
                        key={amount}
                        onPress={() => update({ amount: active ? "" : amount })}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[styles.shortcut, active && styles.shortcutActive]}
                      >
                        <Text variant="label" color={active ? colors.onAccent : colors.text}>
                          {formatAmount(amount)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text variant="title">Fecha y lugar (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={state.date}
                  onChangeText={(date) => update({ date })}
                  placeholder="24 de diciembre"
                  placeholderTextColor={colors.muted}
                  maxLength={MAX_NOTE_LENGTH}
                />
                <TextInput
                  style={styles.input}
                  value={state.place}
                  onChangeText={(place) => update({ place })}
                  placeholder="Donde la abuela"
                  placeholderTextColor={colors.muted}
                  maxLength={MAX_NOTE_LENGTH}
                />
              </View>

              {state.participants.length >= MIN_PARTICIPANTS && (
                <Button
                  label={exclusionPairs ? `Restricciones (${exclusionPairs})` : "Restricciones"}
                  variant="ghost"
                  onPress={() => setExclusionsOpen(true)}
                />
              )}

              {!!error && (
                <Text variant="bodyMedium" color={colors.error}>
                  {error}
                </Text>
              )}
              <Button label="Sortear" accent="nav" size="tall" onPress={draw} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <BannerSlot placement="secret_santa" />

      <ExclusionsSheet
        visible={exclusionsOpen}
        participants={state.participants}
        exclusions={state.exclusions}
        onChange={(exclusions) => update({ exclusions })}
        onClose={() => setExclusionsOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: space.s5, paddingTop: space.s3, paddingBottom: space.s4 },
  section: { gap: space.s3 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space.s5,
    gap: space.s3,
  },
  inputRow: { flexDirection: "row", gap: space.s3 },
  input: {
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: space.s4,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.error },
  add: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.nav,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.s2,
    backgroundColor: colors.surface,
    borderRadius: radius.button,
    paddingVertical: space.s2,
    paddingRight: space.s2,
    paddingLeft: space.s4,
    minHeight: 56,
  },
  remove: { width: 40, height: 40 },
  shortcuts: { flexDirection: "row", gap: space.s2 },
  shortcut: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutActive: { backgroundColor: colors.nav },
});
