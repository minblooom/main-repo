// src/features/community/components/CommunityHeader.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './styles/CommunityHeader.styles';

export const CommunityHeader = ({ eyebrow, title, subtitle }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      {!!eyebrow && <Text style={[styles.eyebrow, { color: theme.textMuted }]}>{eyebrow}</Text>}
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
};