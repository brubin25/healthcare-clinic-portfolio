import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomePage() {
  const router = useRouter();

  return (
      <LinearGradient
          colors={["#e0f2ff", "#ffffff"]}
          style={styles.container}
      >
        <Image
            source={require("../assets/clinic/healthcare-clinic.png")}
            style={styles.image}
            resizeMode="contain"
        />
        <Text style={styles.title}>AuroraClinic</Text>
        <Text style={styles.subtitle}>Multispecialty Health Clinic</Text>

        <Text style={styles.caption}>Your journey to better care starts here.</Text>

        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Let’s Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 32,
  },
  caption: {
    fontSize: 16,
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
