// src/screens/arcade/games/NightStargazerGame.jsx
// Night Stargazer 4-7-8 Sleep Winddown
// Clinically validated parasympathetic breathing & star constellation connection.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { soundService } from '../audio/soundService';

const PHASES = [
  { name: 'INHALE', duration: 4, label: 'Inhale through your nose', color: '#60A5FA' },
  { name: 'HOLD', duration: 7, label: 'Hold softly and rest', color: '#818CF8' },
  { name: 'EXHALE', duration: 8, label: 'Exhale slowly through mouth', color: '#C084FC' },
];

const CONSTELLATIONS = [
  { name: 'Star of Rest', coord: '⭐ (East Horizon)' },
  { name: 'The Acacia Branch', coord: '🌿 (Mid Sky)' },
  { name: 'Savanna River', coord: '🌊 (Zenith)' },
  { name: 'Morning Star of Peace', coord: '✨ (Dawn Peak)' },
];

export const NightStargazerGame = ({ onFinish }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const starScale = useRef(new Animated.Value(1)).current;
  const starOpacity = useRef(new Animated.Value(0.4)).current;

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    if (!isRunning) return;

    let timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          const nextIndex = (phaseIndex + 1) % PHASES.length;
          setPhaseIndex(nextIndex);

          if (nextIndex === 0) {
            // Completed a full 4-7-8 cycle
            soundService.playVictory();
            const newCount = completedCycles + 1;
            setCompletedCycles(newCount);
            if (newCount >= 4) {
              clearInterval(timer);
              setTimeout(() => {
                onFinish?.({
                  summary: 'You linked all 4 stars in the Acacia Constellation. Your heart rate is gentle and ready for sleep.',
                  seeds: 15,
                });
              }, 600);
            }
          } else {
            soundService.playPop();
          }

          return PHASES[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phaseIndex, completedCycles]);

  // Animate star scale & glow based on phase
  useEffect(() => {
    if (!isRunning) return;

    if (currentPhase.name === 'INHALE') {
      Animated.parallel([
        Animated.timing(starScale, { toValue: 1.6, duration: 4000, useNativeDriver: true }),
        Animated.timing(starOpacity, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ]).start();
    } else if (currentPhase.name === 'HOLD') {
      Animated.parallel([
        Animated.timing(starScale, { toValue: 1.65, duration: 7000, useNativeDriver: true }),
        Animated.timing(starOpacity, { toValue: 0.9, duration: 7000, useNativeDriver: true }),
      ]).start();
    } else if (currentPhase.name === 'EXHALE') {
      Animated.parallel([
        Animated.timing(starScale, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(starOpacity, { toValue: 0.35, duration: 8000, useNativeDriver: true }),
      ]).start();
    }
  }, [currentPhase.name, isRunning]);

  const handleStart = () => {
    soundService.playClick();
    setIsRunning(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.badgeText}>EVIDENCE-BASED 4-7-8 SLEEP RHYTHM</Text>
      <Text style={styles.title}>The Acacia Constellation</Text>
      <Text style={styles.subtitle}>
        {CONSTELLATIONS[Math.min(completedCycles, CONSTELLATIONS.length - 1)].name} ({completedCycles}/4 Stars Linked)
      </Text>

      {/* Star Orb Canvas */}
      <View style={styles.orbWrap}>
        <Animated.View
          style={[
            styles.starGlow,
            {
              transform: [{ scale: starScale }],
              opacity: starOpacity,
              backgroundColor: currentPhase.color,
            },
          ]}
        />
        <View style={styles.innerCore}>
          <Text style={styles.phaseName}>{isRunning ? currentPhase.name : 'READY'}</Text>
          <Text style={styles.countdownNumber}>{isRunning ? countdown : '4-7-8'}</Text>
        </View>
      </View>

      <Text style={[styles.instruction, { color: isRunning ? currentPhase.color : '#93C5FD' }]}>
        {isRunning ? currentPhase.label : 'Tap below to quiet your night mind'}
      </Text>

      {/* Constellation Progress Track */}
      <View style={styles.constellationTrack}>
        {CONSTELLATIONS.map((c, idx) => (
          <View key={idx} style={styles.starItem}>
            <View style={[styles.starDot, idx < completedCycles && styles.starDotActive]}>
              <Text style={styles.starIcon}>{idx < completedCycles ? '★' : '☆'}</Text>
            </View>
            <Text style={[styles.starLabel, idx < completedCycles && styles.starLabelActive]}>
              {c.name.split(' ')[0]}
            </Text>
          </View>
        ))}
      </View>

      {!isRunning ? (
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Begin Winddown ✨</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.comfortNote}>
          🌙 Let the heaviness of today melt into the night. You have carried enough.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 32,
  },
  orbWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  starGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  innerCore: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#070D1B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  phaseName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 1.5,
  },
  countdownNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
    minHeight: 24,
  },
  constellationTrack: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  starItem: {
    alignItems: 'center',
    gap: 6,
  },
  starDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  starDotActive: {
    backgroundColor: 'rgba(147, 197, 253, 0.25)',
    borderColor: '#93C5FD',
  },
  starIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  starLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
  },
  starLabelActive: {
    color: '#93C5FD',
  },
  startBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 24,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  comfortNote: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
});
