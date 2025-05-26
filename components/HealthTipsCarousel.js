import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, Animated } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const tips = [
  {
    id: "1",
    title: "EAT MORE\nFRUITS AND\nVEGETABLES",
    description: "Fruits and vegetables are rich in vitamins, minerals, and fiber. They help reduce the risk of chronic diseases and promote good health.",
    image: require("../assets/images/Fruits.jpg"),
  },
  {
    id: "2",
    title: "STAY\nHYDRATED",
    description: "Drink at least 8–10 glasses of water daily to keep your body functioning well and maintain energy levels throughout the day.",
    image: require("../assets/images/water.jpg"),
  },
  {
    id: "3",
    title: "EXERCISE\nDAILY",
    description: "Regular physical activity, even a brisk 20-minute walk, enhances heart health, improves mood, and strengthens muscles.",
    image: require("../assets/images/Exercise.jpg"),
  },
  {
    id: "4",
    title: "WASH\nHANDS\nOFTEN",
    description: "Handwashing with soap is one of the most effective ways to prevent the spread of germs and infectious diseases.",
    image: require("../assets/images/handwash.jpg"),
  },
  {
    id: "5",
    title: "LIMIT\nSCREEN TIME",
    description: "Prolonged screen time can cause eye strain, fatigue, and sleep issues. Take breaks and set screen-time limits.",
    image: require("../assets/images/screen-time.jpg"),
  },
  {
    id: "6",
    title: "SLEEP\nWELL",
    description: "Aim for 7–9 hours of sleep each night. Good sleep improves concentration, supports immunity, and promotes recovery.",
    image: require("../assets/images/Sleep.jpg"),
  },
  {
    id: "7",
    title: "LIMIT\nJUNK FOOD",
    description: "Reduce intake of sugary, salty, and fried foods to maintain a healthy weight and lower the risk of chronic diseases.",
    image: require("../assets/images/Junk-food.jpg"),
  },
  {
    id: "8",
    title: "PROTECT\nFROM SUN",
    description: "Wear sunscreen and protective clothing when outdoors. Avoid long exposure to UV rays to prevent skin damage.",
    image: require("../assets/images/sunscreen.jpg"),
  },
  {
    id: "9",
    title: "MENTAL\nHEALTH\nMATTERS",
    description: "Practice mindfulness, talk to loved ones, and seek help when overwhelmed. Mental health is as important as physical health.",
    image: require("../assets/images/mental-health.jpg"),
  },
  {
    id: "10",
    title: "MAINTAIN\nGOOD\nPOSTURE",
    description: "Sit upright with your shoulders relaxed and avoid slouching to prevent back pain and support spinal health.",
    image: require("../assets/images/posture.jpg"),
  },
];

export default function HealthTipsCarousel() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      fadeOutIn(() => {
        const nextIndex = (currentIndex + 1) % tips.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const fadeOutIn = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/healthtip-details",
          params: {
            title: item.title.replace(/\n/g, " "),
            description: item.description,
            image: Image.resolveAssetSource(item.image).uri,
          },
        })
      }
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <View style={styles.row}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={tips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      <View style={styles.indicators}>
        {tips.map((_, index) => (
          <View key={index} style={[styles.dot, index === currentIndex ? styles.activeDot : null]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 0,
    paddingBottom: 0,
    height: 200,
  },
  card: {
    backgroundColor: "#ffe9d6",
    borderRadius: 24,
    width: width * 0.94,
    marginHorizontal: width * 0.03,
    padding: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: width * 0.38,
    height: 140,
    borderRadius: 12,
    marginRight: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    flexShrink: 1,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});
