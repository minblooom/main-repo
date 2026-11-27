// src/screens/community/components/PrimaryCircleCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  sectionHeaderRow: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  primaryCircleCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  primaryMatchBanner: { paddingVertical: 8, paddingHorizontal: 16 },
  primaryMatchBannerText: { fontSize: 12, fontWeight: '800' },
  primaryCircleBody: { padding: 16, gap: 14 },
  circleHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  circleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: { fontSize: 24 },
  circleTitleCol: { flex: 1, gap: 5 },
  circleTitle: { fontSize: 17, fontWeight: '800' },
  circleMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  capacityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  capacityText: { fontSize: 11, fontWeight: '800' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveGreenDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#16A34A' },
  onlineText: { fontSize: 11.5, fontWeight: '700' },
  descBox: { padding: 12, borderRadius: 14, borderWidth: 1 },
  descText: { fontSize: 13, lineHeight: 18 },
  enterCircleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  enterCircleBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  enterCircleArrow: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
