// src/screens/onboarding/styles/LocalSetupScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  listWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowSelected: {
    backgroundColor: '#F0EAFA',
  },
  codeBadge: {
    width: 34,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#EAE3F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBadgeSelected: {
    backgroundColor: colors.brand,
  },
  codeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: 0.5,
  },
  codeBadgeTextSelected: {
    color: '#FFFFFF',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  rowNameSelected: {
    color: colors.brand,
  },
  rowLangs: {
    fontSize: 10.5,
    color: '#888',
    marginTop: 1,
  },
  rowCheck: {
    fontSize: 14,
    color: colors.brand,
    fontWeight: '800',
  },
  langLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E5D87',
    marginTop: 6,
    marginBottom: 4,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  langChipSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#492542',
  },
  langChipTextSelected: {
    color: '#fff',
    fontWeight: '800',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
});
