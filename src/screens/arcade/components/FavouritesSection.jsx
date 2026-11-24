// src/screens/arcade/components/FavouritesSection.jsx
// "Your happy little collection" favourites section matching Figma.
// Unified responsive grid, strict deduplication (a game only appears once).

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GameCard } from './GameCard';
import { styles } from '../styles/FavouritesSection.styles';

export const FavouritesSection = ({
  games = [],
  onPlayGame,
  onToggleFavourite,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  // Unified responsive breakpoints matching MadeForYourMomentSection
  const isDesktop = width >= 900;
  const isTablet = width >= 640 && width < 900;
  const isWide = isDesktop || isTablet;

  const PADDING = 32; // 16px each side
  const GAP = isDesktop ? 16 : 14;
  const COLS = isDesktop ? 3 : 2;
  const cardWidth = (width - PADDING - GAP * (COLS - 1)) / COLS;

  // Strict deduplication: a game only appears once in favourites
  const uniqueGames = useMemo(() => {
    if (!games || !Array.isArray(games)) return [];
    const seen = new Set();
    const result = [];
    for (const g of games) {
      if (g?.id && !seen.has(g.id)) {
        seen.add(g.id);
        result.push(g);
      }
    }
    return result;
  }, [games]);

  if (uniqueGames.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Your happy little collection
      </Text>

      {isWide ? (
        // Unified grid layout: 3-column desktop, 2-column tablet
        <View style={isDesktop ? styles.wideGrid : styles.tabletGrid}>
          {uniqueGames.map((g) => (
            <View key={`fav_${g.id}`} style={{ width: cardWidth }}>
              <GameCard
                game={g}
                isFavourited={true}
                buttonLabel="Play"
                onPlay={() => onPlayGame(g)}
                onToggleFavourite={() => onToggleFavourite(g.id)}
                isWide={true}
              />
            </View>
          ))}
        </View>
      ) : (
        // Horizontal scroll on mobile
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}
        >
          {uniqueGames.map((g) => (
            <View key={`fav_${g.id}`} style={{ width: 220 }}>
              <GameCard
                game={g}
                isFavourited={true}
                buttonLabel="Play"
                onPlay={() => onPlayGame(g)}
                onToggleFavourite={() => onToggleFavourite(g.id)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
