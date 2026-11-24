// src/features/community/spaces/SpaceListView.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useCommunitySpaces } from '../hooks/useCommunitySpaces';
import { useGroupSafety } from '../hooks/useGroupSafety';
import { useGroupPosts } from '../hooks/useGroupPosts';
import { CommunitySpaceCard } from '../baraza/CommunitySpaceCard';
import { GroupSpaceView } from '../groups/GroupSpaceView';
import { SharingCircleView } from '../circles/SharingCircleView';
import { IdentitySpaceView } from '../identity/IdentitySpaceView';
import { styles } from '../../../screens/community/styles/CommunityContent.styles';

const formatSpaceMeta = (s) =>
  [
    s.dateLabel && s.timeLabel ? `${s.dateLabel} · ${s.timeLabel}` : null,
    !s.privateMembership && s.memberCount ? `${s.memberCount} here` : null,
  ]
    .filter(Boolean)
    .join(' · ');

export const SpaceListView = ({ type, emptyText, onOpen }) => {
  const { theme } = useTheme();
  const baseFont = theme.fontFamily ? { fontFamily: theme.fontFamily } : null;

  const { spaces, status, reload, joinSpace, leaveSpace, actionError } = useCommunitySpaces();
  const {
    safetyAcknowledged,
    acknowledgeSafety,
    blockedAuthorIds,
    reportedPostIds,
    blockAuthor,
    reportPost,
  } = useGroupSafety();
  const { getPostsForGroup, createPost, toggleReaction } = useGroupPosts();

  const items = spaces.filter((s) => s.type === type);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if ((type === 'group' || type === 'circle' || type === 'identity') && items.length > 0) {
      if (!items.some((item) => item.id === selectedId)) {
        setSelectedId(items[0].id);
      }
    }
  }, [type, items, selectedId]);

  if (status === 'loading') {
    return <Text style={[styles.hint, baseFont, { color: theme.textMuted }]}>Loading spaces…</Text>;
  }

  if (status === 'error') {
    return (
      <Pressable accessibilityRole="button" onPress={reload}>
        <Text style={[styles.hint, baseFont, { color: theme.accent }]}>
          We couldn’t load spaces. Tap to try again.
        </Text>
      </Pressable>
    );
  }

  if (items.length === 0) {
    return <Text style={[styles.hint, baseFont, { color: theme.textMuted }]}>{emptyText}</Text>;
  }

  // Inline Switcher for Groups, Sharing Circles, and Identity & Language Spaces
  if (type === 'group' || type === 'circle' || type === 'identity') {
    const activeItem = items.find((item) => item.id === selectedId) ?? items[0];
    const activeIndex = items.findIndex((item) => item.id === activeItem.id);

    return (
      <View style={localStyles.inlineWrap}>
        {!!actionError && (
          <Text
            style={[styles.hint, baseFont, { color: theme.accent }]}
            accessibilityLiveRegion="polite"
          >
            {actionError}
          </Text>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.tabRow}
        >
          {items.map((item, idx) => {
            const active = item.id === activeItem.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setSelectedId(item.id)}
                style={[
                  localStyles.tabPill,
                  {
                    backgroundColor: active ? theme.accent : theme.cardBg,
                    borderColor: active ? theme.accent : theme.divider,
                  },
                ]}
              >
                <Text
                  style={[
                    localStyles.tabText,
                    baseFont,
                    { color: active ? theme.bg : theme.textPrimary },
                  ]}
                >
                  {item.title || `Space ${idx + 1}`}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {type === 'group' && activeItem && (
          <GroupSpaceView
            group={activeItem}
            posts={getPostsForGroup(activeItem.id)}
            joined={!!activeItem.joined}
            onToggleJoin={(id) => (activeItem.joined ? leaveSpace(id) : joinSpace(id))}
            safetyAcknowledged={safetyAcknowledged}
            onAcknowledgeSafety={acknowledgeSafety}
            blockedAuthorIds={blockedAuthorIds}
            reportedPostIds={reportedPostIds}
            onBlockAuthor={blockAuthor}
            onReportPost={reportPost}
            onCreatePost={createPost}
            onToggleReaction={(postId, reactionKey) =>
              toggleReaction(activeItem.id, postId, reactionKey)
            }
          />
        )}

        {type === 'circle' && activeItem && (
          <SharingCircleView
            circle={activeItem}
            circleIndex={activeIndex}
            joined={!!activeItem.joined}
            onToggleJoin={(id) => (activeItem.joined ? leaveSpace(id) : joinSpace(id))}
            safetyAcknowledged={safetyAcknowledged}
            onAcknowledgeSafety={acknowledgeSafety}
            blockedAuthorIds={blockedAuthorIds}
            onBlockAuthor={blockAuthor}
          />
        )}

        {type === 'identity' && activeItem && (
          <IdentitySpaceView
            space={activeItem}
            joined={!!activeItem.joined}
            onToggleJoin={(id) => (activeItem.joined ? leaveSpace(id) : joinSpace(id))}
            safetyAcknowledged={safetyAcknowledged}
            onAcknowledgeSafety={acknowledgeSafety}
            blockedAuthorIds={blockedAuthorIds}
            onBlockAuthor={blockAuthor}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.cardList}>
      {!!actionError && (
        <Text style={[styles.hint, baseFont, { color: theme.accent }]} accessibilityLiveRegion="polite">
          {actionError}
        </Text>
      )}
      {items.map((item) => (
        <CommunitySpaceCard
          key={item.id}
          type={item.type}
          title={item.title}
          description={item.description}
          meta={formatSpaceMeta(item)}
          joined={item.joined === true}
          onPress={() => onOpen(item)}
          quickLabel={item.joined ? undefined : 'Join'}
          onQuick={() => joinSpace(item.id)}
        />
      ))}
    </View>
  );
};

const localStyles = StyleSheet.create({
  inlineWrap: {
    gap: 18,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 2,
  },
  tabPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
});