// src/screens/profile/components/SanctuaryHeroCard.jsx
// Hero card: companion preview, username, stats, edit button
// Clean English text and dynamic theme integration.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { COMPANION_MAP } from '../../../constants/companions';
import { useTheme } from '../../../theme/ThemeContext';

export const SanctuaryHeroCard = ({
  profile,
  companionId,
  stats,
  onEditPress,
  onCompanionPress,
}) => {
  const { theme } = useTheme();
  const companion = COMPANION_MAP[companionId] || COMPANION_MAP['noodle'];

  return (
    <View style={[styles.card, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
      {/* Top row: companion + info */}
      <View style={styles.topRow}>
        {/* Companion avatar - tappable to customize */}
        <TouchableOpacity onPress={onCompanionPress} activeOpacity={0.85}>
          <View style={[styles.companionWrap, { backgroundColor: companion.accent }]}>
            <AnimatedCompanion
              companionId={companionId}
              state="idle"
              size={60}
              showAura={false}
              interactive={false}
            />
          </View>
        </TouchableOpacity>

        {/* Name + location + focus chip */}
        <View style={styles.infoBlock}>
          <Text style={[styles.nickname, { color: theme.textPrimary }]}>
            {profile.nickname || 'friend'}
          </Text>
          <Text style={[styles.location, { color: theme.textMuted }]}>
            {profile.location || 'Kenya · East Africa'}
          </Text>
          {profile.focusAreas && profile.focusAreas.length > 0 && (
            <View style={[styles.focusChip, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
              <Text style={[styles.focusChipText, { color: theme.pillText }]}>
                {profile.focusAreas[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Edit button */}
        <TouchableOpacity
          style={[styles.editBtn, { borderColor: theme.heroBorder, backgroundColor: theme.cardBg }]}
          onPress={onEditPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.editText, { color: theme.textSecondary }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, { borderTopColor: theme.heroBorder }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.textPrimary }]}>{stats.daysHere}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Days here</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.heroBorder }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.textPrimary }]}>{stats.streak} days</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Current streak</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.heroBorder }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.textPrimary }]}>{stats.seeds}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Seeds collected</Text>
        </View>
      </View>
    </View>
  );
};

import { styles } from '../styles/SanctuaryHeroCard.styles';
