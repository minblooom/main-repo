// src/screens/arcade/components/PlayFilterSection.jsx
// Search, category filters, and quick discovery tags matching Figma "Find your kind of play".
// Styles extracted to src/screens/arcade/styles/PlayFilterSection.styles.js.

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../audio/soundService';
import { GAME_CATEGORIES, QUICK_TAGS } from '../engine/gameRegistry';
import { styles } from '../styles/PlayFilterSection.styles';

export const PlayFilterSection = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  activeTag,
  onSelectTag,
  onSortPress,
}) => {
  const { theme } = useTheme();

  const handleSelectCat = (id) => {
    soundService.playClick();
    onSelectCategory?.(id);
  };

  const handleSelectTag = (id) => {
    soundService.playClick();
    onSelectTag?.(id);
  };

  const handleSort = () => {
    soundService.playClick();
    onSortPress?.();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Find your kind of play
      </Text>

      {/* Search Input Row with Filters & Sort */}
      <View style={styles.searchRow}>
        <View style={[styles.searchInputWrap, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search games, moods, focus spaces..."
            placeholderTextColor={theme.textMuted || '#8B6DA8'}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}
          onPress={handleSort}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterBtnText, { color: theme.textSecondary }]}>
            Filters · Sort: Recommended ▾
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {GAME_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                { backgroundColor: isActive ? theme.accent || '#492542' : theme.cardBg },
                !isActive && { borderColor: theme.heroBorder, borderWidth: 1 },
              ]}
              onPress={() => handleSelectCat(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  { color: isActive ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick Tags (Horizontal) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsScroll}
      >
        {QUICK_TAGS.map((tag) => {
          const isSelected = activeTag === tag.id;
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagPill,
                { backgroundColor: isSelected ? theme.accentSoft : theme.heroBg },
                { borderColor: isSelected ? theme.accentBorder : theme.heroBorder },
              ]}
              onPress={() => handleSelectTag(isSelected ? null : tag.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tagPillText, { color: isSelected ? theme.pillText || '#492542' : theme.textSecondary }]}>
                {tag.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
