import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 190,
  },
  containerCompact: {
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 12,
    fontWeight: '900',
  },
  trackCol: {
    flex: 1,
    gap: 5,
  },
  trackBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    fontSize: 13,
    fontWeight: '800',
  },
});

