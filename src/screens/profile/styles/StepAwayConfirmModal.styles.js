// src/screens/profile/styles/StepAwayConfirmModal.styles.js
// Styles for the peaceful "Step away for a moment" confirmation popup modal

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 17, 29, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  mascotWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
  },
  mascotIcon: {
    fontSize: 32,
  },
  tag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  bulletCard: {
    width: '100%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bulletIcon: {
    fontSize: 14,
  },
  bulletText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionRow: {
    width: '100%',
    gap: 10,
  },
  stayBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stayBtnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  leaveBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
