// src/screens/home/components/MoodCheckIn.jsx
// Low-pressure daily mood check-in with tactile cards

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

const MOODS = [
  { id: 'low', emoji: '🌧️', label: 'Low' },
  { id: 'anxious', emoji: '☁️', label: 'Anxious' },
  { id: 'okay', emoji: '⛅', label: 'Okay' },
  { id: 'calm', emoji: '🌸', label: 'Calm' },
  { id: 'great', emoji: '☀️', label: 'Great' },
];

export const MoodCheckIn = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState('calm');

  const handleSelect = (id) => {
    setSelectedMood(id);
    onMoodSelect?.(id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.layout}>
        {/* Left Descriptive Texts */}
        <View style={styles.textColumn}>
          <Text style={styles.title}>How's your heart today?</Text>
          <Text style={styles.subhead}>No right answer. Just a moment for you.</Text>
          <Text style={styles.skipNote}>You can skip this, too.</Text>
        </View>

        {/* Right Mood Selector Pills */}
        <View style={styles.moodRow}>
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.moodItem, isSelected && styles.moodItemSelected]}
                onPress={() => handleSelect(m.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                  {m.label}
                </Text>
                {isSelected && (
                  <Text style={styles.checkText}>✓ Selected</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  layout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  textColumn: {
    minWidth: 200,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subhead: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  skipNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#AAA',
    marginTop: 6,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FAF6EF',
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 64,
  },
  moodItemSelected: {
    borderColor: colors.brand,
    backgroundColor: '#F0EAFA',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  moodLabelSelected: {
    color: colors.brand,
    fontWeight: '800',
  },
  checkText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.brand,
    marginTop: 2,
  },
});
