// src/features/community/encouragement/EncouragementFeed.jsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { styles } from './styles/EncouragementFeed.styles';

export const EncouragementFeed = ({ companionId, message, onAnother, reacting = false }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.dailyCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
      <AnimatedCompanion
        companionId={companionId}
        size={88}
        state={reacting ? 'happy' : 'idle'}
        showAura={false}
        interactive={false}
      />

      <View style={styles.bubbleCol}>
        <Text style={[styles.kicker, { color: theme.accent }]}>FOR YOU</Text>
        <View style={[styles.bubble, { backgroundColor: theme.cardBg }]} accessibilityLiveRegion="polite">
          <Text style={[styles.message, { color: theme.textPrimary }]}>{message}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onAnother}
          style={[styles.anotherButton, { borderColor: theme.accent }]}
        >
          <Text style={[styles.anotherText, { color: theme.accent }]}>Another</Text>
        </Pressable>
      </View>
    </View>
  );
};