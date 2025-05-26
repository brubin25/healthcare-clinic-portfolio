import React from "react";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
                tabBarLabelStyle: { fontSize: 12 },
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size = 28 }) => (
                        <IconSymbol size={size} name="house.fill" color={color} />
                    ),
                }}
            />

            {/* Department Tab */}
            <Tabs.Screen
                name="department"
                options={{
                    title: "Department",
                    tabBarIcon: ({ color, size = 28 }) => (
                        <FontAwesome5 name="hospital-symbol" size={size} color={color} />
                    ),
                }}
            />

            {/* Chatbot Tab */}
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Chatbot",
                    tabBarIcon: ({ color, size = 28 }) => (
                        <IconSymbol size={size} name="stethoscope" color={color} />
                    ),
                }}
            />

            {/* Search Tab */}
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, size = 28 }) => (
                        <IconSymbol size={size} name="paperplane.fill" color={color} />
                    ),
                }}
            />

            {/* Health Carousel Tab */}
            <Tabs.Screen
                name="health-carousel"
                options={{
                    title: "Health Carousel",
                    tabBarIcon: ({ color, size = 28 }) => (
                        <IconSymbol size={size} name="list.bullet.rectangle.fill" color={color} />
                    ),
                }}
            />

            {/* Appointments Tab */}
            <Tabs.Screen
                name="appointments-list"
                options={{
                    title: 'Appointments',
                    tabBarIcon: ({ color, size = 28 }) => (
                        <FontAwesome5 name="calendar-check" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
