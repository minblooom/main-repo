// src/screens/calm/TuliaBreathScreen.jsx
// Tulia Breath Grounding Exercise
// 2-minute paced breathing with gentle guidance and animated pacing ring

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors } from '../../theme/colors';

const PHASES = [
  { name: 'Inhale', sw: 'Vuta pumzi', duration: 4000, toScale: 1.25 },
  { name: 'Hold', sw: 'Shikilia kwa utulivu', duration: 4000, toScale: 1.25 },
  { name: 'Exhale', sw: 'Toa polepole', duration: 4000, toScale: 0.95 },
  { name: 'Rest', sw: 'Tulia hapa', duration: 2000, toScale: 0.95 },
];

export const TuliaBreathScreen = ({ navigation }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [isRunning, setIsRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(1);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  useEffect(() => {
    let timeoutId;

    const runPhase = (idx) => {
      if (!isRunningRef.current) return;
      const phase = PHASES[idx];
      setPhaseIndex(idx);

      Animated.timing(scaleAnim, {
        toValue: phase.toScale,
        duration: phase.duration,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      timeoutId = setTimeout(() => {
        if (!isRunningRef.current) return;
        const nextIdx = (idx + 1) % PHASES.length;
        if (nextIdx === 0) {
          setCycleCount((c) => c + 1);
        }
        runPhase(nextIdx);
      }, phase.duration);
    };

    if (isRunning) {
      runPhase(0);
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }

    return () => clearTimeout(timeoutId);
  }, [isRunning]);

  const activePhase = PHASES[phaseIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isWide && styles.containerWide]}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.() || navigation?.navigate?.('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnText}>← Sanctuary Home</Text>
          </TouchableOpacity>
          <Text style={styles.tagText}>CYCLE {cycleCount} OF 5 · 2 MIN RESET</Text>
        </View>

        {/* Breathing Circle Area */}
        <View style={styles.breathingZone}>
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.middleRing}>
              <View style={styles.innerMascotCircle}>
                <Image
                  source={require('../../../assets/images/sloth.jpg')}
                  style={styles.slothImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </Animated.View>

          {/* Phase Guidance */}
          <View style={styles.guidanceBox}>
            <Text style={styles.phaseTitle}>{activePhase.name}</Text>
            <Text style={styles.phaseSub}>{activePhase.sw}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.playPauseBtn, isRunning && styles.pauseBtn]}
            onPress={() => setIsRunning((r) => !r)}
            activeOpacity={0.88}
          >
            <Text style={[styles.playPauseText, isRunning && styles.pauseText]}>
              {isRunning ? 'Pause breathing' : 'Resume breathing'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Gentle Guidance */}
        <Text style={styles.footerTip}>
          There is nothing to get right. If your mind wanders, gently bring it back to your breath.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDF5EE',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  containerWide: {
    paddingVertical: 36,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4EBD9',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#285437',
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#528562',
    letterSpacing: 0.8,
  },
  breathingZone: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  outerRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(214, 239, 222, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#285437',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  innerMascotCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    backgroundColor: '#FAF5EE',
  },
  slothImage: {
    width: 130,
    height: 150,
    marginTop: -8,
  },
  guidanceBox: {
    alignItems: 'center',
    marginTop: 28,
    gap: 4,
  },
  phaseTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C3E28',
    letterSpacing: -0.3,
  },
  phaseSub: {
    fontSize: 14,
    color: '#497354',
    fontStyle: 'italic',
  },
  controlsRow: {
    width: '100%',
    alignItems: 'center',
  },
  playPauseBtn: {
    backgroundColor: '#285437',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  pauseBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C6E3CD',
  },
  playPauseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  pauseText: {
    color: '#285437',
  },
  footerTip: {
    fontSize: 12,
    color: '#658D70',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
