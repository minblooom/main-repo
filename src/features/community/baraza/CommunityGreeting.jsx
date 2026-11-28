// src/features/community/baraza/CommunityGreeting.jsx
// src/features/community/baraza/CommunityGreeting.jsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { styles } from './styles/CommunityGreeting.styles';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';

export const CommunityGreeting = ({
  companionId = 'noodle',
  message,
  onAnother,
}) => {
  const { theme } = useTheme();
  const [happy, setHappy] = useState(false);
  const timer = useRef(null);
  const textFade = useRef(new Animated.Value(1)).current;

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleRefresh = () => {
    textFade.setValue(0.2);
    onAnother?.();
    Animated.timing(textFade, {
      toValue: 1,
      duration: 240,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
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

        <Animated.Text
          style={[styles.title, { color: theme.textPrimary, opacity: textFade }]}
          numberOfLines={3}
        >
          {message || 'You don’t have to carry everything alone today.'}
        </Animated.Text>

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
