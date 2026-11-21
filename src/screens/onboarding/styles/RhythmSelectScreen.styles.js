// src/screens/onboarding/styles/RhythmSelectScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 8,
  },
  rowSelected: {
    borderColor: colors.brand,
    backgroundColor: '#F0EAFA',
  },
  minsWrap: {
    alignItems: 'center',
    width: 36,
  },
  mins: {
    fontSize: 22,
    fontWeight: '800',
    color: '#888',
  },
  minsSelected: {
    color: colors.brand,
  },
  minsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 0.5,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  rowLabelSelected: {
    color: colors.brand,
  },
  rowDesc: {
    fontSize: 11.5,
    color: '#777',
    marginTop: 2,
  },
  rowCheck: {
    fontSize: 15,
    color: colors.brand,
    fontWeight: '800',
  },
  nudgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    marginVertical: 4,
  },
  nudgeText: {
    flex: 1,
  },
  nudgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  nudgeDesc: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});
