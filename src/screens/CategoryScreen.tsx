import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, ImageBackground, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import backgroundEmpty from "../assets/background-empty.webp";
import CategoryButton from "../components/CategoryButton";
import ShowVideoModal from "../components/ShowVideoModal";
import { isUnlocked } from "../utils";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

export default function CategoryScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryUnlocked, setIsCategoryUnlocked] = useState<boolean>(false);

  const load = async () => {
    const unlocked = await isUnlocked();
    setIsCategoryUnlocked(unlocked);
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(() => {
    load();
  });

  const onPressItem = useCallback(
    (id: string) => {
      navigation.navigate("Game", { category: id });
    },
    [navigation]
  );

  const onPressExtremo = (id: string) => {
    isCategoryUnlocked ? onPressItem(id) : setIsModalVisible(true);
  };

  return (
    <ImageBackground source={backgroundEmpty} style={styles.container}>
      <ScrollView style={styles.content}>
        {CATEGORIES.map((item, index) => {
          const isExtreme = item.id === "extremo";
          return (
            <CategoryButton
              key={item.id}
              index={index}
              item={item}
              onPressItem={isExtreme ? onPressExtremo : onPressItem}
              isNew={isExtreme}
              isLocked={isExtreme && !isCategoryUnlocked}
            />
          );
        })}
      </ScrollView>
      <AdBanner />
      {!isCategoryUnlocked && (
        <ShowVideoModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 50,
  },
});
