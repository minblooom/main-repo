// src/components/navigation/BottomNavBar.jsx
// Mobile bottom navigation bar matching the Figma mobile sanctuary
// Clean text-first pill navigation with personalized companion avatar on "Sanctuary"

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { COMPANION_MAP } from '../../constants/companions';

const BOTTOM_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'journal', label: 'Journal' },
  { id: 'baraza', label: 'Baraza' },
  { id: 'sanctuary', label: 'Sanctuary' },
];

export const BottomNavBar = ({
  activeRoute = 'home',
  onNavigate,
  companionId = 'noodle',
}) => {
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP.noodle;

  return (
    <View style={styles.container}>
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeRoute === tab.id;
        const isSanctuary = tab.id === 'sanctuary';

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => onNavigate?.(tab.id)}
            activeOpacity={0.8}
          >
            <View style={styles.tabInner}>
              {isSanctuary && (
                <View style={styles.tabMascotWrap}>
                  <Image
                    source={companion.image}
                    style={styles.tabMascotImg}
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </View>
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
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 26 : 12,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#EAE3F7',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tabMascotWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tabMascotImg: {
    width: '100%',
    height: '100%',
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
