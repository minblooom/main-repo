// src/screens/onboarding/styles/GentleHelloScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  trustCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  trustItem: {
    gap: 3,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  trustBody: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  hotlineBanner: {
    backgroundColor: '#F3EFFD',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DFD5F0',
    marginTop: 2,
  },
  hotlineTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.brand,
    marginBottom: 2,
  },
  hotlineText: {
    fontSize: 11,
    color: '#555',
  },
  hotlineBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: colors.brand,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  checkLabel: {
    flex: 1,
    fontSize: 12,
    color: '#555',
    lineHeight: 17,
  },
  link: {
    color: colors.brand,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  termsFooter: {
    alignItems: 'center',
    paddingTop: 8,
  },
  termsText: {
    fontSize: 10.5,
    color: '#AAA',
  },
});
