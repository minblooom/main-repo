// src/screens/profile/components/CustomizeCompanionBanner.jsx
// Companion quick card: "A little courage, beside you. / Customize <Companion> ->"
// Clean English text and dynamic theme integration.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { COMPANION_MAP } from '../../../constants/companions';
import { useTheme } from '../../../theme/ThemeContext';

export const CustomizeCompanionBanner = ({ companionId, onPress }) => {
  const { theme } = useTheme();
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP['noodle'];

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.avatarWrap, { backgroundColor: companion.accent }]}>
        <AnimatedCompanion
          companionId={companionId}
          state="happy"
          size={46}
          showAura={false}
          interactive={false}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          A little courage, beside you.
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Customize {companion.name}
        </Text>
      </View>

      <Text style={[styles.arrow, { color: theme.textMuted }]}>›</Text>
    </TouchableOpacity>
  );
};

import { styles } from '../styles/CustomizeCompanionBanner.styles';
