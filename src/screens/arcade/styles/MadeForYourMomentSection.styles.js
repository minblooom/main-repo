// src/screens/arcade/styles/MadeForYourMomentSection.styles.js
// Figma-matching grid: 3-col desktop, 2-col tablet, horizontal scroll mobile.

import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_W = Dimensions.get('window').width;

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
  emptyBox: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
});
