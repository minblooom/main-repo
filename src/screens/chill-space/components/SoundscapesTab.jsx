import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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

const s = StyleSheet.create({
  wrap: { gap: 16 },
  pacerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
  },
  pacerTag: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1 },
  pacerTitle: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  pacerSub: { fontSize: 12.5, textAlign: 'center', marginTop: 4, maxWidth: 320 },
  phaseLabel: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  counterNum: { fontSize: 30, fontWeight: '900', marginVertical: 4 },
  breathBtn: {
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 20,
  },
  breathBtnText: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '800' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionHeading: { fontSize: 17, fontWeight: '800' },
  sectionSub: { fontSize: 12, marginTop: 2 },
  stopPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  stopPillText: { fontSize: 12, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  soundCard: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 155,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  soundEmoji: { fontSize: 28 },
  soundTitle: { fontSize: 14.5, fontWeight: '800' },
  soundDesc: { fontSize: 12, lineHeight: 17 },
  playPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  playPillText: { fontSize: 11.5, fontWeight: '800' },
});
