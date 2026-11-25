import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useI18n } from '../../services/i18n';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { initialStories } from './chillData';
import { StoriesTab } from './components/StoriesTab';
import { MemesTab } from './components/MemesTab';
import { EventsTab } from './components/EventsTab';
import { PodsTab } from './components/PodsTab';
import { MiniPlayer } from './components/MiniPlayer';
import { styles } from './styles/ChillScreen.styles';

export const ChillContent = () => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState(initialStories);

  // Audio player state
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sheng Chill Modal + Advice API state
  const [showModal, setShowModal] = useState(false);
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState('');

  // Dynamic colors from ThemeContext with MindBloom defaults
  const accentColor = theme?.accent || '#42213D';
  const softBg = theme?.navActive || '#EFE8FA';
  const cardBg = theme?.cardBg || '#FFFFFF';
  const borderColor = theme?.divider || '#E8DFF2';
  const mutedText = theme?.textMuted || '#746379';

  useEffect(() => {
    if (!showModal) return;

    setLoadingAdvice(true);
    setAdviceError('');

    fetch('https://api.adviceslip.com/advice')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load advice.');
        }
        return res.json();
      })
      .then((data) => {
        setAdvice(data.slip.advice);
        setLoadingAdvice(false);
      })
      .catch((err) => {
        setAdviceError(err.message);
        setLoadingAdvice(false);
      });
  }, [showModal]);

  function handleToggleLike(id) {
    const updated = stories.map((story) => {
      if (story.id === id) {
        const nextLiked = !story.isLiked;
        return {
          ...story,
          isLiked: nextLiked,
          likes: nextLiked ? story.likes + 1 : story.likes - 1,
        };
      }
      return story;
    });
    setStories(updated);
  }

  function handleToggleSave(id) {
    const updated = stories.map((story) =>
      story.id === id ? { ...story, isSaved: !story.isSaved } : story
    );
    setStories(updated);
  }

  function handleAddStory(title, excerpt, tag) {
    const city = countryData?.capital || 'Your Sanctuary';
    const newStory = {
      id: 's_' + Date.now(),
      authorName: 'Anonymous',
      authorEmoji: '🌊',
      location: `${city} · Just now`,
      tag,
      title,
      excerpt,
      likes: 1,
      reflections: [],
      isLiked: true,
      isSaved: false,
    };
    setStories([newStory, ...stories]);
  }

  function handleSelectEpisode(episode) {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  }

  return (
    <View style={styles.container}>
      {/* Breadcrumb matching Home, Journal & Profile */}
      <Text style={[styles.breadcrumb, { color: mutedText }]}>
        My sanctuary / Chill & Soundscapes
      </Text>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme?.textPrimary || '#2A192E' }]}>
            Chill & Soundscapes 🌴
          </Text>
          <Text style={[styles.subtitle, { color: mutedText }]}>
            Stories · Memes · Events · Podcasts
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.maskButton, { backgroundColor: softBg, borderColor }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={{ fontSize: 22 }}>🎭</Text>
        </TouchableOpacity>
      </View>

      {/* Pill Tabs */}
      <View style={styles.tabBar}>
        {[
          { id: 'stories', label: '📖 Stories' },
          { id: 'memes', label: '😂 Memes' },
          { id: 'events', label: '🎟️ Events' },
          { id: 'pods', label: '🎙️ Pods' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabPill,
                { backgroundColor: cardBg, borderColor },
                isActive && { backgroundColor: accentColor, borderColor: accentColor },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Now Playing Bar (shows cleanly inside the page when audio is active) */}
      <MiniPlayer
        episode={currentEpisode}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onClose={() => {
          setCurrentEpisode(null);
          setIsPlaying(false);
        }}
      />

      {/* Active Tab Content */}
      {activeTab === 'stories' && (
        <StoriesTab
          stories={stories}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onAddStory={handleAddStory}
        />
      )}

      {activeTab === 'memes' && <MemesTab />}

      {activeTab === 'events' && <EventsTab />}

      {activeTab === 'pods' && (
        <PodsTab
          currentEpisode={currentEpisode}
          isPlaying={isPlaying}
          onSelectEpisode={handleSelectEpisode}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
        />
      )}

      {/* Daily Breath & Wisdom Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: cardBg }]}>
            <Text style={{ fontSize: 42, textAlign: 'center' }}>🌿✨</Text>
            <Text style={[styles.sectionHeading, { textAlign: 'center', marginVertical: 8, color: theme?.textPrimary || '#2A192E' }]}>
              Daily Breath & Wisdom
            </Text>
            <Text style={[styles.bodyText, { textAlign: 'center', color: theme?.textSecondary || '#5C4D60' }]}>
              "No catching up needed. Take a slow breath, pick a gentle sound, or share a quiet smile."
            </Text>

            <View style={[styles.memeSubBox, { alignItems: 'flex-start', backgroundColor: softBg }]}>
              <Text style={[styles.tagText, { color: accentColor }]}>🌿 Gentle Reminder:</Text>
              <Text style={{ fontSize: 13, fontStyle: 'italic', marginTop: 4, color: theme?.textPrimary || '#2A192E' }}>
                "Even after seven hours of rain, the sun still finds its way back tomorrow."
              </Text>
            </View>

            <View style={[styles.memeSubBox, { alignItems: 'flex-start', backgroundColor: softBg }]}>
              <Text style={[styles.tagText, { color: accentColor }]}>💡 Daily Tip:</Text>
              {loadingAdvice && <ActivityIndicator color={accentColor} style={{ marginTop: 6 }} />}
              {adviceError !== '' && (
                <Text style={{ color: '#BA1A1A', fontSize: 12, marginTop: 4 }}>{adviceError}</Text>
              )}
              {!loadingAdvice && adviceError === '' && (
                <Text style={{ fontSize: 13, marginTop: 4, color: theme?.textPrimary || '#2A192E' }}>"{advice}"</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: accentColor }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.primaryBtnText}>Feeling lighter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Standalone ChillScreen with unified MindBloom sidebar & mobile navigation
export const ChillScreen = ({ navigation }) => {
  const { theme, companionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const handleNavigate = (routeId) => {
    if (routeId === 'home') navigation?.navigate?.('Home', { tab: 'home' });
    else if (routeId === 'journal') navigation?.navigate?.('Journal');
    else if (routeId === 'arcade') navigation?.navigate?.('Arcade');
    else if (routeId === 'baraza' || routeId === 'community') navigation?.navigate?.('Community');
    else if (routeId === 'sanctuary') navigation?.navigate?.('Profile');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.bg || '#FAF6EF' }]}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme?.bg || '#FAF6EF' }}>
        {isWide && (
          <SidebarNav
            activeRoute="soundscapes"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <ScrollView contentContainerStyle={{ padding: isWide ? 32 : 16 }}>
            <ChillContent />
          </ScrollView>
          {!isWide && (
            <BottomNavBar
              activeRoute="soundscapes"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};