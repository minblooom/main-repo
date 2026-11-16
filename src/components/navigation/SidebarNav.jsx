// src/components/navigation/SidebarNav.jsx
// Desktop navigation sidebar matching the Figma sanctuary layout

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠', active: true },
  { id: 'aurora', label: 'Aurora Companion', icon: '✨' },
  { id: 'breath', label: 'Tulia Breath', icon: '🍃' },
  { id: 'soundscapes', label: 'Chill & Soundscapes', icon: '🎧' },
  { id: 'baraza', label: 'Community Baraza', icon: '💬' },
];

const GROWTH_ITEMS = [
  { id: 'acacia', label: 'The Acacia Tree', icon: '🌳' },
  { id: 'sanctuary', label: 'My Sanctuary', icon: '🌸' },
];

export const SidebarNav = ({ activeRoute = 'home', onNavigate }) => {
  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>mindbloom</Text>
      </View>

      {/* Main Sanctuary Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>YOUR SANCTUARY</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onNavigate?.(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Growth & Spaces Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>GROWTH & SPACES</Text>
        {GROWTH_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onNavigate?.(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Muted Tagline */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Polepole · your pace</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#FAF5EE',
    borderRightWidth: 1,
    borderRightColor: 'rgba(73, 37, 66, 0.08)',
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  brandContainer: {
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },
  section: {
    marginBottom: 24,
    gap: 4,
  },
  sectionHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  navItemActive: {
    backgroundColor: '#EAE3F7',
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#6E5D87',
  },
  navLabelActive: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textMuted,
  },
});
