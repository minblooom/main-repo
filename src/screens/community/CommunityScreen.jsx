// src/screens/community/CommunityScreen.jsx
// MindBloom Community Baraza Hub — modular orchestrator

import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { BarazaGroupChatView } from '../../features/community/circles/BarazaGroupChatView';
import { SmallWinsSection } from '../../features/community/smallWins/SmallWinsSection';
import { VentBoxSection } from '../../features/community/vent/VentBoxSection';
import {
  getMatchingCirclesForUser,
  canAccessCircle,
  isMinorCohort,
} from '../../features/community/services/circleMatchingService';
import { onboardingStorage } from '../../services/onboardingStorage';
import { AuthService } from '../../core/api/authService';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { CommunityHeader } from './components/CommunityHeader';
import { QuickActionsGrid } from './components/QuickActionsGrid';
import { PrimaryCircleCard } from './components/PrimaryCircleCard';
import { TeenSanctuaryBox } from './components/TeenSanctuaryBox';
import { CirclesFeedSection } from './components/CirclesFeedSection';
import { CommunityFeatureModal } from './components/CommunityFeatureModal';
import { BarazaPresenceBar } from '../../features/community/baraza/BarazaPresenceBar';
import { TeenDailyPulse } from './components/TeenDailyPulse';
const ADULT_CATEGORIES = [
  'All Circles',
  'Youth & Campus 🎓',
  'Nairobi Hustle 💼',
  'Healing & Tulia 🌿',
  'Night Owls 🌙',
  'Sisterhood 🌸',
  "Men's Grounding 🦁",
];

const TEEN_CATEGORIES = [
  'All Circles',
  'School & Exams 🎒',
  'After-School & Unwind 🎧',
  'Creative & Identity 🎨',
  'Sisterhood 🌸',
  "Brothers' Grounding 🛡️",
];

