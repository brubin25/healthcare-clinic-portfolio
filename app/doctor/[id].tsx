import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, SafeAreaView, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSafeAreaInsets } from "expo-router";

interface MedicalRecord {
  id: string;
  visitDate: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  allergies: string;
  medicalHistory: string;
}

export default function PatientRecordsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: "1",
      visitDate: "2023-05-15",
      doctorName: "Dr. Smith",
      diagnosis: "Hypertension Stage 1",
      prescription: "Lisinopril 10mg daily, Monitor BP weekly",
      allergies: "Penicillin, Sulfa drugs",
      medicalHistory: "Family history of hypertension"
    },
    {
      id: "2",
      visitDate: "2023-04-10",
      doctorName: "Dr. Johnson",
      diagnosis: "Type 2 Diabetes",
      prescription: "Metformin 500mg twice daily with meals",
      allergies: "None known",
      medicalHistory: "Prediabetes for 2 years prior"
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, "id">>({
    visitDate: new Date().toISOString().split('T')[0],
    doctorName: "",
    diagnosis: "",
    prescription: "",
    allergies: "",
    medicalHistory: ""
  });

  const addRecord = () => {
    if (!newRecord.doctorName || !newRecord.diagnosis) {
      alert("Please fill in doctor name and diagnosis");
      return;
    }

    setRecords([
      {
        id: Date.now().toString(),
        ...newRecord
      },
      ...records
    ]);

    setModalVisible(false);
    setNewRecord({
      visitDate: new Date().toISOString().split('T')[0],
      doctorName: "",
      diagnosis: "",
      prescription: "",
      allergies: "",
      medicalHistory: ""
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Records</Text>
      </View>

      {/* Records List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48} color="#888" />
            <Text style={styles.emptyText}>No records found</Text>
            <Text style={styles.emptySubtext}>Add a new record to get started</Text>
          </View>
        ) : (
          <FlatList
            data={records}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>{item.visitDate}</Text>
                  <Text style={styles.recordDoctor}>{item.doctorName}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Diagnosis:</Text>
                  <Text style={styles.sectionContent}>{item.diagnosis}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Prescription:</Text>
                  <Text style={styles.sectionContent}>{item.prescription || "None"}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Allergies:</Text>
                  <Text style={styles.sectionContent}>{item.allergies || "None"}</Text>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Add Button */}
      <View style={[styles.footer, { bottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Record</Text>
        </TouchableOpacity>
      </View>

      {/* Add Record Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Medical Record</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.inputLabel}>Visit Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={newRecord.visitDate}
              onChangeText={(text) => setNewRecord({...newRecord, visitDate: text})}
            />

            <Text style={styles.inputLabel}>Doctor Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Dr. Smith"
              value={newRecord.doctorName}
              onChangeText={(text) => setNewRecord({...newRecord, doctorName: text})}
            />

            <Text style={styles.inputLabel}>Diagnosis *</Text>
            <TextInput
              style={styles.input}
              placeholder="Primary diagnosis"
              value={newRecord.diagnosis}
              onChangeText={(text) => setNewRecord({...newRecord, diagnosis: text})}
            />

            <Text style={styles.inputLabel}>Prescription</Text>
            <TextInput
              style={styles.input}
              placeholder="Medications/treatment"
              value={newRecord.prescription}
              onChangeText={(text) => setNewRecord({...newRecord, prescription: text})}
            />

            <Text style={styles.inputLabel}>Allergies</Text>
            <TextInput
              style={styles.input}
              placeholder="Known allergies"
              value={newRecord.allergies}
              onChangeText={(text) => setNewRecord({...newRecord, allergies: text})}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addRecord}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    color: "#888",
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    color: "#aaa",
  },
  listContainer: {
    paddingBottom: 20,
  },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  recordDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  recordDoctor: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "500",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    padding: 16,
    paddingBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});