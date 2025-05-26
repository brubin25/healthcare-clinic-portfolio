import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DepartmentItem, { Department } from "../../components/DepartmentItem";

const departments: Department[] = [
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "dermatology", name: "Dermatology" },
  { id: "radiology", name: "Radiology" },
];

export default function DepartmentScreen() {
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
        </ScrollView>
         {/*}<TouchableOpacity
                  style={styles.recordsButton}
                  onPress={() => router.push("/record")}
                >
                  <Text style={styles.recordsButtonText}>Records</Text>
                </TouchableOpacity>*/}
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#e6f2ff", // light blue
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#003366", // darker blue for readability
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
