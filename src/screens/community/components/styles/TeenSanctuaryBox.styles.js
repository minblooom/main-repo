import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  box: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  lockPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  lockPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  guardNote: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});

