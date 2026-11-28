import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  counter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9C8E80',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  col: {
    flex: 1,
    gap: 10,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFE9DF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  chipSelected: {
    backgroundColor: '#FAF5EE',
    borderColor: '#492542',
  },
  chipDisabled: {
    opacity: 0.42,
  },
  chipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#281B26',
    flex: 1,
  },
  chipLabelSelected: {
    color: '#492542',
  },
  checkMark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#492542',
    marginLeft: 4,
  },
  chipDesc: {
    fontSize: 11,
    color: '#766675',
    lineHeight: 14,
  },
  chipDescSelected: {
    color: '#492542',
  },
});

