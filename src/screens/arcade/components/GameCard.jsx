// src/screens/arcade/components/GameCard.jsx
// Game card with real cover imagery — warm cream card body, full-bleed image top.
// Figma-matching layout: image → category badge + actions → title + mood/progress → Play button.

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { soundService } from '../audio/soundService';
import { styles } from '../styles/GameCard.styles';

export const GameCard = ({
  game,
  isFavourited = false,
  buttonLabel = 'Play',
  onPlay,
  onToggleFavourite,
  onRemove,
  isWide = false,
}) => {
  const { theme } = useTheme();

  if (!game) return null;

  const handlePlay = (e) => {
    e?.stopPropagation?.();
    soundService.playClick();
    onPlay?.();
  };

  const handleFav = (e) => {
    e?.stopPropagation?.();
    soundService.playClick();
    onToggleFavourite?.();
  };

  const handleRemove = (e) => {
    e?.stopPropagation?.();
    soundService.playClick();
    onRemove?.();
  };

  // Dynamic progress subtitle if in paused/progress state
  const subtitleText = game.savedState?.currentLevel
    ? `Level ${game.savedState.currentLevel} · ${game.mood || 'In Progress'}`
    : `${game.mood} · ${game.duration}`;

  return (
    <View
      style={[
        styles.card,
        isWide && styles.cardWide,
        { backgroundColor: theme.cardBg, borderColor: theme.heroBorder },
      ]}
    >
      {/* -- Cover Image -- */}
      <View style={styles.imageWrap}>
        <Image
          source={typeof game.coverImage === 'string' ? { uri: game.coverImage } : game.coverImage}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* Category pill over image (top-left) */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>
            {(game.categoryLabel || 'PLAY').toUpperCase()}
          </Text>
        </View>

        {/* Action buttons (top-right) */}
        <View style={styles.topActionsWrap}>
          {/* High-visibility dismiss (X) button for "Pick up where you paused" */}
          {onRemove ? (
            <TouchableOpacity
              onPress={handleRemove}
              style={styles.removeBtn}
              activeOpacity={0.75}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Remove game from paused list"
              accessibilityRole="button"
            >
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}

          {/* Sparkle / favourite heart button */}
          <TouchableOpacity
            onPress={handleFav}
            style={styles.favBtn}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
            accessibilityRole="button"
          >
            <Text style={styles.favIcon}>{isFavourited ? '❤️' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* -- Card Body (warm cream) -- */}
      <View style={styles.cardBody}>
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={[styles.sublabel, { color: theme.textMuted }]} numberOfLines={1}>
          {subtitleText}
        </Text>

        <TouchableOpacity
          style={[
            styles.playBtn,
            { backgroundColor: theme.accentSoft, borderColor: theme.accentBorder },
          ]}
          onPress={handlePlay}
          activeOpacity={0.8}
        >
          <Text style={[styles.playBtnText, { color: theme.pillText || '#492542' }]}>
            {buttonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
