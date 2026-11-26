// src/screens/home/HomeScreen.jsx
// MindBloom Sanctuary Home Screen matching the Figma design
// Responsive: Desktop sidebar on wide screens, bottom navigation bar on mobile
// Fully integrated with dynamic app-wide themes & dark mode.

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { onboardingStorage } from '../../services/onboardingStorage';
import { AuthService } from '../../core/api/authService';
import { useTheme } from '../../theme/ThemeContext';
import { ChillContent } from '../chill-space/ChillScreen';

// Modular Navigation Components
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';

// Modular Home Screen Sections
import { HomeHeader } from './components/HomeHeader';
import { GreetingSection } from './components/GreetingSection';
import { MoodCheckIn } from './components/MoodCheckIn';
import { HeroBanners } from './components/HeroBanners';
import { MomentsSection } from './components/MomentsSection';
import { JournalContent } from '../journal/JournalScreen';
import { ProfileContent } from '../profile/ProfileScreen';
import { ArcadeContent } from '../arcade/ArcadeScreen';
import { AuroraContent } from '../ai/AuroraScreen';
import { MoodAnalyticsModal } from '../profile/components/modals/MoodAnalyticsModal';
import { styles } from './styles/HomeScreen.styles';

export const HomeScreen = ({ navigation, route }) => {
  const { theme, companionId: themeCompanionId, setCompanionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [activeTab, setActiveTab] = useState(route?.params?.tab || 'home');
  const companionId = themeCompanionId || route?.params?.companion || 'noodle';
  const [userName, setUserName] = useState('');
  const [userFocusAreas, setUserFocusAreas] = useState(route?.params?.focusAreas || ['anxiety']);
  const [moodAnalyticsVisible, setMoodAnalyticsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [saved, storedUser] = await Promise.all([
          onboardingStorage.getPreferences(),
          AuthService.getStoredUser(),
        ]);
        const name = storedUser?.nickname || saved?.nickname || '';
        if (name) {
          setUserName(name);
        }
        if (saved) {
          if (saved.companion && !route?.params?.companion) {
            setCompanionId(saved.companion);
          }
          if (saved.focusAreas && saved.focusAreas.length > 0 && !route?.params?.focusAreas) {
            setUserFocusAreas(saved.focusAreas);
          }
        }
      } catch { }
    })();
  }, [route?.params]);

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      setActiveTab('home');
    } else if (routeId === 'journal') {
      setActiveTab('journal');
    } else if (routeId === 'breath') {
      Alert.alert('Tulia Breath', 'A 2-minute reset. Inhale gently, exhale slowly.');
    } else if (routeId === 'arcade' || routeId === 'acacia') {
      setActiveTab('arcade');
    } else if (routeId === 'soundscapes' || routeId === 'chill') {
      setActiveTab('soundscapes');
    } else if (routeId === 'aurora') {
      setActiveTab('aurora');
    } else if (routeId === 'baraza' || routeId === 'community') {
      navigation.navigate('Community');
    } else if (routeId === 'sanctuary') {
      setActiveTab('sanctuary');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.bg }]}>
        {/* Desktop Sidebar Navigation */}
        {isWide && (
          <SidebarNav
            activeRoute={activeTab}
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        {/* Main Content Area */}
        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
          {activeTab === 'arcade' ? (
            <ArcadeContent
              companionId={companionId}
              userName={userName}
              onNavigateHome={() => setActiveTab('home')}
              isWide={isWide}
            />
          ) : activeTab === 'aurora' ? (
            <AuroraContent
              companionId={companionId}
              userName={userName}
              onNavigateHome={() => setActiveTab('home')}
              onNavigateSoundscapes={() => setActiveTab('soundscapes')}
              isWide={isWide}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContainer,
                isWide && styles.scrollContainerWide,
                { backgroundColor: theme.bg },
              ]}
            >
              {activeTab === 'journal' ? (
                <JournalContent
                  companionId={companionId}
                  userFocusAreas={userFocusAreas}
                  onNavigateHome={() => setActiveTab('home')}
                  onNavigateSanctuary={() => handleNavigate('sanctuary')}
                  isWide={isWide}
                />
              ) : activeTab === 'soundscapes' ? (
                <ChillContent onNavigateHome={() => setActiveTab('home')} />
              ) : activeTab === 'sanctuary' ? (
                <ProfileContent
                  companionId={companionId}
                  userFocusAreas={userFocusAreas}
                  onNavigateHome={() => setActiveTab('home')}
                  onNavigateChill={() => setActiveTab('soundscapes')}
                  onNavigateJournal={() => setActiveTab('journal')}
                  onSignOut={() => navigation.reset({ index: 0, routes: [{ name: 'Splash' }] })}
                  isWide={isWide}
                />
              ) : (
                <View style={[styles.contentMaxWrapper, isWide && styles.contentMaxWrapperWide]}>
                  {/* Header with Breadcrumb & Weather */}
                  <HomeHeader
                    companionId={companionId}
                    onProfilePress={() => handleNavigate('sanctuary')}
                  />

                  {/* Welcoming Greeting */}
                  <GreetingSection userName={userName || 'friend'} />

                  {/* Gentle Mood Check-in */}
                  <MoodCheckIn onOpenAnalytics={() => setMoodAnalyticsVisible(true)} />

                  {/* Hero Twin Banners: Aurora & Animated Companion Mascot + Podcast of the Day */}
                  <HeroBanners
                    isWide={isWide}
                    companionId={companionId}
                    userFocusAreas={userFocusAreas}
                    onAuroraPress={() => handleNavigate('aurora')}
                    onPodcastPress={() => handleNavigate('soundscapes')}
                  />

                  {/* "A Moment for You" 3 Activities */}
                  <MomentsSection
                    isWide={isWide}
                    userFocusAreas={userFocusAreas}
                    onSelectMoment={(id) => handleNavigate(id)}
                  />
                </View>
              )}
            </ScrollView>
          )}

          {/* Mobile Bottom Navigation Bar */}
          {!isWide && (
            <BottomNavBar
              activeRoute={activeTab}
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}

          {/* Interactive Mood Analytics Modal */}
          <MoodAnalyticsModal
            visible={moodAnalyticsVisible}
            theme={theme}
            onClose={() => setMoodAnalyticsVisible(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
