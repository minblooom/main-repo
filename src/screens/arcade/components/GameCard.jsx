// src/screens/arcade/components/GameCard.jsx
// Game card with real cover imagery — warm cream card body, full-bleed image top.
// Figma-matching layout: image → category badge → title + mood → Play button.

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

  const handlePlay = () => {
    soundService.playClick();
    onPlay?.();
  };

  const handleFav = () => {
    soundService.playClick();
    onToggleFavourite?.();
  };

  const handleRemove = () => {
    soundService.playClick();
    onRemove?.();
  };

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

        {/* Category pill over image */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>
            {(game.categoryLabel || 'PLAY').toUpperCase()}
          </Text>
        </View>

        {/* Remove button if onRemove is provided (e.g. in Pick up where you paused) */}
        {onRemove ? (
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}

        {/* Sparkle / favourite icon top-right */}
        <TouchableOpacity
          onPress={handleFav}
          style={styles.favBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.favIcon}>{isFavourited ? '❤️' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      {/* -- Card Body (warm cream) -- */}
      <View style={styles.cardBody}>
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
          {game.title}
        </Text>
        <Text style={[styles.sublabel, { color: theme.textMuted }]}>
          {game.mood} · {game.duration}
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
