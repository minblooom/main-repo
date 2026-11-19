// src/screens/arcade/styles/RecentlyPlayedSection.styles.js
// Dedicated styles for RecentlyPlayedSection.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 26,
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
