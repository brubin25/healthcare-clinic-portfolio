import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

type Tip = { id: string; title: string; tip: string };

const tipsForEveryone: Tip[] = [
  { id: '1', title: 'Stay Hydrated', tip: 'Drink 8-10 glasses of water daily.' },
  { id: '2', title: 'Balanced Diet', tip: 'Eat fruits, grains, and proteins regularly.' },
  { id: '3', title: 'Daily Walk', tip: 'Try walking for 20 minutes every morning.' },
  { id: '4', title: 'Stretch Often', tip: 'Stand and stretch every hour if sitting for long.' },
  { id: '5', title: 'Limit Sugar', tip: 'Avoid sugary drinks and snacks for better health.' },
];

const tipsForKids: Tip[] = [
  { id: '4', title: 'Limit Screen Time', tip: 'Keep screen use under 1 hour/day.' },
  { id: '5', title: 'Wash Hands Often', tip: 'Make handwashing a fun habit.' },
  { id: '6', title: 'Bedtime Reading', tip: 'Helps kids sleep better and learn.' },
];

const tipsForOlderAdults: Tip[] = [
  { id: '7', title: 'Gentle Yoga', tip: 'Improves flexibility and reduces joint pain.' },
  { id: '8', title: 'Stay Social', tip: 'Connect with others to reduce loneliness.' },
  { id: '9', title: 'Health Checkups', tip: 'Monitor blood pressure and sugar regularly.' },
];

const renderTips = (title: string, tips: Tip[]) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {tips.map((item) => (
      <View key={item.id} style={styles.tipCard}>
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipText}>{item.tip}</Text>
      </View>
    ))}
  </View>
);

export default function HealthCarouselScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Health Tips</Text>
      {renderTips('Tips for Everyone', tipsForEveryone)}
      {renderTips('Tips for Kids', tipsForKids)}
      {renderTips('Tips for Older Adults', tipsForOlderAdults)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  tipCard: {
    backgroundColor: '#e0f7fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipText: {
    marginTop: 4,
    fontSize: 14,
  },
});