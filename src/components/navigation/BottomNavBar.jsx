// src/components/navigation/BottomNavBar.jsx
// Mobile bottom navigation bar matching the Figma mobile sanctuary
// Clean text-first pill navigation (icons paused for clean visual harmony)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

const BOTTOM_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'journal', label: 'Journal' },
  { id: 'soundscapes', label: 'Chill' },
  { id: 'baraza', label: 'Baraza' },
];

export const BottomNavBar = ({ activeRoute = 'home', onNavigate }) => {
  return (
    <View style={styles.container}>
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeRoute === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => onNavigate?.(tab.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 26 : 12,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#EAE3F7',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B6DA8',
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.brand,
  },
});
