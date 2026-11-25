import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../theme/ThemeContext';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { soundEngine } from '../../../services/soundEngine';
import { GUIDED_MEDITATIONS } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

const PODCAST_TOPICS = [
  { id: 'all', label: 'All Voices', term: 'mental health mindfulness' },
  { id: 'calm', label: 'Calm & Sleep', term: 'guided meditation sleep calm' },
  { id: 'anxiety', label: 'Anxiety & Healing', term: 'anxiety therapy healing' },
  { id: 'africa', label: 'African Voices', term: 'legally clueless africa mental health' },
];

const SOUNDSCAPES = [
  { id: 'rain', emoji: '🌧️', label: 'Rain on Mabati' },
  { id: 'wind', emoji: '🌾', label: 'Savanna Breeze' },
  { id: 'ocean', emoji: '🌊', label: 'Coastal Waves' },
  { id: 'meditation', emoji: '🕯️', label: 'Warm Room Hum' },
];

export const PodsTab = ({ currentEpisode, isPlaying, onSelectEpisode, onTogglePlay }) => {
  const { theme, companionId } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [activeTopic, setActiveTopic] = useState(PODCAST_TOPICS[0]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambient Soundscape quick-play
  const [activeSound, setActiveSound] = useState(null);

  // Human-feel Guided Meditation Modal state
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [medRunning, setMedRunning] = useState(false);
  const [medMuted, setMedMuted] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale gently');
  const [counter, setCounter] = useState(4);
  const [promptIdx, setPromptIdx] = useState(0);
  const medTimerRef = useRef(null);

  // Fetch diverse episodes from Apple iTunes Podcast API + curated multi-topic queries
  async function loadPodcasts(queryTerm) {
    setLoading(true);
    setError('');
    try {
      const terms =
        queryTerm === PODCAST_TOPICS[0].term && !searchText.trim()
          ? ['mental health mindfulness', 'guided meditation calm sleep']
          : [queryTerm];

      const responses = await Promise.all(
        terms.map(async (t) => {
          const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
            t
          )}&media=podcast&entity=podcastEpisode&limit=8`;
          const res = await fetch(url);
          if (!res.ok) return [];
          const json = await res.json();
          return json.results || [];
        })
      );

      const seen = new Set();
      const merged = [];
      responses.flat().forEach((item) => {
        if (item.episodeUrl && !seen.has(item.trackId)) {
          seen.add(item.trackId);
          merged.push({
            id: item.trackId,
            title: item.trackName,
            collectionName: item.collectionName,
            description: item.description || 'Listen to this calming wellness episode.',
            artworkUrl: item.artworkUrl100 || item.artworkUrl60,
            audioUrl: item.episodeUrl,
            durationMins: Math.max(1, Math.round((item.trackTimeMillis || 0) / 60000)),
          });
        }
      });

      setEpisodes(merged);
    } catch {
      setError('We could not reach the podcast library right now.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPodcasts(activeTopic.term);
    return () => {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
      soundEngine.stopSoundscape();
    };
  }, []);

  // Meditation breathing & warm background pad effect
  useEffect(() => {
    if (!activeMeditation || !medRunning) {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
      if (!activeSound) soundEngine.stopSoundscape();
      return;
    }

    if (!medMuted) {
      soundEngine.startSoundscape(activeMeditation.soundType || 'meditation', 0.16);
    }

    let phase = 'inhale';
    let count = 4;
    setBreathPhase('Inhale gently');
    setCounter(4);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    medTimerRef.current = setInterval(() => {
      count -= 1;
      setCounter(count);

      if (count <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          count = 4;
          setBreathPhase('Hold softly');
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = 6;
          setBreathPhase('Exhale slowly');
        } else {
          phase = 'inhale';
          count = 4;
          setBreathPhase('Inhale gently');
          setPromptIdx((i) => i + 1);
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        setCounter(count);
      }
    }, 1000);

    return () => {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
    };
  }, [activeMeditation, medRunning, medMuted]);

  function handleSelectTopic(topic) {
    setActiveTopic(topic);
    setSearchText('');
    loadPodcasts(topic.term);
  }

  function handleSearch() {
    if (!searchText.trim()) return;
    loadPodcasts(searchText.trim());
  }

  function handleToggleSoundscape(id) {
    if (activeSound === id) {
      soundEngine.stopSoundscape();
      setActiveSound(null);
      return;
    }
    setActiveSound(id);
    soundEngine.startSoundscape(id, 0.35);
  }

  function openMeditation(med) {
    setActiveSound(null);
    setPromptIdx(0);
    setMedMuted(false);
    setActiveMeditation(med);
    setMedRunning(true);
  }

  function closeMeditation() {
    setMedRunning(false);
    setActiveMeditation(null);
    soundEngine.stopSoundscape();
  }

  return (
    <View>
      {/* 1. Guided Meditations Carousel */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Guided Meditations 🫁
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Human-paced breathing with gentle, non-distracting ambient background
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {GUIDED_MEDITATIONS.map((med) => (
            <TouchableOpacity
              key={med.id}
              style={[
                styles.card,
                {
                  width: 225,
                  padding: 16,
                  marginBottom: 0,
                  backgroundColor: theme?.heroBg || '#FCEFE9',
                  borderColor: theme?.heroBorder || '#E8DFF2',
                  justifyContent: 'space-between',
                },
              ]}
              onPress={() => openMeditation(med)}
              activeOpacity={0.86}
            >
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 22 }}>🫁</Text>
                  <View style={{ backgroundColor: theme?.cardBg || '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: theme?.textPrimary || '#2A192E' }}>
                      {med.durationMinutes} mins
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14.5, fontWeight: '800', color: theme?.textPrimary || '#2A192E' }}>
                  {med.title}
                </Text>
                <Text style={{ fontSize: 11.5, color: theme?.textMuted || '#7E726D', marginTop: 3 }}>
                  With {med.guide}
                </Text>
                <Text style={{ fontSize: 12, fontStyle: 'italic', color: theme?.textSecondary || '#5C4D60', marginTop: 8 }} numberOfLines={2}>
                  "{med.quote}"
                </Text>
              </View>
              <View style={[styles.primaryBtn, { backgroundColor: theme?.accent || '#E06D3B', marginTop: 12, paddingVertical: 9 }]}>
                <Text style={styles.primaryBtnText}>Begin Session ▶</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 2. Quick Ambient Soundscapes */}
      <Text style={{ fontSize: 13, fontWeight: '800', color: theme?.textPrimary || '#2A192E', marginBottom: 8 }}>
        🌿 Calming Background Soundscapes
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {SOUNDSCAPES.map((sc) => {
            const playing = activeSound === sc.id;
            return (
              <TouchableOpacity
                key={sc.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: playing ? (theme?.accent || '#42213D') : (theme?.cardBg || '#FFFFFF'),
                    borderColor: playing ? (theme?.accent || '#42213D') : (theme?.divider || '#E8DFF2'),
                    borderWidth: 1,
                  },
                ]}
                onPress={() => handleToggleSoundscape(sc.id)}
              >
                <Text style={[styles.chipText, { color: playing ? '#FFFFFF' : (theme?.textPrimary || '#2A192E') }]}>
                  {sc.emoji} {sc.label} {playing ? '· Playing' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 3. Live Podcasts */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionHeading, { color: theme?.textPrimary || '#2A192E' }]}>
            Live Podcasts 🎙️
          </Text>
          <Text style={[styles.sectionSubtext, { color: theme?.textMuted || '#7E726D' }]}>
            Multi-topic wellness & sleep episodes via Apple Podcasts
          </Text>
        </View>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme?.cardBg || '#FFFFFF', borderColor: theme?.divider || '#E8DFF2' }]}>
        <Text>🔍</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={[
            styles.searchInput,
            { color: theme?.textPrimary || '#2A192E' },
            Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
          ]}
          placeholder="Search episodes, hosts, topics..."
          placeholderTextColor={theme?.textMuted || '#7E726D'}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.smallBtn} onPress={handleSearch}>
          <Text style={styles.smallBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipRow}>
        {PODCAST_TOPICS.map((cat) => {
          const active = activeTopic.id === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? (theme?.accent || '#42213D') : (theme?.cardBg || '#FFFFFF'),
                  borderColor: active ? (theme?.accent || '#42213D') : (theme?.divider || '#E8DFF2'),
                  borderWidth: 1,
                },
              ]}
              onPress={() => handleSelectTopic(cat)}
            >
              <Text style={[styles.chipText, { color: active ? '#FFFFFF' : (theme?.textSecondary || '#5C4D60') }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && (
        <View style={[styles.infoBox, { backgroundColor: theme?.cardBg || '#FFFFFF' }]}>
          <ActivityIndicator color={theme?.accent || '#42213D'} />
          <Text style={[styles.metaText, { marginTop: 8 }]}>Loading episodes...</Text>
        </View>
      )}

      {!loading && error !== '' && (
        <View style={[styles.infoBox, styles.errorBox]}>
          <Text style={{ color: '#BA1A1A', marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity style={styles.smallBtn} onPress={() => loadPodcasts(activeTopic.term)}>
            <Text style={styles.smallBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading &&
        error === '' &&
        episodes.map((ep) => {
          const isCurrent = currentEpisode?.id === ep.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <View
              key={ep.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme?.cardBg || '#FFFFFF',
                  borderColor: isCurrent ? (theme?.accent || '#42213D') : (theme?.divider || '#E8DFF2'),
                },
              ]}
            >
              <View style={styles.podRow}>
                <Image
                  source={{ uri: ep.artworkUrl }}
                  style={styles.podCover}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tagText, { color: theme?.accent || '#E06D3B' }]} numberOfLines={1}>
                    {ep.collectionName}
                  </Text>
                  <Text style={[styles.authorName, { color: theme?.textPrimary || '#2A192E' }]} numberOfLines={2}>
                    {ep.title}
                  </Text>
                  <Text style={styles.metaText}>⏱ {ep.durationMins} mins</Text>
                </View>

                <TouchableOpacity
                  style={[styles.playBtn, { backgroundColor: theme?.accent || '#42213D' }]}
                  onPress={() => (isCurrent ? onTogglePlay() : onSelectEpisode(ep))}
                >
                  <Text style={styles.playBtnText}>{isCurrentPlaying ? '⏸' : '▶'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.bodyText, { color: theme?.textSecondary || '#5C4D60' }]} numberOfLines={2}>
                {ep.description.replace(/<[^>]+>/g, '')}
              </Text>
            </View>
          );
        })}

      {/* Human-Feel Guided Meditation Modal */}
      <Modal
        visible={!!activeMeditation}
        transparent
        animationType="fade"
        onRequestClose={closeMeditation}
      >
        <View style={styles.modalBg}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme?.cardBg || '#FFFFFF',
                borderRadius: 28,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme?.divider || '#E8DFF2',
              },
            ]}
          >
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  const nextMuted = !medMuted;
                  setMedMuted(nextMuted);
                  if (nextMuted) soundEngine.setSoundscapeVolume(0);
                  else soundEngine.setSoundscapeVolume(0.16);
                }}
                style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: theme?.bg || '#FAF6EF' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme?.textSecondary || '#5C4D60' }}>
                  {medMuted ? '🔇 Sound off' : '🔊 Gentle ambient'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeMeditation}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: theme?.bg || '#FAF6EF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme?.textMuted || '#7E726D' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 17, fontWeight: '800', color: theme?.textPrimary || '#2A192E', textAlign: 'center' }}>
              {activeMeditation?.title}
            </Text>
            <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D', marginTop: 2, marginBottom: 14 }}>
              With {activeMeditation?.guide}
            </Text>

            <AnimatedCompanion
              companionId={companionId || 'noodle'}
              state={medRunning ? 'happy' : 'idle'}
              size={92}
              interactive={false}
            />

            <Text style={{ fontSize: 18, fontWeight: '800', color: theme?.accent || '#E06D3B', marginTop: 12 }}>
              {medRunning ? breathPhase : 'Paused'}
            </Text>
            <Text style={{ fontSize: 34, fontWeight: '900', color: theme?.textPrimary || '#2A192E', marginVertical: 4 }}>
              {medRunning ? `${counter}s` : '—'}
            </Text>

            <View
              style={{
                backgroundColor: theme?.heroBg || '#FAF6EF',
                padding: 14,
                borderRadius: 18,
                width: '100%',
                marginVertical: 10,
              }}
            >
              <Text style={{ fontSize: 13.5, color: theme?.textPrimary || '#2A192E', textAlign: 'center', lineHeight: 20 }}>
                "{activeMeditation?.prompts?.[promptIdx % (activeMeditation?.prompts?.length || 1)]}"
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 6 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1, backgroundColor: theme?.accent || '#42213D' }]}
                onPress={() => setMedRunning((r) => !r)}
              >
                <Text style={styles.primaryBtnText}>{medRunning ? 'Pause' : 'Resume'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1, backgroundColor: theme?.bg || '#FAF6EF' }]}
                onPress={closeMeditation}
              >
                <Text style={[styles.primaryBtnText, { color: theme?.textPrimary || '#2A192E' }]}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
