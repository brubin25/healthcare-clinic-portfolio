import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { openDatabaseAsync } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router'; // <-- Make sure this is imported

const dbPromise = openDatabaseAsync("appointments.db");

export default function AppointmentsListScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const db = await dbPromise;
      const results = await db.getAllAsync("SELECT * FROM appointments;");
      const now = new Date();
      const upcoming = results.filter(appt => {
        try {
          if (!appt.date || !appt.time) return false;
          const apptDateTime = new Date(`${appt.date}T${appt.time}`);
          return apptDateTime.getTime() >= now.getTime();
        } catch {
          return false;
        }
      });
      upcoming.sort(
        (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
      );
      setAppointments(upcoming);
    } catch (e) {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );



  useEffect(() => {
    loadAppointments();
  }, []);

  // Delete/cancel appointment
  const handleDelete = (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes", style: "destructive", onPress: async () => {
            try {
              const db = await dbPromise;
              await db.runAsync("DELETE FROM appointments WHERE id = ?;", id);
              // Refresh the list
              loadAppointments();
            } catch (e) {
              Alert.alert("Error", "Could not delete appointment.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Upcoming Appointments</Text>
        <FontAwesome5 name="calendar-check" size={28} color="#10c1e6" style={{ marginLeft: 8 }} />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3cc3fa" />
          <Text style={{ color: "#777" }}>Loading appointments…</Text>
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.center}>
          <FontAwesome5 name="calendar-times" size={54} color="#d7e4ec" />
          <Text style={styles.noText}>No upcoming appointments</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardShadowWrap}>
              <View style={styles.card}>
                <View style={styles.leftAccent} />
                <View style={styles.cardContent}>
                  {/* Department Row */}
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                    <MaterialCommunityIcons name="office-building" size={18} color="#00b2b2" />
                    <Text style={styles.deptName}>  {item.department || "General"}</Text>
                  </View>
                  <Text style={styles.docName}>
                    <FontAwesome5 name="user-md" size={18} color="#10c1e6" />
                    <Text style={styles.docNameText}> {item.doctorName}</Text>
                  </Text>
                  <Text style={styles.label}>
                    <FontAwesome5 name="user" size={14} /> Patient: <Text style={styles.val}>{item.patientName}</Text>
                  </Text>
                  <Text style={styles.label}>
                    <FontAwesome5 name="calendar-alt" size={14} /> {item.date}
                  </Text>
                  <Text style={styles.label}>
                    <FontAwesome5 name="clock" size={14} /> {item.time}
                  </Text>
                </View>
                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <FontAwesome5 name="trash-alt" size={21} color="#ef5350" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f3fafd",
  },
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 11,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: "#18b7e3",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#14a6bc",
    letterSpacing: 0.2,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
  },
  cardShadowWrap: {
    shadowColor: "#00a8b7",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 17,
    marginVertical: 8,
    marginHorizontal: 2,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 17,
    overflow: "hidden",
    alignItems: "center",
    minHeight: 150,
    position: "relative",
  },
  leftAccent: {
    width: 8,
    height: "100%",
    backgroundColor: "#10c1e6",
    borderTopLeftRadius: 17,
    borderBottomLeftRadius: 17,
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  deptName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00b2b2",
    marginBottom: 3,
    marginLeft: 3,
  },
  docName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  docNameText: {
    color: "#14a6bc",
    fontWeight: "900",
    fontSize: 19,
  },
  label: {
    color: "#444",
    fontSize: 16,
    marginTop: 4,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  val: {
    fontWeight: "700",
    color: "#10c1e6",
  },
  deleteBtn: {
    paddingHorizontal: 17,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noText: {
    color: "#14a6bc",
    marginTop: 16,
    fontWeight: "800",
    fontSize: 19,
    letterSpacing: 0.2,
  },
});
