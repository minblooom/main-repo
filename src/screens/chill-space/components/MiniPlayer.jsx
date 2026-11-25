import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { styles } from '../styles/ChillScreen.styles';

export const MiniPlayer = ({ episode, isPlaying, onTogglePlay, onClose }) => {
  const soundRef = useRef(null);

  // Load and play a new audio stream whenever episode changes
  useEffect(() => {
    let isMounted = true;

    async function loadAudio() {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (!episode || !episode.audioUrl) return;

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: episode.audioUrl },
          { shouldPlay: true }
        );
        if (isMounted) {
          soundRef.current = sound;
        } else {
          await sound.unloadAsync();
        }
      } catch (err) {
        console.log('Audio playback error:', err);
      }
    }

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [episode]);

  // Pause or resume when user toggles play
  useEffect(() => {
    async function syncPlayState() {
      if (!soundRef.current) return;
      if (isPlaying) {
        await soundRef.current.playAsync();
      } else {
        await soundRef.current.pauseAsync();
      }
    }
    syncPlayState();
  }, [isPlaying]);

  if (!episode) return null;

  return (
    <View style={styles.miniPlayer}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
          🎙️ {episode.title}
        </Text>
        <Text style={{ color: '#D6CCC2', fontSize: 11 }} numberOfLines={1}>
          {episode.host || episode.collectionName || 'Podcast'} · {isPlaying ? 'Playing...' : 'Paused'}
        </Text>
      </View>

      <TouchableOpacity style={styles.playBtn} onPress={onTogglePlay}>
        <Text style={{ fontSize: 14 }}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ padding: 6 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};