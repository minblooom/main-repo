// src/screens/arcade/styles/GameVictoryModal.styles.js
// Dedicated styles for GameVictoryModal component.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 20, 36, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#1A0E2E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  mascotArea: {
    marginBottom: 12,
  },
  companionCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsCard: {
    width: '100%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  seedPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  seedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  replayBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayText: {
    fontSize: 14,
    fontWeight: '700',
  },
  doneBtn: {
    flex: 1.3,
    paddingVertical: 13,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
