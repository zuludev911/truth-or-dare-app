import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, ImageBackground, ScrollView } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import backgroundEmpty from "../assets/background-empty.webp";
import CategoryButton from "../components/CategoryButton";
import ShowVideoModal from "../components/ShowVideoModal";
import { isUnlocked, saveUnlockTime } from "../utils";
import { AD_IDS } from "../services/ads";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

const adUnitId = __DEV__ ? TestIds.REWARDED : AD_IDS.REWARD_ID;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

export default function CategoryScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryUnlocked, setIsCategoryUnlocked] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true)
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        reward && navigation.navigate("Game", { category: "extremo" });
        saveUnlockTime();
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

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
          loaded={loaded}
          rewarded={rewarded}
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
