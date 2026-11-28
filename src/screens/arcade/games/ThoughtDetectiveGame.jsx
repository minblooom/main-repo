// src/screens/arcade/games/ThoughtDetectiveGame.jsx
// CBT (Cognitive Behavioral Therapy) Cognitive Restructuring
// Spot automatic negative thoughts, recognize the distortion, and stamp the balanced truth.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles/ThoughtDetectiveGame.styles';
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
