import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, ImageBackground, ScrollView } from "react-native";
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { HomeStackParamList } from "../navigation/HomeStackNavigator";
import AdBanner from "../components/AdBanner";
import { COLORS, CATEGORIES } from "../constants";
import backgroundEmpty from "../assets/background-empty.webp";
import chicas from "../assets/chicas.webp";
import CategoryButton from "../components/CategoryButton";
import ShowVideoModal from "../components/ShowVideoModal";
import { isUnlocked, saveUnlockTime, isUnlockedChicas, saveUnlockTimeChicas } from "../utils";
import { AD_IDS } from "../services/ads";
import {
  trackAdFailed,
  trackAdShown,
  trackCategorySelected,
  trackRewardEarned,
} from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";
import {
  markFullscreenAdClosed,
  markFullscreenAdOpened,
} from "../services/fullscreenAds";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<HomeStackParamList, "Categories">;

const adUnitId = __DEV__ ? TestIds.REWARDED : AD_IDS.REWARD_ID;
const rewarded = RewardedAd.createForAdRequest(adUnitId);
const rewardedChicas = RewardedAd.createForAdRequest(adUnitId);

/** Eventos comunes de los videos recompensados: analíticas y recarga al cerrar. */
const listenRewardedLifecycle = (ad: RewardedAd, onLoadedChange: (loaded: boolean) => void) => {
  const unsubscribers = [
    ad.addAdEventListener(AdEventType.OPENED, () => {
      markFullscreenAdOpened();
      trackAdShown("rewarded", "categories");
    }),
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      markFullscreenAdClosed();
      onLoadedChange(false);
      ad.load();
    }),
    ad.addAdEventListener(AdEventType.ERROR, (error) => {
      onLoadedChange(false);
      trackAdFailed("rewarded", "categories", error);
    }),
  ];
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};

export default function CategoryScreen({ navigation }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryUnlocked, setIsCategoryUnlocked] = useState<boolean>(false);
  const [loaded, setLoaded] = useState(false);

  const [isChicasModalVisible, setIsChicasModalVisible] = useState(false);
  const [isChicasUnlocked, setIsChicasUnlocked] = useState<boolean>(false);
  const [loadedChicas, setLoadedChicas] = useState(false);

  const load = useCallback(() => {
    isUnlocked().then(setIsCategoryUnlocked);
    isUnlockedChicas().then(setIsChicasUnlocked);
  }, []);

  useFocusEffect(load);

  const onPressItem = useCallback(
    (id: string) => {
      trackCategorySelected(id, false);
      navigation.navigate("Game", { category: id });
    },
    [navigation],
  );

  const onPressExtremo = useCallback(
    (id: string) => {
      if (isCategoryUnlocked) return onPressItem(id);
      trackCategorySelected(id, true);
      setIsModalVisible(true);
    },
    [isCategoryUnlocked, onPressItem],
  );

  const onPressChicas = useCallback(
    (id: string) => {
      if (isChicasUnlocked) return onPressItem(id);
      trackCategorySelected(id, true);
      setIsChicasModalVisible(true);
    },
    [isChicasUnlocked, onPressItem],
  );

  const unlockHours = getConfigNumber("rewarded_unlock_hours");
  const unlockLabel = unlockHours === 1 ? "1 hora" : `${unlockHours} horas`;

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true),
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        trackRewardEarned("extremo");
        reward && navigation.navigate("Game", { category: "extremo" });
        saveUnlockTime();
      },
    );
    const unsubscribeLifecycle = listenRewardedLifecycle(rewarded, setLoaded);

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeLifecycle();
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
        trackRewardEarned("chicas");
        reward && navigation.navigate("Game", { category: "chicas" });
        saveUnlockTimeChicas();
      },
    );
    const unsubscribeLifecycle = listenRewardedLifecycle(
      rewardedChicas,
      setLoadedChicas,
    );

    rewardedChicas.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeLifecycle();
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
      <AdBanner placement="categories" />
      {!isCategoryUnlocked && (
        <ShowVideoModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          loaded={loaded}
          rewarded={rewarded}
          description={`Esta categoría es para adultos y contiene contenido sensible. Para acceder a esta categoría debes ver un video de publicidad el cual te dará acceso por ${unlockLabel}.`}
        />
      )}
      {!isChicasUnlocked && (
        <ShowVideoModal
          isModalVisible={isChicasModalVisible}
          setIsModalVisible={setIsChicasModalVisible}
          loaded={loadedChicas}
          rewarded={rewardedChicas}
          image={chicas}
          description={`Esta es la categoría exclusiva para chicas. Para acceder debes ver un video de publicidad, el cual te dará acceso por ${unlockLabel}.`}
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
