import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { CATEGORIES, CategoryConfig, NEW_CONTENT_UNTIL } from "../constants";
import { trackCategorySelected } from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";
import { formatTimeLeft, formatUnlockHours } from "../utils";
import { useRewardedUnlock } from "../hooks/useRewardedUnlock";
import { usePlayers } from "../hooks/usePlayers";
import PlayersSheet from "../components/PlayersSheet";
import { space } from "../theme";
import { BannerSlot, CategoryCard, Header, Screen, UnlockModal } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

const LOCKED_TEXT: Record<string, string> = {
  extremo: "Esta categoría es para adultos y contiene contenido sensible. Para acceder debes ver un video de publicidad, el cual te dará acceso por",
  chicas: "Esta es la categoría exclusiva para chicas. Para acceder debes ver un video de publicidad, el cual te dará acceso por",
};

const LOCKED_IDS = CATEGORIES.filter((c) => c.locked).map((c) => c.id);

const isNew = (id: string) =>
  !!NEW_CONTENT_UNTIL[id] && new Date() < new Date(NEW_CONTENT_UNTIL[id]);

/** Grilla de categorías de Verdad o Reto. Extremo y Chicas se desbloquean con un video. */
export default function CategoryScreen({ navigation }: Props) {
  const [players, setPlayers] = usePlayers();
  // Categoría elegida: antes de jugar se muestra la hoja de jugadores.
  const [startingCategory, setStartingCategory] = useState<CategoryConfig | null>(null);

  const unlock = useRewardedUnlock(
    LOCKED_IDS,
    (id) => setStartingCategory(CATEGORIES.find((c) => c.id === id) ?? null),
    "categories"
  );

  const onPressCategory = (category: CategoryConfig) => {
    const locked = unlock.isLocked(category.id);
    trackCategorySelected(category.id, locked);
    if (locked) unlock.requestUnlock(category.id);
    else setStartingCategory(category);
  };

  const startGame = () => {
    if (!startingCategory) return;
    setStartingCategory(null);
    navigation.navigate("Game", { mode: "vor", level: startingCategory.id });
  };

  // Grilla de 2 columnas.
  const rows: CategoryConfig[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) rows.push(CATEGORIES.slice(i, i + 2));

  const modalCategory = CATEGORIES.find((c) => c.id === unlock.modalId);
  const hours = formatUnlockHours(getConfigNumber("rewarded_unlock_hours"));

  return (
    <Screen glows={["vor", "yn"]} padBottom={false}>
      <Header title="Elige una categoría" onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((category) => {
              const left = unlock.remaining[category.id] ?? 0;
              return (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  illustration={category.illustration}
                  level={category.level}
                  isNew={isNew(category.id)}
                  locked={unlock.isLocked(category.id)}
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
        state={unlock.unlockState}
        onWatch={unlock.watch}
        onClose={unlock.closeModal}
        onDismiss={unlock.onModalDismiss}
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
