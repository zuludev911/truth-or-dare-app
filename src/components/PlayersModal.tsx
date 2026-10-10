import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IconPlus from "@tabler/icons-react-native/IconPlus";
import IconX from "@tabler/icons-react-native/IconX";

import { COLORS } from "../constants";
import { MAX_NAME_LENGTH, MAX_PLAYERS } from "../services/players";
import CloseButton from "./CloseButton";

interface Props {
  isVisible: boolean;
  players: string[];
  onChange: (players: string[]) => void;
  onClose: () => void;
}

/** Agregar y quitar los nombres de quienes juegan, para mostrar "Le toca a…". */
function PlayersModal({ isVisible, players, onChange, onClose }: Props) {
  const [name, setName] = useState("");

  const trimmedName = name.trim();
  const isDuplicate = players.some(
    (player) => player.toLowerCase() === trimmedName.toLowerCase()
  );
  const canAdd =
    trimmedName.length > 0 && !isDuplicate && players.length < MAX_PLAYERS;

  const addPlayer = () => {
    if (!canAdd) return;
    onChange([...players, trimmedName]);
    setName("");
  };

  const removePlayer = (index: number) =>
    onChange(players.filter((_, i) => i !== index));

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalContent}>
          <CloseButton onPress={onClose} style={styles.closeIcon} />
          <Text style={styles.title}>Jugadores</Text>
          <Text style={styles.subtitle}>
            Agrega los nombres para saber a quién le toca cada carta.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              onSubmitEditing={addPlayer}
              placeholder="Nombre"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              maxLength={MAX_NAME_LENGTH}
              returnKeyType="done"
              submitBehavior="submit"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[styles.addButton, !canAdd && styles.disabled]}
              onPress={addPlayer}
              disabled={!canAdd}
              hitSlop={8}
            >
              <IconPlus color={COLORS.WHITE} size={24} />
            </TouchableOpacity>
          </View>
          {isDuplicate && trimmedName.length > 0 && (
            <Text style={styles.hint}>Ese nombre ya está en la lista.</Text>
          )}

          <ScrollView style={styles.list}>
            {players.map((player, index) => (
              <View key={player} style={styles.playerRow}>
                <Text style={styles.playerName}>{player}</Text>
                <TouchableOpacity onPress={() => removePlayer(index)} hitSlop={8}>
                  <IconX color={COLORS.WHITE} size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>
              {players.length > 0 ? "¡A jugar!" : "Jugar sin nombres"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.PRIMARY,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 30,
    elevation: 10,
    width: "85%",
    maxHeight: "75%",
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  title: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.WHITE,
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  addButton: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  hint: {
    color: COLORS.WHITE,
    fontSize: 13,
    marginTop: 6,
  },
  list: {
    marginTop: 12,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.4)",
  },
  playerName: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: "bold",
  },
  doneButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  doneButtonText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PlayersModal;
