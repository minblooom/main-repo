// src/screens/home/components/GreetingSection.jsx
// Warm Swahili/English/Sheng welcoming greeting matching the Figma home sanctuary.
// Fully integrated with dynamic theme context and localization.

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { styles } from '../styles/GreetingSection.styles';

export const GreetingSection = ({ userName = 'friend' }) => {
  const { theme } = useTheme();
  const { t } = useI18n();

  const title = t('greeting_title').replace('{name}', userName || 'friend');

  return (
    <View style={styles.container}>
      <Text style={[styles.overline, { color: theme.textMuted }]}>
        {t('greeting_overline')}
      </Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t('greeting_subtitle')}
      </Text>
    </View>
  );
};
