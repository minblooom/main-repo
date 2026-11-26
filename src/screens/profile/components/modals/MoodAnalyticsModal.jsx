// src/screens/profile/components/modals/MoodAnalyticsModal.jsx
// Visualizes real user-logged weekly emotional rhythms, interactive day-by-day reflections,
// exact computed metrics, and personalized companion observations. Empty until user logs a mood.

import React, { useState, useEffect, useMemo } from 'react';
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

const FACTOR_LABELS = {
  sleep: 'Sleep',
  work: 'Study / Work',
  people: 'Relationships',
  quiet: 'Solitude',
  body: 'Body / Energy',
  gratitude: 'Small win',
};

function formatFactor(f) {
  return FACTOR_LABELS[f] || f;
}

export const MoodAnalyticsModal = ({ visible, onClose, theme: propTheme }) => {
  const { theme: ctxTheme, companionId: globalCompanionId } = useTheme();
  const theme = propTheme || ctxTheme;
  const companion = COMPANION_MAP[globalCompanionId] || COMPANION_MAP.noodle;

  const [history, setHistory] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(6);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@mindbloom:mood_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
            setSelectedDayIndex(6);
            return;
          }
        }
        setHistory([]);
      } catch {
        setHistory([]);
      }
    })();
  }, [visible]);

  const analytics = useMemo(() => {
    if (!history || history.length === 0) {
      return { isEmpty: true, weekDays: [], dominant: null, streak: 0, topAnchor: null, avgScore: 0 };
    }

    // Build exact last 7 calendar days ending today
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const byDateStr = {};
    history.forEach((entry) => {
      const key = entry.dateString || new Date(entry.timestamp).toDateString();
      byDateStr[key] = entry;
    });

    const weekDays = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toDateString();
      const matched = byDateStr[key];
      if (matched) {
        const score = Number(matched.score) || 3;
        weekDays.push({
          day: dayNames[d.getDay()],
          dateStr: key,
          hasEntry: true,
          score,
          label: matched.label || 'Okay',
          emoji: matched.emoji || '⛅',
          height: `${Math.max(18, Math.round((score / 5) * 100))}%`,
          factors: (matched.factors || []).map(formatFactor),
          note: `Logged on ${key} · Feeling ${matched.label}`,
        });
      } else {
        weekDays.push({
          day: dayNames[d.getDay()],
          dateStr: key,
          hasEntry: false,
          score: 0,
          label: 'No check-in',
          emoji: '·',
          height: '8%',
          factors: [],
          note: `No mood check-in recorded on ${key}.`,
        });
      }
    }

    // Dominant mood across all logged entries
    const moodCounts = {};
    let totalScore = 0;
    const factorCounts = {};
    history.forEach((h) => {
      const lbl = h.label || 'Okay';
      moodCounts[lbl] = (moodCounts[lbl] || 0) + 1;
      totalScore += Number(h.score) || 3;
      (h.factors || []).forEach((f) => {
        const name = formatFactor(f);
        factorCounts[name] = (factorCounts[name] || 0) + 1;
      });
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const topMoodName = sortedMoods[0]?.[0] || 'Calm';
    const topMoodPct = Math.round(((sortedMoods[0]?.[1] || 0) / history.length) * 100);
    const topMoodEmoji = history.find((h) => h.label === topMoodName)?.emoji || '🌸';

    const sortedFactors = Object.entries(factorCounts).sort((a, b) => b[1] - a[1]);
    const topAnchor = sortedFactors[0]?.[0] || 'None yet';

    // Exact consecutive day streak ending today or yesterday
    let streak = 0;
    const cursor = new Date();
    if (!byDateStr[cursor.toDateString()]) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (byDateStr[cursor.toDateString()]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const avgScore = +(totalScore / history.length).toFixed(1);

    return {
      isEmpty: false,
      weekDays,
      dominant: { name: topMoodName, pct: topMoodPct, emoji: topMoodEmoji },
      streak,
      topAnchor,
      avgScore,
    };
  }, [history]);

  const selectedDay = analytics.weekDays[selectedDayIndex] || analytics.weekDays[0];

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
            {analytics.isEmpty
              ? 'Your personal emotional rhythm appears here as you check in.'
              : `Calculated from your ${history.length} recorded check-in${history.length === 1 ? '' : 's'}.`}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {analytics.isEmpty ? (
              <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 44, marginBottom: 12 }}>🌱</Text>
                <Text style={{ fontSize: 17, fontWeight: '800', color: theme.textPrimary, textAlign: 'center', marginBottom: 8 }}>
                  No mood check-ins yet
                </Text>
                <Text style={{ fontSize: 13.5, color: theme.textSecondary, textAlign: 'center', lineHeight: 20 }}>
                  Select how your heart feels on the Home screen whenever you're ready. Your real 7-day flow, streak, and anchors will update automatically with 100% accuracy.
                </Text>
              </View>
            ) : (
              <>
                {/* Top 3 Real Emotional Rhythm Metrics */}
                <View style={styles.metricsRow}>
                  <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                    <Text style={styles.metricIcon}>{analytics.dominant.emoji}</Text>
                    <Text style={[styles.metricVal, { color: theme.textPrimary }]}>
                      {analytics.dominant.pct}% {analytics.dominant.name}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Dominant state</Text>
                  </View>

                  <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                    <Text style={styles.metricIcon}>🔥</Text>
                    <Text style={[styles.metricVal, { color: theme.textPrimary }]}>
                      {analytics.streak} {analytics.streak === 1 ? 'Day' : 'Days'}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Check-in streak</Text>
                  </View>

                  <View style={[styles.metricCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
                    <Text style={styles.metricIcon}>🌿</Text>
                    <Text style={[styles.metricVal, { color: theme.textPrimary }]} numberOfLines={1}>
                      {analytics.topAnchor}
                    </Text>
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
                    {analytics.weekDays.map((d, i) => {
                      const isSelected = selectedDayIndex === i;
                      return (
                        <TouchableOpacity
                          key={d.dateStr}
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
                                  backgroundColor: !d.hasEntry
                                    ? theme.divider || '#E5E0EA'
                                    : isSelected
                                      ? theme.accent
                                      : theme.textMuted,
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
                {selectedDay && (
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
                )}

                {/* Companion's Real Weekly Observation Card */}
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
                      {analytics.avgScore >= 3.8
                        ? `Your average mood has been ${analytics.avgScore}/5 with "${analytics.dominant.name}" leading (${analytics.dominant.pct}%). Notice how "${analytics.topAnchor}" has been supporting your steadiness.`
                        : `You've checked in ${history.length} time${history.length === 1 ? '' : 's'} (avg ${analytics.avgScore}/5). Thank you for being honest with yourself — every gentle pause counts.`}
                    </Text>
                  </View>
                </View>
              </>
            )}
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
