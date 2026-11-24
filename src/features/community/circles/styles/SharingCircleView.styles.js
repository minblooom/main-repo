// src/features/community/circles/styles/SharingCircleView.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 20,
  },
  welcomeCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  timePill: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  spotsBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  warmIntro: {
    fontSize: 14,
    lineHeight: 21,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  dotsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  seatCaption: {
    fontSize: 12,
  },
  joinBtn: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dimmed: {
    opacity: 0.5,
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  shuffleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  promptQuote: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  stanceSection: {
    gap: 8,
  },
  stanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stancePill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  stanceLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  stanceHint: {
    fontSize: 12,
    lineHeight: 17,
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  input: {
    minHeight: 76,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 11,
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
  },
});