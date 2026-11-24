// src/screens/community/CommunityScreen.jsx
// MindBloom Community Baraza Hub
// Faithful implementation of react-frontend CommunityScreen with frontend theme tokens.
// Safe, anonymous peer circles, matched older peer mentors, and dual action launchers.
// (Memes and events belong strictly to Chill Space).

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { SidebarNav } from '../../components/navigation/SidebarNav';
import { BottomNavBar } from '../../components/navigation/BottomNavBar';
import { BackButton } from '../../features/community/baraza/BackButton';
import { SharingCircleView } from '../../features/community/circles/SharingCircleView';
import { GroupSpaceView } from '../../features/community/groups/GroupSpaceView';
import { IdentitySpaceView } from '../../features/community/identity/IdentitySpaceView';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { peerMentors, barazaCircles } from '../../features/community/data/communityData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  const { notifiedMentors, toggleNotifyMentor } = useCommunityStore();
  const [selectedCategory, setSelectedCategory] = useState('All Circles');
  const [selectedMentorId, setSelectedMentorId] = useState('mentor_amani');
  const [selectedCircle, setSelectedCircle] = useState(null);

  const filteredCircles =
    selectedCategory === 'All Circles'
      ? barazaCircles
      : barazaCircles.filter((c) => c.category === selectedCategory);

  const primaryMatch =
    barazaCircles.find((c) => c.isPrimaryMatch) || barazaCircles[0];

  const handleNavigate = (routeId) => {
    if (routeId === 'home') {
      navigation.navigate('Home');
    } else if (routeId === 'journal') {
      navigation.navigate('Journal');
    } else if (routeId === 'arcade') {
      navigation.navigate('Arcade');
    } else if (routeId === 'sanctuary') {
      navigation.navigate('Profile');
    }
  };

  // If viewing a detailed circle space
  if (selectedCircle) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={[styles.detailContainer, { backgroundColor: theme.bg }]}>
          <View style={styles.detailHeader}>
            <BackButton
              label="‹ Back to Baraza"
              onPress={() => setSelectedCircle(null)}
            />
          </View>
          {selectedCircle.type === 'circle' ? (
            <SharingCircleView
              circle={selectedCircle}
              onBack={() => setSelectedCircle(null)}
            />
          ) : selectedCircle.type === 'identity' ? (
            <IdentitySpaceView
              space={selectedCircle}
              onBack={() => setSelectedCircle(null)}
            />
          ) : (
            <GroupSpaceView
              group={selectedCircle}
              onBack={() => setSelectedCircle(null)}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

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
                <View style={[styles.privacyBadge, { backgroundColor: 'rgba(138, 154, 134, 0.15)' }]}>
                  <Text style={styles.privacyLockEmoji}>🔒</Text>
                  <Text style={[styles.privacyBadgeText, { color: '#5B7057' }]}>
                    Encrypted
                  </Text>
                </View>
              </View>

              {/* ── 2. DUAL ACTION LAUNCHER BUTTONS ──────────────────── */}
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
                  onPress={() => navigation.navigate('SmallWins')}
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
                  onPress={() => navigation.navigate('Vent')}
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

              {/* ── 3. VERIFIED OLDER PEER SUPPORT MENTORS ───────────── */}
              <View style={styles.sectionHeaderRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.sectionTitleWithBadge}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                      🌟 Matched Peer Mentors
                    </Text>
                    <View style={[styles.badgePill, { backgroundColor: 'rgba(217, 107, 67, 0.12)', borderColor: 'rgba(217, 107, 67, 0.3)' }]}>
                      <Text style={[styles.badgePillText, { color: '#D96B43' }]}>
                        COMING SOON
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                    Trained guides (25–34) who walked this road · Launching Q1 2025
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mentorsScroll}
              >
                {peerMentors.map((m) => {
                  const isSelected = selectedMentorId === m.id;
                  const isNotified = Boolean(notifiedMentors[m.id]);

                  return (
                    <View
                      key={m.id}
                      style={[
                        styles.mentorCard,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: isSelected ? theme.accent : theme.divider,
                        },
                      ]}
                    >
                      <View style={styles.mentorTopRow}>
                        <View style={styles.mentorAvatarCircle}>
                          <Text style={styles.mentorEmoji}>{m.emoji}</Text>
                          {m.status === 'online' && <View style={styles.onlineDot} />}
                        </View>
                        <View style={[styles.matchScorePill, { backgroundColor: 'rgba(22, 163, 74, 0.12)' }]}>
                          <Text style={[styles.matchScoreText, { color: '#16A34A' }]}>
                            {m.matchScore}% Match
                          </Text>
                        </View>
                      </View>

                      <View style={styles.mentorInfoCol}>
                        <View style={styles.mentorNameRow}>
                          <Text style={[styles.mentorName, { color: theme.textPrimary }]}>
                            {m.name}, {m.age}
                          </Text>
                          <Text style={{ fontSize: 13, color: '#D96B43' }}>🛡️</Text>
                        </View>
                        <Text style={[styles.mentorBadge, { color: theme.accent }]}>
                          {m.badge}
                        </Text>
                        <Text
                          style={[styles.mentorSpecialty, { color: theme.textSecondary }]}
                          numberOfLines={2}
                        >
                          {m.specialty}
                        </Text>
                      </View>

                      <View style={styles.mentorTagsRow}>
                        {m.sharedInterests.map((t, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.mentorTagPill,
                              { backgroundColor: theme.bg, borderColor: theme.divider },
                            ]}
                          >
                            <Text style={[styles.mentorTagText, { color: theme.textSecondary }]}>
                              {t}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.connectMentorBtn,
                          {
                            backgroundColor: isNotified
                              ? '#16A34A'
                              : 'rgba(217, 107, 67, 0.1)',
                            borderColor: isNotified ? '#16A34A' : '#D96B43',
                          },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => {
                          setSelectedMentorId(m.id);
                          toggleNotifyMentor(m.id);
                        }}
                      >
                        <Text
                          style={[
                            styles.connectMentorBtnText,
                            { color: isNotified ? '#FFFFFF' : '#D96B43' },
                          ]}
                        >
                          {isNotified ? 'Subscribed ✓' : 'Coming Soon · Notify Me 🔔'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>

              {/* ── 4. PRIMARY MATCHED SANCTUARY CIRCLE ─────────────── */}
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    💬 Your Matched Sanctuary Circle
                  </Text>
                  <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                    Locked to Age 18–24 • Shared Issues • 2 Shared Interests • Max 12
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
                    🎯 {primaryMatch.matchResonance || 98}% Resonance Match • Shared Anxiety & Body Peace • 2 Interests
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
                            {primaryMatch.memberCount || 10}/{primaryMatch.maxMembers || 12} members (2 spots left)
                          </Text>
                        </View>
                        <View style={styles.onlineBadge}>
                          <View style={styles.liveGreenDot} />
                          <Text style={[styles.onlineText, { color: '#16A34A' }]}>
                            {primaryMatch.activeNow || 7} in discussion
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Live Message Snippet */}
                  {primaryMatch.lastMessage && (
                    <View
                      style={[
                        styles.lastMessagePreview,
                        { backgroundColor: theme.bg, borderColor: theme.divider },
                      ]}
                    >
                      <Text style={styles.lastMessageEmoji}>
                        {primaryMatch.lastMessage.emoji}
                      </Text>
                      <View style={styles.lastMessageCol}>
                        <View style={styles.lastMessageTopRow}>
                          <Text style={[styles.lastMessageSender, { color: theme.textPrimary }]}>
                            {primaryMatch.lastMessage.sender}
                          </Text>
                          <Text style={[styles.lastMessageTime, { color: theme.textMuted }]}>
                            {primaryMatch.lastMessage.time}
                          </Text>
                        </View>
                        <Text
                          style={[styles.lastMessageText, { color: theme.textSecondary }]}
                          numberOfLines={2}
                        >
                          "{primaryMatch.lastMessage.text}"
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

              {/* ── 5. OTHER CIRCLES IN YOUR AGE GROUP ──────────────── */}
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Other Circles in Your Age Group (18–24)
                </Text>
              </View>

              {/* Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
              >
                {CATEGORIES.map((cat) => {
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
                {filteredCircles.map((circle) => {
                  const isFull =
                    (circle.memberCount || 10) >= (circle.maxMembers || 12);

                  return (
                    <TouchableOpacity
                      key={circle.id}
                      style={[
                        styles.circleItemCard,
                        {
                          backgroundColor: theme.cardBg,
                          borderColor: theme.divider,
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
                              isFull
                                ? styles.memberCapBadgeFull
                                : { backgroundColor: 'rgba(217, 107, 67, 0.1)' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.memberCapText,
                                isFull
                                  ? styles.memberCapTextFull
                                  : { color: '#D96B43' },
                              ]}
                            >
                              {isFull
                                ? 'FULL 12/12'
                                : `${circle.memberCount || 10}/${circle.maxMembers || 12}`}
                            </Text>
                          </View>
                        </View>

                        {circle.lastMessage && (
                          <Text
                            style={[
                              styles.circleItemSnippet,
                              { color: theme.textSecondary },
                            ]}
                            numberOfLines={1}
                          >
                            {circle.lastMessage.emoji} {circle.lastMessage.sender}: "{circle.lastMessage.text}"
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
                              {circle.activeNow || 5} online
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.circleTimeText,
                              { color: theme.textMuted },
                            ]}
                          >
                            {circle.lastMessage?.time || 'Live'}
                          </Text>
                        </View>
                      </View>

                      {circle.unreadCount && (
                        <View style={styles.unreadBadgePill}>
                          <Text style={styles.unreadBadgeText}>
                            {circle.unreadCount}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

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
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mentorsScroll: {
    gap: 12,
    paddingVertical: 6,
  },
  mentorCard: {
    width: SCREEN_WIDTH * 0.72 > 290 ? 290 : SCREEN_WIDTH * 0.72,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  mentorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  onlineDot: {
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
  matchScorePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchScoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mentorInfoCol: {
    gap: 2,
  },
  mentorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mentorName: {
    fontSize: 14,
    fontWeight: '800',
  },
  mentorBadge: {
    fontSize: 11,
    fontWeight: '700',
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  mentorTagText: {
    fontSize: 10.5,
  },
  connectMentorBtn: {
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  connectMentorBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
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
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailHeader: {
    marginBottom: 12,
  },
});
