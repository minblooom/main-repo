// src/screens/home/components/HeroBanners.jsx
// Side-by-side hero cards: Aurora AI Companion (with Dynamic Animated Companion) & Podcast of the Day.
// Fully integrated with dynamic theme context.

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from '../styles/HeroBanners.styles';

const DAILY_PODCAST_CATALOG = {
  anxiety: [
    {
      title: 'Calming the Overwhelmed Mind',
      desc: 'Gentle grounding when thoughts are racing too fast.',
    },
    {
      title: 'Unwinding the Nervous System',
      desc: 'A soft 10-minute pause to reset tension.',
    },
    {
      title: 'Soft Space in a Loud World',
      desc: 'Permission to slow down and breathe without apology.',
    },
  ],
  burnout: [
    {
      title: 'Rest Is Not a Reward',
      desc: 'Unlearning the guilt of quiet, restful hours.',
    },
    {
      title: 'Unplugging from the Hustle',
      desc: 'Healthy boundary lines that protect your peace.',
    },
    {
      title: 'Pacing Your Energy',
      desc: 'Moving through your day without running on empty.',
    },
  ],
  sleep: [
    {
      title: 'Night Calm & Gentle Slumber',
      desc: 'Letting the day fade away so tomorrow can breathe.',
    },
    {
      title: 'Quieting Bedtime Chatter',
      desc: 'Soothing guided words for restful night calm.',
    },
  ],
  low_mood: [
    {
      title: 'Gentle Steps on Heavy Days',
      desc: 'Showing up for yourself when energy is quiet.',
    },
    {
      title: "You Don't Have to Force Joy",
      desc: 'Embracing where you are today with tenderness.',
    },
  ],
  body: [
    {
      title: 'Making Peace with Yourself',
      desc: 'A gentler, kinder relationship with your body.',
    },
  ],
  strong_one: [
    {
      title: "When You're Always the Strong One",
      desc: "A safe haven where you don't have to carry it all.",
    },
  ],
  default: [
    {
      title: 'Breathing Room for Your Mind',
      desc: 'A daily 10-minute sanctuary to reset your pace.',
    },
    {
      title: 'Polepole: Moving at Your Rhythm',
      desc: 'Slowing down without feeling like you are falling behind.',
    },
    {
      title: 'Finding Stillness in the Noise',
      desc: 'Curated audio to bring peace to your day.',
    },
  ],
};

export const HeroBanners = ({
  isWide = false,
  companionId = 'noodle',
  userFocusAreas = ['anxiety'],
  onAuroraPress,
  onPodcastPress,
}) => {
  const { theme } = useTheme();

  const dailyPodcast = useMemo(() => {
    const primaryKey = userFocusAreas?.[0] || 'default';
    const playlist = DAILY_PODCAST_CATALOG[primaryKey] || DAILY_PODCAST_CATALOG.default;
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return playlist[dayIndex % playlist.length];
  }, [userFocusAreas]);

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

      {/* -- CARD 2: PODCAST OF THE DAY (Mint Green Curated Audio) ------------------ */}
      <View style={[styles.card, styles.breathCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <View style={styles.tagPillMint}>
          <Text style={styles.tagPillTextMint}>PODCAST OF THE DAY · FOR YOU</Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
          {dailyPodcast.title}
        </Text>

        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
          {dailyPodcast.desc}
        </Text>

        <TouchableOpacity
          style={styles.breathActionBtn}
          onPress={onPodcastPress}
          activeOpacity={0.88}
        >
          <Text style={styles.breathActionBtnText}>Listen now →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
