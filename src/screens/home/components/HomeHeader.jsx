// src/screens/home/components/HomeHeader.jsx
// Sanctuary top header with breadcrumb, peaceful weather widget (no county names), language toggle, and profile

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../../theme/colors';

export const HomeHeader = () => {
  const [language, setLanguage] = useState('EN');

  const handleNotifications = () => {
    Alert.alert('Quiet Sanctuary', 'No unread alerts. Your space is calm and peaceful.');
  };

  return (
    <View style={styles.header}>
      {/* Breadcrumb / Location Indicator */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>My sanctuary  /  Home</Text>
      </View>

      {/* Right Auxiliary Controls */}
      <View style={styles.controlsRow}>
        {/* Peaceful Weather Pill — Strictly No County/City Names */}
        <View style={styles.weatherPill}>
          <Text style={styles.weatherText}>☀️ Warm & Calm · 25°C</Text>
        </View>

        {/* Language Toggle */}
        <TouchableOpacity
          onPress={() => setLanguage(language === 'EN' ? 'SW' : 'EN')}
          style={styles.langBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.langText}>
            <Text style={language === 'EN' ? styles.langActive : styles.langInactive}>EN</Text>
            {' / '}
            <Text style={language === 'SW' ? styles.langActive : styles.langInactive}>SW</Text>
          </Text>
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.iconEmoji}>🔔</Text>
        </TouchableOpacity>

        {/* Profile Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🌸</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#8B6DA8',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  weatherText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  langActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  langInactive: {
    color: colors.textMuted,
  },
  iconBtn: {
    padding: 6,
  },
  iconEmoji: {
    fontSize: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAE3F7',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 15,
  },
});
