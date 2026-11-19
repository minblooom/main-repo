// src/screens/profile/styles/PrivacyDataModal.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 16, 36, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12.5,
    marginBottom: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  scroll: {
    gap: 12,
    paddingVertical: 4,
  },
  infoCard: {
    backgroundColor: '#FAF7F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.06)',
    gap: 6,
  },
  infoTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#2E1E46',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  actionRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAE3F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#2E1E46',
  },
  actionDesc: {
    fontSize: 11.5,
    color: '#8B6DA8',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 16,
    color: '#8B6DA8',
    fontWeight: '700',
  },
  doneBtn: {
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
