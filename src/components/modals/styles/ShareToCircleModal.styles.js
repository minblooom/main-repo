import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 15, 30, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: 2,
  },
  previewBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  previewText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  circleMeta: {
    fontSize: 11,
    marginTop: 1,
  },
});
