// src/screens/journal/styles/JournalSparkBanner.styles.js
// Styles for the daily writing prompt spark banner

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF6EA',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE6C9',
    gap: 10,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8A531C',
    letterSpacing: 0.8,
  },
  promptText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#3B2312',
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 2,
  },
  useBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3D2AE',
  },
  useBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#8A531C',
  },
  actionLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8A531C',
  },
  hideLinkText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#A08060',
  },
  iconBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
