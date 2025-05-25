import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function ClinicPage() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.titleBlock}>
                <Text style={styles.title}>AuroraCare Medical Center</Text>
                <Text style={styles.subtitle}>Multispecialty Health Clinic</Text>
            </View>

            <Animated.View entering={FadeIn.duration(800)} style={styles.imageContainer}>
                <Image
                    source={require("../assets/clinic/healthcare-clinic.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>

            <Text style={styles.description}>
                Welcome to AuroraCare Medical Center – your gateway to compassionate and cutting-edge healthcare.
                We are a multispecialty clinic committed to serving our community with excellence, empathy, and innovation.
            </Text>

            <Text style={styles.sectionTitle}>Departments</Text>
            <Text style={styles.listItem}>• Cardiology</Text>
            <Text style={styles.listItem}>• Neurology</Text>
            <Text style={styles.listItem}>• Orthopedics</Text>
            <Text style={styles.listItem}>• Pediatrics</Text>
            <Text style={styles.listItem}>• Dermatology</Text>
            <Text style={styles.listItem}>• Radiology</Text>

            <Text style={styles.footer}>
                <Text style={{ fontStyle: "italic" }}>
                    At AuroraCare, we believe every patient deserves a personalized approach to healing.
                    Your health is our mission.
                </Text>
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    titleBlock: {
        marginBottom: 16,
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 4,
    },
    imageContainer: {
        marginVertical: 20,
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 200,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 22,
        textAlign: "justify",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 6,
    },
    footer: {
        marginTop: 30,
        fontSize: 14,
        color: "#555",
        textAlign: "center",
    },
});
