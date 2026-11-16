// src/screens/home/homeStyles.js
// Shared design tokens and styles for the sanctuary homepage

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  rootLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  scrollContentWide: {
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: 48,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    gap: 22,
  },

  // Section Typography
  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },

  // Generic Card Container
  cardSurface: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
