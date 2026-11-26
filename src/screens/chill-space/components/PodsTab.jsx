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
import { chillLibraryStorage } from '../../../services/chillLibraryStorage';
import { GUIDED_MEDITATIONS } from '../chillData';
import { styles } from '../styles/ChillScreen.styles';

const PODCAST_TOPICS = [
  { id: 'all', label: 'All Voices', term: 'mental health mindfulness' },
  { id: 'calm', label: 'Calm & Sleep', term: 'guided meditation sleep calm' },
  { id: 'anxiety', label: 'Anxiety & Healing', term: 'anxiety therapy healing' },
  { id: 'africa', label: 'African Voices', term: 'legally clueless africa mental health' },
];

const ENDLESS_WELLNESS_QUERIES = [
  'mental health mindfulness',
  'guided meditation sleep calm',
  'anxiety relief therapy',
  'burnout recovery rest',
  'self compassion healing',
  'emotional resilience africa',
  'grief healing support',
  'morning calm affirmations',
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [savedIds, setSavedIds] = useState(new Set());
  const [error, setError] = useState('');

  // Ambient Soundscape quick-play
  const [activeSound, setActiveSound] = useState(null);

  // Human-feel Guided Meditation Modal state
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [medRunning, setMedRunning] = useState(false);
  const [medMuted, setMedMuted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sessionElapsedSec, setSessionElapsedSec] = useState(0);
  const [breathPhase, setBreathPhase] = useState('Inhale gently');
  const [counter, setCounter] = useState(4);
  const [promptIdx, setPromptIdx] = useState(0);
  const medTimerRef = useRef(null);
  const lastSpokenRef = useRef('');

  // Fetch diverse episodes from Apple iTunes Podcast API + endless query pagination
  async function loadPodcasts(queryTerm, { append = false, nextPage = 0 } = {}) {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError('');
    try {
      const rotatingTerm =
        append && queryTerm === PODCAST_TOPICS[0].term && !searchText.trim()
          ? ENDLESS_WELLNESS_QUERIES[nextPage % ENDLESS_WELLNESS_QUERIES.length]
          : queryTerm;

      const terms =
        !append && queryTerm === PODCAST_TOPICS[0].term && !searchText.trim()
          ? ['mental health mindfulness', 'guided meditation calm sleep']
          : [rotatingTerm];

      const offset = append ? Math.floor(nextPage / ENDLESS_WELLNESS_QUERIES.length) * 15 : 0;

      const responses = await Promise.all(
        terms.map(async (t) => {
          const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
            t
          )}&media=podcast&entity=podcastEpisode&limit=15&offset=${offset}`;
          const res = await fetch(url);
          if (!res.ok) return [];
          const json = await res.json();
          return json.results || [];
        })
      );

      const seen = new Set(append ? episodes.map((e) => e.id) : []);
      const merged = append ? [...episodes] : [];
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
      setPageIdx(nextPage);
    } catch {
      if (!append) setError('We could not reach the podcast library right now.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadPodcasts(activeTopic.term);
    chillLibraryStorage
      .getAll()
      .then((saved) => setSavedIds(new Set(saved.map((i) => String(i.id)))))
      .catch(() => {});
    return () => {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
      soundEngine.stopSoundscape();
    };
  }, []);

  async function handleToggleSaveEpisode(ep) {
    const { isSaved } = await chillLibraryStorage.toggleSave({
      id: `pod_${ep.id}`,
      category: 'PODCAST EPISODE',
      title: ep.title,
      desc: (ep.description || '').replace(/<[^>]+>/g, '').slice(0, 180),
      author: ep.collectionName,
      duration: `${ep.durationMins} MIN`,
      audioUrl: ep.audioUrl,
      bg: '#EDF5EE',
      color: '#2C5A38',
      icon: '🎙️',
    });
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.add(`pod_${ep.id}`);
      else next.delete(`pod_${ep.id}`);
      return next;
    });
  }

  function speakGuidance(text) {
    if (!voiceEnabled || Platform.OS !== 'web' || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.84;
      utter.pitch = 0.95;
      utter.volume = 0.85;
      window.speechSynthesis.speak(utter);
    } catch {}
  }

  function stopVoiceGuidance() {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  // Meditation breathing, session timer, spoken voice guidance & warm background pad effect
  useEffect(() => {
    if (!activeMeditation || !medRunning) {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
      stopVoiceGuidance();
      if (!activeSound) soundEngine.stopSoundscape();
      return;
    }

    if (!medMuted) {
      soundEngine.startSoundscape(activeMeditation.soundType || 'meditation', 0.14);
    }

    const rhythm = activeMeditation.rhythm || { inhale: 4, hold: 4, exhale: 6 };
    const totalSessionSecs = (activeMeditation.durationMinutes || 8) * 60;
    const prompts = activeMeditation.prompts || [];

    let phase = 'inhale';
    let count = rhythm.inhale;
    let currentPromptIndex = promptIdx;

    setBreathPhase('Inhale gently');
    setCounter(rhythm.inhale);
    if (prompts[currentPromptIndex] && lastSpokenRef.current !== prompts[currentPromptIndex]) {
      lastSpokenRef.current = prompts[currentPromptIndex];
      speakGuidance(prompts[currentPromptIndex]);
    }
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    medTimerRef.current = setInterval(() => {
      setSessionElapsedSec((prev) => {
        const next = prev + 1;
        if (next >= totalSessionSecs) {
          setMedRunning(false);
          stopVoiceGuidance();
          soundEngine.stopSoundscape();
          return totalSessionSecs;
        }
        return next;
      });

      count -= 1;
      setCounter(count);

      if (count <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          count = rhythm.hold;
          setBreathPhase('Hold softly');
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = rhythm.exhale;
          setBreathPhase('Exhale slowly');
        } else {
          phase = 'inhale';
          count = rhythm.inhale;
          setBreathPhase('Inhale gently');
          currentPromptIndex = (currentPromptIndex + 1) % Math.max(1, prompts.length);
          setPromptIdx(currentPromptIndex);
          if (prompts[currentPromptIndex]) {
            lastSpokenRef.current = prompts[currentPromptIndex];
            speakGuidance(prompts[currentPromptIndex]);
          }
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        setCounter(count);
      }
    }, 1000);

    return () => {
      if (medTimerRef.current) clearInterval(medTimerRef.current);
      stopVoiceGuidance();
    };
  }, [activeMeditation, medRunning, medMuted, voiceEnabled]);

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
    setSessionElapsedSec(0);
    lastSpokenRef.current = '';
    setMedMuted(false);
    setActiveMeditation(med);
    setMedRunning(true);
  }

  function closeMeditation() {
    setMedRunning(false);
    setActiveMeditation(null);
    stopVoiceGuidance();
    soundEngine.stopSoundscape();
  }

  function formatMedTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
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

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity onPress={() => handleToggleSaveEpisode(ep)}>
                  <Text style={styles.actionText}>
                    {savedIds.has(`pod_${ep.id}`) ? '🔖 Saved' : '🏷️ Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

      {!loading && error === '' && episodes.length > 0 && (
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {
              backgroundColor: theme?.heroBg || '#F0EAFA',
              borderWidth: 1,
              borderColor: theme?.divider || '#E8DFF2',
              marginTop: 4,
              marginBottom: 16,
            },
          ]}
          onPress={() => loadPodcasts(searchText.trim() || activeTopic.term, { append: true, nextPage: pageIdx + 1 })}
          disabled={loadingMore}
        >
          <Text style={[styles.primaryBtnText, { color: theme?.accent || '#42213D' }]}>
            {loadingMore ? 'Loading more episodes...' : 'Load More Episodes 🎙️'}
          </Text>
        </TouchableOpacity>
      )}

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
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity
                  onPress={() => {
                    const nextMuted = !medMuted;
                    setMedMuted(nextMuted);
                    if (nextMuted) soundEngine.setSoundscapeVolume(0);
                    else soundEngine.setSoundscapeVolume(0.14);
                  }}
                  style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: theme?.bg || '#FAF6EF' }}
                >
                  <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme?.textSecondary || '#5C4D60' }}>
                    {medMuted ? '🔇 Ambient off' : '🔊 Ambient'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const nextVoice = !voiceEnabled;
                    setVoiceEnabled(nextVoice);
                    if (!nextVoice) stopVoiceGuidance();
                  }}
                  style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: theme?.bg || '#FAF6EF' }}
                >
                  <Text style={{ fontSize: 11.5, fontWeight: '700', color: theme?.textSecondary || '#5C4D60' }}>
                    {voiceEnabled ? '🗣️ Voice guide' : '🤫 Silent'}
                  </Text>
                </TouchableOpacity>
              </View>
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
            <Text style={{ fontSize: 12, color: theme?.textMuted || '#7E726D', marginTop: 2, marginBottom: 10 }}>
              With {activeMeditation?.guide} · {formatMedTime(sessionElapsedSec)} / {formatMedTime((activeMeditation?.durationMinutes || 8) * 60)}
            </Text>

            {/* Session Progress Bar */}
            <View style={{ width: '100%', height: 5, borderRadius: 3, backgroundColor: theme?.bg || '#F1EBF8', marginBottom: 14, overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${Math.min(100, (sessionElapsedSec / ((activeMeditation?.durationMinutes || 8) * 60)) * 100)}%`,
                  backgroundColor: theme?.accent || '#42213D',
                  borderRadius: 3,
                }}
              />
            </View>

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
