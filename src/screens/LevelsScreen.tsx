import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { Level, MODES } from "../games/modes";
import { usePlayers } from "../hooks/usePlayers";
import { useRewardedUnlock } from "../hooks/useRewardedUnlock";
import { trackCategorySelected } from "../services/analytics";
import { getConfigNumber } from "../services/remoteConfig";
import { formatTimeLeft, formatUnlockHours } from "../utils";
import PlayersSheet from "../components/PlayersSheet";
import { space } from "../theme";
import { BannerSlot, Header, Illustration, ListCard, Screen, UnlockModal } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Levels">;

/**
 * Niveles de Yo nunca y ¿Quién es más probable que…?. Los niveles marcados
 * como `locked` se desbloquean con un video; antes de jugar se piden los jugadores.
 */
export default function LevelsScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const config = MODES[mode];
  const [players, setPlayers] = usePlayers();
  const [selected, setSelected] = useState<Level | null>(null);

  const unlockId = (level: Level) => `${mode}-${level.id}`;
  const unlock = useRewardedUnlock(
    config.levels.filter((l) => l.locked).map(unlockId),
    (id) => setSelected(config.levels.find((l) => unlockId(l) === id) ?? null),
    "categories"
  );

  const onPressLevel = (level: Level) => {
    const locked = unlock.isLocked(unlockId(level));
    trackCategorySelected(unlockId(level), locked);
    if (locked) unlock.requestUnlock(unlockId(level));
    else setSelected(level);
  };

  const startGame = () => {
    if (!selected) return;
    setSelected(null);
    navigation.navigate("Game", { mode, level: selected.id });
  };

  const modalLevel = config.levels.find((l) => unlockId(l) === unlock.modalId);
  const hours = formatUnlockHours(getConfigNumber("rewarded_unlock_hours"));

  return (
    <Screen glows={[config.accent, "vor"]} padBottom={false}>
      <Header title={config.title} onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {config.levels.map((level) => {
          const left = unlock.remaining[unlockId(level)] ?? 0;
          return (
            <ListCard
              key={level.id}
              title={level.name}
              subtitle={level.description}
              accent={config.accent}
              media={<Illustration name={level.illustration} size={80} />}
              locked={unlock.isLocked(unlockId(level))}
              timeLeft={level.locked && left ? formatTimeLeft(left) : undefined}
              onPress={() => onPressLevel(level)}
            />
          );
        })}
      </ScrollView>
      <BannerSlot placement="categories" />

      <UnlockModal
        visible={!!modalLevel}
        title="Nivel para adultos"
        illustration={modalLevel?.illustration ?? "vor"}
        description={`${modalLevel?.lockedText ?? ""} ${hours}.`}
        state={unlock.unlockState}
        onWatch={unlock.watch}
        onClose={unlock.closeModal}
      />
      <PlayersSheet
        visible={!!selected}
        players={players}
        onChange={setPlayers}
        onConfirm={startGame}
        onClose={() => setSelected(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.s3, paddingTop: space.s3, paddingBottom: space.s4 },
});
