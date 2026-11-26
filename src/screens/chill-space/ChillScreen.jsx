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
import { onboardingStorage } from '../../services/onboardingStorage';
import { chillLibraryStorage } from '../../services/chillLibraryStorage';
import { useAudioPlayer } from '../../core/audio/AudioPlayerContext';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { initialStories } from './chillData';
import { StoriesTab } from './components/StoriesTab';
import { MemesTab } from './components/MemesTab';
import { EventsTab } from './components/EventsTab';
import { PodsTab } from './components/PodsTab';
import { styles } from './styles/ChillScreen.styles';

export const ChillContent = ({ initialTab = 'stories', vibeLabel = null }) => {
  const { theme } = useTheme();
  const { countryData } = useI18n();
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [stories, setStories] = useState(() =>
    initialStories.map((s) => ({ ...s, isSaved: false }))
  );
  const [userFocusAreas, setUserFocusAreas] = useState(['anxiety']);

  // Daily Breath & Wisdom Modal + Advice API state
  const [showModal, setShowModal] = useState(false);
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState('');

  const accentColor = theme?.accent || '#42213D';
  const softBg = theme?.navActive || '#EFE8FA';
  const cardBg = theme?.cardBg || '#FFFFFF';
  const borderColor = theme?.divider || '#E8DFF2';
  const mutedText = theme?.textMuted || '#746379';

  useEffect(() => {
    onboardingStorage
      .getPreferences()
      .then((prefs) => {
        if (prefs?.focusAreas && prefs.focusAreas.length > 0) {
          setUserFocusAreas(prefs.focusAreas);
        }
      })
      .catch(() => {});

    chillLibraryStorage
      .getAll()
      .then((saved) => {
        const savedIds = new Set(saved.map((item) => String(item.id)));
        setStories((prev) =>
          prev.map((s) => ({ ...s, isSaved: savedIds.has(String(s.id)) }))
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!showModal) return;
    setLoadingAdvice(true);
    setAdviceError('');

    fetch('https://api.adviceslip.com/advice')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load daily tip right now.');
        return res.json();
      })
      .then((data) => {
        setAdvice(data?.slip?.advice || 'Take one slow breath at a time.');
        setLoadingAdvice(false);
      })
      .catch((err) => {
        setAdviceError(err.message);
        setLoadingAdvice(false);
      });
  }, [showModal]);

  function handleToggleLike(id) {
    setStories((prev) =>
      prev.map((story) => {
        if (story.id !== id) return story;
        const nextLiked = !story.isLiked;
        return {
          ...story,
          isLiked: nextLiked,
          likes: nextLiked ? story.likes + 1 : Math.max(0, story.likes - 1),
        };
      })
    );
  }

  async function handleToggleSave(id) {
    const target = stories.find((s) => s.id === id);
    if (!target) return;
    const { isSaved } = await chillLibraryStorage.toggleSave({
      id: target.id,
      category: target.tag || 'COMMUNITY STORY',
      title: target.title,
      desc: target.excerpt,
      body: target.excerpt,
      author: target.authorName,
      bg: '#F0EAFA',
      color: '#492542',
      icon: target.authorEmoji || '🌿',
    });
    setStories((prev) =>
      prev.map((story) => (story.id === id ? { ...story, isSaved } : story))
    );
  }

  function handleAddStory(title, excerpt, tag, category = 'anxiety') {
    const city = countryData?.capital && countryData.capital !== 'Global'
      ? countryData.capital
      : 'Your Sanctuary';
    const newStory = {
      id: `s_${Date.now()}`,
      authorName: 'Anonymous',
      authorEmoji: '🌊',
      location: `${city} · Just now`,
      tag,
      category,
      title,
      excerpt,
      likes: 1,
      reflections: [],
      isLiked: true,
      isSaved: false,
    };
    setStories((prev) => [newStory, ...prev]);
  }

  function handleAddReflection(storyId, text) {
    const city = countryData?.capital && countryData.capital !== 'Global'
      ? countryData.capital
      : 'Your Sanctuary';
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? {
              ...story,
              reflections: [
                ...story.reflections,
                {
                  id: `r_${Date.now()}`,
                  author: `You · ${city}`,
                  text,
                },
              ],
            }
          : story
      )
    );
  }

  function handleSelectEpisode(episode) {
    playEpisode(episode);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.breadcrumb, { color: mutedText }]}>
        My sanctuary / Chill & Soundscapes
      </Text>

      {/* Header matching screenshots */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme?.textPrimary || '#2A192E' }]}>
            Chill Space 🌴
          </Text>
          <Text style={[styles.subtitle, { color: mutedText }]}>
            {vibeLabel
              ? `Interactive Sanctuary · Matched to your ${vibeLabel.toUpperCase()} vibe`
              : `Interactive Sanctuary · Matched to ${(userFocusAreas[0] || 'Peace').toUpperCase()}`}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.maskButton, { backgroundColor: softBg, borderColor }]}
          onPress={() => setShowModal(true)}
        >
          <Text style={{ fontSize: 20 }}>🌿</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Clean Pill Tabs matching screenshots */}
      <View style={styles.tabBar}>
        {[
          { id: 'stories', label: '✍️ Stories & Essays' },
          { id: 'pods', label: '🎙️ Audio Sanctuary' },
          { id: 'memes', label: '😂 Vibes' },
          { id: 'events', label: '🗓️ Events' },
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

      {/* Active Tab Content */}
      {activeTab === 'stories' && (
        <StoriesTab
          stories={stories}
          userFocusAreas={userFocusAreas}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onAddStory={handleAddStory}
          onAddReflection={handleAddReflection}
        />
      )}

      {activeTab === 'pods' && (
        <PodsTab
          currentEpisode={currentEpisode}
          isPlaying={isPlaying}
          onSelectEpisode={handleSelectEpisode}
          onTogglePlay={togglePlay}
        />
      )}

      {activeTab === 'memes' && <MemesTab />}

      {activeTab === 'events' && <EventsTab />}

      {/* Daily Breath & Wisdom Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: cardBg, borderRadius: 28 }]}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🌿✨</Text>
            <Text style={[styles.sectionHeading, { textAlign: 'center', marginVertical: 8, color: theme?.textPrimary || '#2A192E' }]}>
              Daily Breath & Wisdom
            </Text>
            <Text style={[styles.bodyText, { textAlign: 'center', color: theme?.textSecondary || '#5C4D60' }]}>
              "No catching up needed. Take a slow breath, listen to something gentle, or share a quiet smile."
            </Text>

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
export const ChillScreen = ({ navigation, route }) => {
  const { theme, companionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const initialTab = route?.params?.initialTab || 'stories';
  const vibeLabel = route?.params?.vibeLabel || null;

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
            <ChillContent initialTab={initialTab} vibeLabel={vibeLabel} />
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
