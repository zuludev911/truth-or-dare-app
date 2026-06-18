import React, { useEffect, ReactElement } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconHome, IconTool } from "@tabler/icons-react-native";
import { COLORS } from "../constants";

const TAB_COUNT = 2;

const TAB_BAR_HEIGHT = 72;
const BLOB_TOP_OFFSET = -15; // cuánto sobresale el blob por encima del tab bar

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 140,
  mass: 0.8,
};

const ICONS: Record<string, (focused: boolean) => ReactElement> = {
  HomeTab: (focused) => (
    <IconHome
      size={focused ? 30 : 24}
      color={focused ? COLORS.PRIMARY : "#BDBDBD"}
    />
  ),
  ToolsTab: (focused) => (
    <IconTool
      size={focused ? 30 : 24}
      color={focused ? COLORS.PRIMARY : "#BDBDBD"}
    />
  ),
};

const LABELS: Record<string, string> = {
  HomeTab: "Home",
  ToolsTab: "Tools",
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / TAB_COUNT;
  const blobWidth = width / TAB_COUNT;
  // Posición X del centro del blob
  const blobX = useSharedValue(
    state.index * tabWidth + (tabWidth - blobWidth) / 2,
  );

  // Scale de cada tab
  const scales = state.routes.map((_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSharedValue(i === state.index ? 1 : 0.85),
  );

  useEffect(() => {
    const targetX = state.index * tabWidth + (tabWidth - blobWidth) / 2;
    blobX.value = withSpring(targetX, SPRING_CONFIG);

    scales.forEach((scale, i) => {
      scale.value = withSpring(i === state.index ? 1 : 0.85, SPRING_CONFIG);
    });
  }, [state.index, tabWidth, blobWidth]);

  const blobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: blobX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          height: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      {/* Blob animado */}
      <Animated.View
        style={[
          styles.blob,
          { width: blobWidth, height: blobWidth, borderRadius: blobWidth / 2 },
          blobStyle,
        ]}
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const iconStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scales[index].value }],
          }));

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Animated.View style={[styles.tabContent, iconStyle]}>
                {ICONS[route.name]?.(isFocused)}
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {LABELS[route.name] ?? route.name}
                </Text>
                <View
                  style={[
                    styles.activeIndicator,
                    isFocused && styles.activeIndicatorVisible,
                  ]}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  blob: {
    position: "absolute",
    top: BLOB_TOP_OFFSET,
    backgroundColor: COLORS.WHITE,
  },
  tabsRow: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabContent: {
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: COLORS.PRIMARY,
  },
  tabLabelInactive: {
    color: "#8F8F8F",
  },
  activeIndicator: {
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: "transparent",
    marginTop: 2,
  },
  activeIndicatorVisible: {
    backgroundColor: COLORS.PRIMARY,
  },
});
