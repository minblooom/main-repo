// src/screens/onboarding/styles/AgeSelectScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E5D87',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  ageNumberInput: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E1E46',
    minWidth: 44,
    paddingVertical: 0,
    letterSpacing: -0.5,
  },
  yearsSuffix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B6DA8',
  },
  underageWarningBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    gap: 6,
  },
  underageWarningTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#BE123C',
  },
  underageWarningText: {
    fontSize: 12,
    color: '#9F1239',
    lineHeight: 18,
  },
  orGroupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E5D87',
    marginTop: 4,
    marginBottom: 2,
  },
  bracketGroup: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rowSelected: {
    borderColor: '#492542',
    backgroundColor: '#F0EAFA',
  },
  rowLeft: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  rowLabelSelected: {
    color: '#492542',
  },
  rowDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 1,
  },
  rowCheck: {
    fontSize: 16,
    color: '#492542',
    fontWeight: '800',
  },
  hint: {
    fontSize: 11.5,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 2,
  },
});
