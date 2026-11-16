// src/screens/home/components/MomentsSection.jsx
// "A moment for you" section featuring 3 curated low-pressure activities:
// Soundtrack, Pocket Journal, and The Acacia Worry Tree (Strictly zero county names)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../../theme/colors';

const MOMENT_CARDS = [
  {
    id: 'soundtrack',
    category: 'LISTEN · 5 MIN',
    icon: '🎧',
    title: 'A softer soundtrack',
    desc: 'Let the world turn down a little.',
    cta: 'Find your calm →',
    bg: '#EDF5EE',
    border: '#D8ECDA',
    textDark: '#2C5A38',
  },
  {
    id: 'journal',
    category: 'JOURNAL · 3 MIN',
    icon: '📖',
    title: "What's on your mind?",
    desc: 'A few words. Just for you.',
    cta: 'Open your journal →',
    bg: '#FFF5E8',
    border: '#FFE6C9',
    textDark: '#8A531C',
  },
  {
    id: 'worry_tree',
    category: 'PLAY · AT YOUR PACE',
    icon: '🌳',
    title: 'The acacia worry tree',
    desc: 'Set a worry down. Make room to grow.',
    cta: 'Play a little →',
    bg: '#F0EAFA',
    border: '#DFD5F0',
    textDark: colors.brand,
  },
];

export const MomentsSection = ({ isWide = false, onSelectMoment }) => {
  const handleCardPress = (id) => {
    if (onSelectMoment) {
      onSelectMoment(id);
      return;
    }

    if (id === 'soundtrack') {
      Alert.alert('Softer Soundtrack', 'Playing ambient rain on tin roof and gentle acoustic acoustic melody. Breathe easy.');
    } else if (id === 'journal') {
      Alert.alert('Pocket Journal', 'A safe, private space for your thoughts. Zero judgment, no word count targets.');
    } else if (id === 'worry_tree') {
      Alert.alert('The Acacia Worry Tree', 'Place a worry onto a leaf, let it rest on the branches or gently drift away with the wind.');
    }
  };

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>A moment for you</Text>
        <Text style={styles.sectionSubtitle}>
          Follow what feels good. Leave the rest.
        </Text>
      </View>

      {/* 3 Horizontal/Grid Cards */}
      <View style={[styles.cardRow, isWide && styles.cardRowWide]}>
        {MOMENT_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { backgroundColor: card.bg, borderColor: card.border },
            ]}
            onPress={() => handleCardPress(card.id)}
            activeOpacity={0.88}
          >
            {/* Top Tag & Icon */}
            <View style={styles.cardTop}>
              <Text style={[styles.cardTag, { color: card.textDark }]}>
                {card.category}
              </Text>
              <Text style={styles.cardIcon}>{card.icon}</Text>
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
  cardIcon: {
    fontSize: 18,
  },
  cardBody: {
    gap: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  cardCta: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});
