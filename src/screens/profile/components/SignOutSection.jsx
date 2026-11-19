// src/screens/profile/components/SignOutSection.jsx
// "Step away for a moment" action and calm footer text
// Clean English text and dynamic theme integration.

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const SignOutSection = ({ onSignOut }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
        onPress={onSignOut}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: theme.textPrimary }]}>Step away for a moment</Text>
      </TouchableOpacity>

      <Text style={[styles.footerText, { color: theme.textMuted }]}>
        MindBloom · Pure Bliss · Nakazi Sanctuary 1E
      </Text>
    </View>
  );
};

import { styles } from '../styles/SignOutSection.styles';
