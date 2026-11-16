// src/screens/onboarding/onboardingStyles.js
// Shared stylesheet for all onboarding screens

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const onboardingStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  scrollContainerWide: {
    paddingHorizontal: 48,
  },
  pageWrapper: {
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
    flex: 1,
  },
  pageWrapperWide: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  mainLayout: {
    flexDirection: 'column',
    gap: 20,
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 36,
  },
  contentContainer: {
    flex: 1,
    gap: 12,
  },
  contentContainerWide: {
    flex: 1,
  },
  stepTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
    marginTop: 8,
  },
  primaryBtnDisabled: {
    backgroundColor: '#C4A8C8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipBtnText: {
    fontSize: 12,
    color: '#AAA',
    textDecorationLine: 'underline',
  },
});
