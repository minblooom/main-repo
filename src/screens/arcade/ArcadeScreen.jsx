// src/screens/arcade/ArcadeScreen.jsx
// MindBloom Bloom Arcade & Games Hub matching the approved Figma design.
// Exports both ArcadeContent (embedded in HomeScreen tabs) and ArcadeScreen (standalone stack).
// Styles extracted to src/screens/arcade/styles/ArcadeScreen.styles.js.

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { onboardingStorage } from '../../services/onboardingStorage';
import { AuthService } from '../../core/api/authService';

// Navigation Components
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';

// Arcade Sections
import { ArcadeHeader } from './components/ArcadeHeader';
import { GameOfTheDayHero } from './components/GameOfTheDayHero';
import { PlayFilterSection } from './components/PlayFilterSection';
import { MadeForYourMomentSection } from './components/MadeForYourMomentSection';
import { RecentlyPlayedSection } from './components/RecentlyPlayedSection';
import { FavouritesSection } from './components/FavouritesSection';

// Game Engine & Modals
import { UNIVERSAL_ARCADE_GAMES } from './engine/gameRegistry';
import { getGameOfTheDay } from './engine/dailyRotationService';
import { gameSessionManager } from './engine/gameSessionManager';
import { GamePreviewModal } from './components/modals/GamePreviewModal';
import { GameShell } from './engine/GameShell';
import { soundService } from './audio/soundService';
import { ArcadeApiService } from '../../services/arcadeApiService';
import { ArcadeSyncService } from '../../core/api/arcadeSyncService';

// Styles
import { styles } from './styles/ArcadeScreen.styles';

/**
 * ArcadeContent: The full gaming hub body rendered inside HomeScreen (tabbed) or ArcadeScreen (standalone)
 */
