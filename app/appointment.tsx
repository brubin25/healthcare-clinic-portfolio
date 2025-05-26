import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ActivityIndicator, StyleSheet, Button, Alert,
  TouchableOpacity, TextInput, ScrollView, Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { openDatabaseAsync } from "expo-sqlite";
import LottieView from "lottie-react-native";

const dbPromise = openDatabaseAsync("appointments.db");
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function AppointmentPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const doctorId = params?.doctorId as string | undefined;
  const doctorName = params?.doctorName as string | undefined;

  const [dbReady, setDbReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("");

  const animationRef = useRef<LottieView>(null);
  const animationContainerRef = useRef<View>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = await dbPromise;
        await db.withTransactionAsync(async () => {
          // DEV ONLY: Drop old table!
          await db.execAsync(`DROP TABLE IF EXISTS appointments;`);
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS appointments (
              id   INTEGER PRIMARY KEY AUTOINCREMENT,
              patientName TEXT NOT NULL,
              doctorId TEXT NOT NULL,
              doctorName TEXT,
              date TEXT,
              time TEXT
            );
          `);
        });
        setDbReady(true);
      } catch (err) {
        console.error("DB init failed", err);
        Alert.alert("Error", "Could not initialize database");
      }
    })();
  }, []);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ];

  const bookAppointment = async () => {
    if (!patientName.trim()) {
      Alert.alert("Please enter your name");
      return;
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert("Pick a date and time first");
      return;
    }
    if (!doctorId) {
      Alert.alert("Error", "Doctor information missing.");
      return;
    }
    try {
      animationContainerRef.current?.setNativeProps({ style: { opacity: 1 } });
      animationRef.current?.play();
      const db = await dbPromise;
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          "INSERT INTO appointments (patientName, doctorId, doctorName, date, time) VALUES (?, ?, ?, ?, ?);",
          patientName.trim(),
          doctorId,
          doctorName ?? "",
          selectedDate,
          selectedTime
        );
      });
      Alert.alert("Success", `Your appointment is set for ${selectedDate} at ${selectedTime}!`, [
        { onPress: () => router.replace("/(tabs)") }
      ]);
    } catch (err) {
      console.error("Booking failed", err);
      Alert.alert("Error", "Could not save your appointment");
    }
  };

  // Helper to render time slots as grid (4 per row)
  function renderTimeSlots() {
    const rows: JSX.Element[] = [];
    for (let i = 0; i < timeSlots.length; i += 4) {
      rows.push(
        <View key={i} style={styles.slotRow}>
          {timeSlots.slice(i, i + 4).map((slot) => {
            const isActive = slot === selectedTime;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slot, isActive && styles.slotActive]}
                onPress={() => setSelectedTime(slot)}
                activeOpacity={0.75}
              >
                <Text style={isActive ? styles.slotTextActive : styles.slotText}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return rows;
  }

  if (!dbReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Setting things up…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Book with {doctorName || "Doctor"}</Text>
        <TextInput
          placeholder="Enter your name"
          value={patientName}
          onChangeText={setPatientName}
          style={styles.input}
        />

        <Text style={styles.heading}>Pick a Date</Text>
        <Calendar
          markedDates={selectedDate ? { [selectedDate]: { selected: true, disableTouchEvent: true } } : {}}
          onDayPress={(day: DateData) => {
            setSelectedDate(day.dateString);
            setSelectedTime(null);
          }}
          style={styles.calendar}
        />

        {selectedDate && (
          <>
            <Text style={styles.heading}>Pick a Time</Text>
            <View style={styles.timeSlotGrid}>
              {renderTimeSlots()}
            </View>
          </>
        )}
      </ScrollView>
      <View
        ref={animationContainerRef}
        style={styles.lottieContainer}
        pointerEvents="none" // <---- THIS IS THE KEY LINE!
      >
        <LottieView
          source={require('../assets/images/success.json')}
          autoPlay={false}
          ref={animationRef}
          loop={false}
          style={{ flex: 1 }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="CONFIRM APPOINTMENT"
          onPress={bookAppointment}
          disabled={!(selectedDate && selectedTime && patientName.trim())}
          color="#0099ff"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
    minHeight: SCREEN_HEIGHT - 120,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  timeSlotGrid: {
    marginTop: 8,
    marginBottom: 24,
  },
  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  slot: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    minHeight: 44,
    backgroundColor: "#fff",
  },
  slotActive: {
    backgroundColor: "#00adf5",
    borderColor: "#00adf5",
  },
  slotText: {
    color: "#333",
    fontSize: 16,
  },
  slotTextActive: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  lottieContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: -1,   // <--- Safety!
  },
});
