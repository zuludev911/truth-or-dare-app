import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconAdjustments } from "@tabler/icons-react-native";
import { COLORS } from "../constants";

interface DiceCountSelectorProps {
  onSelect: (count: number) => void;
  currentCount: number;
}

export default function DiceCountSelector({
  onSelect,
  currentCount,
}: DiceCountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [1, 2, 3, 4];

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <IconAdjustments color={COLORS.WHITE} size={24} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        />
        <SafeAreaView style={styles.dropdown}>
          {options.map((count) => (
            <TouchableOpacity
              key={count}
              style={[
                styles.option,
                currentCount === count && styles.optionActive,
              ]}
              onPress={() => {
                onSelect(count);
                setIsOpen(false);
              }}
            >
              <View style={styles.optionContent}>
                {Array.from({ length: count }).map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dicePreview,
                      currentCount === count && styles.dicePreviewActive,
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 92,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdown: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  optionActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  optionContent: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dicePreview: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.BLACK,
    borderRadius: 6,
  },
  dicePreviewActive: {
    backgroundColor: COLORS.WHITE,
  },
});
