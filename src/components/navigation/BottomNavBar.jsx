// src/components/navigation/BottomNavBar.jsx
// Mobile bottom navigation bar matching the Figma mobile sanctuary
// Clean text-first pill navigation with dynamic theme awareness

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { COMPANION_MAP } from '../../constants/companions';
import { useTheme } from '../../theme/ThemeContext';
import { NavbarAudioPlayer } from '../../core/audio/AudioPlayerContext';

const BOTTOM_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'journal', label: 'Journal' },
  { id: 'baraza', label: 'Baraza' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'sanctuary', label: 'Profile' },
];

export const BottomNavBar = ({
  activeRoute = 'home',
  onNavigate,
  companionId: propCompanionId,
}) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const companionKey = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[companionKey] || COMPANION_MAP.noodle;

  return (
    <View>
      <NavbarAudioPlayer variant="bottom" />
      <View style={[styles.container, { backgroundColor: theme.cardBg, borderTopColor: theme.divider }]}>
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeRoute === tab.id;
        const isSanctuary = tab.id === 'sanctuary';

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              isActive && [styles.tabItemActive, { backgroundColor: theme.navActive }],
            ]}
            onPress={() => onNavigate?.(tab.id)}
            activeOpacity={0.8}
          >
            <View style={styles.tabInner}>
              {isSanctuary && (
                <View style={[styles.tabMascotWrap, { backgroundColor: theme.bg, borderColor: theme.cardBg }]}>
                  <Image
                    source={companion.image}
                    style={styles.tabMascotImg}
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.textMuted },
                  isActive && [styles.tabLabelActive, { color: theme.accent, fontWeight: '800' }],
                ]}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      </View>
    </View>
  );
};

import { styles } from './styles/BottomNavBar.styles';
