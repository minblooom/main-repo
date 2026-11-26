// src/features/community/vent/VentBoxSection.jsx
// Private Release & Ephemeral Vent Box with real-time emotion-matching energy aura.
// As the user types, the typing card background and glow adapt to match anger, grief, anxiety, or stillness.

import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { analyzeTextSafety } from '../../../core/safety/safetyFilter';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';

const ANGER_WORDS = [
  'angry', 'mad', 'hate', 'furious', 'screaming', 'tired of', 'burnout',
  'fed up', 'sick of', 'exhausted', 'pressure', 'toxic', 'unfair', 'rage',
  'pissed', 'annoyed', 'yelling', 'break down', 'can’t take', 'cant take',
];

const SADNESS_WORDS = [
  'sad', 'crying', 'cry', 'tears', 'heartbroken', 'lonely', 'alone',
  'hurts', 'empty', 'grief', 'miss', 'missing', 'depressed', 'pain',
  'hopeless', 'weeping', 'unloved', 'sorrow', 'heavy heart',
];

const ANXIETY_WORDS = [
  'anxious', 'anxiety', 'panic', 'scared', 'fear', 'terrified', 'racing',
  'overwhelmed', 'spiraling', 'shaking', 'nervous', 'stress', 'suffocating',
  'worry', 'worried', 'dread', 'paralyzed', 'choking',
];

const NUMB_WORDS = [
  'numb', 'nothing', 'fog', 'cloudy', 'disconnected', 'detached',
  'blank', 'meh', 'pointless', 'grey', 'floating',
];

function getDetectedEmotion(text) {
  const lower = text.toLowerCase();

  if (ANGER_WORDS.some((w) => lower.includes(w))) {
    return {
      type: 'fire',
      label: '🔥 Fiery Release · Embers warming to receive your anger',
      bg: '#FFF1EE',
      border: '#FCA5A5',
      glow: 'rgba(239, 68, 68, 0.25)',
      accent: '#DC2626',
    };
  }

  if (SADNESS_WORDS.some((w) => lower.includes(w))) {
    return {
      type: 'water',
      label: '🌊 Deep Tide · Holding space for your sadness and tears',
      bg: '#F5F3FF',
      border: '#C4B5FD',
      glow: 'rgba(139, 92, 246, 0.25)',
      accent: '#7C3AED',
    };
  }

  if (ANXIETY_WORDS.some((w) => lower.includes(w))) {
    return {
      type: 'air',
      label: '🍃 Tulia Breath · Softening the tension and racing spiral',
      bg: '#F0FDF4',
      border: '#86EFAC',
      glow: 'rgba(34, 197, 94, 0.25)',
      accent: '#16A34A',
    };
  }

  if (NUMB_WORDS.some((w) => lower.includes(w))) {
    return {
      type: 'earth',
      label: '☁️ Heavy Stillness · Resting without pressure or guilt',
      bg: '#F1F5F9',
      border: '#CBD5E1',
      glow: 'rgba(100, 116, 139, 0.25)',
      accent: '#475569',
    };
  }

  return {
    type: 'neutral',
    label: text.trim()
      ? '✨ Tuning into your words...'
      : '✨ Pour your raw thoughts... the space will breathe with you',
    bg: '#FAF7F2',
    border: '#EFE7DC',
    glow: 'rgba(0,0,0,0.04)',
    accent: '#D96B43',
  };
}

