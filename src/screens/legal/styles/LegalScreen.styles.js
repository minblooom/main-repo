// src/screens/legal/styles/LegalScreen.styles.js
// Dedicated styles for LegalScreen and LegalModal.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6EF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF6EF',
  },
  innerWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 16, 47, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '88%',
    borderRadius: 24,
    backgroundColor: '#FAF6EF',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.1)',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8A531C',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#341528',
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(73, 37, 66, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#492542',
  },

  // Tabs Switcher
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(73, 37, 66, 0.06)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(73, 37, 66, 0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#76648E',
  },
  tabTextActive: {
    color: '#341528',
    fontWeight: '800',
  },

  // Scroll Content
  scrollArea: {
    paddingBottom: 24,
  },

  // Plain-Language Summary Grid
  summarySection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#492542',
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  summaryCardsRow: {
    gap: 10,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    gap: 10,
  },
  summaryIcon: {
    fontSize: 20,
    marginTop: 1,
  },
  summaryCardBody: {
    flex: 1,
  },
  summaryCardHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#341528',
    marginBottom: 2,
  },
  summaryCardText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#655375',
  },

  // Detailed Clauses Section
  clausesHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#492542',
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  clauseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
  },
  clauseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#341528',
    marginBottom: 8,
  },
  clauseContent: {
    fontSize: 12.5,
    lineHeight: 19,
    color: '#554261',
  },

  // Footer / Bottom Bar
  bottomBar: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.08)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  doneBtn: {
    backgroundColor: '#492542',
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
