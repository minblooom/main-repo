// src/screens/community/CommunityScreen.jsx
// MindBloom Community Baraza Hub
// Floating dialog popup modals (matching Notification preferences screenshot),
// real live interactive chat groups for all circles with persistent bottom navbar,
// and real-time somatic emotion-matching release box.

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { BarazaGroupChatView } from '../../features/community/circles/BarazaGroupChatView';
import { SmallWinsSection } from '../../features/community/smallWins/SmallWinsSection';
import { VentBoxSection } from '../../features/community/vent/VentBoxSection';
import { getMatchingCirclesForUser } from '../../features/community/services/circleMatchingService';
import { onboardingStorage } from '../../services/onboardingStorage';
import { useCommunityStore } from '../../features/community/store/communityStore';

const CATEGORIES = [
  'All Circles',
  'Youth & Campus 🎓',
  'Nairobi Hustle 💼',
  'Healing & Tulia 🌿',
  'Night Owls 🌙',
  'Sisterhood 🌸',
  "Men's Grounding 🦁",
];

export const CommunityScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const companionId = route?.params?.companion || 'noodle';

  const [selectedCategory, setSelectedCategory] = useState('All Circles');
  const [selectedCircle, setSelectedCircle] = useState(null);
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
        const prefs = await onboardingStorage.getPreferences();
        if (prefs) {
          setUserProfile({
            age: prefs.age || prefs.ageBand || '18-24',
            gender: prefs.gender || 'prefer_not',
            focusAreas: prefs.focusAreas || prefs.primaryStruggles || [],
            interests: prefs.interests || [],
          });
        }
      } catch {}
    }
    loadUserPreferences();
    const unsubscribe = navigation?.addListener?.('focus', loadUserPreferences);
    return unsubscribe;
  }, [navigation]);

  // Compute 5-Invariant Dynamic Grouping & Resonance Matching (includes Gender Alignment)
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

  const visibleCategories = useMemo(() => {
    const g = String(userProfile.gender || 'prefer_not').toLowerCase().trim();
    return CATEGORIES.filter((cat) => {
      if (cat === 'Sisterhood 🌸') return g === 'female';
      if (cat === "Men's Grounding 🦁") return g === 'male';
      return true;
    });
  }, [userProfile.gender]);

  useEffect(() => {
    if (!visibleCategories.includes(selectedCategory)) {
      setSelectedCategory('All Circles');
    }
  }, [visibleCategories, selectedCategory]);

  const filteredCircles =
    selectedCategory === 'All Circles'
      ? eligibleCircles
      : eligibleCircles.filter((c) => c.category === selectedCategory);

  const joinedCircles = useMemo(
    () => eligibleCircles.filter((c) => joinedCircleIds.includes(c.id)),
    [eligibleCircles, joinedCircleIds]
  );

  const handleNavigate = (routeId) => {
    setActiveModal(null);
    if (routeId === 'home') {
      navigation.navigate('Home');
    } else if (routeId === 'journal') {
      navigation.navigate('Journal');
    } else if (routeId === 'arcade') {
      navigation.navigate('Arcade');
    } else if (routeId === 'sanctuary') {
      navigation.navigate('Profile');
    } else if (routeId === 'baraza' || routeId === 'community') {
      setSelectedCircle(null);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <View style={[styles.rootContainer, { backgroundColor: theme.bg }]}>
        {/* Desktop / Tablet Persistent Sidebar Navigation */}
        {isWide && (
          <SidebarNav
            activeRoute="baraza"
            onNavigate={handleNavigate}
            companionId={companionId}
          />
        )}

        <View style={[styles.mainContent, { backgroundColor: theme.bg }]}>
          {/* Real Live Group Chat (keeps BottomNavBar visible WhatsApp-style) */}
          {selectedCircle ? (
            <BarazaGroupChatView
              circle={selectedCircle}
              onBack={() => setSelectedCircle(null)}
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
                {/* ── 1. HEADER ────────────────────────────────────────── */}
                <View style={styles.header}>
                  <View>
                    <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                      Baraza Community 👥
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                      Safe, Anonymous & Live • East Africa
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.privacyBadge,
                      { backgroundColor: 'rgba(138, 154, 134, 0.15)' },
                    ]}
                  >
                    <Text style={styles.privacyLockEmoji}>🔒</Text>
                    <Text style={[styles.privacyBadgeText, { color: '#5B7057' }]}>
                      Encrypted
                    </Text>
                  </View>
                </View>

                {/* ── 2. DUAL ACTION LAUNCHER BUTTONS (Popup Triggers) ──── */}
                <View style={styles.actionLauncherDeck}>
                  {/* Small Wins Wall Button */}
                  <TouchableOpacity
                    style={[
                      styles.actionButtonCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: 'rgba(234, 160, 35, 0.35)',
                      },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setActiveModal('small_wins')}
                  >
                    <View style={styles.actionButtonTop}>
                      <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={styles.actionIconEmoji}>✨</Text>
                      </View>
                      <View style={[styles.arrowMiniCircle, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.arrowMiniText, { color: '#D97706' }]}>➔</Text>
                      </View>
                    </View>
                    <Text style={[styles.actionButtonTitle, { color: theme.textPrimary }]}>
                      Small Wins Wall 🏆
                    </Text>
                    <Text style={[styles.actionButtonSub, { color: theme.textSecondary }]}>
                      Celebrate tiny acts of daily courage
                    </Text>
                  </TouchableOpacity>

                  {/* Safe Vent Box Button */}
                  <TouchableOpacity
                    style={[
                      styles.actionButtonCard,
                      {
                        backgroundColor: theme.cardBg,
                        borderColor: 'rgba(217, 107, 67, 0.3)',
                      },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setActiveModal('vent_box')}
                  >
                    <View style={styles.actionButtonTop}>
                      <View style={[styles.actionIconCircle, { backgroundColor: '#FFEDE6' }]}>
                        <Text style={styles.actionIconEmoji}>💨</Text>
                      </View>
                      <View style={[styles.arrowMiniCircle, { backgroundColor: '#FFEDE6' }]}>
                        <Text style={[styles.arrowMiniText, { color: '#D96B43' }]}>➔</Text>
                      </View>
                    </View>
                    <Text style={[styles.actionButtonTitle, { color: theme.textPrimary }]}>
                      Safe Vent Box 💨
                    </Text>
                    <Text style={[styles.actionButtonSub, { color: theme.textSecondary }]}>
                      Release emotional weight anonymously
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── 2B. MY ACTIVE CIRCLES (WhatsApp-style 1-tap re-entry) ── */}
                {joinedCircles.length > 0 && (
                  <View style={{ marginBottom: 22 }}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                        📌 My Active Circles
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
                    >
                      {joinedCircles.map((jc) => (
                        <TouchableOpacity
                          key={`joined-${jc.id}`}
                          style={[
                            styles.categoryPill,
                            {
                              backgroundColor: theme.cardBg,
                              borderColor: theme.accent,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6,
                              paddingVertical: 9,
                            },
                          ]}
                          onPress={() => setSelectedCircle(jc)}
                          activeOpacity={0.85}
                        >
                          <Text>{jc.icon || '💬'}</Text>
                          <Text style={[styles.categoryPillText, { color: theme.textPrimary, fontWeight: '800' }]}>
                            {jc.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* ── 3. PRIMARY MATCHED SANCTUARY CIRCLE (HERO CARD) ──── */}
                <View style={styles.sectionHeaderRow}>
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      💬 Your Matched Sanctuary Circle
                    </Text>
                    <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                      Locked to Age {userAgeBand} • Shared Struggles & Passions • Max 12
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryCircleCard,
                    {
                      backgroundColor: theme.cardBg,
                      borderColor: 'rgba(217, 107, 67, 0.35)',
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => setSelectedCircle(primaryMatch)}
                >
                  {/* Match Banner */}
                  <View style={[styles.primaryMatchBanner, { backgroundColor: '#FFF0E8' }]}>
                    <Text style={[styles.primaryMatchBannerText, { color: '#B8532D' }]}>
                      🎯 {primaryMatch.matchResonance || 98}% Resonance Match • Tailored to {userAgeBand} Cohort
                    </Text>
                  </View>

                  <View style={styles.primaryCircleBody}>
                    <View style={styles.circleHeaderRow}>
                      <View
                        style={[
                          styles.circleIconBox,
                          { backgroundColor: primaryMatch.iconBg || '#E8F0FF' },
                        ]}
                      >
                        <Text style={styles.circleIcon}>{primaryMatch.icon || '🌀'}</Text>
                      </View>
                      <View style={styles.circleTitleCol}>
                        <Text style={[styles.circleTitle, { color: theme.textPrimary }]}>
                          {primaryMatch.title}
                        </Text>
                        <View style={styles.circleMetaRow}>
                          <View style={[styles.capacityBadge, { backgroundColor: 'rgba(217, 107, 67, 0.1)' }]}>
                            <Text style={[styles.capacityText, { color: '#D96B43' }]}>
                              {Math.min(12, (primaryMatch.memberCount || 1) + (joinedCircleIds.includes(primaryMatch.id) ? 1 : 0))}/{primaryMatch.maxMembers || 12} members
                            </Text>
                          </View>
                          <View style={styles.onlineBadge}>
                            <View style={styles.liveGreenDot} />
                            <Text style={[styles.onlineText, { color: '#16A34A' }]}>
                              {primaryMatch.isOverflowCohort ? 'Cohort 2 · Open' : 'Open Sanctuary'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Circle Description */}
                    {primaryMatch.description && (
                      <View
                        style={[
                          styles.lastMessagePreview,
                          { backgroundColor: theme.bg, borderColor: theme.divider },
                        ]}
                      >
                        <View style={styles.lastMessageCol}>
                          <Text
                            style={[styles.lastMessageText, { color: theme.textSecondary }]}
                            numberOfLines={2}
                          >
                            {primaryMatch.description}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Enter Button */}
                    <View style={[styles.enterCircleBtn, { backgroundColor: theme.accent }]}>
                      <Text style={styles.enterCircleBtnText}>Enter Circle Chat</Text>
                      <Text style={styles.enterCircleArrow}>➔</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* ── 4. OTHER CIRCLES IN YOUR AGE GROUP ──────────────── */}
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Other Circles in Your Age Group ({userAgeBand})
                  </Text>
                </View>

                {/* Filter Pills */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScroll}
                >
                  {visibleCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryPill,
                          { backgroundColor: theme.cardBg, borderColor: theme.divider },
                          isSelected && [
                            styles.categoryPillActive,
                            { backgroundColor: theme.accent, borderColor: theme.accent },
                          ],
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryPillText,
                            { color: theme.textSecondary },
                            isSelected && [styles.categoryPillTextActive, { color: '#FFFFFF' }],
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Circles Feed */}
                <View style={styles.circlesFeed}>
                  {filteredCircles.length === 0 ? (
                    <View
                      style={[
                        styles.circleItemCard,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: theme.divider,
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: 24,
                          gap: 10,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 28 }}>🌿</Text>
                      <Text style={[styles.circleItemTitle, { color: theme.textPrimary, textAlign: 'center' }]}>
                        No circles in this filter for your cohort yet
                      </Text>
                      <TouchableOpacity
                        style={[styles.categoryPill, { backgroundColor: theme.accent, borderColor: theme.accent }]}
                        onPress={() => setSelectedCategory('All Circles')}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.categoryPillText, { color: '#FFFFFF', fontWeight: '800' }]}>
                          Show All Circles
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    filteredCircles.map((circle) => {
                      const isJoined = joinedCircleIds.includes(circle.id);
                      const maxCap = circle.maxMembers || 12;
                      const memberCount = Math.min(maxCap, (circle.memberCount || 1) + (isJoined ? 1 : 0));

                      return (
                        <TouchableOpacity
                          key={circle.id}
                          style={[
                            styles.circleItemCard,
                            {
                              backgroundColor: theme.cardBg,
                              borderColor: isJoined ? theme.accent : theme.divider,
                            },
                          ]}
                          activeOpacity={0.85}
                          onPress={() => setSelectedCircle(circle)}
                        >
                          <View
                            style={[
                              styles.circleItemIcon,
                              { backgroundColor: circle.iconBg || '#E8F0FF' },
                            ]}
                          >
                            <Text style={styles.circleItemIconText}>
                              {circle.icon || '🌿'}
                            </Text>
                          </View>

                          <View style={styles.circleItemContent}>
                            <View style={styles.circleItemTitleRow}>
                              <Text
                                style={[
                                  styles.circleItemTitle,
                                  { color: theme.textPrimary },
                                ]}
                              >
                                {circle.title}
                              </Text>
                              <View
                                style={[
                                  styles.memberCapBadge,
                                  { backgroundColor: isJoined ? 'rgba(22, 163, 74, 0.14)' : 'rgba(217, 107, 67, 0.1)' },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.memberCapText,
                                    { color: isJoined ? '#16A34A' : '#D96B43' },
                                  ]}
                                >
                                  {isJoined ? '✓ Joined' : `${memberCount}/${maxCap}`}
                                </Text>
                              </View>
                            </View>

                            {circle.description && (
                              <Text
                                style={[
                                  styles.circleItemSnippet,
                                  { color: theme.textSecondary },
                                ]}
                                numberOfLines={1}
                              >
                                {circle.description}
                              </Text>
                            )}

                            <View style={styles.circleItemBottomRow}>
                              <View style={styles.circleActiveNowBadge}>
                                <View style={styles.liveGreenDotSmall} />
                                <Text
                                  style={[
                                    styles.circleActiveNowText,
                                    { color: '#16A34A' },
                                  ]}
                                >
                                  {circle.isOverflowCohort ? 'Cohort 2 · Open' : `${maxCap - memberCount} spots open`}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.circleTimeText,
                                  { color: theme.textMuted },
                                ]}
                              >
                                Age {circle.ageGroup || userAgeBand}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              </View>
            </ScrollView>
          )}

          {/* Persistent Mobile Bottom Navigation (WhatsApp style) */}
          {!isWide && (
            <BottomNavBar
              activeRoute="community"
              onNavigate={handleNavigate}
              companionId={companionId}
            />
          )}
        </View>
      </View>

      {/* ── 5. EXACT NOTIFICATION-STYLE CENTERED DIALOG MODAL: SMALL WINS WALL ── */}
      <Modal
        visible={activeModal === 'small_wins'}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={[styles.floatingModalCard, { backgroundColor: theme.cardBg }, isWide && styles.floatingModalCardWide]}>
            {/* Modal Top Header (matching screenshot) */}
            <View style={styles.modalTopHeader}>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={styles.modalBackBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalBackBtnText, { color: theme.textMuted }]}>
                  ‹ Back to Baraza
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={styles.modalCloseCircle}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseCircleText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Title Block */}
            <View style={styles.modalTitleBlock}>
              <Text style={[styles.modalKickerTag, { color: theme.textMuted }]}>
                A LITTLE PROGRESS, ON YOUR TERMS
              </Text>
              <Text style={[styles.modalMainTitle, { color: theme.textPrimary }]}>
                Small Wins Wall.
              </Text>
              <Text style={[styles.modalSubTitle, { color: theme.textSecondary }]}>
                Celebrate the daily acts of courage. A hint of encouragement, never pressure.
              </Text>
            </View>

            {/* Modal Scrollable Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalInnerScroll}
            >
              <SmallWinsSection companionId={companionId} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── 6. EXACT NOTIFICATION-STYLE CENTERED DIALOG MODAL: SAFE VENT BOX ── */}
      <Modal
        visible={activeModal === 'vent_box'}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={[styles.floatingModalCard, { backgroundColor: theme.cardBg }, isWide && styles.floatingModalCardWide]}>
            {/* Modal Top Header (matching screenshot) */}
            <View style={styles.modalTopHeader}>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={styles.modalBackBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalBackBtnText, { color: theme.textMuted }]}>
                  ‹ Back to Baraza
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={styles.modalCloseCircle}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseCircleText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Modal Title Block */}
            <View style={styles.modalTitleBlock}>
              <Text style={[styles.modalKickerTag, { color: theme.textMuted }]}>
                SOMATIC PRIVATE RELEASE · ZERO LOGGING
              </Text>
              <Text style={[styles.modalMainTitle, { color: theme.textPrimary }]}>
                Safe Vent Box.
              </Text>
              <Text style={[styles.modalSubTitle, { color: theme.textSecondary }]}>
                Your space breathes with your emotion. Release anonymously or burn to embers.
              </Text>
            </View>

            {/* Modal Scrollable Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalInnerScroll}
            >
              <VentBoxSection />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  scrollContainerWide: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  maxWrapper: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    gap: 16,
  },
  maxWrapperWide: {
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  privacyLockEmoji: {
    fontSize: 12,
  },
  privacyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionLauncherDeck: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  actionButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconEmoji: {
    fontSize: 18,
  },
  arrowMiniCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowMiniText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionButtonTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },
  actionButtonSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  primaryCircleCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  primaryMatchBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  primaryMatchBannerText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  primaryCircleBody: {
    padding: 16,
    gap: 12,
  },
  circleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    fontSize: 22,
  },
  circleTitleCol: {
    flex: 1,
    gap: 3,
  },
  circleTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  circleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  capacityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  capacityText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
  },
  lastMessagePreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  lastMessageEmoji: {
    fontSize: 18,
    marginTop: 2,
  },
  lastMessageCol: {
    flex: 1,
    gap: 2,
  },
  lastMessageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageSender: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  lastMessageTime: {
    fontSize: 10,
  },
  lastMessageText: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  enterCircleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  enterCircleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  enterCircleArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  categoriesScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryPillActive: {
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryPillTextActive: {
    fontWeight: '800',
  },
  circlesFeed: {
    gap: 10,
    marginTop: 6,
  },
  circleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  circleItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleItemIconText: {
    fontSize: 20,
  },
  circleItemContent: {
    flex: 1,
    gap: 3,
  },
  circleItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  circleItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  memberCapBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberCapBadgeFull: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  memberCapText: {
    fontSize: 10,
    fontWeight: '800',
  },
  memberCapTextFull: {
    color: '#EF4444',
  },
  circleItemSnippet: {
    fontSize: 11.5,
    fontStyle: 'italic',
  },
  circleItemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  circleActiveNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveGreenDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  circleActiveNowText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  circleTimeText: {
    fontSize: 10,
  },
  unreadBadgePill: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D96B43',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // ── Exact Centered Floating Modal Dialog (matches Notification modal screenshot) ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 16, 36, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingModalCard: {
    width: '100%',
    maxWidth: 780,
    maxHeight: '92%',
    borderRadius: 26,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    gap: 12,
  },
  floatingModalCardWide: {
    padding: 32,
  },
  modalTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBackBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  modalBackBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseCircleText: {
    fontSize: 14,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  modalTitleBlock: {
    gap: 4,
    marginBottom: 6,
  },
  modalKickerTag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  modalMainTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modalSubTitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalInnerScroll: {
    paddingVertical: 4,
  },
});
