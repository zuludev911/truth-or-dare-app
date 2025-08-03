import React, { useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from "react-native";
import Animated, { FadeIn, FadeInLeft } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import backgroundEmpty from "../assets/background-empty.webp";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export default function CategoryScreen({ navigation }: Props) {
  const onPressItem = useCallback(
    (id: string) => () => {
      navigation.navigate("Game", { category: id });
    },
    [navigation]
  );

  return (
    <Animated.View style={{ flex: 1 }}>
      <ImageBackground source={backgroundEmpty} style={styles.container}>
        {CATEGORIES.map((item, index) => {
          const entering = FadeInLeft.delay(index * 200).duration(300);
          return (
            <AnimatedTouchableOpacity
              style={styles.card}
              onPress={onPressItem(item.id)}
              entering={entering}
              key={item.id}
            >
              {item.id === "chicas" && (
                <Animated.View
                  style={styles.newCategoryContainer}
                  entering={FadeIn.delay(500).duration(500)}
                >
                  <Text style={styles.newCategoryText}>Nueva</Text>
                </Animated.View>
              )}
              <Image source={item.icon} style={styles.icon} />
            </AnimatedTouchableOpacity>
          );
        })}
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
