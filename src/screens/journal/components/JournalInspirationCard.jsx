// src/screens/journal/components/JournalInspirationCard.jsx
// Soft lavender encouragement card matching the Figma design

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/JournalInspirationCard.styles';
export const JournalInspirationCard = ({ companionName = 'Noodle' }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.quote}>
        Some days, one line is a whole beginning.
      </Text>
      <Text style={styles.subtext}>
        Polepole. {companionName} and your journal can wait until you feel ready.
      </Text>
    </View>
  );
};

