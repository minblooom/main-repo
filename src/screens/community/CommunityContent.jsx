// src/screens/community/CommunityContent.jsx
import React, { useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { HomeHeader } from '../home/components/HomeHeader';
import { useTheme } from '../../theme/ThemeContext';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useCommunitySpaces } from '../../features/community/hooks/useCommunitySpaces';
import { useCheckIns } from '../../features/community/hooks/useCheckIns';
import { useGoals } from '../../features/community/hooks/useGoals';
import { useDailyEncouragement } from '../../features/community/hooks/useDailyEncouragement';
import { useGroupSuggestions } from '../../features/community/hooks/useGroupSuggestions';
import { useGroupSafety } from '../../features/community/hooks/useGroupSafety';
import { useGroupPosts } from '../../features/community/hooks/useGroupPosts';
import { COMMUNITY_CATEGORIES } from '../../features/community/data/communityCategories';
import { buildGarden, gardenStreak } from '../../features/community/utils/gardenGrowth';
import { categoryPreview } from '../../features/community/utils/categoryPreview';
import { CommunityHeader } from '../../features/community/baraza/CommunityHeader';
import { CommunityGreeting } from '../../features/community/baraza/CommunityGreeting';
import { BarazaPresenceBar } from '../../features/community/baraza/BarazaPresenceBar';
import { BackButton } from '../../features/community/baraza/BackButton';
import { SpaceListView } from '../../features/community/spaces/SpaceListView';
import { SpaceDetail } from '../../features/community/spaces/SpaceDetail';
import { SpaceDetailModal } from '../../features/community/spaces/SpaceDetailModal';

import { EncouragementPage } from '../../features/community/encouragement/EncouragementPage';
import { GardenStrip } from '../../features/community/encouragement/GardenStrip';
import { SuggestGroupForm } from '../../features/community/groups/SuggestGroupForm';
import { SuggestionStatusList } from '../../features/community/groups/SuggestionStatusList';
import { GroupSpaceView } from '../../features/community/groups/GroupSpaceView';
import { SharingCircleView } from '../../features/community/circles/SharingCircleView';
import { IdentitySpaceView } from '../../features/community/identity/IdentitySpaceView';
import { styles } from './styles/CommunityContent.styles';

const VIEW_TYPE = { groups: 'group', circles: 'circle', identity: 'identity' };

const EMPTY_TEXT = {
  group: 'Groups are being added. Check back soon.',
  circle: 'Sharing circles are being scheduled. Check back soon.',
  identity: 'Spaces are being added. Check back soon.',
};

const EXPLORE_PALETTE = {
  groups: {
    bg: '#EDF5EE',
    border: '#D8ECDA',
    accent: '#2C5A38',
    cta: 'Browse groups →',
  },
  circles: {
    bg: '#FFF5E8',
    border: '#FFE6C9',
    accent: '#8A531C',
    cta: 'See sessions →',
  },
  identity: {
    bg: '#F0EAFA',
    border: '#DFD5F0',
    accent: '#5B3765',
    cta: 'Explore spaces →',
  },
};

