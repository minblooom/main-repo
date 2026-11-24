// src/components/voice/VoiceNotePlayer.jsx
// Compact, theme-aware WhatsApp-style audio bubble for playing back saved voice notes.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '../../theme/ThemeContext';
import { formatVoiceDuration } from '../../services/voiceNoteService';

export const VoiceNotePlayer = ({
  voiceNote,
  inverted = false,
  onRemove,
  compact = false,
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const soundRef = useRef(null);

  const totalSec = voiceNote?.durationSec || 1;

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [voiceNote?.uri]);

  if (!voiceNote?.uri) return null;

  const handleTogglePlay = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            if (status.positionMillis >= (status.durationMillis || 0)) {
              await soundRef.current.setPositionAsync(0);
            }
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
          return;
        }
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: voiceNote.uri },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          setPositionSec(Math.floor((status.positionMillis || 0) / 1000));
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPositionSec(0);
          }
        }
      );
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (err) {
      console.warn('[VoiceNotePlayer] Playback error:', err);
      setIsPlaying(false);
    }
  };

  const progressPct = Math.min(100, Math.round(((isPlaying ? positionSec : 0) / totalSec) * 100));

  const bgColor = inverted ? 'rgba(255,255,255,0.18)' : theme.bg;
  const borderColor = inverted ? 'rgba(255,255,255,0.28)' : theme.divider;
  const primaryColor = inverted ? '#FFFFFF' : theme.accent;
  const textColor = inverted ? '#FFFFFF' : theme.textPrimary;
  const mutedColor = inverted ? 'rgba(255,255,255,0.78)' : theme.textMuted;

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        { backgroundColor: bgColor, borderColor },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.playBtn,
          { backgroundColor: inverted ? '#FFFFFF' : theme.accent },
        ]}
        onPress={handleTogglePlay}
        activeOpacity={0.8}
      >
        <Text style={[styles.playIcon, { color: inverted ? theme.accent : '#FFFFFF' }]}>
          {isPlaying ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>

      <View style={styles.trackCol}>
        <View style={[styles.trackBg, { backgroundColor: inverted ? 'rgba(255,255,255,0.3)' : theme.divider }]}>
          <View
            style={[
              styles.trackFill,
              { width: `${Math.max(8, progressPct)}%`, backgroundColor: primaryColor },
            ]}
          />
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.labelText, { color: textColor }]}>🎙️ Voice note</Text>
          <Text style={[styles.timeText, { color: mutedColor }]}>
            {isPlaying ? formatVoiceDuration(positionSec) : formatVoiceDuration(totalSec)}
          </Text>
        </View>
      </View>

      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn} activeOpacity={0.7}>
          <Text style={[styles.removeText, { color: mutedColor }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 190,
  },
  containerCompact: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 12,
    fontWeight: '900',
  },
  trackCol: {
    flex: 1,
    gap: 5,
  },
  trackBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
