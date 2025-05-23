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
  { id: '1', title: 'Stay Hydrated', tip: 'Drink at least 8 glasses of water daily.' },
  { id: '2', title: 'Exercise Regularly', tip: 'Do 30 minutes of exercise every day.' },
  { id: '3', title: 'Eat Fruits & Veggies', tip: 'Aim for 5 servings a day.' },
  { id: '4', title: 'Sleep Well', tip: 'Get 7-8 hours of sleep every night.' },
  { id: '5', title: 'Wash Hands', tip: 'Wash hands regularly to prevent illness.' },
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