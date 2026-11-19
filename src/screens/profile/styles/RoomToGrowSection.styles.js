// src/screens/profile/styles/RoomToGrowSection.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
    gap: 3,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSublabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  arrow: {
    fontSize: 22,
    fontWeight: '300',
  },
  soonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  soonText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
