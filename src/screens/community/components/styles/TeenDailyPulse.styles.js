import { StyleSheet } from 'react-native';

export const rb = StyleSheet.create({
  track: { height: 6, borderRadius: 3, flex: 1, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
});

export const s = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dayTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 0.4,
  },
  lockedNote: {
    fontSize: 12,
  },
  qText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  optRow: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  optDesc: {
    fontSize: 12,
  },
  pctText: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 34,
    textAlign: 'right',
  },
  nudge: {
    fontSize: 12,
    marginTop: 2,
  },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  boardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  boardSub: {
    fontSize: 12,
    lineHeight: 17,
  },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pickerWrap: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  pickerTitle: {
    fontSize: 12,
  },
  starterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  starterCheck: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '700',
  },
  starterText: {
    fontSize: 13,
    flex: 1,
  },
  deckContainer: {
    position: 'relative',
    paddingBottom: 6,
  },
  deckBackLayer: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    top: 10,
    borderRadius: 16,
    borderWidth: 1,
    opacity: 0.65,
  },
  popCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 15,
    gap: 14,
  },
  popCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  popBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  mineBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  deckCounter: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  entryQuote: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 24,
  },
  popEntryText: {
    fontSize: 15.5,
    lineHeight: 22,
    fontWeight: '700',
  },
  popCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  meTooBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  meTooText: {
    fontSize: 12,
    fontWeight: '800',
  },
  nextPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  nextPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
