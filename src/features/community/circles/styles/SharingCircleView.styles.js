import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scroll: {
    gap: 22,
    paddingBottom: 32,
  },
  statusBar: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusTextCol: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  descText: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
  },
  joinBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  joinText: {
    fontSize: 13,
    fontWeight: '700',
  },
  spotlightCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  spotlightTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  spotlightBody: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  spotlightAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  mutedTiny: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  actionLink: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  versePaper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  verseLineRow: {
    gap: 3,
  },
  verseText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  verseBy: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  queueList: {
    gap: 8,
  },
  queueRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  queueIndex: {
    fontSize: 12,
    fontWeight: '800',
  },
  queueTrack: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  collectablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  collectableTile: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  collectableMark: {
    fontSize: 18,
  },
  collectableTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  collectableName: {
    fontSize: 13.5,
    fontWeight: '700',
    marginTop: 2,
  },
  collectableNote: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  inlineInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  lineInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
  },
  smallActionBtn: {
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  smallActionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dimmed: {
    opacity: 0.4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pocketPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pocketPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  safetyBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  composerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 10,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniSelect: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  miniSelectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13.5,
    fontWeight: '500',
  },
  bodyInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 84,
  },
  publishBtn: {
    alignSelf: 'flex-end',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  galleryList: {
    gap: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 14,
  },
  artCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  artMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  artAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artAvatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  artAuthor: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  artSubMeta: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  dots: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  menuChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  artTitle: {
    fontSize: 15.5,
    fontWeight: '800',
  },
  artBody: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  poetryItalic: {
    fontStyle: 'italic',
  },
  artFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  reactTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  reactTagText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  perkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  perkLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});
