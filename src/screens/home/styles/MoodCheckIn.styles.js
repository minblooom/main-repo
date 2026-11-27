// src/screens/home/styles/MoodCheckIn.styles.js
// Styles for the enhanced daily mood check-in card

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
    overflow: 'hidden',
  },
  layout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    width: '100%',
  },
  textColumn: {
    minWidth: 180,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  subhead: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  skipNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#AAA',
    marginTop: 6,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    maxWidth: '100%',
    flexShrink: 1,
  },
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#FAF6EF',
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 56,
    flexGrow: 1,
  },
  moodItemSelected: {
    borderColor: colors.brand,
    backgroundColor: '#F0EAFA',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  moodLabelSelected: {
    color: colors.brand,
    fontWeight: '800',
  },
  checkText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.brand,
    marginTop: 2,
  },

  // -- Enhanced Companion Guidance & Factors -----------------
  expansionCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  companionImg: {
    width: 32,
    height: 32,
  },
  companionSpeech: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  companionAuthor: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  companionQuote: {
    fontSize: 12.5,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  factorsSection: {
    gap: 8,
  },
  factorsHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  factorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  factorChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  factorText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  seedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  analyticsLink: {
    fontSize: 11.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
