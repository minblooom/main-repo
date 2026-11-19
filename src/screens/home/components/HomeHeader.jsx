// src/screens/home/components/HomeHeader.jsx
// Sanctuary top header with breadcrumb, peaceful weather widget, language toggle, and profile.
// Fully integrated with dynamic theme context.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { COMPANION_MAP } from '../../../constants/companions';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/HomeHeader.styles';

export const HomeHeader = ({ companionId: propCompanionId, onProfilePress }) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const [language, setLanguage] = useState('EN');
  const companionKey = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[companionKey] || COMPANION_MAP.noodle;

  const handleNotifications = () => {
    Alert.alert('Quiet Sanctuary', 'No unread alerts. Your space is calm and peaceful.');
  };

  return (
    <View style={styles.header}>
      {/* Breadcrumb / Location Indicator */}
      <View style={styles.breadcrumb}>
        <Text style={[styles.breadcrumbText, { color: theme.textMuted }]}>My sanctuary  /  Home</Text>
      </View>

      {/* Right Auxiliary Controls */}
      <View style={styles.controlsRow}>
        {/* Peaceful Weather Pill */}
        <View style={[styles.weatherPill, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          <Text style={[styles.weatherText, { color: theme.textPrimary }]}>☀️ Warm & Calm · 25°C</Text>
        </View>

        {/* Language Toggle */}
        <TouchableOpacity
          onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.langText, { color: theme.textMuted }]}>
            <Text style={language === 'EN' ? [styles.langActive, { color: theme.textPrimary }] : [styles.langInactive, { color: theme.textMuted }]}>EN</Text>
            {' / '}
            <Text style={language === 'SW' ? [styles.langActive, { color: theme.textPrimary }] : [styles.langInactive, { color: theme.textMuted }]}>SW</Text>
          </Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.heroBg }]}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>🔔</Text>
        </TouchableOpacity>

        {/* Profile Avatar with Chosen Companion */}
        <TouchableOpacity
          style={[styles.avatarCircle, { backgroundColor: companion.accent || theme.accentSoft, borderColor: theme.cardBg }]}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            source={companion.image}
            style={styles.avatarImg}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
