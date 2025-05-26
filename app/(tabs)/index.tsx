import { Redirect } from "expo-router";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, ListRenderItemInfo, ScrollView, StyleSheet, Text, View } from "react-native";
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
        <FlatList<Department>
          contentContainerStyle={styles.list}
          data={departments}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          numColumns={2}
          scrollEnabled={false} // prevents nested scroll conflict
        />

        <TouchableOpacity
          style={styles.recordsButton}
          onPress={() => router.push("/record")}
        >
          <Text style={styles.recordsButtonText}>Records</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
    textAlign: "center",
  },
  list: {
    justifyContent: "space-between",
  },
   recordsButton: {
       backgroundColor: "#f7f7f7",
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,

    },
    recordsButtonText: {
      color:  'light',
      fontSize: 18,
      marginLeft: 8,
      fontWeight: '600',
    }

});