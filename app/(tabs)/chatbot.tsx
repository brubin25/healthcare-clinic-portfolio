// app/(tabs)/chatbot.tsx
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const OPENAI_API_KEY = "API_KEY";
const { width } = Dimensions.get("window");

// --- simple keyword→department mapping ---
const keywordMap: Record<string, string> = {
    skin: "dermatology",
    rash: "dermatology",
    allergy: "dermatology",
    heart: "cardiology",
    chest: "cardiology",
    cardio: "cardiology",
    brain: "neurology",
    headache: "neurology",
    nerve: "neurology",
    bone: "orthopedics",
    joint: "orthopedics",
    child: "pediatrics",
    kid: "pediatrics",
    xray: "radiology",
    scan: "radiology",
};

// --- minimal dept metadata ---
const departments: Record<string, { label: string; icon: any; route: string }> = {
    cardiology: {
        label: "Cardiology",
        icon: require("../../assets/icons/cardiology.png"),
        route: "/department/cardiology",
    },
    neurology: {
        label: "Neurology",
        icon: require("../../assets/icons/neurology.png"),
        route: "/department/neurology",
    },
    orthopedics: {
        label: "Orthopedics",
        icon: require("../../assets/icons/orthopedics.png"),
        route: "/department/orthopedics",
    },
    pediatrics: {
        label: "Pediatrics",
        icon: require("../../assets/icons/pediatrics.png"),
        route: "/department/pediatrics",
    },
    dermatology: {
        label: "Dermatology",
        icon: require("../../assets/icons/dermatology.png"),
        route: "/department/dermatology",
    },
    radiology: {
        label: "Radiology",
        icon: require("../../assets/icons/radiology.png"),
        route: "/department/radiology",
    },
};

// --- minimal doctor list by dept for suggestions ---
const doctorsByDept: Record<string, Array<{ id: string; name: string; photo: any }>> = {
    dermatology: [
        {
            id: "dermatology-1",
            name: "Dr. Nancy Skin",
            photo: require("../../assets/doctors/dr_nancy.jpg"),
        },
    ],
    cardiology: [
        {
            id: "cardiology-1",
            name: "Dr. Alice Heart",
            photo: require("../../assets/doctors/dr_alice.jpg"),
        },
    ],
    neurology: [
        {
            id: "neurology-1",
            name: "Dr. Carol Brain",
            photo: require("../../assets/doctors/dr_carol.jpg"),
        },
    ],
    orthopedics: [
        {
            id: "orthopedics-1",
            name: "Dr. Helen Bone",
            photo: require("../../assets/doctors/dr_helen.jpg"),
        },
    ],
    pediatrics: [
        {
            id: "pediatrics-1",
            name: "Dr. Lily Kids",
            photo: require("../../assets/doctors/dr_lily.jpg"),
        },
    ],
    radiology: [
        {
            id: "radiology-1",
            name: "Dr. Rachel Xray",
            photo: require("../../assets/doctors/dr_rachel.jpg"),
        },
    ],
};

type Message = { sender: "user" | "bot"; text: string };

