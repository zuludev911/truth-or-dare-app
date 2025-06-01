import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import categories from "../data/categories.json";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RootStackParamList } from "../navigation/Navigation";
import AdBanner from "../components/AdBanner";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

export default function CategoryScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Game", { category: item.id })}
          >
            <FontAwesome5 name={item.icono} size={24} color="white" />
            <Text style={styles.text}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: "#ff3e6c",
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  text: { color: "white", fontSize: 20, fontWeight: "bold" },
});
