// src/features/community/memes/ChaiMemesSection.jsx
// Relatable East African mental health humor & cultural therapy from react-frontend.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../../../screens/arcade/audio/soundService';

const MEMES = [
  {
    id: '1',
    emoji: '☕',
    title: 'Me telling myself "It is what it is" for the 47th time today',
    caption: 'My nervous system: "Bro, it is NOT what it is. We are fighting for our lives here."',
    likes: 89,
    hasLiked: false,
  },
  {
    id: '2',
    emoji: '📱',
    title: 'Saying "I am almost there" when you haven’t left the bed',
    caption: 'Self-care includes lying to preserve mental energy. (Please don’t take this as clinical advice).',
    likes: 134,
    hasLiked: true,
  },
  {
    id: '3',
    emoji: '🏃💨',
    title: 'Me dodging my responsibilities on a Monday morning in Nairobi',
    caption: 'Aerobic exercise counts as somatic trauma release right?',
    likes: 67,
    hasLiked: false,
  },
  {
    id: '4',
    emoji: '🧘‍♂️',
    title: 'Doing 1 deep breath and expecting my rent, anxiety, and exams to vanish',
    caption: 'Why is my third eye not paying my KPLC power bill?',
    likes: 112,
    hasLiked: false,
  },
  {
    id: '5',
    emoji: '🥑',
    title: 'Kenyan parents when you tell them you have depression',
    caption: '"Kunywa maji mengi na uwache hiyo simu!" (Drink plenty of water and put that phone down!)',
    likes: 245,
    hasLiked: true,
  },
];

export const ChaiMemesSection = () => {
  const { theme } = useTheme();
  const [memeList, setMemeList] = useState(MEMES);

  const handleToggleLike = (id) => {
    soundService.playPop();
    setMemeList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = !m.hasLiked;
          return {
            ...m,
            likes: next ? m.likes + 1 : Math.max(0, m.likes - 1),
            hasLiked: next,
          };
        }
        return m;
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Chai & Chill Corner ☕</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Cultural therapy through honest laughs. Because sometimes you just need to laugh at the absurdity of it all.
        </Text>
      </View>

      <View style={styles.memesGrid}>
        {memeList.map((m) => (
          <View
            key={m.id}
            style={[styles.memeCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
          >
            <View style={styles.memeHeader}>
              <Text style={styles.emoji}>{m.emoji}</Text>
              <TouchableOpacity
                style={[
                  styles.likeBtn,
                  { borderColor: theme.divider },
                  m.hasLiked && [styles.likeBtnActive, { backgroundColor: 'rgba(234, 160, 35, 0.15)', borderColor: '#EAA023' }],
                ]}
                onPress={() => handleToggleLike(m.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.likeIcon}>{m.hasLiked ? '😂' : '🤍'}</Text>
                <Text style={[styles.likeCount, { color: theme.textSecondary }, m.hasLiked && { color: '#EAA023', fontWeight: '800' }]}>
                  {m.likes}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.memeTitle, { color: theme.textPrimary }]}>{m.title}</Text>
            <Text style={[styles.memeCaption, { color: theme.textSecondary }]}>{m.caption}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.quoteBox, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
          "Laughter is emotional oxygen. Giving yourself permission to smile does not minimize what you are carrying." 🌸
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  memesGrid: {
    gap: 14,
  },
  memeCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  memeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 32,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  likeBtnActive: {},
  likeIcon: {
    fontSize: 14,
  },
  likeCount: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  memeTitle: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  memeCaption: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  quoteBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
