// src/screens/journal/components/JournalInspirationCard.jsx
// Soft lavender encouragement card matching the Figma design

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const JournalInspirationCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.quote}>
        Some days, one line is a whole beginning.
      </Text>
      <Text style={styles.subtext}>
        Polepole. Your journal can wait until you feel ready.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0EAFA',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DFD5F0',
    gap: 8,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: {
    fontSize: 16,
    color: colors.brand,
  },
  quote: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#2E1E3B',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  subtext: {
    fontSize: 12,
    color: '#6E5D87',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
