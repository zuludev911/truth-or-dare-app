import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "../constants";

export default function NewCategoryBadge() {
  return (
    <Animated.View
      style={styles.newCategoryContainer}
      entering={FadeIn.delay(500).duration(500)}
    >
      <Text style={styles.newCategoryText}>Nueva</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  newCategoryContainer: {
    position: "absolute",
    top: 10,
    right: 6,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transform: [{ rotate: "20deg" }],
  },
  newCategoryText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: "bold",
  },
});
