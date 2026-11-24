// src/screens/profile/components/ProfileHeader.jsx
// Top bar: breadcrumb, language toggle, notification bell
// Clean English text, dynamic theme and i18n integration.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';
import { styles } from '../styles/ProfileHeader.styles';

export const ProfileHeader = ({ onHomePress, onNotificationPress }) => {
  const { theme } = useTheme();
  const { language, availableLanguages, cycleLanguage } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={onHomePress} activeOpacity={0.7}>
          <Text style={[styles.breadcrumbLink, { color: theme.textSecondary }]}>
            My sanctuary
          </Text>
        </TouchableOpacity>
        <Text style={[styles.breadcrumbSep, { color: theme.textMuted }]}> / </Text>
        <Text style={[styles.breadcrumbActive, { color: theme.textPrimary }]}>
          Profile
        </Text>
      </View>

      {/* Right side: lang + bell */}
      <View style={styles.rightRow}>
        {availableLanguages.length > 1 && (
          <TouchableOpacity
            style={[styles.langPill, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
            onPress={cycleLanguage}
            activeOpacity={0.7}
          >
            <Text style={[styles.langText, { color: theme.textSecondary }]}>
              {(availableLanguages.find((l) => l.id === language) || availableLanguages[0])?.code || 'EN'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.bellBtn, { backgroundColor: theme.heroBg }]}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
