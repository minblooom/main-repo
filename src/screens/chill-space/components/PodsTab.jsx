import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { styles } from '../styles/ChillScreen.styles';

const categories = [
  { label: 'All', query: 'mental health wellness' },
  { label: 'Kenya', query: 'Legally Clueless Kenya' },
  { label: 'Anxiety', query: 'anxiety relief mental health' },
  { label: 'Depression', query: 'depression recovery mental health' },
  { label: 'Mindfulness', query: 'mindfulness guided meditation' },
  { label: 'Grief', query: 'grief healing support' },
  { label: 'Stress', query: 'stress burnout recovery' },
];

export const PodsTab = ({ currentEpisode, isPlaying, onSelectEpisode, onTogglePlay }) => {
  const [episodes, setEpisodes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch real playable mental health podcasts from Apple iTunes Search API
  function fetchPodcasts(term) {
    setLoading(true);
    setError('');

    const url =
      'https://itunes.apple.com/search?term=' +
      encodeURIComponent(term) +
      '&media=podcast&entity=podcastEpisode&limit=10';

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load podcasts right now.');
        }
        return res.json();
      })
      .then((data) => {
        const playable = (data.results || []).filter((item) => item.episodeUrl);
        setEpisodes(playable);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPodcasts('mental health wellness');
  }, []);

  function handleSearch() {
    if (searchText.trim() === '') return;
    setSelectedCategory('');
    fetchPodcasts(searchText.trim() + ' mental health');
  }

  function handleCategoryClick(cat) {
    setSelectedCategory(cat.label);
    setSearchText('');
    fetchPodcasts(cat.query);
  }

  function handlePlayClick(ep) {
    if (currentEpisode && currentEpisode.id === ep.trackId) {
      onTogglePlay();
    } else {
      onSelectEpisode({
        id: ep.trackId,
        title: ep.trackName,
        host: ep.collectionName,
        audioUrl: ep.episodeUrl,
      });
    }
  }

  function formatMinutes(millis) {
    if (!millis) return 'Episode';
    return Math.round(millis / 60000) + ' min';
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionHeading}>🎙️ Wellness Podcasts</Text>
          <Text style={styles.sectionSubtext}>Live episodes via Apple iTunes API</Text>
        </View>
        <Text style={styles.smallBtnText}>Listen Hub</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBox}>
        <Text>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search mental health topics..."
          placeholderTextColor="#7E726D"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.smallBtn} onPress={handleSearch}>
          <Text style={styles.smallBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Category chips */}
      <View style={styles.chipRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[styles.chip, selectedCategory === cat.label && styles.chipActive]}
            onPress={() => handleCategoryClick(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat.label && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.infoBox}>
          <ActivityIndicator color="#42213D" />
          <Text style={[styles.metaText, { marginTop: 8 }]}>Loading mental health podcasts...</Text>
        </View>
      )}

      {error !== '' && (
        <View style={[styles.infoBox, styles.errorBox]}>
          <Text style={{ color: '#BA1A1A', marginBottom: 10 }}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.smallBtn}
            onPress={() => fetchPodcasts('mental health wellness')}
          >
            <Text style={styles.smallBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && error === '' && episodes.length === 0 && (
        <View style={styles.infoBox}>
          <Text style={styles.authorName}>No episodes found</Text>
          <Text style={styles.metaText}>Try another search term or category.</Text>
        </View>
      )}

      {!loading &&
        error === '' &&
        episodes.map((ep) => {
          const isCurrent = currentEpisode && currentEpisode.id === ep.trackId;
          const showingPause = isCurrent && isPlaying;
          const isOpen = expandedId === ep.trackId;

          return (
            <View key={ep.trackId} style={styles.card}>
              <View style={styles.podRow}>
                <Image source={{ uri: ep.artworkUrl160 }} style={styles.podArtwork} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.tagText} numberOfLines={1}>
                    {ep.collectionName}
                  </Text>
                  <Text style={styles.authorName} numberOfLines={2}>
                    {ep.trackName}
                  </Text>
                  <Text style={styles.metaText}>🎧 {formatMinutes(ep.trackTimeMillis)}</Text>
                </View>

                <View style={{ alignItems: 'center', gap: 6 }}>
                  <TouchableOpacity
                    style={[styles.playBtn, showingPause && styles.playBtnActive]}
                    onPress={() => handlePlayClick(ep)}
                  >
                    <Text style={{ fontSize: 16 }}>{showingPause ? '⏸️' : '▶️'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setExpandedId(isOpen ? null : ep.trackId)}
                  >
                    <Text style={styles.metaText}>{isOpen ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {isOpen && (
                <View style={styles.podDrawer}>
                  <Text style={styles.bodyText}>
                    {ep.description || 'No episode description available.'}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
    </View>
  );
};