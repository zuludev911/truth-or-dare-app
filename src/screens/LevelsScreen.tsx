import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { Level, MODES } from "../games/modes";
import { usePlayers } from "../hooks/usePlayers";
import { trackCategorySelected } from "../services/analytics";
import PlayersSheet from "../components/PlayersSheet";
import { space } from "../theme";
import { BannerSlot, Header, Illustration, ListCard, Screen } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Levels">;

/** Niveles de Yo nunca y ¿Quién es más probable que…?; antes de jugar se piden los jugadores. */
export default function LevelsScreen({ route, navigation }: Props) {
  const { mode } = route.params;
  const config = MODES[mode];
  const [players, setPlayers] = usePlayers();
  const [selected, setSelected] = useState<Level | null>(null);

  const startGame = () => {
    if (!selected) return;
    setSelected(null);
    navigation.navigate("Game", { mode, level: selected.id });
  };

  return (
    <Screen glows={[config.accent, "vor"]} padBottom={false}>
      <Header title={config.title} onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {config.levels.map((level) => (
          <ListCard
            key={level.id}
            title={level.name}
            subtitle={level.description}
            accent={config.accent}
            media={<Illustration name={level.illustration} size={80} />}
            onPress={() => {
              trackCategorySelected(`${mode}-${level.id}`, false);
              setSelected(level);
            }}
          />
        ))}
      </ScrollView>
      <BannerSlot placement="categories" />

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
