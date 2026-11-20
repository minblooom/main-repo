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
import { useTheme } from '../../theme/ThemeContext';

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
import { MoodAnalyticsModal } from '../profile/components/modals/MoodAnalyticsModal';
import { styles } from './styles/HomeScreen.styles';

export const HomeScreen = ({ navigation, route }) => {
  const { theme, companionId: themeCompanionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const [activeTab, setActiveTab] = useState(route?.params?.tab || 'home');
  const companionId = themeCompanionId || route?.params?.companion || 'noodle';
  const [userFocusAreas, setUserFocusAreas] = useState(route?.params?.focusAreas || ['anxiety']);
  const [moodAnalyticsVisible, setMoodAnalyticsVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await onboardingStorage.getPreferences();
        if (saved) {
          if (saved.companion && !route?.params?.companion) {
            setCompanionId(saved.companion);
          }
          if (saved.focusAreas && saved.focusAreas.length > 0 && !route?.params?.focusAreas) {
            setUserFocusAreas(saved.focusAreas);
          }
        }
      } catch {}
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
    } else if (routeId === 'soundscapes') {
      Alert.alert(
        'Chill & Soundscapes',
        'Immersive calming audio: Savanna twilight breeze, gentle mountain rain, and soothing guitar chords to help you unwind.'
      );
    } else if (routeId === 'aurora') {
      Alert.alert('Aurora AI Companion', 'Aurora and your companion are ready to listen. Start anywhere.');
    } else if (routeId === 'baraza') {
      Alert.alert('Community Baraza', 'Peer circles and shared encouragement in a moderated safe space.');
    } else if (routeId === 'acacia') {
      Alert.alert('The Acacia Worry Tree', 'Place a worry onto a leaf and watch it drift away.');
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
              onNavigateHome={() => setActiveTab('home')}
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
              ) : activeTab === 'sanctuary' ? (
                <ProfileContent
                  companionId={companionId}
                  userFocusAreas={userFocusAreas}
                  onNavigateHome={() => setActiveTab('home')}
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
                  <GreetingSection userName="soso" />

                  {/* Gentle Mood Check-in */}
                  <MoodCheckIn onOpenAnalytics={() => setMoodAnalyticsVisible(true)} />

                  {/* Hero Twin Banners: Aurora & Animated Companion Mascot + Tulia Breath */}
                  <HeroBanners
                    isWide={isWide}
                    companionId={companionId}
                    onAuroraPress={() => handleNavigate('aurora')}
                    onBreathPress={() => handleNavigate('breath')}
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
