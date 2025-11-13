import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarStyle: {
          position: "absolute",
          height: 70 + insets.bottom / 2,
          borderTopWidth: 0.5,
          borderTopColor: "#E5E7EB",
          backgroundColor: "#ffffffee",
          paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 10,
          paddingTop: 6,
          elevation: 8,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="nature-meditate"
        options={{
          tabBarLabel: "Meditate",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "flower-tulip" : "flower-tulip-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="affirmations"
        options={{
          tabBarLabel: "Affirmations",
          tabBarIcon: ({ color, focused }) => (
            <Entypo name="open-book" size={focused ? 26 : 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
