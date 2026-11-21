// src/features/community/baraza/CommunityGreeting.jsx
// src/features/community/baraza/CommunityGreeting.jsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';

export const CommunityGreeting = ({ companionId = 'noodle', message, onAnother }) => {
  const { theme } = useTheme();
  const [happy, setHappy] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleRefresh = () => {
    onAnother?.();
    setHappy(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHappy(false), 1800);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.heroBg, borderColor: theme.heroBorder },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.tagPill,
            { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder },
          ]}
        >
          <Text style={[styles.tagText, { color: theme.pillText }]}>
            BARAZA · DAILY NOTE
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={3}>
          {message || 'You don’t have to carry everything alone today.'}
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Show another encouragement note"
          onPress={handleRefresh}
          activeOpacity={0.85}
          style={[styles.actionBtn, { backgroundColor: theme.accent }]}
        >
          <Text style={[styles.actionBtnText, { color: theme.bg }]}>
            Another note ↻
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mascotWrap}>
        <AnimatedCompanion
          companionId={companionId}
          size={112}
          state={happy ? 'happy' : 'idle'}
          showAura={true}
          interactive={true}
          onPress={handleRefresh}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 176,
  },
  content: {
    flex: 1,
    gap: 10,
    alignItems: 'flex-start',
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  actionBtn: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 2,
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});