// src/components/navigation/BottomNavBar.jsx
// Mobile bottom navigation bar matching the Figma mobile sanctuary

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

const BOTTOM_TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'aurora', label: 'Aurora', icon: '✨' },
  { id: 'breath', label: 'Tulia', icon: '🍃' },
  { id: 'baraza', label: 'Baraza', icon: '💬' },
  { id: 'sanctuary', label: 'Sanctuary', icon: '🌸' },
];

export const BottomNavBar = ({ activeRoute = 'home', onNavigate }) => {
  return (
    <View style={styles.container}>
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeRoute === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onNavigate?.(tab.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Text style={styles.tabIcon}>{tab.icon}</Text>
            </View>
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
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.08)',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flex: 1,
  },
  iconWrap: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  iconWrapActive: {
    backgroundColor: '#EAE3F7',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#8B6DA8',
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.brand,
  },
});
