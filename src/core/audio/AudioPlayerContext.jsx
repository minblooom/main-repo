// src/core/audio/AudioPlayerContext.jsx
// Global persistent audio player context so podcasts continue playing
// while browsing the app or switching to other apps on mobile/web until paused.

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayerContext = createContext({
  currentEpisode: null,
  isPlaying: false,
  playEpisode: () => {},
  togglePlay: () => {},
  closePlayer: () => {},
});

export const AudioPlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  // Configure expo-av for background playback across screens & phone surfing
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // Load new episode when currentEpisode changes
  useEffect(() => {
    let mounted = true;

    async function loadAudio() {
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch {}
        soundRef.current = null;
      }

      if (!currentEpisode?.audioUrl) return;

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        }).catch(() => {});

        const { sound } = await Audio.Sound.createAsync(
          { uri: currentEpisode.audioUrl },
          { shouldPlay: true }
        );

        if (mounted) {
          soundRef.current = sound;
          setIsPlaying(true);

          // Update OS MediaSession metadata on web for lockscreen/browser controls
          if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
            try {
              navigator.mediaSession.metadata = new window.MediaMetadata({
                title: currentEpisode.title || 'MindBloom Podcast',
                artist: currentEpisode.collectionName || currentEpisode.host || 'MindBloom Audio',
                artwork: currentEpisode.artworkUrl
                  ? [{ src: currentEpisode.artworkUrl, sizes: '100x100', type: 'image/jpeg' }]
                  : [],
              });
              navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
              navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
            } catch {}
          }
        } else {
          await sound.unloadAsync().catch(() => {});
        }
      } catch {
        if (mounted) setIsPlaying(false);
      }
    }

    loadAudio();

    return () => {
      mounted = false;
    };
  }, [currentEpisode?.id, currentEpisode?.audioUrl]);

  // Sync play/pause state
  useEffect(() => {
    async function syncState() {
      if (!soundRef.current) return;
      try {
        if (isPlaying) {
          await soundRef.current.playAsync();
        } else {
          await soundRef.current.pauseAsync();
        }
      } catch {}
    }
    syncState();
  }, [isPlaying]);

  const playEpisode = (episode) => {
    if (!episode) return;
    if (currentEpisode?.id === episode.id) {
      setIsPlaying((prev) => !prev);
      return;
    }
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!currentEpisode) return;
    setIsPlaying((prev) => !prev);
  };

  const closePlayer = async () => {
    setIsPlaying(false);
    setCurrentEpisode(null);
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{ currentEpisode, isPlaying, playEpisode, togglePlay, closePlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const GlobalFloatingMiniPlayer = () => {
  const { currentEpisode, isPlaying, togglePlay, closePlayer } = useAudioPlayer();

  if (!currentEpisode) return null;

  return (
    <View style={styles.floatingWrap} pointerEvents="box-none">
      <View style={styles.miniPlayer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            🎙️ {currentEpisode.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentEpisode.host || currentEpisode.collectionName || 'Podcast'} ·{' '}
            {isPlaying ? 'Playing in background...' : 'Paused'}
          </Text>
        </View>

        <TouchableOpacity style={styles.playBtn} onPress={togglePlay} activeOpacity={0.85}>
          <Text style={{ fontSize: 14 }}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={closePlayer} style={styles.closeBtn} activeOpacity={0.8}>
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'web' ? 20 : 76,
    zIndex: 999,
    alignItems: 'center',
  },
  miniPlayer: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#2A192E',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    color: '#D6CCC2',
    fontSize: 11,
    marginTop: 2,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E06D3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 6,
  },
});
