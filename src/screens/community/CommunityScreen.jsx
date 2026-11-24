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
});
