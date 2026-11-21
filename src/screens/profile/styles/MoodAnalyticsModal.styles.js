// src/screens/profile/styles/MoodAnalyticsModal.styles.js
// Styles for the enhanced interactive Mood Analytics Modal

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 17, 29, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    marginBottom: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  scroll: {
    gap: 14,
    paddingVertical: 4,
    paddingBottom: 8,
  },

  // -- Metrics Row ------------------------------------------
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },

  // -- Chart Card -------------------------------------------
  chartCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  chartHint: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    paddingVertical: 4,
  },
  barEmoji: {
    fontSize: 13,
  },
  barTrack: {
    width: 16,
    height: 80,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
  },
  barDay: {
    fontSize: 11,
    fontWeight: '700',
  },
  selectedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },

  // -- Selected Day Inspector -------------------------------
  inspectorCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspectorDay: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  inspectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  inspectorBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  inspectorFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  inspectorFactorChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inspectorFactorText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  inspectorNote: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },

  // -- Companion Weekly Reflection Card ---------------------
  companionNoteCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  companionAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  companionAvatarImg: {
    width: 30,
    height: 30,
  },
  companionNoteWrap: {
    flex: 1,
    gap: 4,
  },
  companionNoteHeader: {
    fontSize: 13,
    fontWeight: '800',
  },
  companionNoteBody: {
    fontSize: 12,
    lineHeight: 17,
  },

  doneBtn: {
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
