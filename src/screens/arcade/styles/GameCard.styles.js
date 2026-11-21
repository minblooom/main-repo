// src/screens/arcade/styles/GameCard.styles.js
// Figma-matching game card: image top, warm cream body, play button.
// Unified layout, high-contrast action buttons, and pixel-consistent heights.

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
    width: '100%',
  },
  cardWide: {
    marginBottom: 0,
  },

  // --- Cover image section ---
  imageWrap: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#E8E0F0',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },

  // Category pill (top-left)
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 8,
    zIndex: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  // Action buttons container (top-right)
  topActionsWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },

  // High-contrast dismiss (X) button for "Pick up where you paused"
  removeBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 15,
    textAlign: 'center',
  },

  // High-contrast favourite (heart) button
  favBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  favIcon: {
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
  },

  // --- Card body ---
  cardBody: {
    padding: 14,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    lineHeight: 20,
    height: 20,
  },
  sublabel: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 16,
    height: 16,
    marginBottom: 6,
  },
  playBtn: {
    width: '100%',
    height: 38,
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
