import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import DesignSystemScreen from "../screens/DesignSystemScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  MainTabs: undefined;
  /** Catálogo de componentes del rediseño, solo en desarrollo. */
  DesignSystem: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      {__DEV__ && <Stack.Screen name="DesignSystem" component={DesignSystemScreen} />}
    </Stack.Navigator>
  );
}
