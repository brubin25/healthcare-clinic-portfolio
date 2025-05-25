import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tintColor = Colors[colorScheme ?? "light"].tint;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: tintColor,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: { position: "absolute" },
                    default: {},
                }),
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />

            {/* Chatbot Tab */}
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Chatbot",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="stethoscope" color={color} />
                    ),
                }}
            />

            {/* Search Tab */}
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="paperplane.fill" color={color} />
                    ),
                }}
            />

            {/* Health Carousel Tab */}
            <Tabs.Screen
                name="health-carousel"
                options={{
                    title: "Health Carousel",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="list.bullet.rectangle.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}