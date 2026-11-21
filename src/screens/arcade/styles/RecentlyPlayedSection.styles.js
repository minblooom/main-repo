// src/screens/arcade/styles/RecentlyPlayedSection.styles.js


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
  // 3-column grid on desktop (>= 900px)
  wideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  // 2-column grid on tablet (640–899px)
  tabletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  scrollRow: {
    gap: 14,
    paddingRight: 20,
  },
});
