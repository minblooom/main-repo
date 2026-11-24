// src/screens/community/components/CommunityHeader.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useI18n } from '../../../services/i18n';

export const CommunityHeader = () => {
  const { theme } = useTheme();
  const { countryData } = useI18n();

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Baraza Community 👥
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Safe, Anonymous & Live • {countryData?.regionName || 'East Africa'}
        </Text>
      </View>
      <View style={[styles.privacyBadge, { backgroundColor: 'rgba(138, 154, 134, 0.15)' }]}>
        <Text style={styles.privacyLockEmoji}>🔒</Text>
        <Text style={[styles.privacyBadgeText, { color: '#5B7057' }]}>Encrypted</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    marginTop: 2,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
  },
  privacyLockEmoji: { fontSize: 12 },
  privacyBadgeText: { fontSize: 11.5, fontWeight: '700' },
});
