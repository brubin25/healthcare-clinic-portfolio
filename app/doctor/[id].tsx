import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Doctor {
  id: string;
  name: string;
  photo: any;
  specialty: string;
  department: string;
  visitingHour: string;
  totalPatients: string;
  description: string;
  icon: any;
}

const allDoctors: Doctor[] = [
  // Cardiology
  {
    id: "cardiology-1",
    name: "Dr. Alice Heart",
    photo: require("../../assets/doctors/dr_alice.jpg"),
    specialty: "Cardiologist",
    department: "cardiology",
    visitingHour: "10 AM - 12 PM",
    totalPatients: "1400+",
    description:
      "With over a decade at the forefront of interventional cardiology, Dr. Alice Heart combines precision catheter techniques with compassionate patient communication.  A sought-after speaker at national conferences, she’s published landmark studies on advanced stenting procedures and leads a team dedicated to reducing recovery times after complex coronary interventions.",
    icon: require("../../assets/icons/cardiology.png"),
  },
  {
    id: "cardiology-2",
    name: "Dr. Bob Vessels",
    photo: require("../../assets/doctors/dr_bob.jpg"),
    specialty: "Cardiologist",
    department: "cardiology",
    visitingHour: "11 AM - 1 PM",
    totalPatients: "1300+",
    description:
      "An expert in electrophysiology, Dr. Bob Vessels has performed hundreds of successful ablations to treat arrhythmias.  Known for his patient-centered approach, he customizes long-term management plans and empowers patients with the latest wearable-tech monitoring strategies to keep their hearts in rhythm.",
    icon: require("../../assets/icons/cardiology.png"),
  },
  {
    id: "cardiology-3",
    name: "Dr. Gina Pulse",
    photo: require("../../assets/doctors/dr_gina.jpg"),
    specialty: "Cardiologist",
    department: "cardiology",
    visitingHour: "9 AM - 11 AM",
    totalPatients: "1500+",
    description:
      "Dr. Gina Pulse specializes in non‐invasive cardiac imaging, offering state-of-the-art echocardiograms and cardiac MRI diagnostics.  She’s published groundbreaking protocols for early detection of cardiomyopathies and collaborates closely with radiology to craft seamless diagnostic pathways for every patient.",
    icon: require("../../assets/icons/cardiology.png"),
  },
  {
    id: "cardiology-4",
    name: "Dr. Henry Beat",
    photo: require("../../assets/doctors/dr_henry.jpg"),
    specialty: "Cardiologist",
    department: "cardiology",
    visitingHour: "2 PM - 4 PM",
    totalPatients: "1250+",
    description:
      "Focused on heart failure management and transplant cardiology, Dr. Henry Beat develops bespoke treatment regimens for complex cases.  He mentors fellows in advanced hemodynamic support techniques and has led multicenter trials exploring novel pharmacotherapies to improve long-term survival rates.",
    icon: require("../../assets/icons/cardiology.png"),
  },

  // Neurology
  {
    id: "neurology-1",
    name: "Dr. Carol Brain",
    photo: require("../../assets/doctors/dr_carol.jpg"),
    specialty: "Neurologist",
    department: "neurology",
    visitingHour: "1 PM - 3 PM",
    totalPatients: "1100+",
    description:
      "As a pediatric neurology specialist, Dr. Carol Brain brings both deep clinical skill and a warm bedside manner to managing seizure disorders and developmental challenges.  Her family-focused approach includes parent education workshops and cutting-edge neurodevelopmental therapies to give every child the best chance to thrive.",
    icon: require("../../assets/icons/neurology.png"),
  },
  {
    id: "neurology-2",
    name: "Dr. Dan Neuron",
    photo: require("../../assets/doctors/dr_dan.jpg"),
    specialty: "Neurologist",
    department: "neurology",
    visitingHour: "10 AM - 12 PM",
    totalPatients: "1000+",
    description:
      "Dr. Dan Neuron is renowned for his expertise in neurophysiology, offering comprehensive EMG and nerve conduction studies.  He’s contributed to landmark research on peripheral neuropathy and collaborates with rehab specialists to design multidisciplinary care plans that accelerate patient recovery.",
    icon: require("../../assets/icons/neurology.png"),
  },
  {
    id: "neurology-3",
    name: "Dr. Fiona Nerve",
    photo: require("../../assets/doctors/dr_fiona.jpg"),
    specialty: "Neurologist",
    department: "neurology",
    visitingHour: "3 PM - 5 PM",
    totalPatients: "950+",
    description:
      "A leader in stroke management, Dr. Fiona Nerve combines acute intervention expertise with rehab-focused strategies to maximize functional recovery.  She has pioneered rapid‐response stroke protocols and regularly trains first-responder teams on the latest thrombectomy techniques.",
    icon: require("../../assets/icons/neurology.png"),
  },
  {
    id: "neurology-4",
    name: "Dr. George Cortex",
    photo: require("../../assets/doctors/dr_george.jpg"),
    specialty: "Neurologist",
    department: "neurology",
    visitingHour: "9 AM - 11 AM",
    totalPatients: "1200+",
    description:
      "Specializing in neurocritical care, Dr. George Cortex manages complex head trauma and intracranial pressure monitoring.  He’s an active investigator in traumatic brain injury research and has implementing neuro-monitoring protocols that have significantly reduced ICU stays.",
    icon: require("../../assets/icons/neurology.png"),
  },

  // Orthopedics
  {
    id: "orthopedics-1",
    name: "Dr. Helen Bone",
    photo: require("../../assets/doctors/dr_helen.jpg"),
    specialty: "Orthopedic Surgeon",
    department: "orthopedics",
    visitingHour: "2 PM - 4 PM",
    totalPatients: "900+",
    description:
      "Dr. Helen Bone is a fellowship-trained joint replacement surgeon whose minimally invasive hip and knee procedures have transformed patient mobility.  She integrates rapid-rehab protocols into her practice and leads community seminars on maintaining joint health across the lifespan.",
    icon: require("../../assets/icons/orthopedics.png"),
  },
  {
    id: "orthopedics-2",
    name: "Dr. Ian Joint",
    photo: require("../../assets/doctors/dr_ian.jpg"),
    specialty: "Orthopedic Surgeon",
    department: "orthopedics",
    visitingHour: "11 AM - 1 PM",
    totalPatients: "850+",
    description:
      "An expert in spine surgery, Dr. Ian Joint performs advanced minimally invasive procedures to correct scoliosis and degenerative disc disease.  He collaborates with physical therapists to ensure each patient achieves optimal posture and pain relief post-operation.",
    icon: require("../../assets/icons/orthopedics.png"),
  },
  {
    id: "orthopedics-3",
    name: "Dr. Joy Spine",
    photo: require("../../assets/doctors/dr_joy.jpg"),
    specialty: "Orthopedic Surgeon",
    department: "orthopedics",
    visitingHour: "10 AM - 12 PM",
    totalPatients: "780+",
    description:
      "Dr. Joy Spine combines sports medicine expertise with arthroscopic surgical skill, helping athletes return to peak performance quickly.  She’s published studies on cartilage repair techniques and runs an outreach program teaching injury prevention to local schools.",
    icon: require("../../assets/icons/orthopedics.png"),
  },
  {
    id: "orthopedics-4",
    name: "Dr. Kevin Ortho",
    photo: require("../../assets/doctors/dr_kevin.jpg"),
    specialty: "Pediatric Orthopedic Surgeon",
    department: "orthopedics",
    visitingHour: "3 PM - 5 PM",
    totalPatients: "650+",
    description:
      "Dr. Kevin Ortho specializes in treating congenital musculoskeletal conditions in children, from clubfoot to limb length discrepancies.  His gentle approach and child-friendly clinic environment help young patients feel at ease during evaluation and recovery.",
    icon: require("../../assets/icons/orthopedics.png"),
  },

  // Pediatrics
  {
    id: "pediatrics-1",
    name: "Dr. Lily Kids",
    photo: require("../../assets/doctors/dr_lily.jpg"),
    specialty: "Pediatrician",
    department: "pediatrics",
    visitingHour: "9 AM - 11 AM",
    totalPatients: "1100+",
    description:
      "Dr. Lily Kids offers holistic pediatric cardiac care, blending standard treatments with family counseling and nutritional guidance for congenital heart conditions.  She leads parent support groups and collaborates with child life specialists to ensure each family feels supported.",
    icon: require("../../assets/icons/pediatrics.png"),
  },
  {
    id: "pediatrics-2",
    name: "Dr. Mark Growth",
    photo: require("../../assets/doctors/dr_mark.jpg"),
    specialty: "Pediatric Neurologist",
    department: "pediatrics",
    visitingHour: "1 PM - 3 PM",
    totalPatients: "1000+",
    description:
      "With a focus on developmental disorders and epilepsy, Dr. Mark Growth designs individualized care plans that include medication management, behavioral therapy, and family education.  He’s published research on early intervention strategies that improve long-term outcomes.",
    icon: require("../../assets/icons/pediatrics.png"),
  },

  // Dermatology
  {
    id: "dermatology-1",
    name: "Dr. Nancy Skin",
    photo: require("../../assets/doctors/dr_nancy.jpg"),
    specialty: "Dermatologist",
    department: "dermatology",
    visitingHour: "11 AM - 1 PM",
    totalPatients: "720+",
    description:
      "Dr. Nancy Skin treats everything from acne and eczema to complex autoimmune skin disorders.  Her practice emphasizes both medical therapy and cosmetic dermatology, using laser treatments and injectables to help patients look and feel their best.",
    icon: require("../../assets/icons/dermatology.png"),
  },

  // Radiology
  {
    id: "radiology-1",
    name: "Dr. Rachel Xray",
    photo: require("../../assets/doctors/dr_rachel.jpg"),
    specialty: "Radiologist",
    department: "radiology",
    visitingHour: "2 PM - 4 PM",
    totalPatients: "800+",
    description:
      "Dr. Rachel Xray excels in advanced MRI and CT imaging, providing detailed diagnostic reports for complex neurological and oncological cases.  She collaborates closely with multidisciplinary teams to ensure accurate, timely readings and guides treatment planning with her insights.",
    icon: require("../../assets/icons/radiology.png"),
  },
];

