// src/screens/home/styles/HomeHeader.styles.js
// Dedicated styles for HomeHeader component.

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#8B6DA8',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 37, 66, 0.08)',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  weatherText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  langText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textMuted,
  },
  langActive: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  langInactive: {
    color: colors.textMuted,
  },
  iconBtn: {
    padding: 6,
  },
  iconEmoji: {
    fontSize: 16,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAE3F7',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 28,
    height: 28,
  },
});
