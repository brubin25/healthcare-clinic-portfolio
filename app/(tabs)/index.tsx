import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';

interface Department {
  id: keyof typeof iconMap;
  name: string;
}

const iconMap = {
  cardiology: "heartbeat",
  neurology: "brain",
  orthopedics: "bone",
  pediatrics: "baby",
  dermatology: "hand-paper",
  radiology: "radiation",
};

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
      <FontAwesome5 name={iconMap[`${item.id}`]} size={24} color="#007AFF" style={styles.icon} />
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
  icon: {
    marginBottom: 8,
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
