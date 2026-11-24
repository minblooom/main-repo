// src/screens/profile/components/ProfileHeader.jsx
// Top bar: breadcrumb, language toggle, notification bell
// Clean English text, dynamic theme and i18n integration.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/ProfileHeader.styles';

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

      {/* Right side: bell */}
      <View style={styles.rightRow}>

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
