import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DepartmentItem, { Department } from "./department-item";

const departments: Department[] = [
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "dermatology", name: "Dermatology" },
  { id: "radiology", name: "Radiology" },
];

export default function HomeScreen() {
  const router = useRouter();
  
  const renderItem = ({ item }: ListRenderItemInfo<Department>) => (
    <DepartmentItem item={item} onPressOut={() => router.push({ pathname: "/department/[id]", params: { id: item.id } })} />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Departments</Text>
      <FlatList<Department> contentContainerStyle={styles.list} data={departments} renderItem={renderItem} keyExtractor={(i) => i.id} numColumns={2} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  list: { justifyContent: "space-between" },
});
