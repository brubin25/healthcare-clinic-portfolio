import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomePage() {
  const router = useRouter();

  console.log("WelcomePage rendered");  

  return (
    <View style={styles.container}>
      <Image source={require("../assets/welcome.jpg")} style={styles.image} resizeMode="contain" />
      <Text style={styles.subheading}>Welcome to</Text>
      <Text style={styles.heading}>Healthcare Clinic!</Text>
      <Text style={styles.text}>We’re glad you’re here.</Text>
      <Button title="Enter App" onPress={() => router.push("/(tabs)")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: 400,
    height: 265,
    marginBottom: 24,
  },
  heading: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  subheading: {
    fontSize: 24,
    marginBottom: 0,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
});
