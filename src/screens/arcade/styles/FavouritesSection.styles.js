// src/screens/arcade/styles/FavouritesSection.styles.js
// Dedicated styles for FavouritesSection.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 40,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  wideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  scrollRow: {
    gap: 14,
    paddingRight: 20,
  },
});
