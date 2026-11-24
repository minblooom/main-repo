// src/screens/community/CommunityScreen.jsx
// MindBloom Community Baraza Hub
// Connects peer spaces, identity rooms, sharing circles, and daily encouragement.

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { CommunitySpacesProvider, CommunitySpacesContext } from '../../features/community/context/CommunitySpacesContext';
import { BarazaPresenceBar } from '../../features/community/baraza/BarazaPresenceBar';
import { CommunityGreeting } from '../../features/community/baraza/CommunityGreeting';
import { CommunitySpaceCard } from '../../features/community/baraza/CommunitySpaceCard';
import { BackButton } from '../../features/community/baraza/BackButton';
import { GroupSpaceView } from '../../features/community/groups/GroupSpaceView';
import { SharingCircleView } from '../../features/community/circles/SharingCircleView';
import { IdentitySpaceView } from '../../features/community/identity/IdentitySpaceView';
import { EncouragementPage } from '../../features/community/encouragement/EncouragementPage';
import { SmallWinsSection } from '../../features/community/smallWins/SmallWinsSection';
import { VentBoxSection } from '../../features/community/vent/VentBoxSection';
import { ChaiMemesSection } from '../../features/community/memes/ChaiMemesSection';
import { peerMentors } from '../../features/community/data/communityData';

const TABS = [
  { id: 'spaces', label: 'All Spaces 🌿' },
  { id: 'small_wins', label: 'Small Wins 🌟' },
  { id: 'vent_box', label: 'Vent & Burn 🔥' },
  { id: 'chai_memes', label: 'Chai & Memes ☕' },
  { id: 'encouragement', label: 'Encouragement 🌸' },
  { id: 'groups', label: 'Peer Pods 👥' },
  { id: 'circles', label: 'Sharing Circles ⭕' },
  { id: 'identity', label: 'Identity & Roots 🌍' },
];

