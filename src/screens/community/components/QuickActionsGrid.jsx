// src/screens/community/components/QuickActionsGrid.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';

export const QuickActionsGrid = ({
  onOpenSmallWins,
  onOpenVentBox,
  isTeenCohort = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.actionLauncherDeck}>
      <TouchableOpacity
        style={[
          styles.actionButtonCard,
          { backgroundColor: theme.cardBg, borderColor: 'rgba(234, 160, 35, 0.35)' },
        ]}
        activeOpacity={0.85}
        onPress={onOpenSmallWins}
      >
        <View style={styles.actionButtonTop}>
          <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.actionIconEmoji}>✨</Text>
          </View>
          <View style={[styles.arrowMiniCircle, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.arrowMiniText, { color: '#D97706' }]}>➔</Text>
          </View>
        </View>
        <Text style={[styles.actionButtonTitle, { color: theme.textPrimary }]}>
          {isTeenCohort ? 'Tiny Wins 🏆' : 'Small Wins Wall 🏆'}
        </Text>
        <Text style={[styles.actionButtonSub, { color: theme.textSecondary }]}>
          {isTeenCohort
            ? 'Even getting through today counts'
            : 'Celebrate tiny acts of daily courage'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButtonCard,
          { backgroundColor: theme.cardBg, borderColor: 'rgba(217, 107, 67, 0.3)' },
        ]}
        activeOpacity={0.85}
        onPress={onOpenVentBox}
      >
        <View style={styles.actionButtonTop}>
          <View style={[styles.actionIconCircle, { backgroundColor: '#FFEDE6' }]}>
            <Text style={styles.actionIconEmoji}>💨</Text>
          </View>
          <View style={[styles.arrowMiniCircle, { backgroundColor: '#FFEDE6' }]}>
            <Text style={[styles.arrowMiniText, { color: '#D96B43' }]}>➔</Text>
          </View>
        </View>
        <Text style={[styles.actionButtonTitle, { color: theme.textPrimary }]}>
          {isTeenCohort ? 'Safe Vent Box 🫧' : 'Safe Vent Box 💨'}
        </Text>
        <Text style={[styles.actionButtonSub, { color: theme.textSecondary }]}>
          {isTeenCohort
            ? '13–17 only · Let it out anonymously'
            : 'Release emotional weight anonymously'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionLauncherDeck: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  actionButtonCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconEmoji: { fontSize: 20 },
  arrowMiniCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowMiniText: { fontSize: 12, fontWeight: '800' },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionButtonSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});
