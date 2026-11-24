// src/components/navigation/SidebarNav.jsx
// Desktop navigation sidebar matching the Figma sanctuary layout
// Text-first minimalist navigation with personalized companion avatar on "My Sanctuary"
// and dynamic full-app theme awareness.

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { COMPANION_MAP } from '../../constants/companions';
import { useTheme } from '../../theme/ThemeContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'journal', label: 'Journal' },
  { id: 'aurora', label: 'Aurora AI' },
  { id: 'soundscapes', label: 'Chill & Soundscapes' },
  { id: 'baraza', label: 'Community Baraza' },
];

const GROWTH_ITEMS = [
  { id: 'arcade', label: 'Blooms Arcade' },
  { id: 'sanctuary', label: 'My Profile' },
];

export const SidebarNav = ({
  activeRoute = 'home',
  onNavigate,
  companionId: propCompanionId,
  showSupportCards = false,
}) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const companionKey = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[companionKey] || COMPANION_MAP.noodle;

  return (
    <View style={[styles.sidebar, { backgroundColor: theme.sidebarBg, borderRightColor: theme.divider }]}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <Text style={[styles.brandTitle, { color: theme.accent }]}>mindbloom</Text>
      </View>

      {/* Main Sanctuary Navigation */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>YOUR SANCTUARY</Text>
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActive && [styles.navItemActive, { backgroundColor: theme.navActive }],
              ]}
              onPress={() => onNavigate?.(item.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.navLabel,
                  { color: theme.textSecondary },
                  isActive && [styles.navLabelActive, { color: theme.textPrimary }],
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Growth & Spaces Navigation */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.textMuted }]}>GROWTH & SPACES</Text>
        {GROWTH_ITEMS.map((item) => {
          const isActive = activeRoute === item.id;
          const isSanctuary = item.id === 'sanctuary';

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActive && [styles.navItemActive, { backgroundColor: theme.navActive }],
              ]}
              onPress={() => onNavigate?.(item.id)}
              activeOpacity={0.8}
            >
              {isSanctuary && (
                <View style={[styles.mascotIconWrap, { backgroundColor: theme.sidebarBg, borderColor: theme.cardBg }]}>
                  <Image
                    source={companion.image}
                    style={styles.mascotIconImg}
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text
                style={[
                  styles.navLabel,
                  { color: theme.textSecondary },
                  isActive && [styles.navLabelActive, { color: theme.textPrimary }],
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Optional Gentle Supportive Cards */}
      {showSupportCards && (
        <View style={styles.supportCardsSection}>
          <View style={[styles.supportCardMint, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
            <Text style={[styles.supportCardTitle, { color: theme.textPrimary }]}>A little is enough</Text>
            <Text style={[styles.supportCardQuote, { color: theme.textSecondary }]}>
              "You don't have to bloom all at once."
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.supportCardPeach, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}
            onPress={() => onNavigate?.('acacia')}
            activeOpacity={0.85}
          >
            <Text style={[styles.supportCardTitle, { color: theme.textPrimary }]}>A moment of calm</Text>
            <Text style={[styles.supportCardLinkText, { color: theme.accent }]}>Rest in the garden →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpLinkBtn}
            onPress={() => onNavigate?.('help')}
            activeOpacity={0.7}
          >
            <Text style={[styles.helpLinkText, { color: theme.textMuted }]}>Help & support</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer Muted Tagline */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>Polepole · your pace</Text>
      </View>
    </View>
  );
};

import { styles } from './styles/SidebarNav.styles';
