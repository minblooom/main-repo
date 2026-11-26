// src/screens/home/components/MomentsSection.jsx
// "A moment for you" section featuring:
// 1. Podcast of the day (dynamically curated by user's focus, rotates daily, routes to Chill & Soundscapes)
// 2. Pocket Journal (low pressure, routes to Journal)
// 3. The Acacia Worry Tree (mindful play, routes to Acacia)
// Strictly zero county names and clean icon-free typography

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

// Daily rotating podcasts curated by wellness focus area
const PODCAST_CATALOG = {
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
    {
      title: 'Soft Rain & Safe Harbor',
      desc: 'Ambient soundscape and mindful wind-down.',
    },
  ],
  low_mood: [
    {
      title: 'Gentle Steps on Heavy Days',
      desc: 'Showing up for yourself when energy is quiet.',
    },
    {
      title: 'You Don’t Have to Force Joy',
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
      title: 'When You’re Always the Strong One',
      desc: 'A safe haven where you don’t have to carry it all.',
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

export const MomentsSection = ({
  isWide = false,
  userFocusAreas = ['anxiety'],
  onSelectMoment,
}) => {
  // Select daily rotating podcast based on primary focus area and day of year
  const dailyPodcast = useMemo(() => {
    const primaryKey = userFocusAreas && userFocusAreas.length > 0
      ? userFocusAreas[0]
      : 'default';
    const playlist = PODCAST_CATALOG[primaryKey] || PODCAST_CATALOG.default;
    // Rotate deterministically every day
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const item = playlist[dayIndex % playlist.length];
    return item;
  }, [userFocusAreas]);

  const cards = [
    {
      id: 'baraza',
      category: 'COMMUNITY BARAZA · SAFE CIRCLES',
      title: 'Soft Space in a Loud World',
      desc: 'Step into a quiet peer circle when you want warm company — zero pressure to speak.',
      cta: 'Visit Community Baraza →',
      bg: '#EDF5EE',
      border: '#D8ECDA',
      textDark: '#2C5A38',
    },
    {
      id: 'journal',
      category: 'POCKET JOURNAL · 3 MIN',
      title: "What's on your mind?",
      desc: 'A few words. Just for you. Zero pressure.',
      cta: 'Open your journal →',
      bg: '#FFF5E8',
      border: '#FFE6C9',
      textDark: '#8A531C',
    },
    {
      id: 'arcade',
      category: 'MINDFUL PLAY · AT YOUR PACE',
      title: 'Blooms Arcade',
      desc: 'Gentle, score-free mini-games to help your mind reset at your own pace.',
      cta: 'Open Blooms Arcade →',
      bg: '#F0EAFA',
      border: '#DFD5F0',
      textDark: colors.brand,
    },
  ];

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>A moment for you</Text>
        <Text style={styles.sectionSubtitle}>
          Follow what feels good. Leave the rest.
        </Text>
      </View>

      {/* 3 Activities */}
      <View style={[styles.cardRow, isWide && styles.cardRowWide]}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { backgroundColor: card.bg, borderColor: card.border },
            ]}
            onPress={() => onSelectMoment?.(card.id)}
            activeOpacity={0.88}
          >
            {/* Top Tag */}
            <View style={styles.cardTop}>
              <Text style={[styles.cardTag, { color: card.textDark }]}>
                {card.category}
              </Text>
            </View>

            {/* Title & Description */}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </View>

            {/* Bottom Call to Action */}
            <Text style={[styles.cardCta, { color: card.textDark }]}>
              {card.cta}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
    gap: 12,
  },
  header: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRow: {
    flexDirection: 'column',
    gap: 14,
  },
  cardRowWide: {
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 160,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  cardBody: {
    gap: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  cardCta: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
