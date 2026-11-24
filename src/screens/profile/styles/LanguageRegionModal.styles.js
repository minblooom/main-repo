// src/screens/profile/styles/LanguageRegionModal.styles.js
import { StyleSheet } from 'react-native';

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
    maxHeight: '90%',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    gap: 16,
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
    letterSpacing: -0.4,
    marginTop: 2,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#492542',
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: -4,
  },
  scroll: {
    paddingBottom: 8,
    gap: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  countryList: {
    gap: 8,
  },
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  countryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 12,
    fontWeight: '800',
  },
  countryName: {
    fontSize: 15,
    fontWeight: '700',
  },
  countryLangs: {
    fontSize: 12,
    marginTop: 2,
  },
  checkText: {
    fontSize: 15,
    fontWeight: '800',
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  langChipText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  previewBanner: {
    padding: 14,
    borderRadius: 16,
    marginTop: 4,
    gap: 4,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  previewBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  saveBtn: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
