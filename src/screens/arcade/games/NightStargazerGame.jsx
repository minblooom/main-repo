// src/screens/arcade/games/NightStargazerGame.jsx
// Night Stargazer 4-7-8 Sleep Winddown
// Clinically validated parasympathetic breathing & star constellation connection.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { styles } from './styles/NightStargazerGame.styles';
import { soundService } from '../audio/soundService';

const PHASES = [
  { name: 'INHALE', duration: 4, label: 'Inhale through your nose', color: '#60A5FA' },
  { name: 'HOLD', duration: 7, label: 'Hold softly and rest', color: '#818CF8' },
  { name: 'EXHALE', duration: 8, label: 'Exhale slowly through mouth', color: '#C084FC' },
];

const CONSTELLATIONS = [
  { name: 'Star of Rest', coord: '✨ (East Horizon)' },
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
