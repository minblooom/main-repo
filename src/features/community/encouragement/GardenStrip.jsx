// src/features/community/encouragement/GardenStrip.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/GardenStrip.styles';

const WIN_BADGES = [
  { icon: '🌸', bg: '#FCE7F3', border: '#FBCFE8' },
  { icon: '🏆', bg: '#FEF3C7', border: '#FDE68A' },
  { icon: '🌻', bg: '#FFFBEB', border: '#FDE68A' },
  { icon: '🏅', bg: '#EDE9FE', border: '#DDD6FE' },
  { icon: '🌺', bg: '#FFE4E6', border: '#FECDD3' },
  { icon: '💐', bg: '#ECFDF5', border: '#A7F3D0' },
];

export const GardenStrip = ({ plants = [], streak = 0 }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.strip, { flexWrap: 'wrap', gap: 10, justifyContent: 'center' }]}>
        {plants.map((p, idx) => {
          const badge = WIN_BADGES[idx % WIN_BADGES.length];
          return (
            <View
              key={p.id || idx}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: p.stage === 'blooming' ? badge.bg : theme.cardBg,
                borderWidth: 1.5,
                borderColor: p.stage === 'blooming' ? badge.border : theme.divider,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 22 }}>
                {p.stage === 'blooming' ? badge.icon : '🌱'}
              </Text>
            </View>
          );
        })}
      </View>
      {streak > 0 && (
        <Text style={[styles.streak, { color: theme.accent }]}>
          {plants.length} {plants.length === 1 ? 'victory' : 'victories'} blooming · {streak} gentle day streak 🏆🌸
        </Text>
      )}
    </View>
  );
};
