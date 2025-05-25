import React, { useState } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet, ListRenderItemInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { doctors, Doctor } from "../../constants/doctors";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const results = doctors.filter((d) => [d.name, d.department].join(" ").toLowerCase().includes(query.toLowerCase()));

  const renderItem = ({ item }: ListRenderItemInfo<Doctor>) => (
    <Link asChild href={`/doctor/${item.id}`}>
      <TouchableOpacity style={styles.card}>
        <Image source={item.photo} style={styles.photo} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.department}>{item.department.charAt(0).toUpperCase() + item.department.slice(1)}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TextInput style={styles.searchInput} placeholder="Search doctors or departments…" value={query} onChangeText={setQuery} />

      <FlatList data={results} keyExtractor={(d) => d.id} renderItem={renderItem} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.noResults}>No doctors found.</Text>} />
    </SafeAreaView>
  );
}

const PHOTO_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    marginVertical: 8,
    overflow: "hidden",
    padding: 12,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
  },
  info: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  department: { fontSize: 14, color: "#666", marginTop: 4 },
  noResults: {
    textAlign: "center",
    marginTop: 32,
    color: "#999",
  },
});
