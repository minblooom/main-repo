// src/features/community/components/MilestoneCard.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/MilestoneCard.styles';

const MILESTONES = [
  { days: 3, message: 'Three days in a row. Consistency is taking root.' },
  { days: 7, message: 'A full week of showing up. That’s real momentum.' },
  { days: 14, message: 'Two weeks of small steps. You’ve built something steady.' },
];

// Derived from the best current streak, so nothing extra is stored
export const MilestoneCard = ({ streak }) => {
  const { theme } = useTheme();
  const reached = [...MILESTONES].reverse().find((m) => streak >= m.days);
  if (!reached) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]} accessibilityLiveRegion="polite">
      <Text style={[styles.kicker, { color: theme.accent }]}>MILESTONE · {reached.days} DAYS</Text>
      <Text style={[styles.body, { color: theme.textPrimary }]}>{reached.message}</Text>
    </View>
  );
};