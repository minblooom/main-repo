// src/screens/profile/styles/ThemePalettePicker.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '47%',
    padding: 14,
    borderRadius: 16,
    gap: 4,
    position: 'relative',
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardTag: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#7C5CBF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
