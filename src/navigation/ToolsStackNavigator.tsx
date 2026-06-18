import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ToolsScreen from "../screens/ToolsScreen";
import DiceScreen from "../screens/DiceScreen";
import BottleScreen from "../screens/BottleScreen";
import { COLORS } from "../constants";

export type ToolsStackParamList = {
  Tools: undefined;
  Dice: undefined;
  Bottle: undefined;
};

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export default function ToolsStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tools"
      screenOptions={{ contentStyle: { backgroundColor: COLORS.WHITE } }}
    >
      <Stack.Screen
        name="Tools"
        component={ToolsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dice"
        component={DiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bottle"
        component={BottleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