export const CommunityScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const companionId = (route && route.params && route.params.companion) || 'noodle';

  const [selectedCategory, setSelectedCategory] = useState('All Circles');
  const [searchQuery, setSearchQuery] = useState('');
  const [circleLastMessages, setCircleLastMessages] = useState({});
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [circleDraftText, setCircleDraftText] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'small_wins' | 'vent_box' | null
  const { joinedCircleIds, hydrate } = useCommunityStore();
  const [userProfile, setUserProfile] = useState({
    age: '18-24',
    gender: 'prefer_not',
    focusAreas: [],
    interests: [],
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function loadUserPreferences() {
      try {
        const [prefs, storedUser] = await Promise.all([
          onboardingStorage.getPreferences(),
          AuthService.getStoredUser(),
        ]);
        if (prefs || storedUser) {
          setUserProfile({
            age:
              prefs?.age ||
              prefs?.ageBand ||
              prefs?.ageGroup ||
              storedUser?.ageBand ||
              storedUser?.age ||
              '18-24',
            gender: prefs?.gender || storedUser?.gender || 'prefer_not',
            focusAreas:
              prefs?.focusAreas ||
              prefs?.primaryStruggles ||
              storedUser?.primaryStruggles ||
              [],
            interests: prefs?.interests || storedUser?.interests || [],
          });
        }
      } catch(_err){}
    }
    loadUserPreferences();
    const unsubscribe = navigation?.addListener?.('focus', loadUserPreferences);
    return unsubscribe;
  }, [navigation]);

  const { primaryMatch, eligibleCircles, userAgeBand } = useMemo(
    () =>
      getMatchingCirclesForUser({
        age: userProfile.age,
        gender: userProfile.gender,
        focusAreas: userProfile.focusAreas,
        interests: userProfile.interests,
      }),
    [userProfile]
  );

  const isTeenCohort = isMinorCohort(userAgeBand);

  const visibleCategories = useMemo(() => {
    const g = String(userProfile.gender || 'prefer_not').toLowerCase().trim();
    const base = isTeenCohort ? TEEN_CATEGORIES : ADULT_CATEGORIES;
    return base.filter((cat) => {
      if (cat === 'Sisterhood 🌸') return g === 'female';
      if (cat === "Men's Grounding 🦁" || cat === "Brothers' Grounding 🛡️") return g === 'male';
      return true;
    });
  }, [userProfile.gender, isTeenCohort]);

  const handleSelectCircle = (circle) => {
    if (!canAccessCircle(userAgeBand, circle)) return;
    setSelectedCircle(circle);
  };

  useEffect(() => {
    if (!visibleCategories.includes(selectedCategory)) {
      setSelectedCategory('All Circles');
    }
  }, [visibleCategories, selectedCategory]);

  const filteredCircles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = eligibleCircles.filter((c) => {
      const catOk = selectedCategory === 'All Circles' || c.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      const lastMsgText = circleLastMessages[c.id]?.text || '';
      return (
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        lastMsgText.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      const aTs = circleLastMessages[a.id]?.createdAtMs || 0;
      const bTs = circleLastMessages[b.id]?.createdAtMs || 0;
      return bTs - aTs;
    });
  }, [eligibleCircles, selectedCategory, searchQuery, circleLastMessages]);

  useEffect(() => {
    if (selectedCircle) return;
    let cancelled = false;
    async function loadLastMessages() {
      try {
        const entries = await Promise.all(
          eligibleCircles.map(async (c) => {
            const raw = await AsyncStorage.getItem(`mindbloom:baraza:chat:${c.id}:v2`);
            if (!raw) return [c.id, null];
            const msgs = JSON.parse(raw);
            if (!Array.isArray(msgs) || msgs.length === 0) return [c.id, null];
            const last = msgs[msgs.length - 1];
            return [
              c.id,
              {
                sender: last.sender || 'You',
                text: last.text || (last.voiceNote ? '🎙️ Voice note' : ''),
                time: last.time || '',
                createdAtMs: Number(String(last.id || '').replace('msg-', '')) || 0,
              },
            ];
          })
        );
        if (!cancelled) {
          const map = {};
          entries.forEach(([id, val]) => {
            if (val) map[id] = val;
          });
          setCircleLastMessages(map);
        }
      } catch {}
    }
    loadLastMessages();
    return () => {
      cancelled = true;
    };
  }, [eligibleCircles, selectedCircle]);

  const joinedCircles = useMemo(
    () => eligibleCircles.filter((c) => joinedCircleIds.includes(c.id)),
    [eligibleCircles, joinedCircleIds]
  );

  const handleNavigate = (routeId) => {
    setActiveModal(null);
    if (routeId === 'home') navigation.navigate('Home');
    else if (routeId === 'journal') navigation.navigate('Journal');
    else if (routeId === 'arcade') navigation.navigate('Arcade');
    else if (routeId === 'soundscapes' || routeId === 'chill') navigation.navigate('Chill');
    else if (routeId === 'sanctuary') navigation.navigate('Profile');
    else if (routeId === 'baraza' || routeId === 'community') setSelectedCircle(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.bg }]}>
        {isWide && (
          <SidebarNav
            activeRoute="baraza"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
          {selectedCircle ? (
            <BarazaGroupChatView
              circle={selectedCircle}
              userAgeBand={userAgeBand}
              initialDraft={circleDraftText}
              onBack={() => {
                setCircleDraftText('');
                setSelectedCircle(null);
              }}
            />
          ) : (
            <ScrollView
              contentContainerStyle={[
                styles.scrollContainer,
                isWide && styles.scrollContainerWide,
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.maxWrapper, isWide && styles.maxWrapperWide]}>
                <CommunityHeader userAgeBand={userAgeBand} />

                <QuickActionsGrid
                  onOpenSmallWins={() => setActiveModal('small_wins')}
                  onOpenVentBox={() => setActiveModal('vent_box')}
                  isTeenCohort={isTeenCohort}
                />

                {isTeenCohort ? (
                  <View style={{ gap: 20 }}>
                    <TeenSanctuaryBox
                      companionId={companionId}
                      primaryMatch={primaryMatch}
                      isJoined={joinedCircleIds.includes(primaryMatch?.id)}
                      onSelectCircle={handleSelectCircle}
                    />

                    <BarazaPresenceBar
                      cohortKey={userAgeBand}
                      primaryCircle={primaryMatch}
                      onTakeToCircle={(circle, draft) => {
                        setCircleDraftText(draft || '');
                        handleSelectCircle(circle);
                      }}
                      onOpenChill={(initialTab, vibeLabel) =>
                        navigation.navigate('Chill', { initialTab, vibeLabel })
                      }
                    />

                    <TeenDailyPulse
                      companionId={companionId}
                      userAgeBand={userAgeBand}
                    />

                    <CirclesFeedSection
                      userAgeBand={userAgeBand}
                      joinedCircles={joinedCircles}
                      joinedCircleIds={joinedCircleIds}
                      visibleCategories={visibleCategories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                      filteredCircles={filteredCircles}
                      circleLastMessages={circleLastMessages}
                      onSelectCircle={handleSelectCircle}
                    />
                  </View>
                ) : (
                  <>
                    <PrimaryCircleCard
                      primaryMatch={primaryMatch}
                      userAgeBand={userAgeBand}
                      isJoined={joinedCircleIds.includes(primaryMatch?.id)}
                      onPress={() => handleSelectCircle(primaryMatch)}
                    />

                    <CirclesFeedSection
                      userAgeBand={userAgeBand}
                      joinedCircles={joinedCircles}
                      joinedCircleIds={joinedCircleIds}
                      visibleCategories={visibleCategories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                      filteredCircles={filteredCircles}
                      circleLastMessages={circleLastMessages}
                      onSelectCircle={handleSelectCircle}
                    />

                    <View style={{ marginTop: 24 }}>
                      <BarazaPresenceBar
                      cohortKey={userAgeBand}
                      primaryCircle={primaryMatch}
                      onTakeToCircle={(circle, draft) => {
                        setCircleDraftText(draft || '');
                        handleSelectCircle(circle);
                      }}
                      onOpenChill={(initialTab, vibeLabel) =>
                        navigation.navigate('Chill', { initialTab, vibeLabel })
                      }
                    />
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          )}

          {!isWide && (
            <BottomNavBar
              activeRoute="community"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>

      <CommunityFeatureModal
        visible={activeModal === 'small_wins'}
        onClose={() => setActiveModal(null)}
        kicker="A LITTLE PROGRESS, ON YOUR TERMS"
        title="Small Wins Wall."
        subtitle="Celebrate the daily acts of courage. A hint of encouragement, never pressure."
        isWide={isWide}
      >
        <SmallWinsSection companionId={companionId} />
      </CommunityFeatureModal>

      <CommunityFeatureModal
        visible={activeModal === 'vent_box'}
        onClose={() => setActiveModal(null)}
        kicker="YOUR SAFE SANCTUARY, WITHOUT JUDGMENT"
        title="Safe Vent Box."
        subtitle="Release emotional weight anonymously or let it burn to ashes. Your emotions shape this space."
        isWide={isWide}
      >
        <VentBoxSection />
      </CommunityFeatureModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  rootContainer: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1 },
  scrollContainer: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 110 },
  scrollContainerWide: { paddingHorizontal: 36, paddingTop: 32, paddingBottom: 60 },
  maxWrapper: { width: '100%' },
  maxWrapperWide: { maxWidth: 820, alignSelf: 'center' },
});

