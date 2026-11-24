// src/screens/journal/styles/JournalScreen.styles.js
// Styles for the Journal Screen layout and navigation shell

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAF5EE',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  scrollContainerWide: {
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    gap: 16,
  },
  contentWrapperWide: {
    paddingVertical: 6,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  titleCol: {
    gap: 4,
    flex: 1,
    minWidth: 260,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  privacyBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  privacyBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6E5D87',
  },
  columnsRow: {
    flexDirection: 'column',
    gap: 18,
  },
  columnsRowWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  editorCol: {
    flex: 1.5,
    gap: 12,
  },
  archiveCol: {
    flex: 1,
    gap: 16,
  },
  archiveColWide: {
    maxWidth: 340,
  },
  editorFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  footerWordsPace: {
    fontSize: 11.5,
    color: '#8B6DA8',
    fontStyle: 'italic',
  },
  footerHelpline: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8B6DA8',
  },
});
