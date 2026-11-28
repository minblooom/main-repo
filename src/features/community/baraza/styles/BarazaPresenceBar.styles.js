import { StyleSheet } from 'react-native';

export const teenStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 2,
  },
  diceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  diceBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  meterWrap: {
    gap: 6,
  },
  meterBar: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 99,
    overflow: 'hidden',
    gap: 2,
  },
  meterCaption: {
    fontSize: 11,
    fontWeight: '600',
  },
  zoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  zoneTab: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  zoneTabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  cloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  vibeEmoji: {
    fontSize: 14,
  },
  vibeLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  vibeCount: {
    fontSize: 10.5,
    fontWeight: '700',
    marginLeft: 1,
  },
  replyBox: {
    gap: 10,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
  },
  replyTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  peerTwinText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  replyText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  boostBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  boostBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  replyActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  chillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  chillBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#8B5CF6',
  },
  pulseText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});

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
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 36,
    height: 36,
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
    paddingVertical: 12,
    gap: 10,
  },
  blessingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  blessingActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blessingActionBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    maxWidth: '100%',
  },
  blessingActionText: {
    fontSize: 12,
    fontWeight: '700',
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
