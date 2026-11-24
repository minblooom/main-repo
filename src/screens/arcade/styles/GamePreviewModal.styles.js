// src/screens/arcade/styles/GamePreviewModal.styles.js
// Dedicated styles for GamePreviewModal component.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 20, 36, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1A0E2E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  headerBanner: {
    padding: 20,
    paddingTop: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 14,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  gameDuration: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  scrollBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  fullDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  rulesList: {
    gap: 10,
    marginVertical: 10,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  ruleNum: {
    fontSize: 11,
    fontWeight: '800',
  },
  ruleText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  assuranceBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
  },
  assuranceText: {
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  startBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
