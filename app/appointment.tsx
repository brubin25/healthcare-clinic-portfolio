import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ActivityIndicator, StyleSheet, Alert,
  TouchableOpacity, TextInput, ScrollView, Dimensions, Animated,
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
  const department = params?.department as string | undefined;

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
          await db.execAsync(`DROP TABLE IF EXISTS appointments;`);
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS appointments (
              id   INTEGER PRIMARY KEY AUTOINCREMENT,
              patientName TEXT NOT NULL,
              doctorId TEXT NOT NULL,
              doctorName TEXT,
              department TEXT,
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
          department ?? "General",
          selectedDate,
          selectedTime
        );
      });
      Alert.alert(
        "Success",
        `Your appointment is set for ${selectedDate} at ${selectedTime}!`,
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/appointments-list");
            }
          }
        ]
      );
    } catch (err) {
      console.error("Booking failed", err);
      Alert.alert("Error", "Could not save your appointment");
    }
  };

  // Animated scale for slot press feedback
  function AnimatedSlot({ slot, isActive, onPress }: { slot: string, isActive: boolean, onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ flex: 1, marginHorizontal: 4 }}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.slot,
            isActive && styles.slotActive,
            { transform: [{ scale }] }
          ]}
        >
          <Text style={isActive ? styles.slotTextActive : styles.slotText}>{slot}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  function renderTimeSlots() {
    const rows: JSX.Element[] = [];
    for (let i = 0; i < timeSlots.length; i += 4) {
      rows.push(
        <View key={i} style={styles.slotRow}>
          {timeSlots.slice(i, i + 4).map((slot) => (
            <AnimatedSlot
              key={slot}
              slot={slot}
              isActive={slot === selectedTime}
              onPress={() => setSelectedTime(slot)}
            />
          ))}
        </View>
      );
    }
    return rows;
  }

  if (!dbReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3cc3fa" />
        <Text style={{ color: "#999" }}>Setting things up…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.bigHeading}>Book with <Text style={{ color: "#3cc3fa" }}>{doctorName || "Doctor"}</Text></Text>
        <TextInput
          placeholder="Enter your name"
          value={patientName}
          onChangeText={setPatientName}
          style={styles.input}
          placeholderTextColor="#bbb"
        />

        <Text style={styles.heading}>Pick a Date</Text>
        <View style={styles.calendarShadow}>
          <Calendar
            markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#3cc3fa", disableTouchEvent: true } } : {}}
            onDayPress={(day: DateData) => {
              setSelectedDate(day.dateString);
              setSelectedTime(null);
            }}
            style={styles.calendar}
            theme={{
              selectedDayBackgroundColor: "#3cc3fa",
              todayTextColor: "#3cc3fa",
              arrowColor: "#3cc3fa",
              monthTextColor: "#222",
              dayTextColor: "#333",
              textSectionTitleColor: "#3cc3fa"
            }}
          />
        </View>
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
        pointerEvents="none"
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
        <TouchableOpacity
          activeOpacity={!(selectedDate && selectedTime && patientName.trim()) ? 1 : 0.8}
          style={[
            styles.confirmButton,
            !(selectedDate && selectedTime && patientName.trim()) && { opacity: 0.5 }
          ]}
          onPress={bookAppointment}
          disabled={!(selectedDate && selectedTime && patientName.trim())}
        >
          <Text style={styles.buttonText}>CONFIRM APPOINTMENT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafdff",
  },
  safe: {
    flex: 1,
    backgroundColor: "#fafdff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
    minHeight: SCREEN_HEIGHT - 120,
  },
  bigHeading: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
    textAlign: "center",
    color: "#222",
    letterSpacing: 0.15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3cc3fa",
    borderRadius: 8,
    padding: 12,
    marginVertical: 14,
    fontSize: 18,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#3cc3fa",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  calendarShadow: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#3cc3fa",
    shadowOpacity: 0.09,
    shadowRadius: 5,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  calendar: {
    borderWidth: 0,
    borderRadius: 12,
  },
  timeSlotGrid: {
    marginTop: 8,
    marginBottom: 32,
  },

  slotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  slot: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#d7e4ec",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 65,
    minHeight: 48,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#3cc3fa",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  slotActive: {
    backgroundColor: "#3cc3fa",
    borderColor: "#00c4cc",
    elevation: 4,
    shadowColor: "#3cc3fa",
    shadowOpacity: 0.19,
    shadowRadius: 6,
  },
  slotText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  slotTextActive: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.1,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafdff",
    shadowColor: "#222",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
  confirmButton: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#3cc3fa",
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#3cc3fa",
    shadowOpacity: 0.11,
    shadowRadius: 9,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1.2,
  },
  lottieContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    opacity: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: -1,
  },
});
