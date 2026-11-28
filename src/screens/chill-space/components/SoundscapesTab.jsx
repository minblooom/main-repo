import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { s } from './styles/SoundscapesTab.styles';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { soundEngine } from '../../../services/soundEngine';

const SOUNDSCAPES = [
  {
    id: 'rain',
    emoji: '🌧️',
    title: 'Rain on Mabati',
    desc: 'Warm, steady rainfall to quiet racing thoughts.',
  },
  {
    id: 'wind',
    emoji: '🌾',
    title: 'Savanna Breeze',
    desc: 'Soft twilight wind through open acacia grass.',
  },
  {
    id: 'ocean',
    emoji: '🌊',
    title: 'Coastal Waves',
    desc: 'Slow, rhythmic tide swells every six seconds.',
  },
  {
    id: 'chime',
    emoji: '🔔',
    title: '432Hz Singing Bowl',
    desc: 'Resonant meditation chime to anchor your focus.',
  },
];

export const SoundscapesTab = () => {
  const { theme, companionId } = useTheme();
  const [activeSound, setActiveSound] = useState(null);

  // 4-4-6 Calming Breath Pacer
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale gently');
  const [counter, setCounter] = useState(4);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      soundEngine.stopSoundscape();
    };
  }, []);

  useEffect(() => {
    if (!isBreathing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let phase = 'inhale';
    let count = 4;
    setBreathPhase('Inhale gently');
    setCounter(4);
    soundEngine.playTibetanChime(432);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    timerRef.current = setInterval(() => {
      count -= 1;
      setCounter(count);

      if (count <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          count = 4;
          setBreathPhase('Hold softly');
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = 6;
          setBreathPhase('Exhale slowly');
          soundEngine.playTibetanChime(396);
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        } else {
          phase = 'inhale';
          count = 4;
          setBreathPhase('Inhale gently');
          soundEngine.playTibetanChime(432);
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        setCounter(count);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathing]);

  const handleToggleSound = (id) => {
    if (activeSound === id && id !== 'chime') {
      soundEngine.stopSoundscape();
      setActiveSound(null);
      return;
    }
    soundEngine.startSoundscape(id, 0.45);
    setActiveSound(id === 'chime' ? null : id);
  };

  return (
    <View style={s.wrap}>
      {/* 4-4-6 Calming Breath Pacer */}
      <View style={[s.pacerCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
        <Text style={[s.pacerTag, { color: theme.accent }]}>4 · 4 · 6 NERVOUS SYSTEM RESET</Text>
        <Text style={[s.pacerTitle, { color: theme.textPrimary }]}>Breathe with your companion</Text>
        <Text style={[s.pacerSub, { color: theme.textMuted }]}>
          Four seconds in, four seconds hold, six seconds out. No rush.
        </Text>

        <View style={{ marginVertical: 10 }}>
          <AnimatedCompanion
            companionId={companionId || 'noodle'}
            state={isBreathing ? 'happy' : 'idle'}
            size={84}
            interactive={false}
          />
        </View>

        <Text style={[s.phaseLabel, { color: theme.accent }]}>
          {isBreathing ? breathPhase : 'Ready whenever you are'}
        </Text>
        <Text style={[s.counterNum, { color: theme.textPrimary }]}>
          {isBreathing ? `${counter}s` : '4 · 4 · 6'}
        </Text>

        <TouchableOpacity
          style={[s.breathBtn, { backgroundColor: isBreathing ? '#B85450' : theme.accent }]}
          onPress={() => setIsBreathing((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={s.breathBtnText}>
            {isBreathing ? 'Pause breathing' : 'Begin calming breath'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ambient Soundscapes */}
      <View style={s.headerRow}>
        <View>
          <Text style={[s.sectionHeading, { color: theme.textPrimary }]}>🌿 Ambient Soundscapes</Text>
          <Text style={[s.sectionSub, { color: theme.textMuted }]}>
            Instant calming audio — works offline with zero distractions
          </Text>
        </View>
        {activeSound && (
          <TouchableOpacity
            style={[s.stopPill, { backgroundColor: theme.heroBg, borderColor: theme.divider }]}
            onPress={() => {
              soundEngine.stopSoundscape();
              setActiveSound(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={[s.stopPillText, { color: theme.accent }]}>Quiet all</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={s.grid}>
        {SOUNDSCAPES.map((item) => {
          const isPlaying = activeSound === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                s.soundCard,
                {
                  backgroundColor: isPlaying ? theme.heroBg : theme.cardBg,
                  borderColor: isPlaying ? theme.accent : theme.divider,
                },
              ]}
              onPress={() => handleToggleSound(item.id)}
              activeOpacity={0.82}
            >
              <Text style={s.soundEmoji}>{item.emoji}</Text>
              <Text style={[s.soundTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[s.soundDesc, { color: theme.textMuted }]}>{item.desc}</Text>
              <View style={[s.playPill, { backgroundColor: isPlaying ? theme.accent : theme.bg }]}>
                <Text style={[s.playPillText, { color: isPlaying ? '#FFFFFF' : theme.accent }]}>
                  {item.id === 'chime' ? 'Ring chime' : isPlaying ? 'Playing · Tap to pause' : 'Listen'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
