// src/screens/profile/components/modals/MoodAnalyticsModal.jsx
// Visualizes weekly emotional rhythms, interactive day-by-day reflections,
// personalized companion observations, and emotional anchors.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../../theme/ThemeContext';
import { COMPANION_MAP } from '../../../../constants/companions';
import { styles } from '../../styles/MoodAnalyticsModal.styles';

const DEFAULT_WEEK_DAYS = [
  { day: 'Mon', score: 3, label: 'Okay', emoji: '⛅', height: '55%', factors: ['Sleep', 'Study / Work'], note: 'A steady day holding your ground.' },
  { day: 'Tue', score: 4, label: 'Calm', emoji: '🌸', height: '75%', factors: ['Solitude', 'Small win'], note: 'Found quiet moments between tasks.' },
  { day: 'Wed', score: 2, label: 'Low', emoji: '🌧️', height: '35%', factors: ['Study / Work', 'Energy'], note: 'Felt heavy in the afternoon; took a 2-min Tulia breath.' },
  { day: 'Thu', score: 4, label: 'Calm', emoji: '🌸', height: '75%', factors: ['Relationships', 'Solitude'], note: 'Good conversation with a close friend.' },
  { day: 'Fri', score: 5, label: 'Great', emoji: '☀️', height: '95%', factors: ['Small win', 'Solitude'], note: 'Accomplished a key task and walked outside.' },
  { day: 'Sat', score: 4, label: 'Calm', emoji: '🌸', height: '75%', factors: ['Sleep', 'Solitude'], note: 'Gentle weekend start with warm tea.' },
  { day: 'Sun', score: 4, label: 'Calm', emoji: '🌸', height: '75%', factors: ['Sleep', 'Quiet'], note: 'Restful recharge in the sanctuary.' },
];

export const MoodAnalyticsModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme, companionId: globalCompanionId } = useTheme();
  const theme = propTheme || ctxTheme;
  const companion = COMPANION_MAP[globalCompanionId] || COMPANION_MAP.noodle;

  const [weekDays, setWeekDays] = useState(DEFAULT_WEEK_DAYS);
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // Default to Fri (Great)

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@mindbloom:mood_history');
        if (stored) {
          const history = JSON.parse(stored);
          if (Array.isArray(history) && history.length > 0) {
            // Map recent entries into week view
            const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayIdx = new Date().getDay();
            const last7 = DEFAULT_WEEK_DAYS.map((d, idx) => {
              const matched = history.find((h) => {
                const hDate = new Date(h.timestamp);
                return hDate.getDay() === (idx + 1) % 7;
              });
              if (matched) {
                const heightPct = Math.round((matched.score / 5) * 100) + '%';
                return {
                  day: d.day,
                  score: matched.score,
                  label: matched.label,
                  emoji: matched.emoji,
                  height: heightPct,
                  factors: matched.factors && matched.factors.length > 0 ? matched.factors : d.factors,
                  note: `Recorded in your private check-in · ${matched.label}`,
                };
              }
              return d;
            });
            setWeekDays(last7);
          }
        }
      } catch { }
    })();
  }, [visible]);

  const selectedDay = weekDays[selectedDayIndex] || weekDays[0];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.tag, { color: theme.textMuted }]}>YOUR NATURAL RHYTHM</Text>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Mood Analytics</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.heroBg }]} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Noticing your natural rhythm over the past 7 days.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Top 3 Emotional Rhythm Metrics */}
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                <Text style={styles.metricIcon}>🌸</Text>
                <Text style={[styles.metricVal, { color: theme.textPrimary }]}>71% Calm</Text>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Dominant state</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                <Text style={styles.metricIcon}>🔥</Text>
                <Text style={[styles.metricVal, { color: theme.textPrimary }]}>5 Days</Text>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Check-in streak</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                <Text style={styles.metricIcon}>🌿</Text>
                <Text style={[styles.metricVal, { color: theme.textPrimary }]}>Solitude</Text>
                <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Top anchor</Text>
              </View>
            </View>

            {/* Interactive Weekly Bar Graph */}
            <View style={[styles.chartCard, { backgroundColor: theme.bg, borderColor: theme.heroBorder }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>7-Day Emotional Flow</Text>
                <Text style={[styles.chartHint, { color: theme.textMuted }]}>Tap any bar to inspect</Text>
              </View>

              <View style={styles.barsContainer}>
                {weekDays.map((d, i) => {
                  const isSelected = selectedDayIndex === i;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={styles.barCol}
                      onPress={() => setSelectedDayIndex(i)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.barEmoji}>{d.emoji}</Text>
                      <View style={[styles.barTrack, { backgroundColor: theme.heroBg }]}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: d.height,
                              backgroundColor: isSelected ? theme.accent : theme.textMuted,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.barDay,
                          { color: isSelected ? theme.textPrimary : theme.textMuted },
                          isSelected && { fontWeight: '800' },
                        ]}
                      >
                        {d.day}
                      </Text>
                      {isSelected && (
                        <View style={[styles.selectedDot, { backgroundColor: theme.accent }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Day Inspector Card */}
            <View style={[styles.inspectorCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
              <View style={styles.inspectorHeader}>
                <Text style={[styles.inspectorDay, { color: theme.textPrimary }]}>
                  {selectedDay.day} Reflection
                </Text>
                <View style={[styles.inspectorBadge, { backgroundColor: theme.accentSoft }]}>
                  <Text>{selectedDay.emoji}</Text>
                  <Text style={[styles.inspectorBadgeText, { color: theme.accent }]}>
                    {selectedDay.label}
                  </Text>
                </View>
              </View>

              <Text style={[styles.inspectorNote, { color: theme.textSecondary }]}>
                "{selectedDay.note}"
              </Text>

              {selectedDay.factors && selectedDay.factors.length > 0 && (
                <View style={styles.inspectorFactors}>
                  {selectedDay.factors.map((f, idx) => (
                    <View
                      key={idx}
                      style={[styles.inspectorFactorChip, { backgroundColor: theme.heroBg }]}
                    >
                      <Text style={[styles.inspectorFactorText, { color: theme.textPrimary }]}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Companion's Weekly Observation Card */}
            <View style={[styles.companionNoteCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
              <View style={[styles.companionAvatarWrap, { backgroundColor: companion.accent, borderColor: theme.heroBorder }]}>
                <Image
                  source={companion.cutoutImage || companion.image}
                  style={styles.companionAvatarImg}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.companionNoteWrap}>
                <Text style={[styles.companionNoteHeader, { color: theme.accent }]}>
                  {companion.name}'s Weekly Note
                </Text>
                <Text style={[styles.companionNoteBody, { color: theme.textPrimary }]}>
                  "You've shown immense gentleness this week. Even on days when energy dipped, you took time to listen inward rather than rushing past your feelings. That's how steady courage grows."
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.accent }]}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={[styles.doneBtnText, { color: '#FFFFFF' }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
