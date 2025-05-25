import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import HealthTipsCarousel from "../../components/HealthTipsCarousel";

const Home = () => {
  const router = useRouter();

  const tiles = [
    {
      label: "Clinic",
      image: require("../../assets/home/clinic.png"),
      onPress: () => router.push("/clinic"),
    },
    {
      label: "Profile",
      image: require("../../assets/home/profile.png"),
      onPress: () => router.push("/profile"),
    },
    {
      label: "Testimonials",
      image: require("../../assets/home/reviews.png"),
      onPress: () => router.push("/testimonials"),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Multispecialty Healthcare Clinic</Text>
      <View style={styles.grid}>
        {tiles.map((tile, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={tile.onPress}>
            <Image source={tile.image} style={styles.icon} resizeMode="contain" />
            <Text style={styles.label}>{tile.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subheader}>Health Tips</Text>
      <HealthTipsCarousel />
    </ScrollView>
  );
};

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 80) / 2;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 16,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginBottom: 8,
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