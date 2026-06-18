import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { IconLock } from "@tabler/icons-react-native";

import { Category } from "../types";
import { COLORS } from "../constants";
import NewCategoryBadge from "./NewCategoryBadge";

interface CategoryButtonProps {
  index: number;
  item: Category;
  onPressItem: (id: string) => void;
  isNew?: boolean;
  isLocked?: boolean;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

function CategoryButton({
  index,
  item,
  onPressItem,
  isNew,
  isLocked,
}: CategoryButtonProps) {
  const entering = FadeInLeft.delay(index * 200).duration(300);
  const onPress = () => {
    onPressItem(item.id);
  };

  return (
    <AnimatedTouchableOpacity
      style={styles.card}
      onPress={onPress}
      entering={entering}
    >
      <View style={styles.iconContainer}>
        <Image source={item.icon} style={styles.icon} />
      </View>
      {isNew && <NewCategoryBadge />}
      {isLocked && (
        <IconLock color={COLORS.WHITE} size={28} style={styles.lockedIcon} />
      )}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.SECONDARY,
    marginVertical: 10,
    padding: 0,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    height: 90,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 72,
    paddingRight: 48,
  },
  icon: {
    width: 220,
    height: 90,
    resizeMode: "contain",
  },
  lockedIcon: {
    position: "absolute",
    left: 22,
    top: 31,
  },
});

export default memo(CategoryButton);
