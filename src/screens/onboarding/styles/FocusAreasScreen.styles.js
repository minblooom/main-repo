// src/screens/onboarding/styles/FocusAreasScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  counter: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8B6DA8',
    marginBottom: 6,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
    gap: 10,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 11,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#F0EAFA',
    borderColor: colors.brand,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 16,
  },
  chipLabelSelected: {
    color: colors.brand,
  },
  chipCheck: {
    fontSize: 12,
    color: colors.brand,
    fontWeight: '800',
    marginLeft: 4,
  },
  chipDesc: {
    fontSize: 10.5,
    color: '#888',
    marginTop: 2,
  },
});
