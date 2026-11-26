// src/screens/home/components/HeroBanners.jsx
// Side-by-side hero cards: Aurora AI Companion & Podcast of the Day
// (fetches a real daily podcast episode tailored to the user's selected issues and plays it immediately).

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCompanion } from '../../../components/companion/AnimatedCompanion';
import { useTheme } from '../../../theme/ThemeContext';
import { useAudioPlayer } from '../../../core/audio/AudioPlayerContext';
import { styles } from '../styles/HeroBanners.styles';

const ISSUE_PODCAST_QUERIES = {
  anxiety: 'anxiety relief mindfulness calm',
  burnout: 'burnout recovery rest boundaries',
  sleep: 'sleep calm guided meditation',
  low_mood: 'depression healing self compassion',
  body: 'body positivity self love wellness',
  strong_one: 'setting boundaries emotional rest',
  default: 'mental health mindfulness calm',
};

const DAILY_PODCAST_FALLBACK = {
  anxiety: { title: 'Calming the Overwhelmed Mind', desc: 'Gentle grounding when thoughts are racing too fast.' },
  burnout: { title: 'Rest Is Not a Reward', desc: 'Unlearning the guilt of quiet, restful hours.' },
  sleep: { title: 'Night Calm & Gentle Slumber', desc: 'Letting the day fade away so tomorrow can breathe.' },
  low_mood: { title: 'Gentle Steps on Heavy Days', desc: 'Showing up for yourself when energy is quiet.' },
  body: { title: 'Making Peace with Yourself', desc: 'A gentler, kinder relationship with your body.' },
  strong_one: { title: "When You're Always the Strong One", desc: "A safe haven where you don't have to carry it all." },
  default: { title: 'Breathing Room for Your Mind', desc: 'A daily sanctuary episode to reset your pace.' },
};

export const HeroBanners = ({
  isWide = false,
  companionId = 'noodle',
  userFocusAreas = ['anxiety'],
  onAuroraPress,
  onPodcastPress,
}) => {
  const { theme } = useTheme();
  const { currentEpisode, isPlaying, playEpisode } = useAudioPlayer();
  const [dailyEpisode, setDailyEpisode] = useState(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);

  const primaryKey = userFocusAreas?.[0] || 'default';
  const fallbackCopy = useMemo(
    () => DAILY_PODCAST_FALLBACK[primaryKey] || DAILY_PODCAST_FALLBACK.default,
    [primaryKey]
  );

  useEffect(() => {
    let cancelled = false;
    const query = ISSUE_PODCAST_QUERIES[primaryKey] || ISSUE_PODCAST_QUERIES.default;
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    (async () => {
      setLoadingEpisode(true);
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&media=podcast&entity=podcastEpisode&limit=15`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        const playable = (json.results || []).filter((item) => item.episodeUrl);
        if (!cancelled && playable.length > 0) {
          const pick = playable[dayIndex % playable.length];
          setDailyEpisode({
            id: `daily_${pick.trackId}`,
            title: pick.trackName,
            collectionName: pick.collectionName,
            description: (pick.description || fallbackCopy.desc).replace(/<[^>]+>/g, ''),
            artworkUrl: pick.artworkUrl100 || pick.artworkUrl60,
            audioUrl: pick.episodeUrl,
            durationMins: Math.max(1, Math.round((pick.trackTimeMillis || 0) / 60000)),
          });
        }
      } catch {
      } finally {
        if (!cancelled) setLoadingEpisode(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [primaryKey, fallbackCopy.desc]);

  const isDailyPlaying = Boolean(dailyEpisode && currentEpisode?.id === dailyEpisode.id && isPlaying);

  const handleListenDaily = () => {
    if (dailyEpisode) {
      playEpisode(dailyEpisode);
      return;
    }
    onPodcastPress?.();
  };

  return (
    <View style={[styles.container, isWide && styles.containerWide]}>
      {/* -- CARD 1: AURORA COMPANION (Lavender with Animated Companion) -- */}
      <View style={[styles.card, styles.auroraCard, { backgroundColor: theme.heroBg, borderColor: theme.heroBorder }]}>
        <View style={styles.cardContent}>
          <View style={[styles.tagPill, { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder }]}>
            <Text style={[styles.tagPillText, { color: theme.pillText }]}>AURORA · AI COMPANION</Text>
          </View>

          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            {'A little lighter.\nOne chat at a time.'}
          </Text>

          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Big feelings or small things. You can start anywhere.
          </Text>

          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: theme.accent }]}
            onPress={onAuroraPress}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryActionBtnText}>Talk to Aurora →</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Living Animated Companion */}
        <View style={styles.mascotContainer}>
          <AnimatedCompanion
            companionId={companionId}
            size={112}
            state="idle"
            interactive={true}
          />
        </View>
      </View>

      {/* -- CARD 2: PODCAST OF THE DAY (Mint Green Curated Audio) ------------------ */}
      <View style={[styles.card, styles.breathCard, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
        <View style={styles.tagPillMint}>
          <Text style={styles.tagPillTextMint}>
            PODCAST OF THE DAY · {primaryKey.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={2}>
          {dailyEpisode?.title || fallbackCopy.title}
        </Text>

        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
          {dailyEpisode
            ? `${dailyEpisode.collectionName} · ${dailyEpisode.durationMins} min`
            : fallbackCopy.desc}
        </Text>

        <TouchableOpacity
          style={styles.breathActionBtn}
          onPress={handleListenDaily}
          activeOpacity={0.88}
          disabled={loadingEpisode && !dailyEpisode}
        >
          <Text style={styles.breathActionBtnText}>
            {isDailyPlaying
              ? '⏸ Pause today’s episode'
              : dailyEpisode
                ? '▶ Play today’s episode'
                : 'Listen now →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
