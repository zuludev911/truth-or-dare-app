import React, { useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ListRenderItem,
  Text,
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
        contentContainerStyle={{ flex: 1, justifyContent: "center" }}
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
    width: 190,
    height: 90,
  },
});