export default function DoctorDetailScreen() {
  const [expanded, setExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const doctor = allDoctors.find((d) => d.id === id);

  if (!doctor) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Doctor not found.</Text>
      </SafeAreaView>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.5;

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity style={[styles.backCircle, { position: "absolute", top: insets.top + 16, left: 16 }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.name}>{doctor.name}</Text>
            <View style={styles.specialtyRow}>
              <Image source={doctor.icon} style={styles.specialtyIcon} />
              <Text style={styles.specialty}>{doctor.specialty}</Text>
            </View>
          </View>

          <Image source={doctor.photo} style={[styles.profileImage, { width: imageSize, height: imageSize }]} resizeMode="cover" />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Visiting Hour</Text>
            <Text style={styles.metricValue}>{doctor.visitingHour}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total Patient</Text>
            <Text style={styles.metricValue}>{doctor.totalPatients}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Biography</Text>
        <Text style={styles.description} numberOfLines={expanded ? undefined : 3}>
          {doctor.description}
        </Text>
        <Text style={styles.seeMore} onPress={() => setExpanded((prev) => !prev)}>
          {expanded ? "Show Less" : "See More"}
        </Text>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push("../appointment")}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  titleBlock: { flex: 1, paddingRight: 16 },
  name: { fontSize: 24, fontWeight: "bold" },
  specialtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  specialtyIcon: { width: 24, height: 24, marginRight: 8 },
  specialty: { fontSize: 16, color: "#666" },
  profileImage: { borderRadius: 16 },
  metricsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  metricItem: { flex: 1 },
  metricLabel: { fontSize: 14, color: "#888" },
  metricValue: { fontSize: 18, fontWeight: "600", marginTop: 4 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  description: { fontSize: 14, color: "#444", lineHeight: 20 },
  seeMore: { fontSize: 14, color: "#007bff", marginTop: 4 },
  footer: { position: "absolute", left: 16, right: 16 },
  bookButton: { backgroundColor: "#007bff", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  notFound: { flex: 1, textAlign: "center", marginTop: 50, fontSize: 18 },
});
