// src/components/voice/VoiceNotePlayer.jsx
// Compact, theme-aware WhatsApp-style audio bubble for playing back saved voice notes.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles/VoiceNotePlayer.styles';
import { createAudioPlayer } from 'expo-audio';
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
    setIsPlaying(false);
    setPositionSec(0);
    return () => {
      if (soundRef.current) {
        soundRef.current.remove();
        soundRef.current = null;
      }
    };
  }, [voiceNote?.uri]);

  if (!voiceNote?.uri) return null;

  const handleTogglePlay = async () => {
    try {
      if (soundRef.current) {
        const player = soundRef.current;
        if (player.playing) {
          player.pause();
          setIsPlaying(false);
        } else {
          if (player.isLoaded && player.currentTime >= (player.duration || 0)) {
            await player.seekTo(0);
          }
          player.play();
          setIsPlaying(true);
        }
        return;
      }

      const player = createAudioPlayer(voiceNote.uri, { updateInterval: 500 });
      player.addListener('playbackStatusUpdate', (status) => {
        if (!status.isLoaded) return;
        setPositionSec(Math.floor(status.currentTime || 0));
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPositionSec(0);
        }
      });
      soundRef.current = player;
      player.play();
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
