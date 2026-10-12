import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { RootStackParamList } from "../navigation/Navigation";
import { CATEGORIES, CategoryConfig, NEW_CONTENT_UNTIL } from "../constants";
import { AD_IDS } from "../services/ads";
import {
  trackAdFailed,
  trackAdShown,
  trackCategorySelected,
  trackRewardEarned,
} from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";
import {
  formatTimeLeft,
  formatUnlockHours,
  getUnlockRemainingMs,
  saveUnlockTime,
} from "../utils";
import { space } from "../theme";
import { BannerSlot, CategoryCard, Header, Screen, UnlockModal, UnlockState } from "../ui";
import PlayersSheet from "../components/PlayersSheet";
import { usePlayers } from "../hooks/usePlayers";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

const AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : AD_IDS.REWARD_ID;
/** Si el video no carga en este tiempo, se avisa que no hay anuncios. */
const LOAD_TIMEOUT_MS = 10000;

const LOCKED_TEXT: Record<string, string> = {
  extremo: "Esta categoría es para adultos y contiene contenido sensible. Para acceder debes ver un video de publicidad, el cual te dará acceso por",
  chicas: "Esta es la categoría exclusiva para chicas. Para acceder debes ver un video de publicidad, el cual te dará acceso por",
};

const isNew = (id: string) =>
  !!NEW_CONTENT_UNTIL[id] && new Date() < new Date(NEW_CONTENT_UNTIL[id]);

/** Grilla de categorías de Verdad o Reto. Extremo y Chicas se desbloquean con un video. */
export default function CategoryScreen({ navigation }: Props) {
  // Tiempo de desbloqueo restante (ms) de cada categoría bloqueable.
  const [remaining, setRemaining] = useState<Record<string, number>>({});
  const [modalCategory, setModalCategory] = useState<CategoryConfig | null>(null);
  const [unlockState, setUnlockState] = useState<UnlockState>("ready");
  const [players, setPlayers] = usePlayers();
  // Categoría elegida: antes de jugar se muestra la hoja de jugadores.
  const [startingCategory, setStartingCategory] = useState<CategoryConfig | null>(null);

  const rewarded = useMemo(() => RewardedAd.createForAdRequest(AD_UNIT_ID), []);
  const isLoaded = useRef(false);
  const pendingCategory = useRef<CategoryConfig | null>(null);
  const earned = useRef(false);
  const loadTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const refreshUnlocks = useCallback(() => {
    const locked = CATEGORIES.filter((c) => c.locked);
    Promise.all(locked.map((c) => getUnlockRemainingMs(c.id))).then((values) =>
      setRemaining(Object.fromEntries(locked.map((c, i) => [c.id, values[i]])))
    );
  }, []);

  // Al volver a la pantalla y cada 30 s, para que el tiempo restante avance.
  useFocusEffect(
    useCallback(() => {
      refreshUnlocks();
      const interval = setInterval(refreshUnlocks, 30000);
      return () => clearInterval(interval);
    }, [refreshUnlocks])
  );

  const openGame = useCallback((category: CategoryConfig) => setStartingCategory(category), []);

  const startGame = () => {
    if (!startingCategory) return;
    setStartingCategory(null);
    navigation.navigate("Game", { mode: "vor", level: startingCategory.id });
  };

  useEffect(() => {
    const unsubscribers = [
      rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        isLoaded.current = true;
        // Si el usuario ya tocó "Ver video" mientras cargaba, se muestra enseguida.
        if (pendingCategory.current && loadTimeout.current) {
          clearTimeout(loadTimeout.current);
          loadTimeout.current = undefined;
          rewarded.show();
        }
      }),
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        const category = pendingCategory.current;
        if (!category) return;
        earned.current = true;
        trackRewardEarned(category.id);
        saveUnlockTime(category.id).then(refreshUnlocks);
      }),
      rewarded.addAdEventListener(AdEventType.OPENED, () => {
        setModalCategory(null);
        trackAdShown("rewarded", "categories");
      }),
      rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        isLoaded.current = false;
        const category = pendingCategory.current;
        if (earned.current && category) {
          Toast.show({
            type: "success",
            text1: "¡Categoría desbloqueada!",
            text2: `Acceso por ${formatUnlockHours(getConfigNumber("rewarded_unlock_hours"))}`,
          });
          openGame(category);
        }
        earned.current = false;
        pendingCategory.current = null;
        rewarded.load();
      }),
      rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
        isLoaded.current = false;
        trackAdFailed("rewarded", "categories", error);
        if (loadTimeout.current) {
          clearTimeout(loadTimeout.current);
          loadTimeout.current = undefined;
          setUnlockState("noads");
        }
      }),
    ];
    rewarded.load();
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      clearTimeout(loadTimeout.current);
    };
  }, [rewarded, openGame, refreshUnlocks]);

  const onPressCategory = (category: CategoryConfig) => {
    const isLocked = category.locked && !remaining[category.id];
    trackCategorySelected(category.id, !!isLocked);
    if (!isLocked) return openGame(category);
    setUnlockState("ready");
    setModalCategory(category);
  };

  const onWatch = async () => {
    pendingCategory.current = modalCategory;
    if (isLoaded.current) return rewarded.show();

    const { isConnected } = await NetInfo.fetch();
    if (isConnected === false) return setUnlockState("offline");

    setUnlockState("loading");
    rewarded.load();
    loadTimeout.current = setTimeout(() => {
      loadTimeout.current = undefined;
      setUnlockState("noads");
    }, LOAD_TIMEOUT_MS);
  };

  const closeModal = () => {
    clearTimeout(loadTimeout.current);
    loadTimeout.current = undefined;
    pendingCategory.current = null;
    setModalCategory(null);
  };

  // Grilla de 2 columnas.
  const rows: CategoryConfig[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) rows.push(CATEGORIES.slice(i, i + 2));

  const hours = formatUnlockHours(getConfigNumber("rewarded_unlock_hours"));

  return (
    <Screen glows={["vor", "yn"]} padBottom={false}>
      <Header title="Elige una categoría" onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((category) => {
              const left = remaining[category.id] ?? 0;
              return (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  illustration={category.illustration}
                  level={category.level}
                  isNew={isNew(category.id)}
                  locked={category.locked && !left}
                  timeLeft={category.locked && left ? formatTimeLeft(left) : undefined}
                  onPress={() => onPressCategory(category)}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
      <BannerSlot placement="categories" />

      <UnlockModal
        visible={!!modalCategory}
        illustration={modalCategory?.illustration ?? "extremo"}
        description={`${LOCKED_TEXT[modalCategory?.id ?? "extremo"] ?? LOCKED_TEXT.extremo} ${hours}.`}
        state={unlockState}
        onWatch={onWatch}
        onClose={closeModal}
      />
      <PlayersSheet
        visible={!!startingCategory}
        players={players}
        onChange={setPlayers}
        onConfirm={startGame}
        onClose={() => setStartingCategory(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.s3, paddingTop: space.s3, paddingBottom: space.s4 },
  row: { flexDirection: "row", gap: space.s3 },
});
