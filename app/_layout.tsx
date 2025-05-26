import "react-native-reanimated";
import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  console.log("Color Scheme:", colorScheme);

  if (!fontsLoaded) {
    return null;
  }

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      {/* You can uncomment and define Stack.Screen as needed */}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="appointment" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="department" />
        <Stack.Screen name="doctor/[id]" />
        <Stack.Screen name="+not-found" />
         <Stack.Screen name="record" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
