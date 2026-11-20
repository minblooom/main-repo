// src/screens/arcade/components/FavouritesSection.jsx
// "Your happy little collection" favourites section matching Figma.
// Styles extracted to src/screens/arcade/styles/FavouritesSection.styles.js.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GameCard } from './GameCard';
import { styles } from '../styles/FavouritesSection.styles';

export const FavouritesSection = ({
  games = [],
  isWide = false,
  onPlayGame,
  onToggleFavourite,
}) => {
  const { theme } = useTheme();

  if (!games || games.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Your happy little collection
      </Text>

      {isWide ? (
        <View style={styles.wideGrid}>
          {games.map((g) => (
            <GameCard
              key={`fav_${g.id}`}
              game={g}
              isFavourited={true}
              buttonLabel="Play"
              onPlay={() => onPlayGame(g)}
              onToggleFavourite={() => onToggleFavourite(g.id)}
              isWide={true}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}
        >
          {games.map((g) => (
            <GameCard
              key={`fav_${g.id}`}
              game={g}
              isFavourited={true}
              buttonLabel="Play"
              onPlay={() => onPlayGame(g)}
              onToggleFavourite={() => onToggleFavourite(g.id)}
              isWide={true}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
