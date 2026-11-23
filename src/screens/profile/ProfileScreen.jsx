// src/screens/profile/ProfileScreen.jsx
// MindBloom "My Sanctuary" Profile Screen
// Exporting both ProfileContent (for tabbed view) and ProfileScreen (for standalone stack)
// Fully integrated with dynamic themes, dark mode, discreet privacy shield customization, and legal popups.

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { onboardingStorage } from '../../services/onboardingStorage';
// Navigation Components
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';

// Profile Sections
import { ProfileHeader } from './components/ProfileHeader';
import { SanctuaryHeroCard } from './components/SanctuaryHeroCard';
import { EverydayThingsSection } from './components/EverydayThingsSection';
import { ThemePalettePicker } from './components/ThemePalettePicker';
import { CustomizeCompanionBanner } from './components/CustomizeCompanionBanner';
import { ComfortSettingsList } from './components/ComfortSettingsList';
import { RoomToGrowSection } from './components/RoomToGrowSection';
import { SignOutSection } from './components/SignOutSection';

// Modals
import { EditProfileModal } from './components/modals/EditProfileModal';
import { NotificationSettingsModal } from './components/modals/NotificationSettingsModal';
import { CustomizeCompanionModal } from './components/modals/CustomizeCompanionModal';
import { LibraryModal } from './components/modals/LibraryModal';
import { MoodAnalyticsModal } from './components/modals/MoodAnalyticsModal';
import { PrivacyDataModal } from './components/modals/PrivacyDataModal';
import { HelpSupportModal } from './components/modals/HelpSupportModal';
import { DiscreetPrivacyModal } from './components/modals/DiscreetPrivacyModal';
import { StepAwayConfirmModal } from './components/modals/StepAwayConfirmModal';
import { LanguageRegionModal } from './components/modals/LanguageRegionModal';
import { LegalModal } from '../legal/LegalScreen';

/**
 * ProfileContent: The full profile body that can be rendered inside HomeScreen (tabbed)
 * or inside ProfileScreen (standalone stack).
 */
export const ProfileContent = ({
  companionId: initialCompanionId,
  userFocusAreas = ['Anxiety & Panic'],
  onNavigateHome,
  onNavigateJournal,
  onSignOut,
  isWide = false,
}) => {
  const { theme, companionId: globalCompanionId, setCompanionId: setGlobalCompanionId } = useTheme();

  const [companionId, setCompanionId] = useState(initialCompanionId || globalCompanionId || 'noodle');
  const [profile, setProfile] = useState({
    nickname: '',
    bio: '',
    location: 'Kenya · East Africa',
    focusAreas: userFocusAreas,
  });

  const [stats, setStats] = useState({
    daysHere: 1,
    streak: 1,
    seeds: 1,
  });

  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await onboardingStorage.getPreferences();
        if (saved) {
          const comp = saved.companionId || saved.companion;
          if (comp) setCompanionId(comp);
          if (saved.nickname || saved.focusAreas) {
            setProfile((prev) => ({
              ...prev,
              nickname: saved.nickname || prev.nickname,
              bio: saved.bio || prev.bio,
              location: saved.location || prev.location,
              focusAreas: saved.focusAreas && saved.focusAreas.length > 0 ? saved.focusAreas : prev.focusAreas,
            }));
          }
        }
      } catch (err) {
        console.warn('Failed loading profile preferences:', err);
      }
    })();
  }, []);

  const handleSaveProfile = async (updated) => {
    const newProfile = { ...profile, ...updated };
    setProfile(newProfile);
    try {
      await onboardingStorage.savePreferences({
        ...newProfile,
        companionId,
      });
    } catch { }
    setActiveModal(null);
  };

  const handleSelectCompanion = async (newCompanionId) => {
    setCompanionId(newCompanionId);
    setGlobalCompanionId(newCompanionId);
    try {
      await onboardingStorage.savePreferences({
        ...profile,
        companion: newCompanionId,
        companionId: newCompanionId,
      });
    } catch { }
    setActiveModal(null);
  };

  return (
    <View style={[styles.contentMaxWrapper, isWide && styles.contentMaxWrapperWide]}>
      {/* Profile Top Bar */}
      <ProfileHeader
        onHomePress={onNavigateHome}
        onNotificationPress={() => setActiveModal('notifications')}
      />

      {/* Sanctuary Hero Card */}
      <SanctuaryHeroCard
        profile={profile}
        companionId={companionId}
        stats={stats}
        onEditPress={() => setActiveModal('edit')}
        onCompanionPress={() => setActiveModal('customize')}
      />

      {/* Everyday Little Things (Library, Mood Analytics, Journal) */}
      <EverydayThingsSection
        onLibraryPress={() => setActiveModal('library')}
        onMoodPress={() => setActiveModal('mood')}
        onJournalPress={onNavigateJournal}
      />

      {/* Theme Palette Picker (Make yourself at home) */}
      <ThemePalettePicker />

      {/* Companion Customize Banner */}
      <CustomizeCompanionBanner
        companionId={companionId}
        onPress={() => setActiveModal('customize')}
      />

      {/* Comfort Settings */}
      <ComfortSettingsList
        onNotificationsPress={() => setActiveModal('notifications')}
        onLanguagePress={() => setActiveModal('language')}
        onPrivacyPress={() => setActiveModal('privacy')}
        onDiscreetShieldPress={() => setActiveModal('discreet')}
      />

      {/* Room to Grow (Learned Vocabulary removed per request) */}
      <RoomToGrowSection
        onHelpPress={() => setActiveModal('help')}
        onTermsPress={() => setActiveModal('legal_terms')}
        onDisclaimerPress={() => setActiveModal('legal_disclaimer')}
      />

      {/* Sign Out Section & Footer */}
      <SignOutSection onSignOut={() => setActiveModal('step_away')} />

      {/* Step Away Confirmation Modal */}
      <StepAwayConfirmModal
        visible={activeModal === 'step_away'}
        theme={theme}
        onClose={() => setActiveModal(null)}
        onConfirm={onSignOut}
      />

      {/* -- Modals ------------------------------------------ */}
      <EditProfileModal
        visible={activeModal === 'edit'}
        profile={profile}
        theme={theme}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveProfile}
      />

      <NotificationSettingsModal
        visible={activeModal === 'notifications'}
        companionId={companionId}
        theme={theme}
        isWide={isWide}
        onClose={() => setActiveModal(null)}
        onSave={() => setActiveModal(null)}
      />

      <CustomizeCompanionModal
        visible={activeModal === 'customize'}
        currentCompanionId={companionId}
        theme={theme}
        onClose={() => setActiveModal(null)}
        onSelectCompanion={handleSelectCompanion}
      />

      <LibraryModal
        visible={activeModal === 'library'}
        theme={theme}
        onClose={() => setActiveModal(null)}
        onNavigateChill={() => {
          setActiveModal(null);
          Alert.alert('Chill & Soundscapes', 'Streaming relaxing audio from your teammate\'s Chill Space.');
        }}
      />

      <MoodAnalyticsModal
        visible={activeModal === 'mood'}
        theme={theme}
        onClose={() => setActiveModal(null)}
      />

      <PrivacyDataModal
        visible={activeModal === 'privacy'}
        theme={theme}
        onClose={() => setActiveModal(null)}
        onViewLegal={() => setActiveModal('legal_privacy')}
      />

      <HelpSupportModal
        visible={activeModal === 'help'}
        theme={theme}
        onClose={() => setActiveModal(null)}
      />

      <LanguageRegionModal
        visible={activeModal === 'language'}
        theme={theme}
        onClose={() => setActiveModal(null)}
      />

      <DiscreetPrivacyModal
        visible={activeModal === 'discreet'}
        onClose={() => setActiveModal(null)}
      />

      <LegalModal
        visible={typeof activeModal === 'string' && activeModal.startsWith('legal')}
        initialTab={
          activeModal === 'legal_privacy'
            ? 'privacy'
            : activeModal === 'legal_disclaimer'
              ? 'disclaimer'
              : 'terms'
        }
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
};

