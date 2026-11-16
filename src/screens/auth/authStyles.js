// src/screens/auth/authStyles.js
// Shared stylesheet for all authentication screens (Login + Signup)
// Import this in LoginScreen.jsx and SignupScreen.jsx

import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const authStyles = StyleSheet.create({
  // ─── Root ───────────────────────────────────────────────────────────
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

  // ─── Top Header ─────────────────────────────────────────────────────
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: -0.5,
  },
  headerRightLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  langActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  langInactive: {
    color: colors.textMuted,
  },
  urgentLink: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // ─── Two-column layout ──────────────────────────────────────────────
  mainLayout: {
    flexDirection: 'column',
    gap: 24,
  },
  mainLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 36,
  },

  // ─── Left companion / hero card ─────────────────────────────────────
  companionCard: {
    backgroundColor: colors.lavenderSheet,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
  },
  companionCardWide: {
    flex: 1,
    maxWidth: 420,
    minHeight: 520,
    justifyContent: 'space-between',
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 33,
    letterSpacing: -0.4,
    marginBottom: 16,
  },

  // Mascot circle
  mascotCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 14,
  },
  mascotCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.archMatting,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.archBorder,
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 6,
    left: '26%',
    fontSize: 14,
    color: colors.dotGold,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 8,
    right: '26%',
    fontSize: 13,
    color: colors.dotPeach,
  },

  // Speech bubble quote card
  speechBubbleCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  speechQuote: {
    fontSize: 12.5,
    fontStyle: 'italic',
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
  },
  speechAuthor: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 4,
  },

  // ─── Right form container ────────────────────────────────────────────
  formContainer: {
    flex: 1,
    paddingVertical: 6,
  },
  formContainerWide: {
    maxWidth: 520,
    paddingHorizontal: 10,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  formSubhead: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },

  // ─── Segmented pill tabs ─────────────────────────────────────────────
  segmentedTabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lavenderSheet,
    borderRadius: 22,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lavenderSheetBorder,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
  },
  tabTextActive: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tabTextInactive: {
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // ─── Form fields ──────────────────────────────────────────────────────
  fieldsBlock: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  textInput: {
    height: 46,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  showBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  showBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotBtnText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },

  // ─── Primary CTA button ───────────────────────────────────────────────
  primaryBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // ─── Switch link & terms ──────────────────────────────────────────────
  switchLinkWrapper: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLinkText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  switchLinkBold: {
    fontWeight: '800',
    color: colors.brand,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 10.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },

  // ─── Footer slogan ────────────────────────────────────────────────────
  footerBrandRow: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});
