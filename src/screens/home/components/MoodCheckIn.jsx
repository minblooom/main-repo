// src/screens/home/components/MoodCheckIn.jsx
// Empathetic low-pressure daily mood check-in with tactile cards,
// real-time companion support, context factors, local persistence,
// and silent cloud sync to MindBloom backend telemetry.

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../constants/companions';
import { styles } from '../styles/MoodCheckIn.styles';
import { apiClient } from '../../../core/api/client';

const MOODS = [
  {
    id: 'low',
    emoji: '🌧️',
    label: 'Low',
    score: 2,
    guidance: "It takes quiet strength to admit when you're low. You don't have to fix everything today — just resting is enough.",
  },
  {
    id: 'anxious',
    emoji: '☁️',
    label: 'Anxious',
    score: 2,
    guidance: "When thoughts are racing, let's steady your feet on the floor. Take a slow, gentle exhale. You are safe here.",
  },
  {
    id: 'okay',
    emoji: '⛅',
    label: 'Okay',
    score: 3,
    guidance: "Being 'okay' is a completely valid, steady place to stand. You're holding your ground gently today.",
  },
  {
    id: 'calm',
    emoji: '🌸',
    label: 'Calm',
    score: 4,
    guidance: "A peaceful breath. Savor this gentleness — you've cultivated this quiet sanctuary in yourself.",
  },
  {
    id: 'great',
    emoji: '☀️',
    label: 'Great',
    score: 5,
    guidance: "What radiant warmth! Hold onto this lightness and let it anchor you whenever the skies get cloudy.",
  },
];

const FACTORS = [
  { id: 'sleep', label: '💤 Sleep' },
  { id: 'work', label: '📚 Study / Work' },
  { id: 'people', label: '💬 Relationships' },
  { id: 'quiet', label: '🌿 Solitude' },
  { id: 'body', label: '🧘 Body / Energy' },
  { id: 'gratitude', label: '✨ Small win' },
];

const MOOD_HISTORY_KEY = '@mindbloom:mood_history';

