import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import IconCheck from "@tabler/icons-react-native/IconCheck";

import type { Exclusion } from "../games/secretSanta";
import { colors, radius, space } from "../theme";
import { BottomSheet, Button, Text } from "../ui";

interface Props {
  visible: boolean;
  participants: string[];
  exclusions: Exclusion[];
  onChange: (exclusions: Exclusion[]) => void;
  onClose: () => void;
}

const hasPair = (exclusions: Exclusion[], giver: string, receiver: string) =>
  exclusions.some(([g, r]) => g === giver && r === receiver);

/**
 * Hoja de restricciones: se elige una persona y se marca con quién no se puede
 * intercambiar. Cada marca vale para los dos lados (si Ana no le regala a Luis,
 * Luis tampoco le regala a Ana), que es lo que se espera con las parejas.
 */
export default function ExclusionsSheet({ visible, participants, exclusions, onChange, onClose }: Props) {
  const [selected, setSelected] = useState(participants[0] ?? "");

  useEffect(() => {
    if (visible && !participants.includes(selected)) setSelected(participants[0] ?? "");
  }, [visible, participants, selected]);

  const toggle = (other: string) => {
    if (hasPair(exclusions, selected, other)) {
      onChange(
        exclusions.filter(
          ([g, r]) => !((g === selected && r === other) || (g === other && r === selected))
        )
      );
    } else {
      onChange([...exclusions, [selected, other], [other, selected]]);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Restricciones"
      subtitle="Elige una persona y marca con quién no se pueden tocar (por ejemplo, las parejas)."
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {participants.map((name) => {
          const active = name === selected;
          return (
            <Pressable
              key={name}
              onPress={() => setSelected(name)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text variant="label" color={active ? colors.onAccent : colors.text}>
                {name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {participants
          .filter((name) => name !== selected)
          .map((name) => {
            const checked = hasPair(exclusions, selected, name);
            return (
              <Pressable
                key={name}
                onPress={() => toggle(name)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={`${selected} y ${name} no se regalan entre sí`}
                style={styles.row}
              >
                <Text variant="label" style={styles.flex}>
                  {name}
                </Text>
                <View style={[styles.box, checked && styles.boxChecked]}>
                  {checked && <IconCheck color={colors.onAccent} size={18} strokeWidth={3} />}
                </View>
              </Pressable>
            );
          })}
      </ScrollView>

      <Button label="Listo" accent="nav" onPress={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chips: { gap: space.s2 },
  chip: {
    height: 44,
    paddingHorizontal: space.s4,
    borderRadius: radius.pill,
    backgroundColor: colors.base,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.nav },
  list: { maxHeight: 260 },
  listContent: { gap: space.s2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.base,
    borderRadius: radius.button,
    paddingVertical: space.s2,
    paddingHorizontal: space.s4,
    minHeight: 56,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: { backgroundColor: colors.nav, borderColor: colors.nav },
});
