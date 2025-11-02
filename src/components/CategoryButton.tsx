import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";

import { Category } from "../types";
import { COLORS } from "../constants";

interface CategoryButtonProps {
  index: number;
  item: Category;
  onPressItem: (id: string) => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

function CategoryButton({ index, item, onPressItem }: CategoryButtonProps) {
  const entering = FadeInLeft.delay(index * 200).duration(300);
  const onPress = () => onPressItem(item.id);
  return (
    <AnimatedTouchableOpacity
      style={styles.card}
      onPress={onPress}
      entering={entering}
      key={item.id}
    >
      <Image source={item.icon} style={styles.icon} />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SECONDARY,
    marginVertical: 10,
    padding: 0,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 220,
    height: 90,
  },
});

export default memo(CategoryButton);
