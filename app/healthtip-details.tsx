import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

type Params = {
  title?: string | string[];
  description?: string | string[];
  image?: string | string[];
};

export default function HealthTipDetails() {
  const params = useLocalSearchParams<Params>();
  const title = Array.isArray(params.title) ? params.title[0] : params.title || "";
  const description = Array.isArray(params.description) ? params.description[0] : params.description || "";
  const imageUri = Array.isArray(params.image) ? params.image[0] : params.image || "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Health Tip Details</Text>

        {imageUri !== "" && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
});
