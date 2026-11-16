// src/screens/home/components/GreetingSection.jsx
// Warm Swahili welcoming greeting matching the Figma home sanctuary

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const GreetingSection = ({ userName = 'soso' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.overline}>POLEPOLE, ONE MOMENT AT A TIME.</Text>
      <Text style={styles.title}>
        Sema, {userName}. Make yourself at home.
      </Text>
      <Text style={styles.subtitle}>
        Whatever today feels like, there's a little space for you here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  overline: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
});
