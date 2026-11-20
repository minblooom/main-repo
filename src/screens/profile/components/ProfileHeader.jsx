// src/screens/profile/components/ProfileHeader.jsx
// Top bar: breadcrumb, weather pill, language toggle, notification bell
// Clean English text and dynamic theme integration.

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const ProfileHeader = ({ onHomePress, onNotificationPress }) => {
  const { theme } = useTheme();

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

      {/* Right side: weather + lang + bell */}
      <View style={styles.rightRow}>
        <View style={[styles.weatherPill, { backgroundColor: theme.pillBg, borderColor: theme.accentBorder }]}>
          <Text style={[styles.weatherText, { color: theme.pillText }]}>☀️ Warm · 25°C</Text>
        </View>

        <TouchableOpacity
          style={[styles.langPill, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}
          onPress={() =>
            Alert.alert(
              'Language Selection',
              'Currently set to English · Kenya. Swahili translations for your sanctuary are coming soon!'
            )
          }
          activeOpacity={0.7}
        >
          <Text style={[styles.langText, { color: theme.textSecondary }]}>EN / SW</Text>
        </TouchableOpacity>

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

import { styles } from '../styles/ProfileHeader.styles';
