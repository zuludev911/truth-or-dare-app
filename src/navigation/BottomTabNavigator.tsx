import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import ToolsStackNavigator from "./ToolsStackNavigator";
import CustomTabBar from "../components/CustomTabBar";

type BottomTabParamList = {
  HomeTab: undefined;
  ToolsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="ToolsTab" component={ToolsStackNavigator} />
    </Tab.Navigator>
  );
}
