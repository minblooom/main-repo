// src/screens/arcade/styles/ArcadeHeader.styles.js
// Dedicated styles for ArcadeHeader component.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexWrap: 'wrap',
    gap: 12,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbLink: {
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  breadcrumbSep: {
    fontSize: 13,
  },
  breadcrumbActive: {
    fontSize: 13,
    fontWeight: '700',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  weatherPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  weatherText: {
    fontSize: 12,
    fontWeight: '500',
  },
  langPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: 16,
  },
  favBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  favText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
