// src/screens/onboarding/onboardingStyles.js
// Shared stylesheet for all onboarding screens, guaranteeing visual harmony with Signup/Login

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const onboardingStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.splashBg,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    gap: 24,
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 36,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 6,
  },
  contentContainerWide: {
    maxWidth: 520,
    paddingHorizontal: 10,
  },
  stepTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 10,
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
    paddingVertical: 8,
  },
  skipBtnText: {
    fontSize: 12,
    color: '#AAA',
    textDecorationLine: 'underline',
  },
});