/**
 * ProfileScreen: Standalone screen wrapper with full navigation support.
 */
export const ProfileScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;

  const companionId = route?.params?.companion || 'kovu';
  const focusAreas = route?.params?.focusAreas || ['Anxiety & Panic'];

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation?.navigate?.('Home', { tab: 'home' });
    } else if (routeId === 'journal') {
      navigation?.navigate?.('Journal', { companion: companionId, focusAreas });
    } else if (routeId === 'sanctuary') {
      // Already on profile
    } else if (routeId === 'chill') {
      Alert.alert('Chill Space', 'A calm space to unwind and listen to soothing sounds.');
    } else if (routeId === 'community') {
      Alert.alert('Baraza Community', 'A warm circle of shared encouragement and peaceful stories.');
    } else if (routeId === 'aurora') {
      Alert.alert('Aurora Companion', 'Aurora AI companion session is starting...');
    } else if (routeId === 'breath') {
      Alert.alert('Tulia Breathing', '60-second breathing exercise starting...');
    } else {
      Alert.alert('MindBloom', `Navigating to ${routeId}...`);
    }
  };

  const handleSignOut = () => {
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      <View style={[styles.layoutContainer, { backgroundColor: theme.bg }]}>
        {/* Desktop Sidebar Navigation */}
        {isWide && (
          <SidebarNav
            activeRoute="sanctuary"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        {/* Main Content Area */}
        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              isWide && styles.scrollContainerWide,
              { backgroundColor: theme.bg },
            ]}
          >
            <ProfileContent
              companionId={companionId}
              userFocusAreas={focusAreas}
              onNavigateHome={() => navigation?.navigate?.('Home', { tab: 'home' })}
              onNavigateJournal={() =>
                navigation?.navigate?.('Journal', { companion: companionId, focusAreas })
              }
              onSignOut={handleSignOut}
              isWide={isWide}
            />
          </ScrollView>

          {/* Mobile Bottom Navigation Bar */}
          {!isWide && (
            <BottomNavBar
              activeRoute="sanctuary"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

import { styles } from './styles/ProfileScreen.styles';
