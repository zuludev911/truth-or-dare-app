import React, { useCallback } from "react";
import { StyleSheet, ImageBackground } from "react-native";
import Animated from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import backgroundEmpty from "../assets/background-empty.webp";
import CategoryButton from "../components/CategoryButton";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

export default function CategoryScreen({ navigation }: Props) {
  const onPressItem = useCallback(
    (id: string) => navigation.navigate("Game", { category: id }),
    [navigation]
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <ImageBackground source={backgroundEmpty} style={styles.container}>
        {CATEGORIES.map((item, index) => (
          <CategoryButton
            index={index}
            item={item}
            onPressItem={onPressItem}
            key={item.id}
          />
        ))}
        <AdBanner />
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 50,
    backgroundColor: COLORS.PRIMARY,
  },
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
  text: { color: "white", fontSize: 20, fontWeight: "bold" },
  icon: {
    width: 220,
    height: 90,
  },
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