export const CommunityContent = ({ onOpenProfile, onNavigateHome }) => {
  const { theme, companionId } = useTheme();
  const { isDesktop, isTablet } = useResponsiveLayout();
  const isWide = isDesktop || isTablet;
  const { spaces, status, reload, joinSpace, leaveSpace } = useCommunitySpaces();

  const { suggestions, suggestGroup, canSuggest } = useGroupSuggestions();
  const {
    safetyAcknowledged,
    acknowledgeSafety,
    blockedAuthorIds,
    reportedPostIds,
    blockAuthor,
    reportPost,
  } = useGroupSafety();
  const { getPostsForGroup, createPost, toggleReaction } = useGroupPosts();
  const { message, another } = useDailyEncouragement();

  const checkInState = useCheckIns();
  const goalState = useGoals();

  const [route, setRoute] = useState({ name: 'home' });
  const [openSpaceId, setOpenSpaceId] = useState(null);

  const openCategory = (id) => setRoute({ name: 'category', id });
  const goHome = () => setRoute({ name: 'home' });
  const openedSpace = spaces.find((s) => s.id === openSpaceId) ?? null;
  const joinedSpaces = spaces.filter((s) => s.joined === true);
  const category =
    route.name === 'category'
      ? COMMUNITY_CATEGORIES.find((c) => c.id === route.id)
      : null;

  const renderSpaceDetail = (space) => {
    if (space.type === 'circle') {
      return <SharingCircleView space={space} />;
    }
    if (space.type === 'identity') {
      return <IdentitySpaceView space={space} />;
    }
    if (space.type === 'group') {
      return (
        <GroupSpaceView
          group={space}
          posts={getPostsForGroup(space.id)}
          joined={!!space.joined}
          onToggleJoin={(id) => (space.joined ? leaveSpace(id) : joinSpace(id))}
          safetyAcknowledged={safetyAcknowledged}
          onAcknowledgeSafety={acknowledgeSafety}
          blockedAuthorIds={blockedAuthorIds}
          reportedPostIds={reportedPostIds}
          onBlockAuthor={blockAuthor}
          onReportPost={reportPost}
          onCreatePost={createPost}
          onToggleReaction={(postId, reactionKey) =>
            toggleReaction(space.id, postId, reactionKey)
          }
        />
      );
    }
    return <SpaceDetail space={space} />;
  };

  let body;

  if (category) {
    let content;
    if (category.view === 'encouragement') {
      content = (
        <EncouragementPage
          checkInState={checkInState}
          goalState={goalState}
          companionId={companionId}
        />
      );
    } else if (category.view === 'groups') {
      content = (
        <View style={styles.sections}>
          <SpaceListView
            type="group"
            emptyText={EMPTY_TEXT.group}
            onOpen={(s) => setOpenSpaceId(s.id)}
          />
          {canSuggest ? (
            <SuggestGroupForm onSubmit={suggestGroup} />
          ) : (
            <Text style={[styles.hint, { color: theme.textMuted }]}>
              You’ve reached the limit of suggestions for now.
            </Text>
          )}
          <SuggestionStatusList suggestions={suggestions} />
        </View>
      );
    } else {
      content = (
        <SpaceListView
          type={VIEW_TYPE[category.view]}
          emptyText={EMPTY_TEXT[VIEW_TYPE[category.view]]}
          onOpen={(s) => setOpenSpaceId(s.id)}
        />
      );
    }

    body = (
      <>
        <BackButton label="‹ Baraza" onPress={goHome} />
        <CommunityHeader title={category.title} subtitle={category.description} />
        {content}
      </>
    );
  } else {
    const garden = buildGarden({
      checkIns: checkInState.checkIns,
      goals: goalState.goals,
      days: 7,
    });
    const exploreCategories = COMMUNITY_CATEGORIES.filter(
      (c) => c.id !== 'encouragement' && c.id !== 'resources' && c.view !== 'resources'
    );

    body = (
      <>
        <HomeHeader
          companionId={companionId}
          onProfilePress={onOpenProfile}
          currentPage="Baraza"
          onBackPress={onNavigateHome}
        />

        <View style={styles.greetingBlock}>
          <Text style={[styles.overline, { color: theme.textMuted }]}>
            BARAZA · SHARED SANCTUARY
          </Text>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>
            Karibu Baraza. Take your time.
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
            Quiet spaces to share, listen, or simply sit alongside others.
          </Text>
        </View>

        <BarazaPresenceBar />

        <View style={[styles.heroRow, isWide && styles.heroRowWide]}>
          <View style={isWide ? styles.heroMain : null}>
            <CommunityGreeting
              companionId={companionId}
              message={message}
              onAnother={another}
            />
          </View>

          <View style={isWide ? styles.heroSide : null}>
            <View
              style={[
                styles.gardenCard,
                { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open your garden"
                onPress={() => openCategory('encouragement')}
                style={styles.gardenHeader}
              >
                <View style={styles.gardenPill}>
                  <Text style={styles.gardenPillText}>YOUR GARDEN</Text>
                </View>
                <Text style={[styles.gardenLink, { color: theme.accent }]}>
                  Open garden →
                </Text>
              </Pressable>

              <GardenStrip
                garden={garden}
                streak={gardenStreak(garden)}
                onPlantPress={() => openCategory('encouragement')}
              />
            </View>
          </View>
        </View>

        {joinedSpaces.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Your spaces
              </Text>
            </View>
            <View style={styles.joinedRow}>
              {joinedSpaces.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.85}
                  onPress={() => setOpenSpaceId(s.id)}
                  style={[
                    styles.joinedPill,
                    { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
                  ]}
                >
                  <View style={[styles.joinedDot, { backgroundColor: theme.accent }]} />
                  <Text style={[styles.joinedTitle, { color: theme.textPrimary }]}>
                    {s.title}
                  </Text>
                  <Text style={[styles.joinedMeta, { color: theme.accent }]}>Open →</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.gatherSection}>
          <View style={styles.gatherHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Places to gather
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Step into what feels gentle today. Leave anytime.
            </Text>
          </View>

          <View style={[styles.cardRow, isWide && styles.cardRowWide]}>
            {exploreCategories.map((c) => {
              const palette = EXPLORE_PALETTE[c.id] ?? EXPLORE_PALETTE.groups;
              const tag = categoryPreview(c.id, { spaces, suggestions });
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.88}
                  onPress={() => openCategory(c.id)}
                  style={[
                    styles.exploreCard,
                    isWide && styles.exploreCardWide,
                    { backgroundColor: palette.bg, borderColor: palette.border },
                  ]}
                >
                  <View style={styles.exploreTop}>
                    <Text style={[styles.exploreTag, { color: palette.accent }]}>
                      {(tag || c.title).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.exploreBody}>
                    <Text style={styles.exploreTitle}>{c.title}</Text>
                    <Text style={styles.exploreDesc}>{c.description}</Text>
                  </View>

                  <Text style={[styles.exploreCta, { color: palette.accent }]}>
                    {palette.cta}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {status === 'error' && (
          <Text style={[styles.hint, { color: theme.accent }]} onPress={reload}>
            We couldn’t load your spaces. Tap to try again.
          </Text>
        )}

        <Text style={[styles.note, { color: theme.textMuted }]}>
          Peer spaces for connection and encouragement.
        </Text>
      </>
    );
  }

  return (
    <View style={styles.container}>
      {body}
      <SpaceDetailModal
        visible={!!openedSpace}
        title={openedSpace?.title ?? ''}
        onClose={() => setOpenSpaceId(null)}
      >
        {openedSpace ? renderSpaceDetail(openedSpace) : null}
      </SpaceDetailModal>
    </View>
  );
};