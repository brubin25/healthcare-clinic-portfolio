import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 60;

const healthTips = [
  { id: '1', title: 'Stay Hydrated', tip: 'Drink 8-10 glasses of water daily.' },
  { id: '2', title: 'Morning Walk', tip: 'Start your day with a light 20-min walk.' },
  { id: '3', title: 'Stretch Often', tip: 'Stretch your body every few hours.' },
  { id: '4', title: 'Balanced Diet', tip: 'Include fruits, grains, and proteins daily.' },
  { id: '5', title: 'Sleep Routine', tip: 'Stick to a consistent 7-8 hour sleep schedule.' },
  { id: '6', title: 'Avoid Sugary Snacks', tip: 'Especially important for kids and seniors.' },
  { id: '7', title: 'Screen Time Limit (Kids)', tip: 'Limit screen use to 1 hour/day for kids.' },
  { id: '8', title: 'Bedtime Reading (Kids)', tip: 'Encourages sleep and builds imagination.' },
  { id: '9', title: 'Handwashing (Kids)', tip: 'Make handwashing a fun habit.' },
  { id: '10', title: 'Gentle Yoga (Older Adults)', tip: 'Boosts flexibility and reduces joint pain.' },
  { id: '11', title: 'Regular Checkups (Older Adults)', tip: 'Monitor blood pressure and sugar levels.' },
  { id: '12', title: 'Social Time (Older Adults)', tip: 'Connect with others to reduce loneliness.' },
];

const HealthTipsCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Animated.FlatList
      data={healthTips}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.9, 1, 0.9],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 1, 0.6],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.tip}>{item.tip}</Text>
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: ITEM_WIDTH,
    marginHorizontal: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HealthTipsCarousel;