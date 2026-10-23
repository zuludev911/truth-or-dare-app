import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import IconPlus from "@tabler/icons-react-native/IconPlus";
import IconX from "@tabler/icons-react-native/IconX";

import { MAX_NAME_LENGTH, MAX_PLAYERS } from "../services/players";
import { trackPlayersUpdated } from "../services/analytics";
import { colors, fonts, radius, space } from "../theme";
import { BottomSheet, Button, IconButton, Text } from "../ui";

interface Props {
  visible: boolean;
  players: string[];
  onChange: (players: string[]) => void;
  /** Botón principal: antes de jugar "¡A jugar!"; dentro del juego "Listo". */
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

/** Hoja para agregar los nombres de quienes juegan (son opcionales). */
export default function PlayersSheet({
  visible,
  players,
  onChange,
  confirmLabel = "¡A jugar!",
  onConfirm,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  const add = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (players.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Ese nombre ya está en la lista.");
    }
    if (players.length >= MAX_PLAYERS) return setError(`Máximo ${MAX_PLAYERS} jugadores.`);
    onChange([...players, trimmed]);
    setName("");
    // El foco se queda en el campo para escribir el siguiente nombre.
    inputRef.current?.focus();
  };

  const confirm = () => {
    trackPlayersUpdated(players.length);
    onConfirm();
  };

  // Antes de jugar, sin nombres el botón invita a jugar igual.
  const label = players.length || confirmLabel !== "¡A jugar!" ? confirmLabel : "Jugar sin nombres";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Jugadores"
      subtitle={`Los nombres son opcionales. Máximo ${MAX_PLAYERS} jugadores.`}
    >
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={[styles.input, error ? styles.inputError : null]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError("");
          }}
          onSubmitEditing={add}
          submitBehavior="submit"
          returnKeyType="next"
          placeholder="Nombre del jugador"
          placeholderTextColor={colors.muted}
          maxLength={MAX_NAME_LENGTH}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <Pressable onPress={add} style={styles.add} accessibilityLabel="Agregar" hitSlop={4}>
          <IconPlus color={colors.onAccent} size={26} strokeWidth={3} />
        </Pressable>
      </View>
      {!!error && (
        <Text variant="bodyMedium" color={colors.error} style={styles.error}>
          {error}
        </Text>
      )}

      {players.length > 0 && (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
          {players.map((player, index) => (
            <View key={player} style={styles.row}>
              <Text variant="label" style={styles.flex}>
                {player}
              </Text>
              <IconButton
                icon={<IconX color={colors.text} size={18} strokeWidth={2.5} />}
                onPress={() => onChange(players.filter((_, i) => i !== index))}
                accessibilityLabel={`Quitar a ${player}`}
                style={styles.remove}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <Button label={label} onPress={confirm} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inputRow: { flexDirection: "row", gap: space.s3 },
  input: {
    flex: 1,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.base,
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
    backgroundColor: colors.vor,
    alignItems: "center",
    justifyContent: "center",
  },
  error: { marginTop: -6 },
  list: { maxHeight: 230 },
  listContent: { gap: space.s2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.s2,
    backgroundColor: colors.base,
    borderRadius: radius.button,
    paddingVertical: space.s2,
    paddingRight: space.s2,
    paddingLeft: space.s4,
    minHeight: 56,
  },
  remove: { width: 40, height: 40 },
});
