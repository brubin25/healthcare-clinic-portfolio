import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { openDatabaseAsync } from "expo-sqlite";

const dbPromise = openDatabaseAsync("appointments.db");

export default function AppointmentPage() {
  const router = useRouter();
  const [dbReady, setDbReady] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = await dbPromise;
        await db.withTransactionAsync(async () => {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS appointments (
              id   INTEGER PRIMARY KEY AUTOINCREMENT,
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

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Pick a date and time first");
      return;
    }
    try {
      const db = await dbPromise;
      await db.withTransactionAsync(async () => {
        await db.runAsync("INSERT INTO appointments (date, time) VALUES (?, ?);", selectedDate, selectedTime);
      });
      Alert.alert("Success", `Your appointment is set for ${selectedDate} at ${selectedTime}!`);
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Booking failed", err);
      Alert.alert("Error", "Could not save your appointment");
    }
  };

  // While DB is initializing, show spinner
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
      {/* All your scrollable calendar + slots live here */}
      <View style={styles.content}>
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
            <FlatList
              data={timeSlots}
              keyExtractor={(t) => t}
              numColumns={4}
              contentContainerStyle={styles.slotsContainer}
              renderItem={({ item: slot }) => {
                const isActive = slot === selectedTime;
                return (
                  <TouchableOpacity style={[styles.slot, isActive && styles.slotActive]} onPress={() => setSelectedTime(slot)}>
                    <Text style={isActive ? styles.slotTextActive : styles.slotText}>{slot}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}
      </View>

      {/* Fixed bottom area for the button */}
      <View style={styles.buttonContainer}>
        <Button title="Confirm Appointment" onPress={bookAppointment} disabled={!(selectedDate && selectedTime)} />
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  slotsContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  slot: {
    flex: 1,
    margin: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 6,
    alignItems: "center",
  },
  slotActive: {
    backgroundColor: "#00adf5",
    borderColor: "#00adf5",
  },
  slotText: {
    color: "#333",
  },
  slotTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
