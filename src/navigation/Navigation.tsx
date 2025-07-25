import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import CategoryScreen from "../screens/CategoryScreen";

export type RootStackParamList = {
  Home: undefined;
  Game: { category: string };
  Categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoryScreen}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  );
}
