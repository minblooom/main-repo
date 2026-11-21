// src/screens/home/components/GreetingSection.jsx
// Warm Swahili welcoming greeting matching the Figma home sanctuary.
// Fully integrated with dynamic theme context.

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/GreetingSection.styles';

export const GreetingSection = ({ userName = 'soso' }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.overline, { color: theme.textMuted }]}>POLEPOLE, ONE MOMENT AT A TIME.</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Sema, {userName}. Make yourself at home.
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Whatever today feels like, there's a little space for you here.
      </Text>
    </View>
  );
};
