// src/screens/community/components/CirclesFeedSection.jsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { styles } from './styles/CirclesFeedSection.styles';
import { useTheme } from '../../../theme/ThemeContext';

export const CirclesFeedSection = ({
  userAgeBand,
  joinedCircles = [],
  joinedCircleIds = [],
  visibleCategories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onChangeSearchQuery,
  filteredCircles = [],
  circleLastMessages = {},
  onSelectCircle,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      {/* My Active Circles (WhatsApp-style 1-tap re-entry) */}
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
                onPress={() => onSelectCircle(jc)}
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

      {/* Other Circles Header */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Explore Peer Circles
        </Text>
      </View>

      {/* Search Bar (zero Web focus outline) */}
      <View style={[styles.searchBarWrap, { backgroundColor: theme.cardBg, borderColor: theme.divider }]}>
        <Text style={{ fontSize: 14 }}>🔍</Text>
        <TextInput
          underlineColorAndroid="transparent"
          style={[
            styles.searchBarInput,
            { color: theme.textPrimary },
            Platform.OS === 'web' && { outlineStyle: 'none', outlineWidth: 0 },
          ]}
          placeholder="Search circles by name, topic, or message..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={onChangeSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onChangeSearchQuery('')} activeOpacity={0.7}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: theme.textMuted }}>✕</Text>
          </TouchableOpacity>
        )}
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
                isSelected && { backgroundColor: theme.accent, borderColor: theme.accent },
              ]}
              onPress={() => onSelectCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  { color: theme.textSecondary },
                  isSelected && { color: '#FFFFFF', fontWeight: '800' },
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
              No circles in this filter yet
            </Text>
            <TouchableOpacity
              style={[styles.categoryPill, { backgroundColor: theme.accent, borderColor: theme.accent }]}
              onPress={() => {
                onSelectCategory('All Circles');
                onChangeSearchQuery('');
              }}
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
            const lastMsg = circleLastMessages[circle.id];

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
                onPress={() => onSelectCircle(circle)}
              >
                <View style={[styles.circleItemIcon, { backgroundColor: circle.iconBg || '#E8F0FF' }]}>
                  <Text style={styles.circleItemIconText}>{circle.icon || '🌿'}</Text>
                </View>

                <View style={styles.circleItemContent}>
                  <View style={styles.circleItemTitleRow}>
                    <Text style={[styles.circleItemTitle, { color: theme.textPrimary }]}>
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

                  {lastMsg ? (
                    <Text style={[styles.circleItemSnippet, { color: theme.textSecondary }]} numberOfLines={1}>
                      <Text style={{ fontWeight: '700', color: theme.textPrimary }}>
                        {lastMsg.sender}:{' '}
                      </Text>
                      {lastMsg.text}
                    </Text>
                  ) : (
                    !!circle.description && (
                      <Text style={[styles.circleItemSnippet, { color: theme.textSecondary }]} numberOfLines={1}>
                        {circle.description}
                      </Text>
                    )
                  )}

                  <View style={styles.circleItemBottomRow}>
                    <View style={styles.circleActiveNowBadge}>
                      <View style={styles.liveGreenDotSmall} />
                      <Text style={[styles.circleActiveNowText, { color: '#16A34A' }]}>
                        {`${maxCap - memberCount} spots open`}
                      </Text>
                    </View>
                    <Text style={[styles.circleTimeText, { color: theme.textMuted }]}>
                      {lastMsg?.time || 'Active today'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};
