// src/features/community/encouragement/GardenStrip.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/GardenStrip.styles';

export const GardenStrip = ({ plants = [], streak = 0 }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.strip}>
        {plants.map((p, idx) => (
          <View key={p.id || idx} style={styles.plantWrap}>
            <View style={styles.plantArea}>
              {p.stage === 'blooming' ? (
                <>
                  <View style={[styles.stem, { height: 20, backgroundColor: theme.accent || '#5B8A72' }]} />
                  <View style={[styles.bloom, { backgroundColor: '#E07A5F' }]} />
                </>
              ) : (
                <View style={[styles.seed, { backgroundColor: theme.accent || '#8A7A6B' }]} />
              )}
            </View>
            <View style={[styles.soil, { backgroundColor: theme.cardBg, borderColor: theme.divider }]} />
          </View>
        ))}
      </View>
      {streak > 0 && (
        <Text style={[styles.streak, { color: theme.accent }]}>
          {streak} gentle day streak in the garden 🌿
        </Text>
      )}
    </View>
  );
};
