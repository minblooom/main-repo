// src/screens/home/HomeScreen.jsx
// MindBloom Sanctuary Home Screen matching the Figma design
// Responsive: Desktop sidebar on wide screens, bottom navigation bar on mobile

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { colors } from '../../theme/colors';

// Modular Navigation Components
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';

// Modular Home Screen Sections
import { HomeHeader } from './components/HomeHeader';
import { GreetingSection } from './components/GreetingSection';
import { MoodCheckIn } from './components/MoodCheckIn';
import { HeroBanners } from './components/HeroBanners';
import { MomentsSection } from './components/MomentsSection';

export const HomeScreen = ({ navigation, route }) => {
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companionId = route?.params?.companion || 'noodle';
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigate = (routeId) => {
    setActiveTab(routeId);
    if (routeId === 'journal') {
      navigation?.navigate?.('Journal');
    } else if (routeId === 'breath') {
      Alert.alert('Tulia Breath', 'A 2-minute reset. Inhale gently, exhale slowly.');
    } else if (routeId === 'soundscapes') {
      Alert.alert('Chill & Soundscapes', 'Playing relaxing acoustic melodies and rain on tin roof.');
    } else if (routeId === 'aurora') {
      Alert.alert('Aurora AI Companion', 'Aurora and your companion are ready to listen. Start anywhere.');
    } else if (routeId === 'baraza') {
      Alert.alert('Community Baraza', 'Peer circles and shared encouragement in a moderated safe space.');
    } else if (routeId === 'acacia') {
      Alert.alert('The Acacia Worry Tree', 'Place a worry onto a leaf and watch it drift away.');
    } else if (routeId === 'sanctuary') {
      Alert.alert('My Sanctuary', 'Your private wellness settings, streaks, and companion preferences.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.rootContainer}>
        {/* Desktop Sidebar Navigation */}
        {isWide && (
          <SidebarNav
            activeRoute={activeTab}
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              isWide && styles.scrollContainerWide,
            ]}
          >
            <View style={[styles.contentMaxWrapper, isWide && styles.contentMaxWrapperWide]}>
              {/* Header with Breadcrumb & Weather */}
              <HomeHeader />

              {/* Welcoming Greeting */}
              <GreetingSection userName="soso" />

              {/* Gentle Mood Check-in */}
              <MoodCheckIn />

              {/* Hero Twin Banners: Aurora & Sloth Mascot + Tulia Breath */}
              <HeroBanners
                isWide={isWide}
                onAuroraPress={() => handleNavigate('aurora')}
                onBreathPress={() => handleNavigate('breath')}
              />

              {/* "A Moment for You" 3 Activities */}
              <MomentsSection
                isWide={isWide}
                userFocusAreas={route?.params?.focusAreas || ['anxiety']}
                onSelectMoment={(id) => handleNavigate(id)}
              />
            </View>
          </ScrollView>

          {/* Mobile Bottom Navigation Bar */}
          {!isWide && (
            <BottomNavBar
              activeRoute={activeTab}
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.splashBg,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  scrollContainerWide: {
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 40,
  },
  contentMaxWrapper: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    gap: 20,
  },
  contentMaxWrapperWide: {
    paddingVertical: 8,
  },
});
