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
import chicas from "../assets/chicas.webp";
import CategoryButton from "../components/CategoryButton";
import ShowVideoModal from "../components/ShowVideoModal";
import { isUnlocked, saveUnlockTime, isUnlockedChicas, saveUnlockTimeChicas } from "../utils";
import { AD_IDS } from "../services/ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

const adUnitId = __DEV__ ? TestIds.REWARDED : AD_IDS.REWARD_ID;
const rewarded = RewardedAd.createForAdRequest(adUnitId);
const rewardedChicas = RewardedAd.createForAdRequest(adUnitId);

export default function CategoryScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryUnlocked, setIsCategoryUnlocked] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  const [isChicasModalVisible, setIsChicasModalVisible] = useState(false);
  const [isChicasUnlocked, setIsChicasUnlocked] = useState<boolean>(false);
  const [loadedChicas, setLoadedChicas] = useState(false);

  const load = async () => {
    const unlocked = await isUnlocked();
    setIsCategoryUnlocked(unlocked);
    const chicasUnlocked = await isUnlockedChicas();
    setIsChicasUnlocked(chicasUnlocked);
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
    [navigation],
  );

  const onPressExtremo = (id: string) => {
    isCategoryUnlocked ? onPressItem(id) : setIsModalVisible(true);
  };

  const onPressChicas = (id: string) => {
    isChicasUnlocked ? onPressItem(id) : setIsChicasModalVisible(true);
  };

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true),
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        reward && navigation.navigate("Game", { category: "extremo" });
        saveUnlockTime();
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  useEffect(() => {
    const unsubscribeLoaded = rewardedChicas.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoadedChicas(true),
    );
    const unsubscribeEarned = rewardedChicas.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        reward && navigation.navigate("Game", { category: "chicas" });
        saveUnlockTimeChicas();
      },
    );

    rewardedChicas.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const { bottom, top } = useSafeAreaInsets();

  return (
    <>
      <ImageBackground
        source={backgroundEmpty}
        style={[
          styles.container,
          { paddingBottom: bottom + 50, paddingTop: top },
        ]}
      >
        <ScrollView scrollEnabled style={styles.content}>
          {CATEGORIES.map((item, index) => {
            const isExtreme = item.id === "extremo";
            const isChicas = item.id === "chicas";
            return (
              <CategoryButton
                key={item.id}
                index={index}
                item={item}
                onPressItem={
                  isExtreme ? onPressExtremo
                  : isChicas ? onPressChicas
                  : onPressItem
                }
                isNew={false}
                isLocked={
                  (isExtreme && !isCategoryUnlocked) ||
                  (isChicas && !isChicasUnlocked)
                }
              />
            );
          })}
        </ScrollView>
      </ImageBackground>
      <AdBanner />
      {!isCategoryUnlocked && (
        <ShowVideoModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          loaded={loaded}
          rewarded={rewarded}
        />
      )}
      {!isChicasUnlocked && (
        <ShowVideoModal
          isModalVisible={isChicasModalVisible}
          setIsModalVisible={setIsChicasModalVisible}
          loaded={loadedChicas}
          rewarded={rewardedChicas}
          image={chicas}
          description="Esta es la categoría exclusiva para chicas. Para acceder debes ver un video de publicidad, el cual te dará acceso por 2 horas."
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  content: {
    paddingHorizontal: 30,
  },
});
