// src/screens/arcade/games/BubbleBreathingGame.jsx
// Scientifically designed 4-4-4 diaphragmatic breathing for Vagus Nerve Regulation
// Follows expanding glowing clay bubbles with gentle haptic/sound rhythm.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { styles } from './styles/BubbleBreathingGame.styles';
import { soundService } from '../audio/soundService';

const PHASES = [
  { label: 'Inhale', duration: 4000, instruction: 'Breathe in slowly through your nose...', color: '#80CBC4' },
  { label: 'Hold', duration: 4000, instruction: 'Rest gently at the top. Soft shoulders.', color: '#FFE082' },
  { label: 'Exhale', duration: 4000, instruction: 'Release all tension out through your mouth...', color: '#FFAB91' },
];

const TARGET_CYCLES = 3;

export const BubbleBreathingGame = ({ onVictory, theme }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);

  const bubbleScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isActive) return;

    // Animate bubble based on phase
    if (phaseIndex === 0) {
      // Inhale: expand
      Animated.parallel([
        Animated.timing(bubbleScale, {
          toValue: 1.5,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.8,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
      soundService.playChime?.();
    } else if (phaseIndex === 1) {
      // Hold: gentle float
      Animated.timing(pulseOpacity, {
        toValue: 0.6,
        duration: 4000,
        useNativeDriver: true,
      }).start();
    } else if (phaseIndex === 2) {
      // Exhale: contract
      Animated.parallel([
        Animated.timing(bubbleScale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.2,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Countdown timer for 4 seconds per phase
    setSecondsLeft(4);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          advancePhase();
          return 4;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phaseIndex, cycleCount, isActive]);

  const advancePhase = () => {
    setPhaseIndex((prev) => {
      const next = prev + 1;
      if (next >= PHASES.length) {
        const nextCycle = cycleCount + 1;
        setCycleCount(nextCycle);
        if (nextCycle >= TARGET_CYCLES) {
          setIsActive(false);
          setTimeout(() => {
            onVictory?.({
              score: 300,
              summary: '3 mindful breathing cycles completed. Your nervous system is grounded.',
              seeds: 2,
            });
          }, 800);
        }
        return 0;
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Progress Badge */}
      <View style={styles.progressBadge}>
        <Text style={styles.progressText}>
          Cycle {Math.min(cycleCount + 1, TARGET_CYCLES)} of {TARGET_CYCLES}
        </Text>
      </View>

      {/* Center Interactive Animated Bubble */}
      <View style={styles.bubbleArea}>
        <Animated.View
          style={[
            styles.outerHalo,
            {
              transform: [{ scale: bubbleScale }],
              opacity: pulseOpacity,
              backgroundColor: currentPhase.color,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bubbleCircle,
            {
              transform: [{ scale: bubbleScale }],
              borderColor: currentPhase.color,
            },
          ]}
        >
          <Text style={[styles.phaseLabel, { color: currentPhase.color }]}>
            {currentPhase.label}
          </Text>
          <Text style={styles.secondsCounter}>{secondsLeft}s</Text>
        </Animated.View>
      </View>

      {/* Gentle Guidance Subtext */}
      <View style={styles.instructionCard}>
        <Text style={styles.instructionText}>{currentPhase.instruction}</Text>
      </View>
    </View>
  );
};
