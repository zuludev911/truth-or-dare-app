import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import GameScreen from "../screens/GameScreen";
import LevelsScreen from "../screens/LevelsScreen";
import ToolsScreen from "../screens/ToolsScreen";
import DiceScreen from "../screens/DiceScreen";
import BottleScreen from "../screens/BottleScreen";
import DesignSystemScreen from "../screens/DesignSystemScreen";
import { colors } from "../theme";
import type { GameMode } from "../games/modes";

/**
 * Rediseño: el inicio es el centro de juegos y cada juego se abre desde ahí
 * (ya no hay barra de pestañas).
 */
export type RootStackParamList = {
  Home: undefined;
  Categories: undefined;
  /** Niveles de Yo nunca o ¿Quién…?. */
  Levels: { mode: "yn" | "qmp" };
  /** `level`: categoría de Verdad o Reto o nivel de los otros juegos. */
  Game: { mode: GameMode; level: string };
  Tools: undefined;
  Dice: undefined;
  Bottle: undefined;
  /** Catálogo de componentes del rediseño, solo en desarrollo. */
  DesignSystem: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.base },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoryScreen} />
      <Stack.Screen name="Levels" component={LevelsScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Tools" component={ToolsScreen} />
      <Stack.Screen name="Dice" component={DiceScreen} />
      <Stack.Screen name="Bottle" component={BottleScreen} />
      {__DEV__ && <Stack.Screen name="DesignSystem" component={DesignSystemScreen} />}
    </Stack.Navigator>
  );
}
