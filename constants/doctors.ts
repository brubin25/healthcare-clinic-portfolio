import type { ImageSourcePropType } from "react-native";

export interface Doctor {
  id: string;
  name: string;
  photo: ImageSourcePropType;
  specialty: string;
  department: string;
  price: string;
}

export const doctors: Doctor[] = [
  // Cardiology
  {
    id: "cardiology-1",
    name: "Dr. Alice Heart",
    photo: require("../assets/doctors/dr_alice.jpg"),
    specialty: "Interventional Cardiology",
    department: "cardiology",
    price: "$200",
  },
  {
    id: "cardiology-2",
    name: "Dr. Bob Vessels",
    photo: require("../assets/doctors/dr_bob.jpg"),
    specialty: "Electrophysiology",
    department: "cardiology",
    price: "$180",
  },
  {
    id: "cardiology-3",
    name: "Dr. Gina Pulse",
    photo: require("../assets/doctors/dr_gina.jpg"),
    specialty: "Cardiac Imaging",
    department: "cardiology",
    price: "$210",
  },
  {
    id: "cardiology-4",
    name: "Dr. Henry Beat",
    photo: require("../assets/doctors/dr_henry.jpg"),
    specialty: "Heart Failure Management",
    department: "cardiology",
    price: "$220",
  },

  // Neurology
  {
    id: "neurology-1",
    name: "Dr. Carol Brain",
    photo: require("../assets/doctors/dr_carol.jpg"),
    specialty: "Pediatric Neurology",
    department: "neurology",
    price: "$220",
  },
  {
    id: "neurology-2",
    name: "Dr. Dan Neuron",
    photo: require("../assets/doctors/dr_dan.jpg"),
    specialty: "Neurophysiology",
    department: "neurology",
    price: "$210",
  },
  {
    id: "neurology-3",
    name: "Dr. Fiona Nerve",
    photo: require("../assets/doctors/dr_fiona.jpg"),
    specialty: "Stroke Management",
    department: "neurology",
    price: "$230",
  },
  {
    id: "neurology-4",
    name: "Dr. George Cortex",
    photo: require("../assets/doctors/dr_george.jpg"),
    specialty: "Neurocritical Care",
    department: "neurology",
    price: "$240",
  },

  // Orthopedics
  {
    id: "orthopedics-1",
    name: "Dr. Helen Bone",
    photo: require("../assets/doctors/dr_helen.jpg"),
    specialty: "Joint Replacement",
    department: "orthopedics",
    price: "$190",
  },
  {
    id: "orthopedics-2",
    name: "Dr. Ian Joint",
    photo: require("../assets/doctors/dr_ian.jpg"),
    specialty: "Spine Surgery",
    department: "orthopedics",
    price: "$200",
  },
  {
    id: "orthopedics-3",
    name: "Dr. Joy Spine",
    photo: require("../assets/doctors/dr_joy.jpg"),
    specialty: "Sports Medicine",
    department: "orthopedics",
    price: "$180",
  },
  {
    id: "orthopedics-4",
    name: "Dr. Kevin Ortho",
    photo: require("../assets/doctors/dr_kevin.jpg"),
    specialty: "Pediatric Orthopedics",
    department: "orthopedics",
    price: "$210",
  },

  // Pediatrics
  {
    id: "pediatrics-1",
    name: "Dr. Lily Kids",
    photo: require("../assets/doctors/dr_lily.jpg"),
    specialty: "Pediatric Cardiology",
    department: "pediatrics",
    price: "$200",
  },
  {
    id: "pediatrics-2",
    name: "Dr. Mark Growth",
    photo: require("../assets/doctors/dr_mark.jpg"),
    specialty: "Pediatric Neurology",
    department: "pediatrics",
    price: "$220",
  },

  // Dermatology
  {
    id: "dermatology-1",
    name: "Dr. Nancy Skin",
    photo: require("../assets/doctors/dr_nancy.jpg"),
    specialty: "Cosmetic Dermatology",
    department: "dermatology",
    price: "$180",
  },

  // Radiology
  {
    id: "radiology-1",
    name: "Dr. Rachel Xray",
    photo: require("../assets/doctors/dr_rachel.jpg"),
    specialty: "Magnetic Resonance Imaging",
    department: "radiology",
    price: "$220",
  },
];
