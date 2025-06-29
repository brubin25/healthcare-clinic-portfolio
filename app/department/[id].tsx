import React from "react";
import { SafeAreaView, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ListRenderItemInfo } from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import LottieView from 'lottie-react-native';

// Doctor interface
type Doctor = {
  id: string;
  name: string;
  photo: any;
  specialty: string;
  price: string;
};

const allDoctors: Doctor[] = [
  // Cardiology
  { id: "cardiology-1", name: "Dr. Alice Heart", photo: require("../../assets/doctors/dr_alice.jpg"), specialty: "Interventional Cardiology", price: "$200" },
  { id: "cardiology-2", name: "Dr. Bob Vessels", photo: require("../../assets/doctors/dr_bob.jpg"), specialty: "Electrophysiology", price: "$180" },
  { id: "cardiology-3", name: "Dr. Gina Pulse", photo: require("../../assets/doctors/dr_gina.jpg"), specialty: "Cardiac Imaging", price: "$210" },
  { id: "cardiology-4", name: "Dr. Henry Beat", photo: require("../../assets/doctors/dr_henry.jpg"), specialty: "Heart Failure Management", price: "$220" },

  // Neurology
  { id: "neurology-1", name: "Dr. Carol Brain", photo: require("../../assets/doctors/dr_carol.jpg"), specialty: "Pediatric Neurology", price: "$220" },
  { id: "neurology-2", name: "Dr. Dan Neuron", photo: require("../../assets/doctors/dr_dan.jpg"), specialty: "Neurophysiology", price: "$210" },
  { id: "neurology-3", name: "Dr. Fiona Nerve", photo: require("../../assets/doctors/dr_fiona.jpg"), specialty: "Stroke Management", price: "$230" },
  { id: "neurology-4", name: "Dr. George Cortex", photo: require("../../assets/doctors/dr_george.jpg"), specialty: "Neurocritical Care", price: "$240" },

  // Orthopedics
  { id: "orthopedics-1", name: "Dr. Helen Bone", photo: require("../../assets/doctors/dr_helen.jpg"), specialty: "Joint Replacement", price: "$190" },
  { id: "orthopedics-2", name: "Dr. Ian Joint", photo: require("../../assets/doctors/dr_ian.jpg"), specialty: "Spine Surgery", price: "$200" },
  { id: "orthopedics-3", name: "Dr. Joy Spine", photo: require("../../assets/doctors/dr_joy.jpg"), specialty: "Sports Medicine", price: "$180" },
  { id: "orthopedics-4", name: "Dr. Kevin Ortho", photo: require("../../assets/doctors/dr_kevin.jpg"), specialty: "Pediatric Orthopedics", price: "$210" },

  // Pediatrics
  { id: "pediatrics-1", name: "Dr. Lily Kids", photo: require("../../assets/doctors/dr_lily.jpg"), specialty: "Pediatric Cardiology", price: "$200" },
  { id: "pediatrics-2", name: "Dr. Mark Growth", photo: require("../../assets/doctors/dr_mark.jpg"), specialty: "Pediatric Neurology", price: "$220" },

  // Dermatology
  { id: "dermatology-1", name: "Dr. Nancy Skin", photo: require("../../assets/doctors/dr_nancy.jpg"), specialty: "Cosmetic Dermatology", price: "$180" },

  // Radiology
  { id: "radiology-1", name: "Dr. Rachel Xray", photo: require("../../assets/doctors/dr_rachel.jpg"), specialty: "Magnetic Resonance Imaging", price: "$220" },
];

export default function DepartmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const doctors = allDoctors.filter((doc) => doc.id.startsWith(id));

  const renderItem = ({ item }: ListRenderItemInfo<Doctor>) => (
    <View style={styles.cardContainer}>
      {/* Tapping anywhere on the card navigates to /doctor/[id] */}
      <Link asChild href={`/doctor/${item.id}`}>
        <TouchableOpacity style={styles.card}>
          <Image source={item.photo} style={styles.photo} resizeMode="cover" />
          <LottieView
            source={require('../../assets/images/heart-pump.json')}
            autoPlay
            loop
            style={[{ position: 'absolute', top: CARD_IMAGE_WIDTH / 2, bottom: 15, left: 12, right: 12 }, styles.photo]}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>Specialty: {item.specialty}</Text>
            <Text style={styles.price}>Fees: {item.price}</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({
          pathname: "../appointment",
          params: {
            doctorId: item.id,
            doctorName: item.name,
          }
        })}
      >
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Doctor> data={doctors} renderItem={renderItem} keyExtractor={(d) => d.id} contentContainerStyle={styles.list} />
    </SafeAreaView>
  );
}

const CARD_IMAGE_WIDTH = 120;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  cardContainer: {
    marginVertical: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    overflow: "hidden",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  photo: {
    width: CARD_IMAGE_WIDTH,
    aspectRatio: 1,
    height: undefined,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  specialty: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
