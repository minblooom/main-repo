// src/screens/community/components/QuickActionsGrid.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/QuickActionsGrid.styles';
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