export const CommunityContent = ({
  companionId = 'noodle',
  onNavigateHome,
  onNavigateSanctuary,
  onNavigateJournal,
  isWide = false,
}) => {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState('spaces');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [notifiedMentors, setNotifiedMentors] = useState({});

  const handleToggleNotify = (mentorId) => {
    setNotifiedMentors((prev) => ({
      ...prev,
      [mentorId]: !prev[mentorId],
    }));
  };

  // If viewing a detailed space
  if (selectedSpace) {
    return (
      <View style={[styles.detailContainer, { backgroundColor: theme.bg }]}>
        <View style={styles.detailHeader}>
          <BackButton
            label="‹ Back to Baraza"
            onPress={() => setSelectedSpace(null)}
          />
        </View>
        {selectedSpace.type === 'circle' ? (
          <SharingCircleView circle={selectedSpace} onBack={() => setSelectedSpace(null)} />
        ) : selectedSpace.type === 'identity' ? (
          <IdentitySpaceView space={selectedSpace} onBack={() => setSelectedSpace(null)} />
        ) : (
          <GroupSpaceView group={selectedSpace} onBack={() => setSelectedSpace(null)} />
        )}
      </View>
    );
  }

  return (
    <CommunitySpacesContext.Consumer>
      {(context) => {
        const spaces = context?.spaces || [];
        const joinSpace = context?.joinSpace;
        const leaveSpace = context?.leaveSpace;

        const filteredSpaces = spaces.filter((s) => {
          if (activeSubTab === 'spaces') return true;
          if (activeSubTab === 'groups') return s.type === 'group';
          if (activeSubTab === 'circles') return s.type === 'circle';
          if (activeSubTab === 'identity') return s.type === 'identity';
          return true;
        });

        const primaryCircle =
          spaces.find((s) => s.isPrimaryMatch) ||
          spaces.find((s) => s.id === 'campus_grounding') ||
          spaces[0];

        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContainer,
              isWide && styles.scrollContainerWide,
              { backgroundColor: theme.bg },
            ]}
          >
            <View style={[styles.maxWrapper, isWide && styles.maxWrapperWide]}>
              {/* Top Greeting & Community Presence */}
              <CommunityGreeting
                companionId={companionId}
                message="Karibu Baraza. You don't have to carry everything alone today."
              />

              <View style={styles.presenceWrap}>
                <BarazaPresenceBar />
              </View>

              {/* Sub-tabs for Spaces */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabScroll}
              >
                {TABS.map((tab) => {
                  const isActive = activeSubTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={[
                        styles.subTabPill,
                        { backgroundColor: theme.cardBg, borderColor: theme.divider },
                        isActive && [
                          styles.subTabPillActive,
                          { backgroundColor: theme.accent, borderColor: theme.accent },
                        ],
                      ]}
                      onPress={() => setActiveSubTab(tab.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.subTabText,
                          { color: theme.textSecondary },
                          isActive && [styles.subTabTextActive, { color: '#FFFFFF' }],
                        ]}
                      >
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* View Content */}
              {activeSubTab === 'small_wins' ? (
                <SmallWinsSection companionId={companionId} />
              ) : activeSubTab === 'vent_box' ? (
                <VentBoxSection />
              ) : activeSubTab === 'chai_memes' ? (
                <ChaiMemesSection />
              ) : activeSubTab === 'encouragement' ? (
                <EncouragementPage companionId={companionId} />
              ) : (
                <View style={styles.mainFeedStack}>
                  {/* 1. DUAL ACTION LAUNCHERS (Small Wins Wall & Safe Vent Box) */}
                  {activeSubTab === 'spaces' && (
                    <View style={styles.launcherDeck}>
                      <TouchableOpacity
                        style={[
                          styles.launcherCard,
                          {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.divider,
                            borderLeftColor: '#F59E0B',
                            borderLeftWidth: 4,
                          },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setActiveSubTab('small_wins')}
                      >
                        <View style={styles.launcherTop}>
                          <View style={[styles.launcherIconCircle, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={styles.launcherEmoji}>🌟</Text>
                          </View>
                          <Text style={[styles.launcherArrow, { color: theme.textMuted }]}>➔</Text>
                        </View>
                        <Text style={[styles.launcherTitle, { color: theme.textPrimary }]}>
                          Small Wins Wall 🏆
                        </Text>
                        <Text style={[styles.launcherSub, { color: theme.textSecondary }]}>
                          Celebrate tiny acts of daily courage with the Baraza
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.launcherCard,
                          {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.divider,
                            borderLeftColor: '#EF4444',
                            borderLeftWidth: 4,
                          },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => setActiveSubTab('vent_box')}
                      >
                        <View style={styles.launcherTop}>
                          <View style={[styles.launcherIconCircle, { backgroundColor: '#FEE2E2' }]}>
                            <Text style={styles.launcherEmoji}>🔥</Text>
                          </View>
                          <Text style={[styles.launcherArrow, { color: theme.textMuted }]}>➔</Text>
                        </View>
                        <Text style={[styles.launcherTitle, { color: theme.textPrimary }]}>
                          Safe Vent Box 💨
                        </Text>
                        <Text style={[styles.launcherSub, { color: theme.textSecondary }]}>
                          Release heavy thoughts & watch them burn to ashes
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 2. MATCHED PEER MENTORS CAROUSEL */}
                  {activeSubTab === 'spaces' && (
                    <View style={styles.sectionBlock}>
                      <View style={styles.sectionTitleRow}>
                        <View style={styles.sectionHeaderLeft}>
                          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                            🌟 Matched Peer Mentors
                          </Text>
                          <View style={[styles.badgePill, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={styles.badgePillText}>COMING SOON</Text>
                          </View>
                        </View>
                        <Text style={[styles.sectionSubText, { color: theme.textMuted }]}>
                          Trained older guides (25–34) who walked this road
                        </Text>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.mentorsScroll}
                      >
                        {peerMentors.map((mentor) => {
                          const isNotified = notifiedMentors[mentor.id];
                          return (
                            <View
                              key={mentor.id}
                              style={[
                                styles.mentorCard,
                                {
                                  backgroundColor: theme.cardBg,
                                  borderColor: theme.divider,
                                },
                              ]}
                            >
                              <View style={styles.mentorTopRow}>
                                <View style={styles.mentorAvatarCircle}>
                                  <Text style={styles.mentorEmoji}>{mentor.emoji}</Text>
                                  {mentor.status === 'online' && (
                                    <View style={styles.mentorOnlineDot} />
                                  )}
                                </View>
                                <View
                                  style={[
                                    styles.mentorScorePill,
                                    { backgroundColor: '#DCFCE7' },
                                  ]}
                                >
                                  <Text style={styles.mentorScoreText}>
                                    {mentor.matchScore}% Match
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.mentorInfoCol}>
                                <Text style={[styles.mentorName, { color: theme.textPrimary }]}>
                                  {mentor.name}, {mentor.age}
                                </Text>
                                <Text style={[styles.mentorBadge, { color: theme.accent }]}>
                                  {mentor.badge}
                                </Text>
                                <Text
                                  style={[styles.mentorSpecialty, { color: theme.textSecondary }]}
                                  numberOfLines={2}
                                >
                                  {mentor.specialty}
                                </Text>
                              </View>

                              <View style={styles.mentorTagsRow}>
                                {mentor.sharedInterests.map((interest, idx) => (
                                  <View
                                    key={idx}
                                    style={[
                                      styles.mentorTagPill,
                                      { backgroundColor: theme.bg, borderColor: theme.divider },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.mentorTagText,
                                        { color: theme.textSecondary },
                                      ]}
                                    >
                                      {interest}
                                    </Text>
                                  </View>
                                ))}
                              </View>

                              <TouchableOpacity
                                style={[
                                  styles.mentorNotifyBtn,
                                  {
                                    backgroundColor: isNotified
                                      ? '#16A34A'
                                      : 'transparent',
                                    borderColor: isNotified ? '#16A34A' : theme.accent,
                                  },
                                ]}
                                activeOpacity={0.85}
                                onPress={() => handleToggleNotify(mentor.id)}
                              >
                                <Text
                                  style={[
                                    styles.mentorNotifyBtnText,
                                    { color: isNotified ? '#FFFFFF' : theme.accent },
                                  ]}
                                >
                                  {isNotified ? 'Subscribed ✓' : 'Notify When Live 🔔'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {/* 3. PRIMARY MATCHED SANCTUARY CIRCLE HERO */}
                  {activeSubTab === 'spaces' && primaryCircle && (
                    <View style={styles.sectionBlock}>
                      <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                          💬 Your Matched Sanctuary Circle
                        </Text>
                        <Text style={[styles.sectionSubText, { color: theme.textMuted }]}>
                          Locked to Age 18–24 • Shared Struggles • Max 12 Peers
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.heroCircleCard,
                          {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.accent,
                          },
                        ]}
                        activeOpacity={0.9}
                        onPress={() => setSelectedSpace(primaryCircle)}
                      >
                        <View style={[styles.heroBanner, { backgroundColor: '#FFF7ED' }]}>
                          <Text style={styles.heroBannerText}>
                            🎯 98% Resonance Match • Shared Anxiety & Body Peace • 2 Passions
                          </Text>
                        </View>

                        <View style={styles.heroCircleBody}>
                          <View style={styles.heroCircleTop}>
                            <View style={styles.heroCircleTitleRow}>
                              <Text style={styles.heroCircleIcon}>
                                {primaryCircle.icon || '🎓'}
                              </Text>
                              <View style={styles.heroCircleTextCol}>
                                <Text
                                  style={[styles.heroCircleTitle, { color: theme.textPrimary }]}
                                >
                                  {primaryCircle.title}
                                </Text>
                                <Text
                                  style={[styles.heroCircleMeta, { color: theme.textSecondary }]}
                                >
                                  {primaryCircle.memberCount || 10}/12 members · 7 active now
                                </Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.enterCircleBtn,
                                { backgroundColor: theme.accent },
                              ]}
                              onPress={() => setSelectedSpace(primaryCircle)}
                            >
                              <Text style={styles.enterCircleBtnText}>Enter Circle 🚪</Text>
                            </TouchableOpacity>
                          </View>

                          {primaryCircle.lastMessage && (
                            <View
                              style={[
                                styles.heroSnippetBox,
                                { backgroundColor: theme.bg, borderColor: theme.divider },
                              ]}
                            >
                              <Text style={styles.heroSnippetSender}>
                                {primaryCircle.lastMessage.emoji} {primaryCircle.lastMessage.sender}:
                              </Text>
                              <Text
                                style={[styles.heroSnippetText, { color: theme.textSecondary }]}
                                numberOfLines={2}
                              >
                                "{primaryCircle.lastMessage.text}"
                              </Text>
                              <Text style={[styles.heroSnippetTime, { color: theme.textMuted }]}>
                                {primaryCircle.lastMessage.time}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* 4. ALL SPACES CARDS GRID */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionTitleRow}>
                      <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                        🌿 Explore All Baraza Spaces
                      </Text>
                      <Text style={[styles.sectionSubText, { color: theme.textMuted }]}>
                        {filteredSpaces.length} warm, moderated peer environments
                      </Text>
                    </View>

                    <View style={styles.cardsGrid}>
                      {filteredSpaces.map((space) => (
                        <CommunitySpaceCard
                          key={space.id}
                          type={space.type}
                          title={space.title}
                          description={space.description}
                          meta={`${space.memberCount || 12} members · ${space.category || 'Peer Space'}`}
                          preview={space.preview}
                          joined={space.joined}
                          onPress={() => setSelectedSpace(space)}
                          quickLabel={space.joined ? 'Leave' : 'Join'}
                          onQuick={() => {
                            if (space.joined) {
                              leaveSpace?.(space.id);
                            } else {
                              joinSpace?.(space.id);
                            }
                          }}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        );
      }}
    </CommunitySpacesContext.Consumer>
  );
};

export const CommunityScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const companionId = route?.params?.companion || 'noodle';

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation.navigate('Home');
    } else if (routeId === 'journal') {
      navigation.navigate('Journal');
    } else if (routeId === 'arcade') {
      navigation.navigate('Arcade');
    } else if (routeId === 'sanctuary') {
      navigation.navigate('Profile');
    } else if (routeId === 'baraza' || routeId === 'community') {
      // already on community screen
    }
  };

  return (
    <CommunitySpacesProvider>
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
            <CommunityContent
              companionId={companionId}
              onNavigateHome={() => navigation.navigate('Home')}
              onNavigateSanctuary={() => navigation.navigate('Profile')}
              onNavigateJournal={() => navigation.navigate('Journal')}
              isWide={isWide}
            />

            {!isWide && (
              <BottomNavBar
                activeRoute="community"
                onNavigate={handleNavigate}
                companionId={companionId}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </CommunitySpacesProvider>
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
  presenceWrap: {
    marginVertical: 4,
  },
  tabScroll: {
    gap: 8,
    paddingVertical: 8,
  },
  subTabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  subTabPillActive: {
    borderWidth: 1,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subTabTextActive: {
    fontWeight: '700',
  },
  cardsGrid: {
    gap: 12,
    marginTop: 8,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailHeader: {
    marginBottom: 12,
  },
  mainFeedStack: {
    gap: 20,
  },
  launcherDeck: {
    flexDirection: 'row',
    gap: 12,
  },
  launcherCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  launcherTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  launcherIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  launcherEmoji: {
    fontSize: 18,
  },
  launcherArrow: {
    fontSize: 14,
    fontWeight: '700',
  },
  launcherTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  launcherSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitleRow: {
    marginBottom: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  sectionSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  mentorsScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  mentorCard: {
    width: 250,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  mentorTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mentorAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mentorEmoji: {
    fontSize: 22,
  },
  mentorOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mentorScorePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  mentorScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  mentorInfoCol: {
    gap: 2,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  mentorBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  mentorSpecialty: {
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 2,
  },
  mentorTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  mentorTagPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  mentorTagText: {
    fontSize: 10.5,
  },
  mentorNotifyBtn: {
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  mentorNotifyBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  heroCircleCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  heroBanner: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#C2410C',
  },
  heroCircleBody: {
    padding: 14,
    gap: 12,
  },
  heroCircleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroCircleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  heroCircleIcon: {
    fontSize: 28,
  },
  heroCircleTextCol: {
    flex: 1,
  },
  heroCircleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  heroCircleMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  enterCircleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  enterCircleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroSnippetBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
  },
  heroSnippetSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  heroSnippetText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  heroSnippetTime: {
    fontSize: 10,
    textAlign: 'right',
  },
});
