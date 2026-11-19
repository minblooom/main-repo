// src/screens/journal/styles/JournalEntryModal.styles.js
// Styles for the past entry read-only view modal

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 30, 59, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.1)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  feelingTagWrap: {
    backgroundColor: '#F5FAF6',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4EBD9',
  },
  feelingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#285437',
  },
  bodyScroll: {
    maxHeight: 260,
    marginVertical: 4,
  },
  bodyText: {
    fontSize: 14.5,
    color: '#2E1E3B',
    lineHeight: 23,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(73, 37, 66, 0.06)',
  },
  rightActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  deleteBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#C0392B',
  },
  editBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF5EE',
  },
  editBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.brand,
  },
  doneBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.brand,
  },
  doneBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
