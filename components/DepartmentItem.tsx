import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ListRenderItemInfo, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { Animated } from "react-native";

export interface Department {
  id: keyof typeof iconMap;
  name: string;
}

export const iconMap = {
  cardiology: "heartbeat",
  neurology: "brain",
  orthopedics: "bone",
  pediatrics: "baby",
  dermatology: "hand-paper",
  radiology: "radiation",
};

interface DepartmentItemProps {
  item: Department;
  onPressOut: () => void;
}
export default function DepartmentItem({ item, onPressOut }: DepartmentItemProps) {
  const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);
  const animation = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.sequence([
      Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    }),
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.in(Easing.quad),
    })
    ]).start(() => setTimeout(onPressOut, 200));
  };

  const animatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#007AFF", "red"],
  });

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const animatedIconStyle = {
    transform: [{ scale: animatedScale }],
  };

  return (
    <TouchableOpacity style={styles.card} onPressIn={handlePressIn} >
      <AnimatedIcon name={iconMap[item.id]} size={100} color={animatedColor} style={[styles.icon, animatedIconStyle]} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
