// src/screens/arcade/styles/GameCard.styles.js
// Figma-matching game card: image top, warm cream body, play button.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#2D1B4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 14,
  },
  cardWide: {
    // wide layout controlled by parent grid
    marginBottom: 0,
  },

  // --- Cover image section ---
  imageWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#E8E0F0', // placeholder tint while loading
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.52)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 10,
    padding: 4,
    zIndex: 5,
  },
  favIcon: {
    fontSize: 18,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },

  // --- Card body ---
  cardBody: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sublabel: {
    fontSize: 11.5,
    fontWeight: '500',
    marginBottom: 6,
  },
  playBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  playBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