export default function ChatbotScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const tint = Colors[colorScheme ?? "light"].tint;

    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeDept, setActiveDept] = useState<string | null>(null);

    const scrollRef = useRef<ScrollView>(null);

    // auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [history, loading]);

    // Basic retry helper
    async function callOpenAI(body: any) {
        const headers = {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        };
        for (let i = 0; i < 3; i++) {
            try {
                return await axios.post("https://api.openai.com/v1/chat/completions", body, {
                    headers,
                });
            } catch (err: any) {
                if (err.response?.status === 429) {
                    await new Promise((r) => setTimeout(r, 2 ** i * 1000));
                    continue;
                }
                throw err;
            }
        }
        throw new Error("Rate limited");
    }

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        // 1) Show user message
        setHistory((h) => [...h, { sender: "user", text }]);
        setInput("");
        setLoading(true);

        // 2) Quick keyword scan for department
        const lower = text.toLowerCase();
        const foundKey = Object.keys(keywordMap).find((k) => lower.includes(k));
        if (foundKey) {
            setActiveDept(keywordMap[foundKey]);
        }

        // 3) Send to OpenAI
        try {
            const recent = history
                .slice(-4)
                .map((m) => ({
                    role: m.sender === "user" ? "user" : "assistant",
                    content: m.text,
                }));

            const body = {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful medical assistant." },
                    ...recent,
                    { role: "user", content: text },
                ],
                temperature: 0.7,
                max_tokens: 150,
            };

            const resp = await callOpenAI(body);
            const reply = resp.data.choices[0].message.content.trim();
            setHistory((h) => [...h, { sender: "bot", text: reply }]);
        } catch (err) {
            console.error(err);
            setHistory((h) => [
                ...h,
                { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const TAB_BAR_HEIGHT = 70;
    const EXTRA = 20;
    const bottomOffset = insets.bottom + TAB_BAR_HEIGHT + EXTRA;
    const IMAGE_SZ = width * 0.6;

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/** Suggestion Card */}
            {activeDept && (
                <View style={styles.suggestionCard}>
                    <TouchableOpacity
                        style={styles.suggestionHeader}
                        onPress={() => router.push(departments[activeDept].route)}
                    >
                        <Image source={departments[activeDept].icon} style={styles.suggIcon} />
                        <Text style={styles.suggTitle}>
                            You may want our {departments[activeDept].label} department
                        </Text>
                    </TouchableOpacity>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {doctorsByDept[activeDept].map((doc) => (
                            <TouchableOpacity
                                key={doc.id}
                                style={styles.suggDocCard}
                                onPress={() => router.push(`/doctor/${doc.id}`)}
                            >
                                <Image source={doc.photo} style={styles.suggDocPhoto} />
                                <Text style={styles.suggDocName}>{doc.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/** Bot illustration */}
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../assets/chatbot/medical_doctor.png")}
                    style={{ width: IMAGE_SZ, height: IMAGE_SZ }}
                    resizeMode="contain"
                />
            </View>

            {/** Chat history */}
            <View style={[styles.chatCard, { marginBottom: bottomOffset + 60 }]}>
                <ScrollView ref={scrollRef} contentContainerStyle={styles.history}>
                    {history.length === 0 && !loading && (
                        <Text style={styles.placeholder}>Say hi to Dr. Bot below…</Text>
                    )}
                    {history.map((m, i) => (
                        <View
                            key={i}
                            style={[
                                styles.bubble,
                                m.sender === "user" ? styles.bubbleUser : styles.bubbleBot,
                            ]}
                        >
                            <Text style={m.sender === "user" ? styles.textUser : styles.textBot}>
                                {m.text}
                            </Text>
                        </View>
                    ))}
                    {loading && <ActivityIndicator color={tint} style={{ marginTop: 8 }} />}
                </ScrollView>
            </View>

            {/** Input row */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <View
                    style={[
                        styles.inputRow,
                        { position: "absolute", left: 16, right: 16, bottom: bottomOffset },
                    ]}
                >
                    <TextInput
                        style={[styles.input, { borderColor: tint }]}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Type message here…"
                        placeholderTextColor="#888"
                        editable={!loading}
                        returnKeyType="send"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: loading ? "#aaa" : tint }]}
                        onPress={sendMessage}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <IconSymbol name="paperplane.fill" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const PHOTO_SZ = 60;
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    suggestionCard: {
        margin: 16,
        padding: 12,
        backgroundColor: "#F0F8FF",
        borderRadius: 10,
    },
    suggestionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    suggIcon: { width: 28, height: 28, marginRight: 8 },
    suggTitle: { fontSize: 16, fontWeight: "600" },

    suggDocCard: {
        width: PHOTO_SZ,
        marginRight: 12,
        alignItems: "center",
    },
    suggDocPhoto: {
        width: PHOTO_SZ,
        height: PHOTO_SZ,
        borderRadius: PHOTO_SZ / 2,
    },
    suggDocName: { marginTop: 4, fontSize: 12, textAlign: "center" },

    imageContainer: { alignItems: "center", marginBottom: 12 },

    chatCard: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: "#F5F7FA",
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
            android: { elevation: 3 },
        }),
    },
    history: { flexGrow: 1 },
    placeholder: { textAlign: "center", color: "#888", fontStyle: "italic", marginTop: 24 },

    bubble: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: "80%" },
    bubbleUser: { backgroundColor: "#E1FFC7", alignSelf: "flex-end" },
    bubbleBot: { backgroundColor: "#fff", alignSelf: "flex-start" },
    textUser: { color: "#333" },
    textBot: { color: "#333" },

    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 30,
        padding: 8,
    },
    input: { flex: 1, height: 44, borderWidth: 1, borderRadius: 22, paddingHorizontal: 16, fontSize: 16, backgroundColor: "#fff" },
    sendBtn: { marginLeft: 8, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
