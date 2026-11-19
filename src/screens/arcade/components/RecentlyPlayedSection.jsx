// src/screens/arcade/components/RecentlyPlayedSection.jsx
// "Pick up where you paused" recently played games section matching Figma.
// Styles extracted to src/screens/arcade/styles/RecentlyPlayedSection.styles.js.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GameCard } from './GameCard';
import { styles } from '../styles/RecentlyPlayedSection.styles';

export const RecentlyPlayedSection = ({
  games = [],
  favourites = [],
  isWide = false,
  onPlayGame,
  onToggleFavourite,
  onRemoveGame,
}) => {
  const { theme } = useTheme();

  // Deduplicate games by id so no game appears twice
  const uniqueGames = React.useMemo(() => {
    if (!games || !Array.isArray(games)) return [];
    const map = new Map();
    games.forEach((g) => {
      if (g?.id && !map.has(g.id)) {
        map.set(g.id, g);
      }
    });
    return Array.from(map.values());
  }, [games]);

  if (uniqueGames.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Pick up where you paused
      </Text>

      {isWide ? (
        <View style={styles.wideGrid}>
          {uniqueGames.map((g) => (
            <GameCard
              key={`recent_${g.id}`}
              game={g}
              isFavourited={favourites.some((f) => f.id === g.id)}
              buttonLabel="Continue playing"
              onPlay={() => onPlayGame(g, { resume: true })}
              onToggleFavourite={() => onToggleFavourite(g.id)}
              onRemove={() => onRemoveGame?.(g.id)}
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
          {uniqueGames.map((g) => (
            <GameCard
              key={`recent_${g.id}`}
              game={g}
              isFavourited={favourites.some((f) => f.id === g.id)}
              buttonLabel="Continue playing"
              onPlay={() => onPlayGame(g, { resume: true })}
              onToggleFavourite={() => onToggleFavourite(g.id)}
              onRemove={() => onRemoveGame?.(g.id)}
              isWide={true}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
