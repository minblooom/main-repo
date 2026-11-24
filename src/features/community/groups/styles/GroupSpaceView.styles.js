// GroupSpaceView.styles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    gap: 14,
    paddingBottom: 24,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  panelTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  panelSub: {
    fontSize: 13,
    lineHeight: 19,
  },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  selfStartBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  dimmed: {
    opacity: 0.45,
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 84,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 2,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  authorCol: {
    flex: 1,
    gap: 2,
  },
  rowMood: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowDate: {
    fontSize: 12,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  safetyMenuRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
});