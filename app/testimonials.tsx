import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const testimonials = [
    {
        id: 1,
        name: "Emily R.",
        date: "March 12, 2024",
        image: require("../assets/testimonials/testimonial1.png"),
        text:
            "Took my 8-year-old daughter for a UTI. The staff was phenomenal and better with kids than most places just for kids. Wish I got their names but the lady at check-in and the nurse or MA who took her vitals — you ladies deserve a raise and recognition for your excellent attitudes and service. Much obliged.",
    },
    {
        id: 2,
        name: "Jason T.",
        date: "June 4, 2024",
        image: require("../assets/testimonials/testimonial2.png"),
        text:
            "My 7-year-old son just went for his 2nd visit to AuroraClinic. Both visits were on a Sunday evening. We were in and out in under an hour both times, with hardly any wait time. Even for a weekend night, the staff was super friendly and kind, from check-in to check out. Everyone made sure he got a Popsicle and stickers and said they hoped he felt better. A note for school was ready at check out. The prescription was ready as soon as we got to the pharmacy. I cannot say enough good things. I've told everyone I know what a great place this is!",
    },
    {
        id: 3,
        name: "Clara S.",
        date: "August 9, 2024",
        image: require("../assets/testimonials/testimonial3.png"),
        text:
            "The clinic was spotless and well-organized. I came in for a routine check-up and the process was quick, smooth, and professional. The doctor explained everything clearly, and I left feeling reassured and cared for. Highly recommended!",
    },
    {
        id: 4,
        name: "Michael Y.",
        date: "January 21, 2025",
        image: require("../assets/testimonials/testimonial4.png"),
        text:
            "I brought my elderly father here for his annual exam. The team was incredibly patient and thorough. They treated him with respect and dignity, which means a lot to us. Thank you, AuroraClinic, for the outstanding care!",
    },
    {
        id: 5,
        name: "Diana V.",
        date: "February 3, 2025",
        image: require("../assets/testimonials/testimonial5.png"),
        text:
            "From the moment I walked in, I felt welcomed and safe. Booking was easy, the wait time minimal, and the nurse practitioner was empathetic and attentive. I truly appreciate the level of care and professionalism. Will be back for future appointments!",
    },
];

export default function TestimonialsPage() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require("../assets/testimonials/testimonial-clinic.png")}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>What Our Patients Say</Text>

            {testimonials.map((item) => (
                <View key={item.id} style={styles.card}>
                    <Image source={item.image} style={styles.testimonialImage} resizeMode="cover" />
                    <Text style={styles.quoteIcon}>“</Text>
                    <Text style={styles.text}>{item.text}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                    <View style={styles.starsRow}>
                        {[...Array(5)].map((_, i) => (
                            <FontAwesome key={i} name="star" size={16} color="#f5c518" style={styles.starIcon} />
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0077b6",
        marginBottom: 24,
        textTransform: "capitalize",
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 12,
        borderRadius: 60,
        overflow: "hidden",
    },
    testimonialImage: {
        width: "100%",
        height: 160,
        borderRadius: 12,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        width: screenWidth * 0.9,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quoteIcon: {
        fontSize: 32,
        color: "#0aa",
        marginBottom: 10,
        textAlign: "center",
    },
    text: {
        fontSize: 16,
        color: "#333",
        textAlign: "justify",
        marginBottom: 10,
    },
    name: {
        fontWeight: "600",
        fontSize: 16,
        marginTop: 4,
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    starsRow: {
        flexDirection: "row",
        marginTop: 4,
    },
    starIcon: {
        marginRight: 2,
    },
});