export const ArcadeContent = ({
  companionId = 'taz',
  userName = '',
  onNavigateHome,
  isWide = false,
}) => {
  const { theme } = useTheme();

  // Active playing game (null = hub view; object = full in-game shell)
  const [activeGame, setActiveGame] = useState(null);
  // Whether resuming from a saved pause state
  const [resumeMode, setResumeMode] = useState(false);
  // Game selected for preview modal
  const [previewGame, setPreviewGame] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState(null);

  // Persistence State
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [dailyGame, setDailyGame] = useState(getGameOfTheDay());
  const [displayName, setDisplayName] = useState(userName || 'friend');
  const [userFocusAreas, setUserFocusAreas] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [publicWebGames, setPublicWebGames] = useState([]);

  // Load user data, recents, and favourites on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedPrefs, storedUser] = await Promise.all([
          onboardingStorage.getPreferences(),
          AuthService.getStoredUser(),
        ]);
        const name = storedUser?.nickname || savedPrefs?.nickname || userName;
        if (name) {
          setDisplayName(name);
        }
        if (savedPrefs?.focusAreas && savedPrefs.focusAreas.length > 0) {
          setUserFocusAreas(savedPrefs.focusAreas);
        } else if (storedUser?.primaryStruggles && storedUser.primaryStruggles.length > 0) {
          setUserFocusAreas(storedUser.primaryStruggles);
        }

        if (savedPrefs?.interests && savedPrefs.interests.length > 0) {
          setUserInterests(savedPrefs.interests);
        } else if (storedUser?.interests && storedUser.interests.length > 0) {
          setUserInterests(storedUser.interests);
        }

        // Check backend database for cloud-synced struggles, interests, and tailored catalog
        try {
          const backendCatalog = await ArcadeSyncService.getCatalog();
          if (backendCatalog?.primaryStruggles && backendCatalog.primaryStruggles.length > 0) {
            setUserFocusAreas(backendCatalog.primaryStruggles);
          }
          if (backendCatalog?.interests && backendCatalog.interests.length > 0) {
            setUserInterests(backendCatalog.interests);
          }
        } catch { }
        const universalIds = new Set(UNIVERSAL_ARCADE_GAMES.map((g) => g.id));
        const recents = await gameSessionManager.getRecentlyPlayed();
        setRecentlyPlayed(recents.filter((g) => universalIds.has(g.id)));

        const favs = await gameSessionManager.getFavourites();
        setFavourites(favs.filter((g) => universalIds.has(g.id)));

        // Fetch optional external public mindfulness & backend-proxied browser games in background
        ArcadeApiService.fetchExternalMindfulnessGames().catch(() => {});
        ArcadeApiService.fetchPublicWebGames()
          .then((list) => {
            if (Array.isArray(list) && list.length > 0) {
              setPublicWebGames(list);
            }
          })
          .catch(() => {});
      } catch { }
    })();
  }, [userName]);

  // Only surface the 6 universal games in Blooms Arcade for now
  const userCatalog = UNIVERSAL_ARCADE_GAMES;

  const filteredGames = useMemo(() => {
    return userCatalog.filter((g) => {
      // Category filter
      if (activeCategory !== 'all' && g.category !== activeCategory) {
        return false;
      }
      // Quick tag filter
      if (activeTag === 'under_5' && g.duration.includes('8')) {
        return false;
      }
      if (activeTag === 'gentle' && g.difficulty !== 'Gentle') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = g.title.toLowerCase().includes(q);
        const matchesDesc = g.shortDesc.toLowerCase().includes(q);
        const matchesCat = (g.categoryLabel || '').toLowerCase().includes(q);
        const matchesMood = (g.mood || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesMood) {
          return false;
        }
      }
      return true;
    });
  }, [userCatalog, searchQuery, activeCategory, activeTag]);

  const handleToggleFavourite = async (gameId) => {
    soundService.playClick();
    await gameSessionManager.toggleFavourite(gameId);
    const updatedFavs = await gameSessionManager.getFavourites();
    const universalIds = new Set(UNIVERSAL_ARCADE_GAMES.map((g) => g.id));
    setFavourites(updatedFavs.filter((g) => universalIds.has(g.id)));
  };

  const handlePlayGame = (game, options = {}) => {
    soundService.playClick();
    if (options.resume) {
      // Continue playing right where they paused!
      setResumeMode(true);
      setActiveGame(game);
    } else {
      setResumeMode(false);
      setPreviewGame(game);
    }
  };

  const handleRemoveRecent = async (gameId) => {
    soundService.playClick();
    const updated = await gameSessionManager.removeRecentGame(gameId);
    setRecentlyPlayed(updated);
  };

  const handleStartFromPreview = () => {
    soundService.playClick();
    const gameToPlay = previewGame;
    setPreviewGame(null);
    setResumeMode(false);
    setActiveGame(gameToPlay);
  };

  // If a game is actively playing, render the full immersive in-game shell
  if (activeGame) {
    return (
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <GameShell
          game={activeGame}
          companionId={companionId}
          shouldResume={resumeMode}
          onExit={async () => {
            setActiveGame(null);
            setResumeMode(false);
            // Refresh recents
            const updatedRecents = await gameSessionManager.getRecentlyPlayed();
            const universalIds = new Set(UNIVERSAL_ARCADE_GAMES.map((g) => g.id));
            setRecentlyPlayed(updatedRecents.filter((g) => universalIds.has(g.id)));
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContainer,
        isWide && styles.scrollContainerWide,
      ]}
    >
      <View style={[styles.contentMaxWrapper, isWide && styles.contentMaxWrapperWide]}>
        {/* Top Breadcrumb & Controls */}
        <ArcadeHeader
          onHomePress={onNavigateHome}
          onFavouritesPress={() => {
            soundService.playClick();
            Alert.alert(
              'My Favourites',
              `You have ${favourites.length} games in your peaceful collection.`
            );
          }}
          onNotificationPress={() => {
            soundService.playClick();
            Alert.alert('Arcade Nudges', 'Zero daily pressure. Play only when it feels nourishing.');
          }}
        />

        {/* Welcoming Greeting matching Figma */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingTitle, { color: theme.textPrimary }]}>
            A little play, {displayName}?
          </Text>
          <Text style={[styles.greetingSub, { color: theme.textMuted }]}>
            No scores to beat. Just a gentle spot to reset.
          </Text>
        </View>

        {/* Featured Game of the Day Card */}
        <GameOfTheDayHero
          game={dailyGame}
          isWide={isWide}
          onPlayToday={() => handlePlayGame(dailyGame)}
        />

        {/* "Find your kind of play" Search & Filters */}
        <PlayFilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          activeTag={activeTag}
          onSelectTag={setActiveTag}
          onSortPress={() => {
            soundService.playClick();
            Alert.alert(
              'Sort Games',
              'Currently sorted by Mindful Recommendations. More sort filters coming soon!'
            );
          }}
        />

        {/* "Made for your moment" Section */}
        <MadeForYourMomentSection
          games={filteredGames}
          favourites={favourites}
          isWide={isWide}
          onPlayGame={handlePlayGame}
          onToggleFavourite={handleToggleFavourite}
        />

        {/* "Pick up where you paused" Section */}
        <RecentlyPlayedSection
          games={recentlyPlayed}
          favourites={favourites}
          isWide={isWide}
          onPlayGame={handlePlayGame}
          onToggleFavourite={handleToggleFavourite}
          onRemoveGame={handleRemoveRecent}
        />

        {/* "Your happy little collection" (Favourites) */}
        <FavouritesSection
          games={favourites}
          isWide={isWide}
          onPlayGame={handlePlayGame}
          onToggleFavourite={handleToggleFavourite}
        />

        {/* Optional Backend-Proxied "More Free Web Games" Shelf (shown when online) */}
        {publicWebGames.length > 0 && (
          <View style={{ marginTop: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: theme.textPrimary, marginBottom: 4 }}>
              More Free Web Games 🌐
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 12 }}>
              External browser games via safe MindBloom proxy (opens in new tab)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {publicWebGames.map((wg) => (
                <TouchableOpacity
                  key={wg.id}
                  style={{
                    width: 210,
                    borderRadius: 18,
                    backgroundColor: theme.cardBg,
                    borderWidth: 1,
                    borderColor: theme.heroBorder,
                    overflow: 'hidden',
                  }}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (typeof wg.gameUrl === 'string' && /^https:\/\//i.test(wg.gameUrl)) {
                      if (Platform.OS === 'web' && typeof window !== 'undefined') {
                        window.open(wg.gameUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        Linking.openURL(wg.gameUrl).catch(() => {});
                      }
                    }
                  }}
                >
                  {wg.thumbnail ? (
                    <Image
                      source={{ uri: wg.thumbnail }}
                      style={{ width: '100%', height: 112 }}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View style={{ padding: 10, gap: 4 }}>
                    <Text style={{ fontSize: 10, fontWeight: '800', color: theme.accent }}>
                      {(wg.genre || 'WEB').toUpperCase()}
                    </Text>
                    <Text style={{ fontSize: 13.5, fontWeight: '800', color: theme.textPrimary }} numberOfLines={1}>
                      {wg.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted }} numberOfLines={2}>
                      {wg.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Game Launch Preview Modal */}
        <GamePreviewModal
          visible={!!previewGame}
          game={previewGame}
          isFavourited={previewGame ? favourites.some((f) => f.id === previewGame.id) : false}
          onClose={() => setPreviewGame(null)}
          onStart={handleStartFromPreview}
          onToggleFavourite={() => previewGame && handleToggleFavourite(previewGame.id)}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
};

/**
 * ArcadeScreen: Standalone screen wrapper with full navigation support.
 */
export const ArcadeScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companionId = route?.params?.companion || 'taz';

  const handleNavigate = (routeId) => {
    soundService.playClick();
    if (routeId === 'home') {
      navigation?.navigate?.('Home', { tab: 'home' });
    } else if (routeId === 'journal') {
      navigation?.navigate?.('Journal', { companion: companionId });
    } else if (routeId === 'sanctuary') {
      navigation?.navigate?.('Profile', { companion: companionId });
    } else if (routeId === 'baraza' || routeId === 'community') {
      navigation?.navigate?.('Community');
    } else if (routeId === 'arcade' || routeId === 'acacia') {
      // Already on arcade
    } else if (routeId === 'soundscapes' || routeId === 'chill') {
      navigation?.navigate?.('Chill');
    } else {
      Alert.alert('MindBloom', `Navigating to ${routeId}...`);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme?.bg || '#FAF6EF' }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme?.bg || '#FAF6EF'}
      />

      <View style={[styles.layoutContainer, { backgroundColor: theme?.bg || '#FAF6EF' }]}>
        {/* Desktop Sidebar Navigation */}
        {isWide && (
          <SidebarNav
            activeRoute="arcade"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <ArcadeContent
            companionId={companionId}
            onNavigateHome={() => navigation?.navigate?.('Home', { tab: 'home' })}
            isWide={isWide}
          />

          {/* Mobile Bottom Navigation Bar */}
          {!isWide && (
            <BottomNavBar
              activeRoute="arcade"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
