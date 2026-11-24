// src/screens/arcade/games/ThoughtDetectiveGame.jsx
// CBT (Cognitive Behavioral Therapy) Cognitive Restructuring
// Spot automatic negative thoughts, recognize the distortion, and stamp the balanced truth.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { soundService } from '../audio/soundService';

const CASES = [
  {
    id: 'case-1',
    situation: 'You sent a text to a friend 4 hours ago and they have not replied.',
    automaticThought: 'They are tired of me and probably talking about me behind my back.',
    distortion: 'Mind-Reading & Catastrophizing',
    options: [
      {
        text: 'They are definitely ghosting me because I am too much to deal with.',
        isBalanced: false,
        explanation: 'This feeds into harsh self-criticism without evidence.',
      },
      {
        text: 'They might be busy, napping, or out of airtime. Their silence is about their day, not my worth.',
        isBalanced: true,
        explanation: 'Balanced & grounded in reality! People have full, messy lives.',
      },
      {
        text: 'I should send 5 more texts to demand an explanation right now.',
        isBalanced: false,
        explanation: 'This comes from acute panic. Pausing brings clarity.',
      },
    ],
  },
  {
    id: 'case-2',
    situation: 'You stumbled on one question during a group discussion or interview.',
    automaticThought: 'I ruined everything. Everyone thinks I am completely incompetent.',
    distortion: 'All-or-Nothing Thinking',
    options: [
      {
        text: 'One imperfect moment does not erase the 9 other things I answered well.',
        isBalanced: true,
        explanation: 'Spot on! Human conversations are allowed to be imperfect.',
      },
      {
        text: 'I should never speak up in public ever again.',
        isBalanced: false,
        explanation: 'That is avoidance talking. Growth happens when we stumble and keep going.',
      },
      {
        text: 'I am just fundamentally bad at speaking compared to everyone else.',
        isBalanced: false,
        explanation: 'Comparing your inside feelings to other people’s outside composure is an unfair mirror.',
      },
    ],
  },
];

export const ThoughtDetectiveGame = ({ onVictory, theme }) => {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const activeCase = CASES[caseIndex];

  const handleSelectOption = (option, index) => {
    setSelectedOption(index);
    soundService.playChime?.();

    setFeedback({
      isBalanced: option.isBalanced,
      text: option.explanation,
    });

    if (option.isBalanced) {
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        const nextCase = caseIndex + 1;
        if (nextCase >= CASES.length) {
          onVictory?.({
            score: 500,
            summary: 'Case Closed! You proved that anxious thoughts are guesses, not facts.',
            seeds: 3,
          });
        } else {
          setCaseIndex(nextCase);
        }
      }, 2000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Detective Badge */}
      <View style={styles.topBadgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>CASE FILE #{caseIndex + 1}</Text>
        </View>
        <Text style={styles.distortionTag}>
          Distortion: {activeCase?.distortion}
        </Text>
      </View>

      {/* Case Situation & Suspect Thought */}
      <View style={styles.caseCard}>
        <Text style={styles.situationLabel}>THE SITUATION</Text>
        <Text style={styles.situationText}>{activeCase?.situation}</Text>

        <View style={styles.divider} />

        <Text style={styles.thoughtLabel}>SUSPECT THOUGHT 🔍</Text>
        <Text style={styles.thoughtText}>"{activeCase?.automaticThought}"</Text>
      </View>

      {/* Question instruction */}
      <Text style={styles.instructionHeader}>
        Pick the grounded, balanced reality:
      </Text>

      {/* Options */}
      <View style={styles.optionsWrap}>
        {activeCase?.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionCard,
                isSelected && (opt.isBalanced ? styles.optionGood : styles.optionUnbalanced),
              ]}
              onPress={() => handleSelectOption(opt, idx)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Banner */}
      {feedback && (
        <View style={[styles.feedbackBanner, feedback.isBalanced ? styles.feedbackGood : styles.feedbackTryAgain]}>
          <Text style={styles.feedbackTitle}>
            {feedback.isBalanced ? '✓ GROUNDED REALITY FOUND' : '🔍 NOT QUITE'}
          </Text>
          <Text style={styles.feedbackBody}>{feedback.text}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 16,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 420,
  },
  badge: {
    backgroundColor: '#3949AB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#E8EAF6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  distortionTag: {
    color: '#FFB74D',
    fontSize: 12,
    fontWeight: '700',
  },
  caseCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(20, 25, 45, 0.9)',
    borderWidth: 1.5,
    borderColor: '#3F51B5',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  situationLabel: {
    color: '#9FA8DA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  situationText: {
    color: '#ECEFF1',
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  thoughtLabel: {
    color: '#FF8A65',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  thoughtText: {
    color: '#FFF8E1',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  instructionHeader: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'flex-start',
    maxWidth: 420,
  },
  optionsWrap: {
    width: '100%',
    maxWidth: 420,
    gap: 10,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  optionGood: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderColor: '#81C784',
  },
  optionUnbalanced: {
    backgroundColor: 'rgba(239, 83, 80, 0.25)',
    borderColor: '#E57373',
  },
  optionText: {
    color: '#ECEFF1',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  feedbackBanner: {
    width: '100%',
    maxWidth: 420,
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  feedbackGood: {
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
    borderWidth: 1,
    borderColor: '#81C784',
  },
  feedbackTryAgain: {
    backgroundColor: 'rgba(198, 40, 40, 0.85)',
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  feedbackBody: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
