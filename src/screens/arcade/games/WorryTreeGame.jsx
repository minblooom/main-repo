// src/screens/arcade/games/WorryTreeGame.jsx
// ACT (Acceptance and Commitment Therapy) Spheres of Control
// Sort worries: plant actionable seeds, let uncontrollable thoughts drift away on savanna leaves.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { soundService } from '../audio/soundService';

const WORRY_CARDS = [
  {
    id: 'w1',
    text: 'What if someone in class or at work judges my presentation?',
    isActionable: false,
    insight: 'Other people’s private thoughts are outside your hands. Let it drift.',
  },
  {
    id: 'w2',
    text: 'I have an assignment due tomorrow that I have not started.',
    isActionable: true,
    insight: 'In your hands! Opening the doc and writing 2 sentences is a real step.',
  },
  {
    id: 'w3',
    text: 'What if the future economy makes it harder to get a stable job?',
    isActionable: false,
    insight: 'Macroeconomic shifts cannot be carried on your shoulders today. Release it.',
  },
  {
    id: 'w4',
    text: 'I haven’t reached out to check on a friend who seemed quiet.',
    isActionable: true,
    insight: 'In your hands! A 5-word text: "Thinking of you, hope you’re good" is powerful.',
  },
];

export const WorryTreeGame = ({ onVictory, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plantedCount, setPlantedCount] = useState(0);
  const [releasedCount, setReleasedCount] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const card = WORRY_CARDS[currentIndex];

  const handleChoice = (choseActionable) => {
    const isCorrect = choseActionable === card.isActionable;
    soundService.playChime?.();

    if (card.isActionable) {
      setPlantedCount((p) => p + 1);
    } else {
      setReleasedCount((r) => r + 1);
    }

    setFeedback({
      isCorrect,
      text: card.insight,
    });

    setTimeout(() => {
      setFeedback(null);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= WORRY_CARDS.length) {
        onVictory?.({
          score: 400,
          summary: 'You sorted your worries with wisdom. What you cannot control has drifted into the savanna breeze.',
          seeds: 3,
        });
      } else {
        setCurrentIndex(nextIndex);
      }
    }, 1800);
  };

  return (
    <View style={styles.container}>
      {/* Top Header stats */}
      <View style={styles.headerStats}>
        <View style={styles.statPill}>
          <Text style={styles.statEmoji}>🌱</Text>
          <Text style={styles.statLabel}>Planted: {plantedCount}</Text>
        </View>
        <Text style={styles.cardCounter}>
          Thought {currentIndex + 1} of {WORRY_CARDS.length}
        </Text>
        <View style={styles.statPill}>
          <Text style={styles.statEmoji}>🍃</Text>
          <Text style={styles.statLabel}>Released: {releasedCount}</Text>
        </View>
      </View>

      {/* Center Worry Card */}
      <View style={styles.cardContainer}>
        <View style={styles.acaciaIconWrap}>
          <Text style={styles.acaciaIcon}>🌳</Text>
        </View>

        <Text style={styles.worryPromptText}>
          "{card?.text}"
        </Text>

        {feedback && (
          <View style={[styles.feedbackBanner, feedback.isCorrect ? styles.feedbackGood : styles.feedbackGentle]}>
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        )}
      </View>

      {/* Choice Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.releaseBtn]}
          activeOpacity={0.8}
          onPress={() => handleChoice(false)}
          disabled={Boolean(feedback)}
        >
          <Text style={styles.btnEmoji}>🍃</Text>
          <Text style={styles.btnTitle}>In The Wind</Text>
          <Text style={styles.btnSub}>Outside my control</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.plantBtn]}
          activeOpacity={0.8}
          onPress={() => handleChoice(true)}
          disabled={Boolean(feedback)}
        >
          <Text style={styles.btnEmoji}>🌱</Text>
          <Text style={styles.btnTitle}>In My Hands</Text>
          <Text style={styles.btnSub}>I can take a step</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statEmoji: {
    fontSize: 16,
  },
  statLabel: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '700',
  },
  cardCounter: {
    color: '#B0BEC5',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(35, 25, 20, 0.85)',
    borderWidth: 1.5,
    borderColor: '#8D6E63',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  acaciaIconWrap: {
    marginBottom: 16,
  },
  acaciaIcon: {
    fontSize: 48,
  },
  worryPromptText: {
    color: '#FFF8E1',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
    minHeight: 78,
  },
  feedbackBanner: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    width: '100%',
  },
  feedbackGood: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderWidth: 1,
    borderColor: '#81C784',
  },
  feedbackGentle: {
    backgroundColor: 'rgba(255, 183, 77, 0.25)',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  releaseBtn: {
    backgroundColor: '#37474F',
    borderColor: '#78909C',
  },
  plantBtn: {
    backgroundColor: '#2E7D32',
    borderColor: '#81C784',
  },
  btnEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  btnTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnSub: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
