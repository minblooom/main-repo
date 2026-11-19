// src/screens/home/components/HeroBanners.jsx
// Side-by-side hero cards: Aurora AI Companion (with Dynamic Animated Companion) & Tulia Breath reset.
// Fully integrated with dynamic theme context.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/HeroBanners.styles';

export const HeroBanners = ({
  isWide = false,
  companionId = 'noodle',
  onAuroraPress,
  onBreathPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      {/* -- CARD 1: AURORA COMPANION (Lavender with Animated Companion) -- */}
      <View style={[styles.card, styles.auroraCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
        <View style={styles.cardContent}>
          <View style={[styles.tagPill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
            <Text style={[styles.tagPillText, { color: theme.pillText }]}>AURORA · AI COMPANION</Text>
          </View>

          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            {'A little lighter.\nOne chat at a time.'}
          </Text>

          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Big feelings or small things. You can start anywhere.
          </Text>

          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: theme.accent }]}
            onPress={onAuroraPress}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionBtnText}>Talk to Aurora →</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Living Animated Companion */}
        <View style={styles.mascotContainer}>
          <AnimatedCompanion
            companionId={companionId}
            size={112}
            state="idle"
            interactive={true}
          />
        </View>
      </View>

      {/* -- CARD 2: TULIA BREATH (Mint Green Reset) ------------------ */}
      <View style={[styles.card, styles.breathCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <View style={styles.tagPillMint}>
          <Text style={styles.tagPillTextMint}>LET'S START SMALL</Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          {'Tulia Breath.\n60 seconds to reset.'}
        </Text>

        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          Gentle breathing circle with sound. You don't have to push.
        </Text>

        <TouchableOpacity
          style={styles.breathActionBtn}
          onPress={onBreathPress}
          activeOpacity={0.88}
        >
          <Text style={styles.breathActionBtnText}>Begin breath reset →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
