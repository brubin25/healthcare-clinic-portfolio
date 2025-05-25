import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DepartmentItem, { Department } from "../../components/DepartmentItem";
import HealthTipsCarousel from "../../components/HealthTipsCarousel";

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
    <DepartmentItem
      item={item}
      onPressOut={() =>
        router.push({ pathname: "/department/[id]", params: { id: item.id } })
      }
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Departments</Text>
        <FlatList
          contentContainerStyle={styles.list}
          data={departments}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          numColumns={2}
          scrollEnabled={false}
        />

        {/* Health Tips Section */}
        <Text style={styles.subtitle}>Health Tips</Text>
        <View style={{ marginBottom: 20 }}>
          <HealthTipsCarousel />
        </View>
      </ScrollView>
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
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  list: {
    justifyContent: "space-between",
  },
});