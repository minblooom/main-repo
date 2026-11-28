// src/screens/arcade/games/SmallSparksGame.jsx
// Small Sparks · CBT Behavioral Activation
// Gently breaks depressive inertia and exhaustion through 30-second low-friction micro-actions.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from './styles/SmallSparksGame.styles';
import { soundService } from '../audio/soundService';

const SPARKS = [
  {
    id: 'water',
    title: 'Sip of Cool Water',
    icon: '💧',
    desc: 'Drink one slow sip. Feel the cool temperature awaken your throat and chest.',
    encouragement: 'Hydration is a quiet, radical act of honoring your physical vessel.',
  },
  {
    id: 'stretch',
    title: 'Shoulder Drop & Neck Roll',
    icon: '🌿',
    desc: 'Release your jaw, roll shoulders back, and let heavy tension slide off.',
    encouragement: 'You don’t have to brace against the world right now.',
  },
  {
    id: 'window',
    title: '30 Seconds of Sky',
    icon: '🌤️',
    desc: 'Glance at a window or open door. Watch the breeze in the trees or the clouds.',
    encouragement: 'There is an entire world breathing outside, holding space for you.',
  },
  {
    id: 'warmth',
    title: 'Wrap in Warmth',
    icon: '🧣',
    desc: 'Pull a sweater closer or hold your hands together for comforting warmth.',
    encouragement: 'Physical warmth signals safety directly to your parasympathetic heart.',
  },
  {
    id: 'sound',
    title: 'Listen to One Melody',
    icon: '🎵',
    desc: 'Close your eyes and let a soft acoustic note wash over your mind.',
    encouragement: 'Beauty requires no effort. Just listening is enough.',
  },
];

export const SmallSparksGame = ({ onFinish }) => {
  const [ignitedSparks, setIgnitedSparks] = useState({});
  const [selectedSpark, setSelectedSpark] = useState(null);

  const ignitedCount = Object.keys(ignitedSparks).length;

  const handleIgnite = (spark) => {
    soundService.playPop();
    const updated = { ...ignitedSparks, [spark.id]: true };
    setIgnitedSparks(updated);
    setSelectedSpark(spark);

    const count = Object.keys(updated).length;
    if (count >= 3) {
      soundService.playVictory();
      setTimeout(() => {
        onFinish?.({
          summary: 'You gathered 3 warm sparks into your hearth. When everything felt heavy, you still found a gentle way forward.',
          seeds: 15,
        });
      }, 1200);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.badgeText}>CBT BEHAVIORAL ACTIVATION</Text>
      <Text style={styles.title}>Small Sparks Hearth 🔥</Text>
      <Text style={styles.subtitle}>
        When energy is low, do not climb mountains. Pick 3 tiny micro-sparks ({ignitedCount}/3 Ignited).
      </Text>

      {/* Hearth Ember Counter */}
      <View style={styles.hearthJar}>
        <View style={styles.hearthVisual}>
          <Text style={styles.hearthFireIcon}>{ignitedCount === 0 ? '🪵' : ignitedCount < 3 ? '🔥' : '✨'}</Text>
          <Text style={styles.hearthWarmthText}>
            {ignitedCount === 0
              ? 'Hearth is resting quietly'
              : ignitedCount < 3
              ? 'A gentle glow begins to warm the room'
              : 'Warmth fills your entire sanctuary!'}
          </Text>
        </View>
      </View>

      {/* Spark Choice Cards */}
      <View style={styles.cardsWrap}>
        {SPARKS.map((spark) => {
          const isIgnited = Boolean(ignitedSparks[spark.id]);
          return (
            <TouchableOpacity
              key={spark.id}
              style={[
                styles.sparkCard,
                isIgnited && styles.sparkCardIgnited,
              ]}
              onPress={() => handleIgnite(spark)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isIgnited && styles.iconWrapIgnited]}>
                <Text style={styles.icon}>{spark.icon}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, isIgnited && styles.cardTitleIgnited]}>
                  {spark.title} {isIgnited ? '· Ignited ✨' : ''}
                </Text>
                <Text style={styles.cardDesc}>{spark.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Encouragement Card */}
      {selectedSpark ? (
        <View style={styles.encouragementCard}>
          <Text style={styles.encourageTag}>GENTLE PERMISSION</Text>
          <Text style={styles.encourageText}>"{selectedSpark.encouragement}"</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};
