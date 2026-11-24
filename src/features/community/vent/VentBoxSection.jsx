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
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../../../screens/arcade/audio/soundService';
import { useCommunityStore } from '../store/communityStore';
import { VoiceInputControls } from '../../../components/voice/VoiceInputControls';
import { VoiceNotePlayer } from '../../../components/voice/VoiceNotePlayer';

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
  const { vents, addVent, deleteVent, toggleHugVent, toggleCandleVent } = useCommunityStore();
  const [ventText, setVentText] = useState('');
  const [draftVoiceNote, setDraftVoiceNote] = useState(null);
  const [isBurning, setIsBurning] = useState(false);

  // Dissolve/Burn Animation
  const burnOpacity = useRef(new Animated.Value(1)).current;
  const burnScale = useRef(new Animated.Value(1)).current;

  // Real-time emotion detection
  const emotion = useMemo(() => getDetectedEmotion(ventText), [ventText]);

  const handleBurnWorry = () => {
    if (!ventText.trim() && !draftVoiceNote) {
      Alert.alert('Empty Release', 'Write or record what is weighing on your mind first before releasing it to the embers.');
      return;
    }

    soundService.playPop();
    setIsBurning(true);

    Animated.parallel([
      Animated.timing(burnOpacity, {
        toValue: 0,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(burnScale, {
        toValue: 0.85,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      setVentText('');
      setDraftVoiceNote(null);
      burnOpacity.setValue(1);
      burnScale.setValue(1);
      setIsBurning(false);
      soundService.playVictory();
      Alert.alert(
        'Imeyeyuka (Released) 🔥',
        'Your note has been cleared to ashes. Take a quiet, steady breath. You are free from carrying this weight right now.'
      );
    });
  };

  const handlePostAnonymous = () => {
    if (!ventText.trim() && !draftVoiceNote) return;
    soundService.playPop();
    addVent(ventText.trim(), draftVoiceNote);
    setVentText('');
    setDraftVoiceNote(null);
    Alert.alert(
      'Shared Anonymously 🫂',
      'Your thought was placed into the quiet sanctuary. You are seen and supported.'
    );
  };

  const handleToggleHug = (id) => {
    soundService.playPop();
    toggleHugVent(id);
  };

  const handleToggleCandle = (id) => {
    soundService.playPop();
    toggleCandleVent(id);
  };

  return (
    <View style={styles.container}>
      {/* Intro Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>The Release Box 💨</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Write what is on your chest. You can share anonymously for peer warmth, or burn it completely to ashes.
        </Text>
      </View>

      {/* Dynamic Emotion-Matching Animated Write Card */}
      <Animated.View
        style={[
          styles.writeCard,
          {
            backgroundColor: emotion.bg,
            borderColor: emotion.border,
            shadowColor: emotion.accent,
            opacity: burnOpacity,
            transform: [{ scale: burnScale }],
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
            onPress={handleBurnWorry}
            disabled={isBurning}
            activeOpacity={0.8}
          >
            <Text style={styles.burnIcon}>🔥</Text>
            <Text style={styles.burnBtnText}>Choma (Burn to Ashes)</Text>
          </TouchableOpacity>

          {/* Post Anonymously */}
          <TouchableOpacity
            style={[
              styles.postBtn,
              { backgroundColor: theme.accent, opacity: ventText.trim() || draftVoiceNote ? 1 : 0.6 },
            ]}
            onPress={handlePostAnonymous}
            disabled={isBurning || (!ventText.trim() && !draftVoiceNote)}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>Post Anonymously 🫂</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Anonymous Vent Feed */}
      <View style={styles.feed}>
        <Text style={[styles.feedTitle, { color: theme.textSecondary }]}>Safe Anonymous Voices</Text>
        {vents.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
            <Text style={styles.emptyEmoji}>🍃</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Safe & Silent Sanctuary</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              No anonymous notes shared yet. Write what is on your chest above to release it to the embers or place it gently here.
            </Text>
          </View>
        ) : (
          vents.map((v) => (
            <View
              key={v.id}
              style={[styles.ventCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
            >
              <View style={[styles.cardHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={[styles.anonTag, { color: theme.textMuted }]}>
                  🍃 Anonymous Sanctuary Voice · {v.createdAt || v.time || 'Recently'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      if (window.confirm('Remove this vent note?')) deleteVent(v.id);
                    } else {
                      Alert.alert('Remove Note', 'Remove this vent note?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => deleteVent(v.id) },
                      ]);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#C0392B' }}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>

              {!!v.text && (
                <Text style={[styles.cardText, { color: theme.textPrimary }]}>{v.text}</Text>
              )}

              {v.voiceNote && (
                <View style={{ marginBottom: 12 }}>
                  <VoiceNotePlayer voiceNote={v.voiceNote} compact />
                </View>
              )}

              {/* Hug & Candle Reactions */}
              <View style={styles.reactionsRow}>
                <TouchableOpacity
                  style={[
                    styles.reactBtn,
                    { borderColor: theme.divider },
                    v.hasHugged && [styles.reactBtnActive, { backgroundColor: 'rgba(217, 107, 67, 0.15)', borderColor: '#D96B43' }],
                  ]}
                  onPress={() => handleToggleHug(v.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.reactEmoji}>🫂</Text>
                  <Text style={[styles.reactLabel, { color: theme.textSecondary }, v.hasHugged && { color: '#D96B43', fontWeight: '800' }]}>
                    {v.hugs} {v.hasHugged ? 'Hugged' : 'Send Hug'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.reactBtn,
                    { borderColor: theme.divider },
                    v.hasCandle && [styles.reactBtnActive, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }],
                  ]}
                  onPress={() => handleToggleCandle(v.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.reactEmoji}>🕯️</Text>
                  <Text style={[styles.reactLabel, { color: theme.textSecondary }, v.hasCandle && { color: '#F59E0B', fontWeight: '800' }]}>
                    {v.candles} {v.hasCandle ? 'Lit' : 'Light Candle'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
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
