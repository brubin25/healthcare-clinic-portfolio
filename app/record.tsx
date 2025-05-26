import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { openDatabaseAsync } from "expo-sqlite";

interface MedicalRecord {
  id: string;
  visitDate: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  allergies: string;
  medicalHistory: string;
}

// Initialize database with proper schema
const dbPromise = openDatabaseAsync("patientRecords.db").then(async (db) => {
  // Create table with all required columns if it doesn't exist
  // Add this before table creation during development
  await db.execAsync("DROP TABLE IF EXISTS patient_records");
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS patient_records (
          id TEXT PRIMARY KEY NOT NULL,
          visitDate TEXT NOT NULL,
          doctorName TEXT NOT NULL,
          diagnosis TEXT NOT NULL,
          prescription TEXT,
          allergies TEXT,
          medicalHistory TEXT
        );
  `);
  console.log('Table created!')
  return db;
});


export default function PatientRecordsPage() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
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
         medicalHistory: "Predicates for 2 years prior"
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

     // Initialize database and load records
      useEffect(() => {
        const initDB = async () => {
          try {
            // Try to initialize real database
            const db = await dbPromise;

            console.log('fetching record...')
            // Load existing records from real database
            const result = await db.getAllAsync<MedicalRecord>(
              "SELECT * FROM patient_records ORDER BY visitDate DESC"
            );

            console.log('record fetched!')
            if (result.length > 0) {
              // If we have real records, use them
              setRecords(result);
            }

          } catch (error) {
            // If database fails, use mock data
            console.error("Database error", error);
          } finally {
            setLoading(false);
          }
        };

        initDB();
      }, []);

     const addRecord = async() => {
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

   try {
       const db = await dbPromise;
       const recordId = Date.now().toString();

        console.log('saving record in db ..')
       await db.runAsync(
         `INSERT INTO patient_records
         (id, visitDate, doctorName, diagnosis, prescription, allergies, medicalHistory)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [
           recordId,
           newRecord.visitDate,
           newRecord.doctorName,
           newRecord.diagnosis,
           newRecord.prescription,
           newRecord.allergies,
           newRecord.medicalHistory
         ]
       );

    console.log('record saved!')
     } catch (error) {
       console.error(error);
     }
     };



  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Patient Records</Text>
      </View>

      {/* Records List */}
      <View style={styles.content}>
        {records.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No records found</Text>
            <Text style={styles.emptySubtext}>Add a new record to get started</Text>
          </View>
        ) : (
          <FlatList
            data={records}
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
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Record</Text>
      </TouchableOpacity>

      {/* Add Record Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Record</Text>

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
                style={[styles.button, styles.confirmButton]}
                onPress={addRecord}
              >
                <Text style={[styles.buttonText]}>Save</Text>
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
      paddingTop: 20,

    backgroundColor: "#fff",
  },
  header: {
      paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
     // Shadow properties
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2, // This creates a shadow at the bottom
      },
      shadowOpacity: 0.1, // Very subtle opacity
      shadowRadius: 4, // Soft edges
      elevation: 5, // For Android
      backgroundColor: "#fff", // Important for shadows to work
      zIndex: 10, // Ensures shadow appears above other elements


  },
  heading: {
      paddingTop: 20,

    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    paddingBottom: 30
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 14,
    fontSize:20,

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
    fontSize: 20,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#eee",
     // Shadow properties
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2, // This creates a shadow at the bottom
                  },
                  shadowOpacity: 0.1, // Very subtle opacity
                  shadowRadius: 4, // Soft edges
                  elevation: 5, // For Android
                  backgroundColor: "#fff", // Important for shadows to work
                  zIndex: 10, // Ensures shadow appears above other elements
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
    fontSize:18
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalContent: {
    padding: 16,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
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
  confirmButton: {
    backgroundColor: "#007bff",
    color: 'white'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",

  },
});