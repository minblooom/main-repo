// src/features/community/baraza/styles/BarazaPresenceBar.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    minWidth: 180,
    gap: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subline: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  counterPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    flex: 1,
    minWidth: 110,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 2,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  badgeCircle: {
    position: 'absolute',
    right: -4,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 11,
  },
  tileLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  tileCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  blessingBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blessingIcon: {
    fontSize: 18,
  },
  blessingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
});