export const MoodCheckIn = ({ onMoodSelect, onOpenAnalytics, companionId: propCompanionId }) => {
  const { theme, companionId: globalCompanionId } = useTheme();
  const companionKey = propCompanionId || globalCompanionId || 'noodle';
  const companion = COMPANION_MAP[companionKey] || COMPANION_MAP.noodle;

  const [selectedMoodId, setSelectedMoodId] = useState('calm');
  const [selectedFactors, setSelectedFactors] = useState(['quiet']);
  const [hasSaved, setHasSaved] = useState(false);

  const activeMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[3];

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(MOOD_HISTORY_KEY);
        if (stored) {
          const history = JSON.parse(stored);
          if (Array.isArray(history) && history.length > 0) {
            const today = new Date().toDateString();
            const latest = history[history.length - 1];
            if (latest.dateString === today) {
              setSelectedMoodId(latest.moodId);
              if (latest.factors) setSelectedFactors(latest.factors);
              setHasSaved(true);
            }
          }
        }
      } catch { }
    })();
  }, []);

  const handleSelectMood = (id) => {
    setSelectedMoodId(id);
    setHasSaved(false);
    onMoodSelect?.(id);
  };

  const toggleFactor = (fId) => {
    setSelectedFactors((prev) =>
      prev.includes(fId) ? prev.filter((id) => id !== fId) : [...prev, fId]
    );
    setHasSaved(false);
  };

  const handleSaveCheckIn = async () => {
    const entry = {
      id: 'mood_' + Date.now(),
      moodId: activeMood.id,
      label: activeMood.label,
      emoji: activeMood.emoji,
      score: activeMood.score,
      factors: selectedFactors,
      dateString: new Date().toDateString(),
      timestamp: Date.now(),
    };

    try {
      // 1. Local-first Vault save
      const stored = await AsyncStorage.getItem(MOOD_HISTORY_KEY);
      const history = stored ? JSON.parse(stored) : [];
      const filtered = history.filter((h) => h.dateString !== entry.dateString);
      filtered.push(entry);
      await AsyncStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(filtered));
      setHasSaved(true);

      // 2. Silent Cloud Telemetry Sync (for AI adaptation & research insights)
      apiClient.post('/journal/mood', {
        moodScore: activeMood.score,
        moodLabel: activeMood.label,
        triggers: selectedFactors,
        toolsUsed: ['mood_checkin'],
        helpfulRating: 5,
        note: `Self-recorded on ${entry.dateString}`,
      }).catch((err) => {
        // Silently tolerate network/offline
        console.log('[MoodCheckIn] Backend sync offline, stored locally:', err.message);
      });
    } catch { }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
      {/* Top row: Title & Mood Pills */}
      <View style={styles.layout}>
        <View style={styles.textColumn}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>How's your heart today?</Text>
          <Text style={[styles.subhead, { color: theme.textSecondary }]}>
            No right answer. Just a moment for you.
          </Text>
          <Text style={[styles.skipNote, { color: theme.textMuted }]}>
            You can skip this, too.
          </Text>
        </View>

        <View style={styles.moodRow}>
          {MOODS.map((m) => {
            const isSelected = selectedMoodId === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.moodItem,
                  { backgroundColor: theme.bg, borderColor: theme.heroBorder },
                  isSelected && [
                    styles.moodItemSelected,
                    { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder },
                  ],
                ]}
                onPress={() => handleSelectMood(m.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: theme.textSecondary },
                    isSelected && [styles.moodLabelSelected, { color: theme.accent }],
                  ]}
                >
                  {m.label}
                </Text>
                {isSelected && (
                  <Text style={[styles.checkText, { color: theme.accent }]}>✓ Selected</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Expanded Companion Guidance & Emotional Factors */}
      <View style={[styles.expansionCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
        {/* Companion Speech Bubble */}
        <View style={styles.companionRow}>
          <View style={[styles.companionAvatar, { backgroundColor: companion.accent, borderColor: theme.heroBorder }]}>
            <Image
              source={companion.cutoutImage || companion.image}
              style={styles.companionImg}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.companionSpeech, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
            <Text style={[styles.companionAuthor, { color: theme.accent }]}>
              {companion.name} · gently beside you
            </Text>
            <Text style={[styles.companionQuote, { color: theme.textPrimary }]}>
              "{activeMood.guidance}"
            </Text>
          </View>
        </View>

        {/* Contributing Factors */}
        <View style={styles.factorsSection}>
          <Text style={[styles.factorsHeading, { color: theme.textSecondary }]}>
            What's touching your heart right now? (Optional)
          </Text>
          <View style={styles.factorsRow}>
            {FACTORS.map((f) => {
              const isChecked = selectedFactors.includes(f.id);
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.factorChip,
                    {
                      backgroundColor: isChecked ? theme.accentSoft : theme.cardBg,
                      borderColor: isChecked ? theme.accent : theme.heroBorder,
                    },
                  ]}
                  onPress={() => toggleFactor(f.id)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.factorText,
                      { color: isChecked ? theme.accent : theme.textSecondary },
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action Footer */}
        <View style={styles.actionFooter}>
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: hasSaved ? '#10B981' : theme.accent },
            ]}
            onPress={handleSaveCheckIn}
            activeOpacity={0.85}
          >
            <Text style={[styles.saveBtnText, { color: '#FFFFFF' }]}>
              {hasSaved ? '✓ Recorded to your rhythm' : 'Save today\'s check-in'}
            </Text>
            <Text style={[styles.seedBadgeText, { color: '#FFFFFF' }]}>
              (+1 Seed 🌸)
            </Text>
          </TouchableOpacity>

          {onOpenAnalytics && (
            <TouchableOpacity onPress={onOpenAnalytics} activeOpacity={0.75}>
              <Text style={[styles.analyticsLink, { color: theme.accent }]}>
                Notice your patterns in Mood Analytics →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
