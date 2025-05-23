// app/(tabs)/chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from 'react-native';
import axios, { AxiosResponse } from 'axios';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const OPENAI_API_KEY =
    'API_PUT_HERE';

const DoctorImage = require('../../assets/chatbot/medical_doctor.png');
const { width } = Dimensions.get('window');

type Message = { sender: 'user' | 'bot'; text: string };

// Exponential-backoff retry helper
async function callOpenAIWithRetry(
    body: Record<string, any>,
    headers: Record<string, string>,
    maxRetries = 3
): Promise<AxiosResponse<any>> {
    let attempt = 0;
    while (true) {
        try {
            return await axios.post(
                'https://api.openai.com/v1/chat/completions',
                body,
                { headers }
            );
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 429 && attempt < maxRetries) {
                const backoff = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
                await new Promise((r) => setTimeout(r, backoff));
                attempt++;
                continue;
            }
            throw err;
        }
    }
}

export default function ChatbotScreen() {
    const insets = useSafeAreaInsets();
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    const tint = Colors[useColorScheme() ?? 'light'].tint;

    // Auto-scroll when new message arrives
    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [history, loading]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        // 1) Add user message to history
        setHistory((h) => [...h, { sender: 'user', text }]);
        setInput('');
        setLoading(true);

        try {
            // 2) Only keep last 4 messages to save tokens
            const recent = history.slice(-4).flatMap((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
            }));

            const body = {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful medical assistant.' },
                    ...recent,
                    { role: 'user', content: text },
                ],
                temperature: 0.7,
                max_tokens: 150,
            };

            const headers = {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            };

            // 3) Call OpenAI with retry logic
            const resp = await callOpenAIWithRetry(body, headers);
            const botReply = resp.data.choices[0].message.content.trim();

            // 4) Add bot reply to history
            setHistory((h) => [...h, { sender: 'bot', text: botReply }]);
        } catch (err) {
            console.error(err);
            setHistory((h) => [
                ...h,
                {
                    sender: 'bot',
                    text: 'Sorry, something went wrong. Please try again later.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Layout offsets
    const TAB_BAR_HEIGHT = 70;
    const EXTRA_LIFT = 20;
    const bottomOffset = insets.bottom + TAB_BAR_HEIGHT + EXTRA_LIFT;
    const IMAGE_SIZE = width * 0.6;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Robot illustration */}
            <View style={styles.imageContainer}>
                <Image
                    source={DoctorImage}
                    style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
                    resizeMode="contain"
                />
            </View>

            {/* Chat history “card” */}
            <View style={[styles.chatCard, { marginBottom: bottomOffset + 60 }]}>
                <ScrollView ref={scrollRef} contentContainerStyle={styles.history}>
                    {history.length === 0 && !loading && (
                        <Text style={styles.placeholder}>
                            Say hi to Dr. Bot below…
                        </Text>
                    )}
                    {history.map((m, i) => (
                        <View
                            key={i}
                            style={[
                                styles.bubble,
                                m.sender === 'user' ? styles.bubbleUser : styles.bubbleBot,
                            ]}
                        >
                            <Text style={m.sender === 'user' ? styles.textUser : styles.textBot}>
                                {m.text}
                            </Text>
                        </View>
                    ))}
                    {loading && <ActivityIndicator color={tint} style={{ marginTop: 8 }} />}
                </ScrollView>
            </View>

            {/* Input row (absolute) */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View
                    style={[
                        styles.inputRow,
                        {
                            position: 'absolute',
                            left: 16,
                            right: 16,
                            bottom: bottomOffset,
                        },
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
                        style={[styles.sendBtn, { backgroundColor: loading ? '#aaa' : tint }]}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: { alignItems: 'center', marginTop: 8, marginBottom: 12 },

    chatCard: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        padding: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    history: { flexGrow: 1 },
    placeholder: {
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic',
        marginTop: 24,
    },

    bubble: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
    bubbleUser: { backgroundColor: '#E1FFC7', alignSelf: 'flex-end' },
    bubbleBot: { backgroundColor: '#fff', alignSelf: 'flex-start' },
    textUser: { color: '#333' },
    textBot: { color: '#333' },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 30,
        padding: 8,
    },
    input: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    sendBtn: {
        marginLeft: 8,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
