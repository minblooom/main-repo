// src/core/audio/AudioPlayerContext.jsx
// Global persistent audio player context with auto-next queue so podcasts
// continue playing across screens, in the background, and advance to the next episode automatically.

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayerContext = createContext({
  currentEpisode: null,
  isPlaying: false,
  queue: [],
  playEpisode: () => {},
  playNext: () => {},
  togglePlay: () => {},
  closePlayer: () => {},
});

export const AudioPlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);
  const queueRef = useRef([]);
  const currentRef = useRef(null);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentRef.current = currentEpisode;
  }, [currentEpisode]);

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

  const playNext = () => {
    const list = queueRef.current || [];
    const curr = currentRef.current;
    if (!curr || list.length === 0) {
      setIsPlaying(false);
      return;
    }
    const idx = list.findIndex((item) => String(item.id) === String(curr.id));
    const nextIdx = idx >= 0 ? idx + 1 : 0;
    if (nextIdx < list.length) {
      setCurrentEpisode(list[nextIdx]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

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

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status?.isLoaded && status.didJustFinish && !status.isLooping) {
            playNext();
          }
        });

        if (mounted) {
          soundRef.current = sound;
          setIsPlaying(true);

          if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
            try {
              navigator.mediaSession.metadata = new window.MediaMetadata({
                title: currentEpisode.title || 'MindBloom Podcast',
                artist: currentEpisode.collectionName || currentEpisode.host || 'MindBloom Audio',
                artwork: currentEpisode.artworkUrl
                  ? [{ src: currentEpisode.artworkUrl, sizes: '300x300', type: 'image/jpeg' }]
                  : [],
              });
              navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
              navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
              navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
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

  const playEpisode = (episode, episodeQueue = null) => {
    if (!episode) return;
    if (Array.isArray(episodeQueue) && episodeQueue.length > 0) {
      setQueue(episodeQueue);
    } else if (queueRef.current.length === 0) {
      setQueue([episode]);
    }
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
      value={{ currentEpisode, isPlaying, queue, playEpisode, playNext, togglePlay, closePlayer }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const NavbarAudioPlayer = ({ variant = 'sidebar' }) => {
  const { currentEpisode, isPlaying, queue, togglePlay, playNext, closePlayer } = useAudioPlayer();

  if (!currentEpisode) return null;

  const isSidebar = variant === 'sidebar';
  const hasNext = queue.length > 1;

  return (
    <View style={isSidebar ? styles.sidebarPlayer : styles.bottomBarPlayer}>
      {currentEpisode.artworkUrl ? (
        <Image
          source={{ uri: currentEpisode.artworkUrl }}
          style={isSidebar ? styles.thumbSidebar : styles.thumbBottom}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {currentEpisode.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {currentEpisode.host || currentEpisode.collectionName || 'Podcast'} ·{' '}
          {isPlaying ? 'Playing' : 'Paused'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.playBtn, isSidebar && { width: 28, height: 28, borderRadius: 14 }]}
        onPress={togglePlay}
        activeOpacity={0.85}
      >
        <Text style={{ fontSize: isSidebar ? 11 : 13 }}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>

      {hasNext && (
        <TouchableOpacity onPress={playNext} style={styles.nextBtn} activeOpacity={0.8}>
          <Text style={{ color: '#FFFFFF', fontSize: isSidebar ? 12 : 14 }}>⏭️</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={closePlayer} style={styles.closeBtn} activeOpacity={0.8}>
        <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarPlayer: {
    marginTop: 'auto',
    marginBottom: 10,
    backgroundColor: '#2A192E',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  bottomBarPlayer: {
    width: '100%',
    backgroundColor: '#2A192E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  thumbSidebar: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  thumbBottom: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  subtitle: {
    color: '#D6CCC2',
    fontSize: 10.5,
    marginTop: 1,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E06D3B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    padding: 3,
  },
  closeBtn: {
    padding: 4,
  },
});
