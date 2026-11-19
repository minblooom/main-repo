// src/screens/profile/components/ThemePalettePicker.jsx
// "Make yourself at home" — 2x2 theme grid with dynamic theme & dark mode support

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, THEME_PALETTES } from '../../../theme/ThemeContext';

const THEME_CARDS = [
  { id: 'savannah',     emoji: '🌅', tag: 'Solar Bento' },
  { id: 'deep_horizon', emoji: '🌙', tag: 'Mindful silence' },
  { id: 'sage_meadow',  emoji: '🌿', tag: 'Vitality & growth' },
  { id: 'teal_clarity', emoji: '💎', tag: 'Social joy' },
];

const ThemeCard = ({ card, isActive, onPress, currentTheme, isDark }) => {
  const paletteDef = THEME_PALETTES[card.id];
  const p = isDark ? paletteDef.dark : paletteDef.light;

  const cardBg = isDark ? p.cardBg : p.accentSoft;
  const cardBorder = isActive ? currentTheme.accent : (isDark ? p.heroBorder : p.accentBorder);
  const textColor = isDark ? p.textPrimary : p.textPrimary;
  const tagColor = isDark ? p.textMuted : p.textSecondary;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          borderWidth: isActive ? 2.5 : 1.5,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.emoji}>{card.emoji}</Text>
      <Text style={[styles.cardName, { color: textColor }]}>{paletteDef?.name || card.id}</Text>
      <Text style={[styles.cardTag, { color: tagColor }]}>{card.tag}</Text>
      {isActive && (
        <View style={[styles.activeBadge, { backgroundColor: currentTheme.accent }]}>
          <Text style={styles.activeBadgeText}>✓ Active</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const ThemePalettePicker = () => {
  const { theme, themeId, setThemeId, isDark } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Make yourself at home
      </Text>
      <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
        Choose the word that calls to you.
      </Text>

      <View style={styles.grid}>
        {THEME_CARDS.map((card) => (
          <ThemeCard
            key={card.id}
            card={card}
            isActive={themeId === card.id}
            onPress={() => setThemeId(card.id)}
            currentTheme={theme}
            isDark={isDark}
          />
        ))}
      </View>
    </View>
  );
};

import { styles } from '../styles/ThemePalettePicker.styles';
