// src/screens/onboarding/styles/ReadyToBloomScreen.styles.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  heroBanner: {
    backgroundColor: '#EAE3F7',
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DFD5F0',
  },
  heroBannerWide: {
    paddingHorizontal: 36,
  },
  heroText: {
    flex: 1,
    paddingRight: 16,
  },
  heroTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#8B6DA8',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2E1E46',
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: '#6E5D87',
    lineHeight: 19,
  },
  heroImgWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#FCE8D8',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#492542',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroImg: {
    width: '85%',
    height: '85%',
  },
  kitTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  kitSub: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 14,
  },
  kitRow: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  kitRowWide: {
    flexDirection: 'row',
  },
  kitCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    gap: 4,
  },
  kitNum: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.3)',
    marginBottom: 2,
  },
  kitCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 0.8,
  },
  kitCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  kitCardDesc: {
    fontSize: 11.5,
    color: '#555',
    lineHeight: 16,
  },
  footer: {
    fontSize: 11.5,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 14,
  },
});
