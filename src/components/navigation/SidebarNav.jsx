// src/components/navigation/SidebarNav.jsx
// Desktop navigation sidebar matching the Figma sanctuary layout
// Text-first minimalist navigation (icons paused for clean visual harmony)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'aurora', label: 'Aurora Companion' },
  { id: 'journal', label: 'Journal' },
  { id: 'soundscapes', label: 'Chill & Soundscapes' },
  { id: 'baraza', label: 'Community Baraza' },
];

const GROWTH_ITEMS = [
  { id: 'acacia', label: 'The Acacia Tree' },
  { id: 'sanctuary', label: 'My Sanctuary' },
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
    paddingVertical: 28,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  brandContainer: {
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.6,
  },
  section: {
    marginBottom: 26,
    gap: 4,
  },
  sectionHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.9,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#EAE3F7',
  },
  navLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#6E5D87',
    letterSpacing: -0.1,
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
