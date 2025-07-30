import React, { useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ListRenderItem,
  Text,
  View,
} from "react-native";
import Animated, { SlideInLeft } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import { Category } from "../types";
import backgroundEmpty from "../assets/background-empty.webp";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

export default function CategoryScreen({ navigation }: Props) {
  const onPressItem = useCallback(
    (id: string) => () => {
      navigation.navigate("Game", { category: id });
    },
    [navigation]
  );
  const renderItem: ListRenderItem<Category> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={SlideInLeft.duration(300).delay(index * 100)}>
        <TouchableOpacity style={styles.card} onPress={onPressItem(item.id)}>
          {item.id === "chicas" && (
            <View style={styles.newCategoryContainer}>
              <Text style={styles.newCategoryText}>Nueva</Text>
            </View>
          )}
          <Image source={item.icon} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    ),
    [onPressItem]
  );

  return (
    <ImageBackground source={backgroundEmpty} style={styles.container}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 100 }}
      />
      <AdBanner />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
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