export const VentBoxSection = () => {
  const { theme } = useTheme();
  const [ventText, setVentText] = useState('');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);
  const [isBurning, setIsBurning] = useState(false);

  // Tactile Ritual Modal state ('burn' | 'universe' | null)
  const [ritualMode, setRitualMode] = useState(null);
  const [ritualSnippet, setRitualSnippet] = useState('');
  const [ritualDone, setRitualDone] = useState(false);

  // Animations for paper-to-fire & release-to-universe
  const paperTranslateY = useRef(new Animated.Value(0)).current;
  const paperRotate = useRef(new Animated.Value(0)).current;
  const paperScale = useRef(new Animated.Value(1)).current;
  const paperOpacity = useRef(new Animated.Value(1)).current;
  const fireScale = useRef(new Animated.Value(0.8)).current;
  const sparkOpacity = useRef(new Animated.Value(0)).current;
  const starTranslateY = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(1)).current;

  // Real-time emotion detection
  const emotion = useMemo(() => getDetectedEmotion(ventText), [ventText]);

  const handleReleaseVent = (mode = 'universe') => {
    if (!ventText.trim() && !draftVoiceNote) {
      const msg = 'Write or record what is weighing on your mind first before releasing it.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Empty Release', msg);
      return;
    }

    const safety = analyzeTextSafety(ventText);
    if (safety.isCritical) {
      const helplineMsg =
        'It sounds like you may be carrying something very heavy right now. Please consider talking to a caring helpline:\n\n• Befrienders Kenya: +254 722 178 177\n• Kenya Red Cross: 1199\n• Uganda: 0800 21 21 21\n• Rwanda: 114\n• Global: findahelpline.com';
      if (Platform.OS === 'web') window.alert(helplineMsg);
      else Alert.alert("You're Not Alone 💛", helplineMsg);
    }

    soundService.playPop();
    const snippet = ventText.trim() || 'Voice vent 🎙️';
    // Strictly zero-trace: wipe from memory immediately
    setVentText('');
    setDraftVoiceNote(null);
    setIsBurning(true);
    setRitualSnippet(snippet);
    setRitualDone(false);
    setRitualMode(mode);

    const useNative = Platform.OS !== 'web';

    if (mode === 'burn') {
      paperTranslateY.setValue(-40);
      paperRotate.setValue(0);
      paperScale.setValue(1);
      paperOpacity.setValue(1);
      fireScale.setValue(0.85);
      sparkOpacity.setValue(0);

      Animated.sequence([
        // Toss crumpled paper down into the fire
        Animated.parallel([
          Animated.timing(paperTranslateY, { toValue: 68, duration: 750, easing: Easing.in(Easing.quad), useNativeDriver: useNative }),
          Animated.timing(paperRotate, { toValue: 1, duration: 750, useNativeDriver: useNative }),
          Animated.timing(paperScale, { toValue: 0.78, duration: 750, useNativeDriver: useNative }),
          Animated.timing(fireScale, { toValue: 1.35, duration: 750, useNativeDriver: useNative }),
        ]),
        // Paper chars & turns to embers/ashes
        Animated.parallel([
          Animated.timing(paperScale, { toValue: 0.15, duration: 900, useNativeDriver: useNative }),
          Animated.timing(paperOpacity, { toValue: 0, duration: 900, useNativeDriver: useNative }),
          Animated.timing(sparkOpacity, { toValue: 1, duration: 500, useNativeDriver: useNative }),
          Animated.timing(fireScale, { toValue: 0.95, duration: 900, useNativeDriver: useNative }),
        ]),
      ]).start(() => {
        setIsBurning(false);
        setRitualDone(true);
        soundService.playVictory();
      });
    } else {
      starTranslateY.setValue(40);
      starScale.setValue(1);
      paperOpacity.setValue(1);
      sparkOpacity.setValue(0.3);

      Animated.parallel([
        Animated.timing(starTranslateY, { toValue: -150, duration: 1700, easing: Easing.out(Easing.cubic), useNativeDriver: useNative }),
        Animated.timing(starScale, { toValue: 0.25, duration: 1700, useNativeDriver: useNative }),
        Animated.timing(paperOpacity, { toValue: 0, duration: 1650, useNativeDriver: useNative }),
        Animated.timing(sparkOpacity, { toValue: 1, duration: 1200, useNativeDriver: useNative }),
      ]).start(() => {
        setIsBurning(false);
        setRitualDone(true);
        soundService.playVictory();
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Intro Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>The Release Box 💨</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Zero-trace sanctuary: write or speak what is on your chest, then release it to the universe or burn it to ashes. Nothing is ever saved or tracked.
        </Text>
      </View>

      {/* Dynamic Emotion-Matching Write Card */}
      <View
        style={[
          styles.writeCard,
          {
            backgroundColor: emotion.bg,
            borderColor: emotion.border,
            shadowColor: emotion.accent,
          },
        ]}
      >
        {/* Real-time Somatic Aura Indicator */}
        <View style={styles.auraBadge}>
          <Text style={[styles.auraText, { color: emotion.accent }]}>
            {emotion.label}
          </Text>
        </View>

        <TextInput
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              borderColor: emotion.border,
              backgroundColor: 'rgba(255,255,255,0.7)',
            },
            Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
          ]}
          placeholder="Unburden your heart here. No judgment, no names... (the background breathes with your emotion)"
          placeholderTextColor={theme.textMuted}
          value={ventText}
          onChangeText={setVentText}
          multiline
          editable={!isBurning}
        />

        <View style={{ marginBottom: 12 }}>
          <VoiceInputControls
            voiceNote={draftVoiceNote}
            onVoiceNoteChange={setDraftVoiceNote}
            onAppendTranscript={(chunk) =>
              setVentText((prev) => (prev ? `${prev} ${chunk}` : chunk))
            }
            compact
          />
        </View>

        <View style={styles.actionRow}>
          {/* Burn Worry Button */}
          <TouchableOpacity
            style={[styles.burnBtn, { borderColor: '#E53E3E' }]}
            onPress={() => handleReleaseVent('burn')}
            disabled={isBurning}
            activeOpacity={0.8}
          >
            <Text style={styles.burnIcon}>🔥</Text>
            <Text style={styles.burnBtnText}>Choma (Burn to Ashes)</Text>
          </TouchableOpacity>

          {/* Release to Universe */}
          <TouchableOpacity
            style={[
              styles.postBtn,
              { backgroundColor: theme.accent, opacity: ventText.trim() || draftVoiceNote ? 1 : 0.6 },
            ]}
            onPress={() => handleReleaseVent('universe')}
            disabled={isBurning || (!ventText.trim() && !draftVoiceNote)}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>Release to Universe 🌌</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Zero-Trace Guarantee Note */}
      <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.divider, marginTop: 12 }]}>
        <Text style={styles.emptyEmoji}>🍃</Text>
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Zero-Trace Safe Vent</Text>
        <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
          We never store, log, or track anything you release here. Once you let it go, it is gone completely.
        </Text>
      </View>

      {/* Tactile Paper-to-Fire / Release-to-Universe Ritual Modal */}
      <Modal
        visible={!!ritualMode}
        transparent
        animationType="fade"
        onRequestClose={() => !isBurning && setRitualMode(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: ritualMode === 'burn' ? 'rgba(24, 10, 8, 0.88)' : 'rgba(11, 16, 38, 0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View style={{ width: '100%', maxWidth: 380, alignItems: 'center', minHeight: 320, justifyContent: 'center' }}>
            {ritualMode === 'burn' ? (
              <>
                <Animated.View
                  style={{
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FDBA74',
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 16,
                    width: '86%',
                    opacity: paperOpacity,
                    transform: [
                      { translateY: paperTranslateY },
                      { scale: paperScale },
                      {
                        rotate: paperRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '-14deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#9A3412', marginBottom: 4 }}>
                    📄 YOUR PAPER NOTE
                  </Text>
                  <Text style={{ fontSize: 13, color: '#431407', fontStyle: 'italic' }} numberOfLines={3}>
                    "{ritualSnippet}"
                  </Text>
                </Animated.View>

                <Animated.View style={{ marginTop: 24, transform: [{ scale: fireScale }], alignItems: 'center' }}>
                  <Text style={{ fontSize: 64 }}>🔥</Text>
                </Animated.View>

                <Animated.Text style={{ opacity: sparkOpacity, fontSize: 20, marginTop: -12, letterSpacing: 8 }}>
                  ✨ 💨 ✨
                </Animated.Text>
              </>
            ) : (
              <>
                <Animated.Text style={{ opacity: sparkOpacity, fontSize: 22, letterSpacing: 10, marginBottom: 24 }}>
                  ✨ 🌟 💫 🌙
                </Animated.Text>

                <Animated.View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    borderColor: 'rgba(196,181,253,0.5)',
                    borderWidth: 1,
                    borderRadius: 24,
                    padding: 18,
                    width: '86%',
                    alignItems: 'center',
                    opacity: paperOpacity,
                    transform: [{ translateY: starTranslateY }, { scale: starScale }],
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 6 }}>🏮</Text>
                  <Text style={{ fontSize: 13, color: '#F5F3FF', textAlign: 'center', fontStyle: 'italic' }} numberOfLines={3}>
                    "{ritualSnippet}"
                  </Text>
                </Animated.View>
              </>
            )}

            {ritualDone && (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' }}>
                  {ritualMode === 'burn' ? 'Imeyeyuka — Burned to Ashes' : 'Released to the Universe'}
                </Text>
                <Text style={{ fontSize: 13.5, color: '#E2E8F0', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                  Your words have dissolved completely — nothing was saved or tracked. Take a slow, peaceful breath.
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    backgroundColor: ritualMode === 'burn' ? '#EA580C' : '#7C3AED',
                    paddingHorizontal: 26,
                    paddingVertical: 12,
                    borderRadius: 16,
                  }}
                  onPress={() => setRitualMode(null)}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>I feel lighter ✓</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  writeCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    marginBottom: 24,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    gap: 12,
  },
  auraBadge: {
    paddingVertical: 3,
  },
  auraText: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  input: {
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  burnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.2,
    backgroundColor: '#FFF5F5',
  },
  burnIcon: {
    fontSize: 16,
  },
  burnBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E53E3E',
  },
  postBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  postBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  feed: {
    gap: 12,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  ventCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  reactBtnActive: {
    borderWidth: 1,
  },
  reactEmoji: {
    fontSize: 13,
  },
  reactLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 340,
  },
});
