// src/features/community/components/BackButton.jsx
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/BackButton.styles';

export const BackButton = ({ label = '‹ Community', onPress }) => {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label.replace('‹ ', '')}`}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.text, { color: theme.accent }]}>{label}</Text>
    </Pressable>
  );
};