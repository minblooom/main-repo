// src/screens/community/styles/CommunityContent.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
    paddingBottom: 32,
  },
  greetingBlock: {
    gap: 4,
    marginTop: 4,
  },
  overline: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  pageSubtitle: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  heroRow: {
    flexDirection: 'column',
    gap: 14,
  },
  heroRowWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroMain: {
    flex: 1.35,
  },
  heroSide: {
    flex: 1,
  },
  gardenCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    justifyContent: 'space-between',
    gap: 12,
  },
  gardenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gardenPill: {
    backgroundColor: '#EDF5EE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gardenPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#2C5A38',
  },
  gardenLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  sections: {
    gap: 18,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  joinedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  joinedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  joinedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  joinedTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  joinedMeta: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Places to gather — aligned with MomentsSection card arrangement
  gatherSection: {
    marginVertical: 4,
    gap: 12,
  },
  gatherHeader: {
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'column',
    gap: 14,
  },
  cardRowWide: {
    flexDirection: 'row',
  },
  exploreCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 160,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  exploreCardWide: {
    flex: 1,
  },
  exploreTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exploreTag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  exploreBody: {
    gap: 4,
    marginBottom: 16,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  exploreDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
  },
  exploreCta: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  hint: {
    fontSize: 12.5,
    textAlign: 'center',
    paddingVertical: 6,
  },
  note: {
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 4,
  },
});