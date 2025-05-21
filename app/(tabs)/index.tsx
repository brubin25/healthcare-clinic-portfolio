import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Department {
  id: string;
  name: string;
}

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
    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/department/[id]", params: { id: item.id } })}>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
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
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardText: { fontSize: 18, fontWeight: "600" },
});
