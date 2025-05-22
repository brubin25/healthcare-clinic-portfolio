import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DepartmentItem, { Department } from "../../components/DepartmentItem";

const departments: Department[] = [
  { id: "cardiology", name: "Cardiology", category: "Internal" },
  { id: "neurology", name: "Neurology", category: "Internal" },
  { id: "orthopedics", name: "Orthopedics", category: "Surgery" },
  { id: "pediatrics", name: "Pediatrics", category: "Pediatrics" },
  { id: "dermatology", name: "Dermatology", category: "Internal" },
  { id: "radiology", name: "Radiology", category: "Surgery" },
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

  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = ["All", "Internal", "Surgery", "Pediatrics"];

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.welcome}>Welcome to MediCare Clinic</Text>
      <Text style={styles.subtitle}>Choose a department to book your appointment</Text>
      <Text style={styles.title}>Departments</Text>

      <View style={styles.container}>
        <View style={styles.sidebar}>
          {categories.map((cat) => (
            <Text
              key={cat}
              style={[
                styles.filterItem,
                selectedCategory === cat && styles.filterItemSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              {cat}
            </Text>
          ))}
        </View>

        <FlatList
          style={styles.grid}
          contentContainerStyle={styles.list}
          data={
            selectedCategory === "All"
              ? departments
              : departments.filter((d) => d.category === selectedCategory)
          }
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  list: { justifyContent: "space-between" },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 85,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#333",
  },
  filterItemSelected: {
    backgroundColor: "#e0f0ff",
    fontWeight: "bold",
  },
  grid: {
    flex: 1,
  },
});
