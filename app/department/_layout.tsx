import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

export default function DepartmentLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerTitle = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerTitle }} />
    </Stack>
  );
}
