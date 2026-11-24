// src/screens/arcade/components/MadeForYourMomentSection.jsx
// "Made for your moment" games showcase section matching the Figma design.
// 3-column grid on desktop, 2-column on tablet, horizontal scroll on mobile.

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { GameCard } from './GameCard';
import { styles } from '../styles/MadeForYourMomentSection.styles';

export const MadeForYourMomentSection = ({
  games = [],
  favourites = [],
  onPlayGame,
  onToggleFavourite,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  // Breakpoints matching Figma
  const isDesktop = width >= 900;
  const isTablet = width >= 640 && width < 900;
  const isWide = isDesktop || isTablet;

  // Card widths for grid layouts
  const PADDING = 32; // 16px each side
  const GAP = isDesktop ? 16 : 14;
  const COLS = isDesktop ? 3 : 2;
  const cardWidth = (width - PADDING - GAP * (COLS - 1)) / COLS;

  if (!games || games.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Made for your moment
        </Text>
        <View style={[styles.emptyBox, { backgroundColor: theme.cardBg, borderColor: theme.heroBorder }]}>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            No games found matching your filter. Try selecting "All games".
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Made for your moment
      </Text>

      {isWide ? (
        // Grid layout: 3-col desktop, 2-col tablet
        <View style={[isDesktop ? styles.wideGrid : styles.tabletGrid]}>
          {games.map((g) => (
            <View key={g.id} style={{ width: cardWidth }}>
              <GameCard
                game={g}
                isFavourited={favourites.some((f) => f.id === g.id)}
                buttonLabel="Play"
                onPlay={() => onPlayGame(g)}
                onToggleFavourite={() => onToggleFavourite(g.id)}
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
          {games.map((g) => (
            <View key={g.id} style={{ width: 220 }}>
              <GameCard
                game={g}
                isFavourited={favourites.some((f) => f.id === g.id)}
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
