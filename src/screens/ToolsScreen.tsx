import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../navigation/Navigation";
import { space } from "../theme";
import {
  BannerSlot,
  BottleIllustration,
  Header,
  Illustration,
  ListCard,
  Screen,
  Text,
} from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "Tools">;

/** Ícono emoji de 72 dp para las herramientas que todavía no existen. */
const EmojiMedia = ({ emoji }: { emoji: string }) => (
  <View style={styles.emoji}>
    <Text style={styles.emojiText}>{emoji}</Text>
  </View>
);

/** Lista de herramientas: Dado y Botella, y las que vienen pronto. */
export default function ToolsScreen({ navigation }: Props) {
  const comingSoon = () =>
    Toast.show({ type: "info", text1: "Próximamente", text2: "Esta herramienta llegará pronto" });

  return (
    <Screen glows={["her", "yn"]} padBottom={false}>
      <Header title="Herramientas" onLeadingPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <ListCard
          title="Dado"
          subtitle="Lanza de 1 a 4 dados"
          media={<Illustration name="her" size={72} />}
          onPress={() => navigation.navigate("Dice")}
        />
        <ListCard
          title="Botella"
          subtitle="Gírala y que el azar decida"
          media={
            <View style={styles.bottle}>
              <BottleIllustration height={72} />
            </View>
          }
          onPress={() => navigation.navigate("Bottle")}
        />
        <ListCard title="Papa caliente" subtitle="Próximamente" soon media={<EmojiMedia emoji="🔥" />} onPress={comingSoon} />
        <ListCard title="Charadas" subtitle="Próximamente" soon media={<EmojiMedia emoji="🎭" />} onPress={comingSoon} />
      </ScrollView>
      <BannerSlot placement="tools" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.s3, paddingTop: space.s3, paddingBottom: space.s4 },
  bottle: { width: 72, height: 72, alignItems: "center", justifyContent: "center" },
  emoji: { width: 72, height: 72, alignItems: "center", justifyContent: "center" },
  emojiText: { fontSize: 48, lineHeight: 60 },
});
