import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";

const tiles = [
    { label: "Clinic", image: require("../../assets/home/clinic.png"), onPress: () => console.log("Clinic pressed") },
    { label: "Profile", image: require("../../assets/home/profile.png"), onPress: () => console.log("Profile pressed") },
    { label: "Reviews", image: require("../../assets/home/reviews.png"), onPress: () => console.log("Reviews pressed") },
];

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Multispecialty Healthcare Clinic</Text>
            <View style={styles.grid}>
                {tiles.map((tile, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={tile.onPress}>
                        <Image source={tile.image} style={styles.icon} resizeMode="contain" />
                        <Text style={styles.label}>{tile.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 80) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20,
    },
    card: {
        width: cardSize,
        height: cardSize,
        borderRadius: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
});

export default Home;
