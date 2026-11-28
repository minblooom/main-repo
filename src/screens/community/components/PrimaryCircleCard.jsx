// src/screens/community/components/PrimaryCircleCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/PrimaryCircleCard.styles';
import { useTheme } from '../../../theme/ThemeContext';

export const PrimaryCircleCard = ({
  primaryMatch,
  userAgeBand,
  isJoined,
  onPress,
}) => {
  const { theme } = useTheme();
  if (!primaryMatch) return null;

  const memberCount = Math.min(
    primaryMatch.maxMembers || 12,
    (primaryMatch.memberCount || 1) + (isJoined ? 1 : 0)
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            💬 Your Matched Sanctuary Circle
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
            Locked to Age {userAgeBand} • Shared Struggles & Passions • Max 12
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryCircleCard,
          { backgroundColor: theme.cardBg, borderColor: 'rgba(217, 107, 67, 0.35)' },
        ]}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={[styles.primaryMatchBanner, { backgroundColor: '#FFF0E8' }]}>
          <Text style={[styles.primaryMatchBannerText, { color: '#B8532D' }]}>
            🎯 {primaryMatch.matchResonance || 98}% Resonance Match • Tailored to your sanctuary
          </Text>
        </View>

        <View style={styles.primaryCircleBody}>
          <View style={styles.circleHeaderRow}>
            <View style={[styles.circleIconBox, { backgroundColor: primaryMatch.iconBg || '#E8F0FF' }]}>
              <Text style={styles.circleIcon}>{primaryMatch.icon || '🌀'}</Text>
            </View>
            <View style={styles.circleTitleCol}>
              <Text style={[styles.circleTitle, { color: theme.textPrimary }]}>
                {primaryMatch.title}
              </Text>
              <View style={styles.circleMetaRow}>
                <View style={[styles.capacityBadge, { backgroundColor: 'rgba(217, 107, 67, 0.1)' }]}>
                  <Text style={[styles.capacityText, { color: '#D96B43' }]}>
                    {memberCount}/{primaryMatch.maxMembers || 12} members
                  </Text>
                </View>
                <View style={styles.onlineBadge}>
                  <View style={styles.liveGreenDot} />
                  <Text style={[styles.onlineText, { color: '#16A34A' }]}>
                    Open Sanctuary
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {!!primaryMatch.description && (
            <View style={[styles.descBox, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
              <Text style={[styles.descText, { color: theme.textSecondary }]} numberOfLines={2}>
                {primaryMatch.description}
              </Text>
            </View>
          )}

          <View style={[styles.enterCircleBtn, { backgroundColor: theme.accent }]}>
            <Text style={styles.enterCircleBtnText}>Enter Circle Chat</Text>
            <Text style={styles.enterCircleArrow}>➔</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
