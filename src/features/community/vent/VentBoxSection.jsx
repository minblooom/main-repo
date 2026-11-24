// src/features/community/vent/VentBoxSection.jsx
// Private Release & Ephemeral Vent Box from react-frontend.
// Allows users to write heavy thoughts and either post anonymously or burn them to ashes.

import React, { useState, useRef } from 'react';
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

export const VentBoxSection = () => {
  const { theme } = useTheme();
  const { vents, addVent, toggleHugVent, toggleCandleVent } = useCommunityStore();
  const [ventText, setVentText] = useState('');
  const [isBurning, setIsBurning] = useState(false);

  // Dissolve/Burn Animation
  const burnOpacity = useRef(new Animated.Value(1)).current;
  const burnScale = useRef(new Animated.Value(1)).current;

  const handleBurnWorry = () => {
    if (!ventText.trim()) {
      Alert.alert('Empty Release', 'Write what is weighing on your mind first before releasing it to the embers.');
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
    if (!ventText.trim()) return;
    soundService.playPop();
    addVent(ventText.trim());
    setVentText('');
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

      {/* Animated Write Card with Burn / Post Actions */}
      <Animated.View
        style={[
          styles.writeCard,
          {
            backgroundColor: theme.cardBg,
            borderColor: theme.heroBorder,
            opacity: burnOpacity,
            transform: [{ scale: burnScale }],
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.bg }]}
          placeholder="Unburden your heart here. No judgment, no names..."
          placeholderTextColor={theme.textMuted}
          value={ventText}
          onChangeText={setVentText}
          multiline
          editable={!isBurning}
        />

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
              { backgroundColor: theme.accent, opacity: ventText.trim() ? 1 : 0.6 },
            ]}
            onPress={handlePostAnonymous}
            disabled={isBurning || !ventText.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.postBtnText}>Post Anonymously 🫂</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Anonymous Vent Feed */}
      <View style={styles.feed}>
        <Text style={[styles.feedTitle, { color: theme.textSecondary }]}>Safe Anonymous Voices</Text>
        {vents.map((v) => (
          <View
            key={v.id}
            style={[styles.ventCard, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.anonTag, { color: theme.textMuted }]}>
                🕊️ Anonymous Sanctuary Voice · {v.time}
              </Text>
            </View>

            <Text style={[styles.cardText, { color: theme.textPrimary }]}>{v.text}</Text>

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
        ))}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  writeCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minHeight: 85,
    textAlignVertical: 'top',
    fontSize: 14.5,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  burnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(229, 62, 62, 0.08)',
  },
  burnIcon: {
    fontSize: 14,
  },
  burnBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E53E3E',
  },
  postBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  feed: {
    gap: 12,
  },
  feedTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ventCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  cardHeader: {
    marginBottom: 8,
  },
  anonTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 12,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  reactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  reactBtnActive: {},
  reactEmoji: {
    fontSize: 14,
  },
  reactLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
